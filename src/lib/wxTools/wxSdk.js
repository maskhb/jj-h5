import axios from 'axios'
import wx from 'weixin-js-sdk'

function wxShare () {
  var Loading = true
  var config = {}
  var refreshTicket = function (opt) {
    Loading = true
    var jsSdkSign = new FormData()
    jsSdkSign.append('url', opt.url)

    var wxDomain = ''
    switch (process.env.HT_ENV) {
      case 'test':
        wxDomain = 'ht-mjwx-test.htmimi.com'
        jsSdkSign.append('token', 'gh_e8a7b9983c24')
        break
      case 'release':
        wxDomain = 'ht-mjwx-stg.htmimi.com'
        jsSdkSign.append('token', 'gh_0cfc2652b406')
        break
      default:
        wxDomain = 'ht-mjwx-test.htmimi.com'
        jsSdkSign.append('token', 'gh_e8a7b9983c24')
        break
    }

    axios({
      url: 'https://' + wxDomain + '/index.php/Api/Wxapi/JsSignPackage',
      data: jsSdkSign,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      method: 'POST'
    }).then(function (res) {
      var wxConfig = res.data

      delete wxConfig.url
      wxConfig.jsApiList = [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'hideOptionMenu',
        'showOptionMenu',
        'hideMenuItems',
        'showMenuItems',
        'chooseWXPay',
        'hideOptionMenu',
        'showOptionMenu',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem'
      ]

      wx.config(wxConfig)
      wx.error(function (res) {
        console.log('验证失败：' + JSON.stringify(res))
      })
      /* 分享页面 */
      wx.ready(function () {
        // 分享朋友
        wx.onMenuShareAppMessage(config.toFriend)
        // 分享朋友圈
        wx.onMenuShareTimeline(config.toTimeLine)

        if (config.BaseMenuDisplay === 'hide') {
          wx.hideAllNonBaseMenuItem()
        } else if (config.BaseMenuDisplay === 'show') {
          wx.showAllNonBaseMenuItem()
        }

        Loading = false
      })
    })
  }

  return {
    refreshTicket: (opt) => {
      refreshTicket(opt)
    },
    toFriend: (opt) => {
      config.toFriend = opt
      if (Loading === false) {
        wx.onMenuShareAppMessage(opt)
      }
    },
    toTimeLine: (opt, isInit) => {
      config.toTimeLine = opt
      if (Loading === false) {
        wx.onMenuShareTimeline(opt)
      }
    },
    pay: (params) => {
      if (Loading === false) {
        wx.chooseWXPay(params)
      }
    },
    hideAllNonBaseMenuItem: () => {
      config.BaseMenuDisplay = 'hide'
      if (Loading === false) {
        wx.hideAllNonBaseMenuItem()
      }
    },
    showAllNonBaseMenuItem: () => {
      config.BaseMenuDisplay = 'show'
      if (Loading === false) {
        wx.showAllNonBaseMenuItem()
      }
    }
  }
}

export default wxShare()
