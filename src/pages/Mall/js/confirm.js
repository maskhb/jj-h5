import Vue from 'vue'
import AddressSelect from '@/components/addressSelect.vue'
import CouponSelect from '@/components/coupon/couponSelect.vue'
import MjAudio from '@/components/audio.vue'
import http from '@/http';
import { TransferDom, AlertPlugin, ToastPlugin,
  Cell, XInput, Group, XButton, CheckIcon, Flexbox, FlexboxItem, XHeader, Popup, XTextarea, CellFormPreview, Agree, ViewBox, Icon
} from 'vux'
import {getFullAdress, money, getSkuStr} from '@/utils/filter.js'
import {removeCart} from '@/utils/cart'

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)

export default {
  directives: {
    TransferDom
  },
  components: {
    MjAudio, AddressSelect, CouponSelect,
    Cell, XInput, Group, XButton, CheckIcon, Flexbox, FlexboxItem, XHeader, Popup, XTextarea, CellFormPreview, Agree, ViewBox, Icon
  },
  watch: {
    localOrderInfo (newVal) {
      if (newVal && newVal.money) {
        this.moneyObj.money = newVal.money;
        if(newVal && newVal.discount){
          this.needPayAmount = newVal.money-newVal.discount;
        }else{
          this.needPayAmount = newVal.money;
        }
        if (newVal.earnest) {
          this.moneyObj.earnest = newVal.earnest;
        }
      }
      if (newVal && newVal.orderItemVOList && newVal.orderItemVOList.length > 3) {
        this.showProduct = false
      }
      if (newVal && newVal.discount) {
        this.moneyObj.discount = newVal.discount;
      }
    },
    coupon(newVal){
      if(newVal && newVal.amount){
        this.moneyObj.coupon = newVal.amount;
      }else{
        this.moneyObj.coupon = 0;
      }
      this.updateNeedPayAmount()
    },
    'walletObj.isSelected' (newVal, oldVal) {
      if (typeof oldVal !== 'undefined') {
        this.updateNeedPayAmount()
      }
    },
    'depositObj.isSelected' (newVal, oldVal) {
      if (typeof oldVal !== 'undefined') {
        this.updateNeedPayAmount()
      }
    },
    'submitOrderVO.preDepositAmount' (newVal, oldVal) {
      this.updateNeedPayAmount()
    },
    'submitOrderVO.walletAmount' (newVal, oldVal) {
      this.updateNeedPayAmount()
    },
    showBill(newVal){
      if(newVal === false){
        this.invoiceVO = Object.assign({}, this.submitOrderVO.invoiceVO);
      }
    }
  },
  methods: {
    selectAddress (item) {
      if (item.addressId) {
        let receiptVO = this.submitOrderVO.receiptVO
        receiptVO = Object.assign({}, receiptVO, {
          provinceId: item.provinceId,
          cityId: item.cityId,
          areaId: item.areaId,
          consigneeName: item.consignee,
          consigneeMobile: item.mobile,
          regionName: item['provinceName'] + item['cityName'] + item['areaName'],
          detailedAddress: item.address
        })
        this.submitOrderVO.receiptVO = receiptVO
        this.addressId = item.addressId
      }
      this.showAddressList = false
    },
    selectCoupon(item){
      if (item.codeId>=0) {
        if(item.codeId === 0){
          item = {};
        }
        this.coupon = item;

        /*初始化预存款和钱包显示*/
        let submitOrderVO = this.submitOrderVO;
        let depositObj = this.depositObj;
        let walletObj = this.walletObj;
        submitOrderVO.preDepositAmount = 0;
        submitOrderVO.walletAmount = 0;
        depositObj.isSelected = false;
        walletObj.isSelected = false;
      }
      this.showCouponList = false
    },
    hasEnabled(enabled){
      this.couponEnabled = enabled;
    },
    changeBillType(index){
      this.invoiceVO.type = index+1;
    },
    /*保存发票*/
    saveInvoiceVO(){
      this.submitOrderVO.invoiceVO = Object.assign({}, this.invoiceVO);
      this.showBill=false;
    },
    showAreaHelp () {
      this.$vux.alert.show({
        title: '',
        content: '仅支持发货至当前项目所在地区，如需更换请返回首页更换项目',
        buttonText: '知道了'
      })
    },
    /*更新还需支付金额 */
    updateNeedPayAmount () {
      let needPayAmount = this.localOrderInfo.money;
      let discount = this.localOrderInfo.discount;
      let coupon = this.coupon;
      let depositObj = this.depositObj;
      let walletObj = this.walletObj;
      let preDepositAmount = (this.submitOrderVO.preDepositAmount * 100) .toFixed(0);
      let walletAmount = (this.submitOrderVO.walletAmount * 100).toFixed(0);
      if (depositObj.isSelected && preDepositAmount) {
        if(preDepositAmount)
        needPayAmount -= preDepositAmount
      }
      if (walletObj.isSelected && walletAmount) {
        needPayAmount -= walletAmount
      }
      if(coupon && coupon.amount){
        needPayAmount -= coupon.amount
      }
      if(discount && parseInt(discount)>=0){
        needPayAmount -= discount
      }
      if (needPayAmount < 0) {
        needPayAmount = 0
      }
      this.needPayAmount = needPayAmount
    },
    getExtendObj (list, fullFlag) {
      let money = 0
      let orderItemVOList = []
      if (list) {
        list.map((v, i) => {
          if (v['packageGoodsList'] && v['packageGoodsList'].length > 0) {
            v['packageGoodsList'].map((pv, pj) => {
              if (pv['selected']) {
                money += pv['packagePrice'] * pv['num']
                let item = {
                  goodsNum: pv['num'],
                  propertyValue: pv['specifications'],
                  salePrice: pv['salePrice'],
                  skuId: pv['skuId']
                }
                if (fullFlag) {
                  item.goodsName = pv['goodsName']
                  item.imgUrl = pv['imgUrl']
                }

                /* 合并sku*/
                let listFlag = true
                orderItemVOList.map((ov, oi) => {
                  if (ov['skuId'] === item['skuId'] && ov['salePrice'] === item['salePrice']) {
                    listFlag = false
                    ov['goodsNum'] += item['goodsNum']
                  }
                })
                if (listFlag) {
                  orderItemVOList.push(item)
                }
              }
            })
          }
        })
      }
      return {
        money: money,
        orderItemVOList: orderItemVOList
      }
    },
    getDetailExtendObj (detail, fullFlag) {
      let money = 0
      let orderItemVOList = []
      if (detail) {
        detail.goodsSkuVoList.map((v, i) => {
          if (i === 0) {
            money = v['salePrice']
            let item = {
              goodsNum: 1,
              propertyValue: getSkuStr(v['skuPropertyRelationVoSList']),
              salePrice: v['salePrice'],
              skuId: v['skuId']
            }
            if (fullFlag) {
              item.goodsName = detail['goodsName']
              if (v['goodsImgVoList'] && v['goodsImgVoList'].length > 0) {
                item.imgUrl = v['goodsImgVoList'][0]['imgUrl']
              }
            }
            orderItemVOList.push(item)
          }
        })
      }
      return {
        money: money,
        orderItemVOList: orderItemVOList
      }
    },
    getDepositCanUse(){
      let depositObj = this.depositObj;
      let localOrderInfo = this.localOrderInfo;
      let coupon = this.coupon;
      let canUse = 0;
      if(depositObj.validityEnd>new Date().getTime() && depositObj.validityStart < new Date().getTime()){
        let money = localOrderInfo.money;
        if(localOrderInfo.discount){
          money -= localOrderInfo.discount
        }
        if(coupon && coupon.amount){
          money -= coupon.amount
        }
        if(money>depositObj.balance){
          canUse = (depositObj.balance/100).toFixed(2);
        }else{
          canUse = (money/100).toFixed(2)
        }
      }
      return canUse;
    },
    changeMoney(val){
      if(parseInt(val)<0){
        let depositObj = this.depositObj;
        let walletObj = this.walletObj;
        let submitOrderVO = this.submitOrderVO;
        if (depositObj.isSelected) {
          if(parseInt(submitOrderVO.preDepositAmount)>=0){
          }else{ submitOrderVO.preDepositAmount = 0;}
        }
        if (walletObj.isSelected) {
          if(parseInt(submitOrderVO.walletAmount)>=0){
          }else{ submitOrderVO.walletAmount = 0;}
        }
      }

    },
    /* 去结算*/
    submitOrder () {
      let _this = this;
      if (this.toOrderLoading === false) {
        if (!this.valueTrue) {
          return
        }
        let submitOrderVO = JSON.parse(JSON.stringify(this.submitOrderVO));
        submitOrderVO = this.cleanParams(submitOrderVO);

        /*校验收货地址*/
        let regBox = this.regBox
        if (!submitOrderVO.receiptVO.consigneeName) {
          this.$vux.toast.text('收货人不正确!')
          return;
        }
        if (!regBox.tel.test(submitOrderVO.receiptVO.consigneeMobile)) {
          this.$vux.toast.text('手机号格式不正确!')
          return;
        }
        if (!submitOrderVO.receiptVO.detailedAddress) {
          this.$vux.toast.text('详细地址不能为空!')
          return;
        }

        /*校验预存款-钱包 */
        let depositObj = this.depositObj
        let walletObj = this.walletObj
        if (depositObj.isSelected) {
          submitOrderVO.preDepositAmount = (submitOrderVO.preDepositAmount * 100).toFixed(0)
          if (submitOrderVO.preDepositAmount > submitOrderVO.money) {
            this.$vux.toast.text('使用预存款抵扣金额不得大于实付金额')
            return;
          }
          if(submitOrderVO.preDepositAmount<0){
            this.$vux.toast.text('使用预存款抵扣金额有误');
            return;
          }
        }else {
          delete submitOrderVO.preDepositAmount
          delete submitOrderVO.preDepositAmountBalance
        }
        if (walletObj.isSelected) {
          submitOrderVO.walletAmount = (submitOrderVO.walletAmount * 100).toFixed(0)
          if (submitOrderVO.walletAmount > submitOrderVO.money) {
            this.$vux.toast.text('使用钱包抵扣金额不得大于实付金额')
            return;
          } else if (depositObj.isSelected && submitOrderVO.walletAmount > (submitOrderVO.money - submitOrderVO.preDepositAmount)) {
            this.$vux.toast.text('使用钱包抵扣金额不得大于实付金额-预存款抵扣金额')
            return;
          }
          if(submitOrderVO.walletAmount<0){
            this.$vux.toast.text('使用钱包款抵扣金额有误');
            return;
          }
        }else {
          delete submitOrderVO.walletAmount
          delete submitOrderVO.walletAmountBalance
        }

        /*优惠券*/
        let coupon = this.coupon;
        if(coupon && coupon.codeId){
          submitOrderVO.couponCodeId = coupon.codeId;
        }

        this.toOrderLoading = true
        http('ht-mj-order-server/order/wx/submitOrder', {submitOrderVO: submitOrderVO})
          .then(function (suc) {
            if (suc.code === 0) {
              localStorage.removeItem('submitOrderInfo')
              localStorage.removeItem('packageInfo')

              //清除本地购物车记录
              let skuId = submitOrderVO.orderItemVOList.map(v => { return v.skuId })
              removeCart(skuId)
              location.href = '/Pay/' + suc.data
              //this.$router.push('/Pay/' + suc.data)
            } else{
              if (suc.code === 120 || suc.code === 130 || suc.code === 140 || suc.code === 150 || suc.code === 160) {
                suc.msg = '部分商品信息已变化，请返回购物车重新确认'
              }
              if (suc.code === 460) {
                suc.msg = '当前套餐已下架，请选择其它商品'
              }
              if (suc.code === 310) {
                setTimeout(function () {
                  localStorage.removeItem('communityId')
                  localStorage.removeItem('communityName')
                  localStorage.removeItem('provinceId')
                  localStorage.removeItem('selectArea')
                  _this.$router.push('/')
                }, 2000)
              }

              this.$vux.toast.text(suc.msg)
              this.toOrderLoading = false
            }
          }.bind(this), function (err) {
            this.toOrderLoading = false
          }.bind(this))
      }
    },
    /* 获取最新地址*/
    getLastAddress () {
      let selectArea = localStorage['selectArea']
      if (selectArea) {
        selectArea = JSON.parse(selectArea)
        let searchParams = {
          provinceId: selectArea.provinceId,
          cityId: selectArea.cityId,
          areaId: selectArea.areaId
        }

        http('ht-mj-order-server/order/wx/lastOrderAddr', searchParams)
          .then(function (suc) {
            if (suc.areaId) {
              this.hasAddress = true

              let receiptVO = this.submitOrderVO.receiptVO
              receiptVO = Object.assign({}, receiptVO, {
                provinceId: suc.provinceId,
                cityId: suc.cityId,
                areaId: suc.areaId,
                consigneeName: suc.consigneeName,
                consigneeMobile: suc.consigneeMobile,
                regionName: suc.regionName,
                detailedAddress: suc.detailedAddress
              })
              if (suc.addressId) {
                receiptVO.addressId = suc.addressId
                this.address = suc
              }

              this.submitOrderVO.receiptVO = receiptVO
            }
          }.bind(this), function (err) {})
      }
    },
    /*获取预存款 */
    getDeposit (cb) {
      http('ht-mj-account-server/portalpredeposit', {})
        .then(function (suc) {
          if (suc) {
            let isSelected = false
            if (suc.validityEnd >  new Date().getTime() && suc.validityStart < new Date().getTime() && suc.balance > 0 && this.canPreDepositAmount) {
              isSelected = true;
              let money = this.localOrderInfo.money;
              let discount = this.localOrderInfo.discount;
              let coupon = this.coupon;
              if(coupon && coupon.amount){
                money -= coupon.amount
              }
              if(discount>0){
                money -= discount
              }
              if (money > suc.balance) {
                this.submitOrderVO.preDepositAmount = (suc.balance / 100).toFixed(2)
              }else {
                this.submitOrderVO.preDepositAmount = (money / 100).toFixed(2)
              }
            }
            this.depositObj = Object.assign({isSelected: isSelected}, suc)
            this.submitOrderVO.preDepositAmountBalance = suc.balance
          }

          if (typeof cb === 'function') {
            cb()
          }
        }.bind(this), function (err) {})
    },
    /*获取钱包 */
    getWallet () {
      http('ht-mj-account-server/portalwallet', {})
        .then(function (suc) {
          let isSelected = false
          if (suc && suc.balance > 0) {
            isSelected = true

            let money = this.localOrderInfo.money;
            let discount = this.localOrderInfo.discount;
            let coupon = this.coupon;
            if(coupon && coupon.amount){
              money -= coupon.amount
            }
            if(discount>0){
              money -= discount
            }
            let preDepositAmount = this.submitOrderVO.preDepositAmount * 100
            if (money > preDepositAmount) {
              let walletAmount = money - preDepositAmount
              if (walletAmount > suc.balance) {
                this.submitOrderVO.walletAmount = (suc.balance / 100).toFixed(2)
              } else{
                this.submitOrderVO.walletAmount = (walletAmount / 100).toFixed(2)
              }
            }else {
              this.submitOrderVO.walletAmount = 0
            }
          }
          this.walletObj = Object.assign({isSelected: isSelected}, suc)
          this.submitOrderVO.walletAmountBalance = suc.balance
        }.bind(this), function (err) {})
    },
    /* 获取商品详情*/
    getDetail (skuId, cb) {
      let submitOrderVO = this.submitOrderVO
      let searchParams = {skuId: skuId}
      http('ht-mj-goods-server/goods/foreQueryDetail', {foreQueryVo: searchParams})
        .then(function (suc) {
          if (suc && suc.goodsType == 3) {
            let extendObj = this.getDetailExtendObj(suc)
            submitOrderVO = Object.assign({}, submitOrderVO, extendObj)
            let localOrderInfo = this.getDetailExtendObj(suc, true)

            this.localOrderInfo = Object.assign({earnest: localOrderInfo.money}, localOrderInfo)
            this.submitOrderVO = submitOrderVO

            if (typeof cb === 'function') {
              cb()
            }
          }else {
            this.$vux.toast.text('该商品不支持立即购买')
          }
        }.bind(this), function (err) {})
    },
    /* 检查是否可以使用预存款*/
    checkPredeposit (cb) {
      let localOrderInfo = this.localOrderInfo
      if (localOrderInfo && localOrderInfo.orderItemVOList && localOrderInfo.orderItemVOList.length > 0) {
        let skuIds = []
        localOrderInfo.orderItemVOList.map((v, i) => {
          if(v['isGift'] !==1){
            skuIds.push(v['skuId'])
          }

        })
        http('ht-mj-goods-server/goods/checkPredeposit', {skuIds: skuIds})
          .then(function (suc) {
            this.canPreDepositAmount = suc
            // this.canPreDepositAmount = true;
            if (cb && typeof cb === 'function') {
              cb()
            }
          }.bind(this), function (err) {})
      }
    },
    /*清除多余字段 */
    cleanParams (obj) {
      let newObj = obj;
      if(newObj.money){
        delete newObj.money;
      }
      if(newObj.discount>=0){
        delete newObj.discount;
      }
      if (newObj.orderItemVOList && newObj.orderItemVOList.length > 0) {
        let orderItemVOList = [];
        newObj.orderItemVOList.map((v, i) => {
          if(v['isGift'] !== 1){
            delete v['goodsName'];
            delete v['imgUrl'];
            delete v['goodsCategoryId'];
            delete v['merchantId'];
            orderItemVOList.push(v);
          }
        });
        newObj.orderItemVOList = orderItemVOList;
      }
      return newObj
    },
    /* 设置地址*/
    setAddress () {
      let selectArea = localStorage['selectArea']
      if (selectArea) {
        selectArea = JSON.parse(selectArea)
        this.address = selectArea
      }
    },
    openSelectCoupon(){
      let skuId = this.skuId;
      if(skuId<=0){
        this.showCouponList=true;
      }
    },
    depositClick(){
      let depositObj = this.depositObj;
      if(depositObj.balance>0 && depositObj.validityEnd > new Date().getTime()){
        depositObj.isSelected=!depositObj.isSelected;
      }
    },
    walletClick(){
      let walletObj = this.walletObj;
      if(walletObj.balance>0){
        walletObj.isSelected=!walletObj.isSelected;
      }
    }
  },

  mounted: function () {
    let {params} = this.$route
    let skuId = parseInt(params.skuId)
    let submitOrderVO = this.submitOrderVO

    /*-地址*/
    this.setAddress()
    this.getLastAddress()

    /*套餐*/
    if (skuId === 0) {
      let packageInfo = localStorage['packageInfo']
      if (packageInfo) {
        packageInfo = JSON.parse(packageInfo)
        if (packageInfo['comboIncludeList']) {
          let extendObj = this.getExtendObj(packageInfo['comboIncludeList'])
          submitOrderVO = Object.assign({packageId: packageInfo['packageId']}, submitOrderVO, extendObj)

          let localOrderInfo = this.getExtendObj(packageInfo['comboIncludeList'], true)
          this.localOrderInfo = localOrderInfo;

          if (localOrderInfo.orderItemVOList.length === 0) {
            this.$vux.alert.show({
              title: '提示',
              content: '该套餐没有选中商品'
            })
          }

          this.checkPredeposit(function () {
            /*预存款-钱包 */
            this.getDeposit(function () {
              this.getWallet()
            }.bind(this))
          }.bind(this))

          // localStorage['submitOrderInfo'] = JSON.stringify(localOrderInfo);
          console.log({packageInfo: packageInfo, localOrderInfo: localOrderInfo})
        }
      }else {
        this.$vux.alert.show({
          title: '提示',
          content: '未选择套餐'
        })
      }
    }
    /*预购商品 */
    else if (skuId > 0) {
      this.getDetail(skuId, function () {
        this.checkPredeposit(function () {
          /*预存款-钱包 */
          this.getDeposit(function () {
            this.getWallet()
          }.bind(this))
        }.bind(this))


      }.bind(this))
    }
    /* 购物车结算*/
    else {
      skuId = -1;
      let submitOrderInfo = localStorage['submitOrderInfo']
      if (submitOrderInfo) {
        submitOrderInfo = JSON.parse(submitOrderInfo);

        // submitOrderInfo.discount = 200;
        // if(submitOrderInfo.orderItemVOList){
        //   submitOrderInfo.orderItemVOList.map((v,i)=>{
        //     v['conditionId']=115;
        //     v['promotionId']=10;
        //     v['conditionUpdatedTime']=0;
        //     v['promotionUpdatedTime']=0;
        //     v['goodsCategoryId']=7;
        //     v['merchantId']=53;
        //   })
        // }
        // localStorage['submitOrderInfo'] = JSON.stringify(submitOrderInfo);

        let localOrderInfo = Object.assign({}, submitOrderInfo);
        this.localOrderInfo = localOrderInfo;


        this.checkPredeposit(function () {
          /*预存款-钱包 */
          this.getDeposit(function () {
            this.getWallet()
          }.bind(this))
        }.bind(this))

      } else{
        this.$vux.alert.show({
          title: '提示',
          content: '结算商品为空'
        })
      }
      submitOrderVO = Object.assign({}, submitOrderVO, submitOrderInfo)
    }

    this.skuId = skuId;
    this.submitOrderVO = submitOrderVO


  },
  data () {
    return {
      regBox: {
        tel: /^1\d{10}$/
      },
      skuId:-1,
      toOrderLoading: false,
      showProduct: true,
      showAddressList: false,
      showCouponList: false,
      showBill: false,
      showMoney: false,
      showAgree: false,
      valueTrue: true,
      hasAddress: false,
      canPreDepositAmount: false,
      localOrderInfo: {
        money: '',
        discount: '',
        orderItemVOList: []
      },
      needPayAmount: '',
      address: {},
      coupon:{
        amount:0
      },
      couponEnabled:false,
      submitOrderVO: {
        communityId: localStorage['communityId'],
        money: 0,
        discount: 0,
        orderItemVOList: [],
        invoiceVO: {
          content: '商品明细',
          taxId: '',
          title: '',
          type: 1
        },
        receiptVO: {
          provinceId: localStorage['selectArea'] ? JSON.parse(localStorage['selectArea'])['provinceId']:'',
          cityId: localStorage['selectArea'] ? JSON.parse(localStorage['selectArea'])['cityId']:'',
          areaId: localStorage['selectArea'] ? JSON.parse(localStorage['selectArea'])['areaId']:'',
          regionName: localStorage['selectArea'] ? getFullAdress(JSON.parse(localStorage['selectArea']), true):'',
          detailedAddress: '',
          consigneeMobile: '',
          consigneeName: '',
          userRemark: ''
        },
        preDepositAmount: '',
        walletAmount: '',
        preDepositAmountBalance: '',
        walletAmountBalance: ''
      },
      depositObj:{},
      walletObj:{},
      invoiceVO:{
        content:'商品明细',
        taxId:'',
        title:'',
        type:1
      },
      billTypes:[
        {name:'不开发票', value:'不开发票'},
        {name:'个人', value:'个人-商品明细'},
        {name:'单位', value:'单位-商品明细'}
      ],
      moneyObj:{
        money:0,
        postage:0,
        discount:0,
        coupon:0,
        earnest:0
      }
    }
  }
}
