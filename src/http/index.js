import Vue from 'vue'
import axios from 'axios'
import {deleteCookies} from '@/utils/cookies'
import {responseFilter} from './filter'
import { AlertModule } from 'vux'
import formateData from './formatApi'
import * as Loading from '@/components/loading'

const tokenKey = 'x-security-token'

let apiConfigBaseURL = '/proxy'
let apiConfigOldBaseURL = '/oldProxy'

/**
   * 代理类 基于axios
   * @param options
   * @returns {HtProxy}
   * @constructor
   */
function HtProxy (options) {
  options = options || {}

  // 上下文
  this.context = options.context || {isServer: true}
  // 指向代理服务器地址
  this.proxyUrl = options.proxyUrl || 'http://ht-json-fix.htmimi.com/json'
  // 目标环境
  this.env = options.env || ''
  // 是否不加密,默认为加密
  this['x-disable-encrypt'] = options['x-disable-encrypt'] || ''
  // headers
  this.headers = options.headers || {
    'x-api-address': '', // api 地址
    'x-api-env': '', // 环境
    'x-disable-encrypt': '', // 是否不编码,默认需要编码
    'x-manager-token': '', // 员工端,非商家后台(物业/运营)
    'x-supplier-token': '', // 商家端
    /**
字段构成：用户Id_当前系统时间_设备标识
其中：
1）、如果本地没有用户Id，则使用-1；
2）、当前系统时间为1970年到目前的毫秒数；获取失败，采用空串。
3）、设备标识使用设备Id；获取失败，采用空串。
*/
    'x-client-traceId': -1,
    'X-Requested-With': 'XMLHttpRequest',
    'x-security-token': '' // 业主端
  }

  this.count = 0 // 记录并发数

  this.initClientTraceId()
  this.configAxios()
  return this.fetchJSON.bind(this)
}

// 配置axios
HtProxy.prototype.configAxios = function (config) {
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  axios.defaults.baseURL = config && config.includeApi ? apiConfigOldBaseURL : apiConfigBaseURL
}

axios.defaults.retry = 0
axios.defaults.retryDelay = 1000
axios.defaults.timeout = 60000

axios.interceptors.response.use(undefined, function axiosRetryInterceptor (err) {
  var config = err.config
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(err)

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0

  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err)
  }

  // Increase the retry count
  config.__retryCount += 1

  // Create new promise to handle exponential backoff
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, config.retryDelay || 1)
  })

  // Return the promise in which recalls axios to retry the request
  return backoff.then(function () {
    return axios(config)
  })
})

/**
   * 初始化 x-client-traceId
   * @param userId
   * @param equipmentId
   * @returns {*}
   */
HtProxy.prototype.initClientTraceId = function (userId, equipmentId) {
  if (this.context.isServer) {
    return
  }
  if (userId) {
    localStorage.setItem('x-client-userId', userId)
  }
  if (equipmentId) {
    localStorage.setItem('x-client-equipmentId', equipmentId)
  }
  userId = userId || localStorage.getItem('x-client-userId') || -1
  equipmentId = equipmentId || localStorage.getItem('x-client-equipmentId') || ''
  var now = new Date().getTime()
  this.headers['x-client-traceId'] = [userId, now, equipmentId].join('_')
}

/**
   * 获取json
   * @param url   需要访问的api地址
   * @param data  请求参数,需stringify后的json
   * @param config 非必填 配置项 {hideAlertError:是否不展示错误提示[true false]}
   * @returns {*}
   */
HtProxy.prototype.fetchJSON = function (url, data, config) {
  this.initClientTraceId()
  this.configAxios(config)

  config = config || {showLoading: true}
  let _this = this
  let aesDecrypt // aesDecrypt解密方法

  // 如果使用加密
  if (config && config.useEncrypt) {
    return require.ensure([], function (require) {
      return require('@/http/encrypt').default
    }).then(function (Encrypt) {
      let header = {}
      let params = Encrypt.getNewParams(url, data, header)
      if (config.includeApi) {
        params = Encrypt.getParams(url, data, header)
      };
      aesDecrypt = params.aesDecrypt
      delete params.aesDecrypt

      return serviceFn.call(_this, params)
    })
  } else {
    // 服务名(eg: sso-api )
    const serviceAddress = '' + /[^\/]+/.exec(url)

    let header = {}
    header['x-api-address'] = serviceAddress
    header['x-api-env'] = this.env || ''
    header[tokenKey] = config.token || localStorage[tokenKey] ? localStorage[tokenKey] : ''

    header['x-client-type'] = 'app'
    header['version'] = '1.0.0'

    if (!header[tokenKey]) {
      delete header[tokenKey]
    }

    return serviceFn.call(this, {headers: header})
  }

  function serviceFn (_params = {}) {
    let params = {
      url: url,
      method: config.method || 'post',
      headers: this.headers,
      data: data
    }

    if (_params) {
      params = Object.assign({}, params, _params)
    }

    if (config.showLoading) {
      this.count++
      if (this.count === 1) {
        Loading.show()
      }
    }
    return axios(params).then((response) => {
      if (config.showLoading) {
        this.count--
        if (this.count === 0) {
          Loading.hide()
        }
      }

      if (response.statusText === 'OK' || response.status === 200) {
        response = response.data
        const status = responseFilter(response, (message) => {
          if (typeof window !== 'undefined') {
            deleteCookies(tokenKey)
            deleteCookies('userLoginNo')
          }

          return message || '未登录'
        })
        if (status !== true) {
          return Promise.reject(response)
        }

        if (aesDecrypt) {
          response.data = JSON.parse(aesDecrypt(response.data))
          console.log({url: params.url, data: JSON.parse(aesDecrypt(params.data))['params']})
          console.log(response)
        }
        if (response.data && typeof response.data.result !== 'undefined') {
          response.data = response.data.result
        }

        if (config.formatTpl !== undefined) {
          response.data = formateData(response.data, config.formatTpl)
        }

        return response.data // ajax成功之后只返回主体内容
      }
    }).catch((e = {}) => {
      if (config.showLoading) {
        this.count--
        if (this.count === 0) {
          Loading.hide()
        }
      }
      if (!config.hideAlertError) {
        if (e.msgCode === 401 || e.busCode === 1010004 || e.busCode === 1010003) {
          // e.callback = () => {};
          localStorage.removeItem('x-security-token')
          let errLog = Object.assign({}, e, { params: params, url: location.pathname })
          localStorage['errLog'] = JSON.stringify(errLog)
          location.href = '/Login?redirect_uri=' + encodeURIComponent(errLog.url)
        } else if (e.msgCode === 501 && e.busCode === 70) {
          location.href = '/Order'
        } else {
          if (typeof (e.message) === 'string') {
            if (e.message.search('timeout') > -1) {
              e.message = '网络请求超时,请刷新后重试'
              e.callback = () => { location.reload() }
            }
            AlertModule.show({
              content: e.message,
              onHide () {
                // 在业务中暴漏回调方法
                if (typeof e.callback === 'function') {
                  e.callback()
                }
              }
            })
          } else {
            AlertModule.show({
              content: '服务器开小差了'
            })

            // process.env.NODE_ENV !== 'release' && console.info(e)
            // const mockData = mock(url)
            // console.info(mockData)
            // if (isDEV && mockData) {
            //   return Promise.resolve(mockData)
            // }
          }
        }
      }
      return Promise.reject(e)
    })
  }
}

/**
   * 设置请求头
   * @param key
   * @param value
   * @returns {HtProxy}
   */
HtProxy.prototype.header = function (key, value) {
  const props = ['x-manager-token', 'x-supplier-token', 'x-security-token']

  // 只允许设置一次token
  if (~props.indexOf(key)) {
    for (let i in props) {
      this.headers[props[i]] = ''
    }
  }
  if (typeof value !== 'undefined') {
    this.headers[key] = value
  }

  return this
}

/**
   * 设置属性
   * @param prop      属性名
   * @param value     属性值
   * @returns {HtProxy}
   */
HtProxy.prototype.set = function (prop, value) {
  if (typeof this[prop] !== 'undefined') {
    this[prop] = value
  } else {
    return console.log('没有该属性:' + prop)
  }
  return this
}

Vue.prototype.$http = axios

const htProxy = new HtProxy()
export default htProxy
