import {isWeiXin} from '@/utils/common'

let defaultShareObj
let config = {}
// 配置
let wx

// 异步读取微信sdk
if (isWeiXin) {
  require.ensure([], function (require) {
    return require('@/lib/wxTools/wxSdk').default
  }).then(function (_wx) {
    wx = _wx

    wx.toFriend(config.toFriend || defaultShareObj)
    wx.toTimeLine(config.toFriend || defaultShareObj)

    if (config.BaseMenuDisplay === 'hide') {
      wx.hideAllNonBaseMenuItem()
    } else if (config.BaseMenuDisplay === 'show') {
      wx.showAllNonBaseMenuItem()
    }
  })
} else {
  console.log('非微信浏览器，微信sdk不运行')
}

export default {
  refreshTicket: function (url) {
    config.refreshTicket = {url}
    if (wx) {
      wx.refreshTicket({url})
    }
  },
  setDefaultShareConf: function (opt) {
    defaultShareObj = opt
  },
  toFriend: function (opt) {
    config.toFriend = opt

    if (wx) {
      wx.toFriend(opt)
    }
  },
  toTimeLine: function (opt) {
    config.toFriend = opt

    if (wx) {
      wx.toTimeLine(opt)
    }
  },
  pay: function (opt) {
    if (wx) {
      wx.pay(opt)
    }
  },
  hideAllNonBaseMenuItem: function () {
    config.BaseMenuDisplay = 'hide'

    if (wx) {
      wx.hideAllNonBaseMenuItem()
    }
  },
  showAllNonBaseMenuItem: function () {
    config.BaseMenuDisplay = 'show'

    if (wx) {
      wx.showAllNonBaseMenuItem()
    }
  }
}
