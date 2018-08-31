/*
* 分格式化为元
* num为保留几位小数
* 使用：value | money(0)
* */
let money = (value, num) => {
  if (value === undefined || value==='') return ''

  let res = parseInt(value)
  if (typeof (num) === 'undefined') {
    num = 2
  } else {
    num = parseInt(num)
  }
  if(res%100!==0 && num===0){
    num = 2;
  }
  res = (res / 100).toFixed(num)
  return res
}

let moneyAuto = (value, num) => {
  if (value === undefined || value==='') return ''

  let res = parseInt(value)
  if (typeof (num) === 'undefined') {
    num = 2
  } else {
    num = parseInt(num)
  }
  if(res%100!==0 && num===0){
    num = 2;
  }

  res = (res / 100).toFixed(num)

  return parseInt(res.toString().split('.')[1] || 0) === 0?parseInt(res):res
}


/*
* 时间格式化
* 使用: value | date('yyyy-MM-dd')
* */
let date = (obj, fmt) => {
  let _this = ''
  if (!fmt) {
    fmt = 'yyyy-MM-dd'
  }
  if (obj instanceof Date) {
    _this = obj
  } else if (typeof obj === 'number' && obj > 0) {
    _this = new Date(obj)
  } else {
    fmt = obj
  }
  if (fmt == 0) {
    fmt = ''
  }

  if (_this) {
    let o = {
      'M+': _this.getMonth() + 1, // 月份
      'd+': _this.getDate(), // 日
      'h+': _this.getHours(), // 小时
      'm+': _this.getMinutes(), // 分
      's+': _this.getSeconds(), // 秒
      'q+': Math.floor((_this.getMonth() + 3) / 3), // 季度
      'S': _this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt))fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) if (new RegExp('(' + k + ')').test(fmt))fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

let option = (value, dic) => {
  return dic[value]
}

/* sku数组转化为字符串 */
let getSkuStr = (arr) => {
  let str = ''
  if (arr && arr.length > 0) {
    arr.map((v, i) => {
      str += v['propertyValue']
      if (i < arr.length - 1) {
        str += ','
      }
    })
  }
  return str
}

/* 获取完整地址 */
let getFullAdress = (obj, flag) => {
  let str = ''
  if (obj['provinceName']) {
    str += obj['provinceName']
  }
  if (obj['cityName']) {
    str += obj['cityName']
  }
  if (obj['areaName']) {
    str += obj['areaName']
  }
  if (obj['streetName'] && flag != true) {
    str += obj['streetName']
  }
  if (obj['address'] && flag != true) {
    str += obj['address']
  }
  return str
}

/* 优化图片大小 */
let imgFormat = function (value, sizeStr) {
  let str = value
  if (value && value.slice(0, 4) === 'http') { // 只有服务器上的地址才处理
    var res_jpg = value.split('.jpg')
    var res_png = value.split('.png')
    var res_gif = value.split('.gif')
    if (res_jpg.length > 1) {
      str = res_jpg[0] + '_' + sizeStr + '.jpg'
    }
    if (res_png.length > 1) {
      str = res_png[0] + '_' + sizeStr + '.png'
    }
    if (res_gif.length > 1) {
      str = res_gif[0] + '_' + sizeStr + '.gif'
    }
  }
  return str
}

/* 毫秒转化成天时分秒的时间格式 */
const formatDuring = function (mss) {
  var days = parseInt(mss / (1000 * 60 * 60 * 24))
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  var seconds = parseInt((mss % (1000 * 60)) / 1000)
  if (days) {
    return days + ' 天 ' + hours + ' 小时 ' + minutes + ' 分钟 ' + seconds + ' 秒 '
  }
  if (hours) {
    return hours + ' 小时 ' + minutes + ' 分钟 ' + seconds + ' 秒 '
  }
  if (minutes) {
    return minutes + ' 分钟 ' + seconds + ' 秒 '
  }

  return seconds + ' 秒 '
}

let getWholeSkuTxt = function (skuList) {
  let str = '';
  if(skuList && skuList.length>0){
    skuList.map((v,i)=>{
      str += v['specifications'];
      if(i<skuList.length-1){
        str +=';'
      }
    })
  }
  if(str ===''){
    str = '选规格';
  }
  return str;

};

/* 获取列表sku种类乘数量之和 */
let getSumSkuNum = function (orderItemVOList) {
  let sum = 0;
  orderItemVOList.map((v,i)=>{
    sum += parseInt(v['goodsNum']);
  });
  return sum;
};


/*获取优惠券适用范围*/
let getScopeType = (scopeType, obj)=>{
  let str = '';
  if(scopeType === 0){
    str = '全场';
  }else if(obj.listPromotionRuleCouponScopeVoQ){
    obj.listPromotionRuleCouponScopeVoQ.map((v,i)=>{
      str += v['refName'];
      if(i<obj.listPromotionRuleCouponScopeVoQ.length-1){
        str += ',';
      }
    });
  }
  return str;
};

export { money, moneyAuto, date, option, getSkuStr, getFullAdress, imgFormat, formatDuring, getWholeSkuTxt, getSumSkuNum, getScopeType }
