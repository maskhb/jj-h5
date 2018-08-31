<template>
<div class="wrapper">
  <ht-marquee>{{shoppingCartTitle}}</ht-marquee>
  <div v-if="group.length>0 && isLogin">
    <div class="group" v-for="groupItem in group" :key="groupItem.promotionId">
      <p class="tips display1line" v-if="groupItem.promotionId!==0 && groupItem.activityUrlApp"><a :href="groupItem.activityUrlApp"><span>{{conditionTypeOpt[groupItem.conditionType]}}</span>{{groupItem.tips}}</a></p>
      <p class="tips display2line" v-else-if="groupItem.promotionId!==0"><span>{{conditionTypeOpt[groupItem.conditionType]}}</span>{{groupItem.tips}}</p>

      <div class="block" v-if="groupItem.skuCompoundVos && groupItem.skuCompoundVos.length>0">
        <div class="content" v-for="item in groupItem.skuCompoundVos" :key="item.skuId" @click.self="gotoGoods(item.skuId)">
          <check-icon v-if="item.isSellOut!==2 && item.isOffShelves!==2" @click.native="checkIcon(1)" type="plain" :value.sync="item.checkoutState" ></check-icon>
          <div @click="$router.push('Product/detail/'+item.skuId)" class="fl imgbox" :style="{backgroundImage:'url('+imgFormat(item.imgUrl, '160X160')+')'}">
            <div v-if="item.isSellOut===2" class="goods-state fs12">已售罄</div>
            <div v-else-if="item.isOffShelves===2" class="goods-state fs12">已下架</div>
          </div>
          <span class="price">¥{{item.price | money}}</span>
          <p class="good-title display2line" @click="$router.push('Product/detail/'+item.skuId)">{{item.goodsName}}</p>
          <inline-x-number class="x-number" :class="{'warning': item.warning === true}" :min="1" :max="item.remainNum === 0 ? 1:10000" :fillable="item.remainNum !== 0" button-style="round" v-model="item.goodsNum" :addFn="change(item.remainNum, item)" :subFn="change(item.remainNum, item)" :blurFn="blurFn(item.remainNum, item)" ></inline-x-number>
          <p class="display1line p2">{{item.property}}</p>
          <i class="change-rule" @click="showRule(item)" >修改优惠</i>
          <icon class="clear" type="clear" @click.native="del(item.skuId)" ></icon>
          <p class="cb"></p>
        </div>

        <template v-if="groupItem.giftPromotion && groupItem.giftPromotion.goodsSkuInfoVos">
        <div class="contentInner" @click="$router.push('Product/detail/'+goods.skuId)" v-for="goods in groupItem.giftPromotion.goodsSkuInfoVos" :key="goods.skuId">
          <div class="fl imgbox" :style="{backgroundImage:'url('+imgFormat(goods.imgUrl, '100X100')+')'}"></div>
          <p class="p1 display2line">
            <span style="color:#FFB000">赠品</span>
            <span style="color:#000000">|</span> {{goods.goodsName}}
          </p>
          <p class="p2 display1line">{{goods.goodsDetail}}</p>
          <span v-if="goods.giftNum" class="num">x {{goods.giftNum}}</span>
        </div>
        </template>
      </div>
    </div>
  </div>
  <div class="block" v-else-if="list && list.length>0 && !isLogin">
    <div class="content" v-for="item in list" :key="item.skuId" @click.self="gotoGoods(item.skuId)">
      <check-icon v-if="item.isSellOut!==2 && item.isOffShelves!==2" @click.native="checkIcon(1)" type="plain" :value.sync="item.checkoutState" ></check-icon>
      <div class="fl imgbox" @click="$router.push('Product/detail/'+item.skuId)" :style="{backgroundImage:'url('+imgFormat(item.imgUrl, '160X160')+')'}">
        <div v-if="item.isSellOut===2" class="goods-state fs12">已售罄</div>
        <div v-else-if="item.isOffShelves===2" class="goods-state fs12">已下架</div>
      </div>
      <span class="price">¥{{item.price | money}}</span>
      <p class="good-title display2line" @click="$router.push('Product/detail/'+item.skuId)">{{item.goodsName}}</p>
      <inline-x-number class="x-number" :class="{'warning': item.warning === true}" :min="1" :max="item.remainNum === 0 ? 1:10000" :fillable="item.remainNum !== 0" button-style="round" v-model="item.goodsNum" :addFn="change(item.remainNum, item)" :subFn="change(item.remainNum, item)" :blurFn="blurFn(item.remainNum, item)" ></inline-x-number>
      <p class="display1line p2">{{item.property}}</p>
      <icon class="clear" type="clear" @click.native="del(item.skuId)" ></icon>
      <p class="cb"></p>
    </div>
  </div>
  <div v-else class="cartEmpty">
    <span>您的购物车空空如也，赶紧去逛逛吧~</span><br/>
    <router-link class="darkLineBtn mt_20" to="/Mall">去逛逛</router-link>
  </div>
  <div class="footer-count halfpx_top" v-if="list && list.length>0 && !isLogin">
    <check-icon class="fl" type="plain" @click.native="checkIcon(2)" :value.sync="selectAll" >全选</check-icon>
    <div v-if="someSelect" class="fr btn active" @click="submitOrder">去结算</div>
    <div v-else class="fr btn">去结算</div>
    <div class="count">
      <p class="total-count-txt">
      合计：<span class="fs16">¥{{countTotal | money}}</span>
      </p>
      <p class="fs12" v-if="countTotal>0">
      总额：<span>¥{{countTotal | money}}</span>
      </p>
    </div>
  </div>
  <div class="footer-count halfpx_top" v-else-if="group.length>0 && isLogin">
    <check-icon class="fl" type="plain" @click.native="checkIcon(2)" :value.sync="selectAll" >全选</check-icon>
    <div v-if="someSelect" class="fr btn active" @click="submitOrder">去结算</div>
    <div v-else class="fr btn">去结算</div>
    <div class="count">
      <p class="total-count-txt">
      合计：<span class="fs16">¥{{countTotal - countDiscount | money}}</span>
      </p>
      <p class="fs12" v-if="countTotal>0">
        <span v-if="countDiscount>0"> 已减：{{countDiscount | money}}</span>
      </p>
    </div>
  </div>

  <div v-transfer-dom>
    <toast v-model="toastShow" type="text" width="11em" :time="800" is-show-mask :text="toastTips"></toast>
  </div>
  <actionsheet v-model="rule.visiable" :menus="rule.list" @on-click-menu="onSelectRule" ></actionsheet>
</div>
</template>

<script>
import {
  ConfirmPlugin, CheckIcon, Icon, Toast, TransferDomDirective as TransferDom, ToastPlugin, Actionsheet
} from 'vux'
import http from '@/http'
import {InlineXNumber, Marquee} from '@/components'
import {checkLogin} from '@/utils/common'
import {moneyAuto} from '@/utils/filter'
import {getCart, setCart, removeCart} from '@/utils/cart'
import Vue from 'vue'
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)

export default {
  directives: {
    TransferDom
  },
  components: {
    Actionsheet,
    ConfirmPlugin,
    InlineXNumber,
    CheckIcon,
    Icon,
    Toast,
    'ht-marquee': Marquee
  },
  methods: {
    showRule (item) {
      let list = item.promotionVosOfSku
      let menus = []
      menus = list.map((v, index) => {
        return {label: v.promotionName, value: v.promotionId}
      })
      menus.push({label: '不使用优惠', value: '-1'})

      this.rule = {
        visiable: true,
        list: menus,
        skuId: item.skuId
      }
    },
    onSelectRule (menuKey, menuItem) {
      http('ht-mj-cart-server/updateSkuProId', {communityId: localStorage.communityId, skuId: this.rule.skuId, promotionId: menuItem.value}).then((res) => {
        this.getList()
      })
    },
    checkIcon (type) {
      setTimeout(() => {
        if (type === 2) {
          let value = this.selectAll
          this.list = this.list.map((v) => {
            if (v.isSellOut === 2 || v.isOffShelves === 2) {
              return v
            }
            v.checkoutState = value === true
            return v
          })
        }

        this.group.forEach((item) => {
          this.setPromotions(item)
        })
      }, 100)
    },
    refreshmjcartgoodsnum () {
      if (checkLogin()) {
        let cartLocal = getCart()
        let map = {}

        cartLocal.list.forEach((v) => {
          map[v.skuId] = v.goodsNum
        })

        if (Object.keys(map).length > 0) {
          http('ht-mj-cart-server/refreshmjcartgoodsnum', {communityId: localStorage.communityId, skuIdToNum: {map: map}}).then((res) => {
            this.getList()
          })
        } else {
          this.getList()
        }
      } else {
        this.getList()
      }
    },
    getList () {
      if (checkLogin()) {
        http('ht-mj-cart-server/mjCartWithGroup', {communityId: localStorage.communityId}).then((res) => {
          let cartLocal = getCart()

          let group = res.promotionGroupVos || []
          let list = []
          group = group.map((item) => {
            item.skuCompoundVos = item.skuCompoundVos.map((v) => {
              v = {...v.skuVo, ...{promotionVosOfSku: v.promotionVosOfSku}}

              v.checkoutState = true

              let _item = cartLocal.list.find(v2 => { return v2.skuId === v.skuId })

              if (_item) {
                v.checkoutState = _item['checkoutState']
                v.goodsNum = _item['goodsNum'] > v.remainNum ? v.remainNum : _item['goodsNum']
              }

              if (v.isSellOut === 2 || v.isOffShelves === 2) {
                v.checkoutState = false
              }

              if (v.isSellOut === 2 || v.remainNum === 0) {
                v.goodsNum = 1
              }

              v.imgUrl = v.imgUrl || '/static/goods-default.png'

              v.group = item
              list.push(v)
              return v
            })

            let goodsNameStr = []
            item.goodsSkuInfoVos = item.goodsSkuInfoVos || []
            item.goodsSkuInfoVos.forEach((v) => {
              goodsNameStr.push(v.goodsName)
            })

            item = this.setPromotions(item)

            return item
          })

          this.group = group
          console.log('this.group', this.group)
          this.list = list
        })
      } else {
        let cartLocal = getCart()
        let skuIdToNum = {}

        if (localStorage.communityId && cartLocal.list.length > 0) {
          cartLocal.list.forEach((v) => {
            skuIdToNum[v.skuId] = v.goodsNum
          })

          http('ht-mj-cart-server/unmjcart', {communityId: localStorage.communityId, skuIdToNum: {map: skuIdToNum}}).then((res) => {
            let cartLocal = getCart()
            let list = []

            // 按本地排序
            cartLocal.list.forEach((v, index) => {
              let item = res.skuVoList.find((v2) => {
                return v2.skuId === v.skuId
              })

              item.checkoutState = item.checkoutState === 1
              item.imgUrl = item.imgUrl || '/static/goods-default.png'

              list.push(item)
            })

            this.list = list
          })
        }
      }
    },
    setPromotions (item) {
      if (item && item.promotionId !== 0) {
        item.tips = ''
        item.accordPromotion = null
        let checkNum = 0
        let conditionType = item.conditionType
        let conditionsOfThePromotion = item.conditionsOfThePromotion || []
        conditionsOfThePromotion = conditionsOfThePromotion.sort((a, b) => { return a.fullKey - b.fullKey })

        let total = item.skuCompoundVos.reduce((total, v) => {
          if (v.checkoutState && v['isSellOut'] !== 2 && v['isOffShelves'] !== 2) {
            checkNum++
            return total + v.goodsNum * v.price
          }
          return total
        }, 0) || 0

        // 满足的所有规则
        let accordPromotions = conditionsOfThePromotion.filter((v, index) => {
          return total >= v.fullKey
        })

        // 即将满足的下一个规则
        let nextPromotions = conditionsOfThePromotion.find((v, index) => {
          return total < v.fullKey
        })

        if (conditionType === 1) {
          item.tips = `每满${moneyAuto(conditionsOfThePromotion[0].fullKey)}元减${moneyAuto(conditionsOfThePromotion[0].fullValue)}元`
          if (total === 0 && checkNum) {
            // item.tips = `每满${moneyAuto(nextPromotions.fullKey)}元减${moneyAuto(nextPromotions.fullValue)}元`
            item.activityUrlApp = nextPromotions.activityUrlApp
          } else {
            if (accordPromotions.length === 0) {
              // item.tips = `再购${moneyAuto(nextPromotions.fullKey - total)}元,即可享受满${moneyAuto(nextPromotions.fullKey)}元减${moneyAuto(nextPromotions.fullValue)}元优惠`
              item.activityUrlApp = nextPromotions.activityUrlApp
            } else {
              // let priceStep = parseInt(total / accordPromotions[0].fullKey)
              // let priceLeft = accordPromotions[0].fullKey * (priceStep + 1) - total

              // item.tips = `已享满${moneyAuto(accordPromotions[0].fullKey * priceStep)}元减${moneyAuto(accordPromotions[0].fullValue)}元优惠`
              if (accordPromotions[0]) {
                // item.tips += `,再购${moneyAuto(priceLeft)}元,即可享受满${moneyAuto(accordPromotions[0].fullKey * (priceStep + 1))}元减${moneyAuto(accordPromotions[0].fullValue * (priceStep + 1))}元优惠`
              }
              item.accordPromotion = accordPromotions[0]
              item.activityUrlApp = accordPromotions[0].activityUrlApp
            }
          }
        } else if (conditionType === 2) {
          if (total === 0 && checkNum) {
            item.tips = `满${moneyAuto(conditionsOfThePromotion[0].fullKey)}元减${moneyAuto(nextPromotions.fullValue)}元`
            item.activityUrlApp = conditionsOfThePromotion[0].activityUrlApp
          } else {
            if (accordPromotions.length === 0) {
              item.tips = `再购${moneyAuto(nextPromotions.fullKey - total)}元即可享受满${moneyAuto(nextPromotions.fullKey)}元减${moneyAuto(nextPromotions.fullValue)}元优惠`
              item.activityUrlApp = nextPromotions.activityUrlApp
            } else {
              item.tips = `已享满${moneyAuto(accordPromotions[accordPromotions.length - 1].fullKey)}元减${moneyAuto(accordPromotions[accordPromotions.length - 1].fullValue)}元优惠`
              if (nextPromotions) {
                item.tips += `,再购${moneyAuto(nextPromotions.fullKey - total)}元即可享受满${moneyAuto(nextPromotions.fullKey)}元减${moneyAuto(nextPromotions.fullValue)}元优惠`
              }
              item.accordPromotion = accordPromotions[accordPromotions.length - 1]
              item.activityUrlApp = accordPromotions[accordPromotions.length - 1].activityUrlApp
            }
          }
        } else if (conditionType === 3) {
          if (total === 0 && checkNum) {
            item.tips = `买${moneyAuto(conditionsOfThePromotion[0].fullKey)}元, 送以下赠品`
            item.giftPromotion = conditionsOfThePromotion[0]
            item.activityUrlApp = conditionsOfThePromotion[0].activityUrlApp
          } else {
            if (accordPromotions.length === 0) {
              item.tips = `再购${moneyAuto(nextPromotions.fullKey - total)}元, 送以下赠品`
              item.giftPromotion = nextPromotions
              item.activityUrlApp = nextPromotions.activityUrlApp
            } else {
              item.tips = `已满${moneyAuto(accordPromotions[accordPromotions.length - 1].fullKey)}元, 送以下赠品`

              if (nextPromotions) {
                item.tips += `,再购${moneyAuto(nextPromotions.fullKey - total)}元即可获赠${nextPromotions.goodsSkuInfoVos.map(v => v.goodsName + 'x' + v.giftNum).join(',')}`
              }
              item.giftPromotion = accordPromotions[accordPromotions.length - 1]
              item.accordPromotion = accordPromotions[accordPromotions.length - 1]
              item.activityUrlApp = accordPromotions[accordPromotions.length - 1].activityUrlApp
            }
          }
        } else if (conditionType === 4) {
          let amount = nextPromotions ? nextPromotions.promotionCouponVoQs[0]['amount'] : 0

          if (total === 0 && checkNum) {
            item.tips = `买${moneyAuto(conditionsOfThePromotion[0].fullKey)}元, 赠${moneyAuto(amount)}元优惠券`
            item.activityUrlApp = conditionsOfThePromotion[0].activityUrlApp
          } else {
            if (accordPromotions.length === 0) {
              item.tips = `再购${moneyAuto(nextPromotions.fullKey - total)}元, 即可享受满${moneyAuto(nextPromotions.fullKey)}元赠${moneyAuto(amount)}元优惠券`
              item.activityUrlApp = nextPromotions.activityUrlApp
            } else {
              item.tips = `已满${moneyAuto(accordPromotions[accordPromotions.length - 1].fullKey)}元,赠${moneyAuto(accordPromotions[accordPromotions.length - 1].promotionCouponVoQs[0]['amount'])}元优惠券`

              if (nextPromotions) {
                item.tips += `,再购${moneyAuto(nextPromotions.fullKey - total)}元,即可享受满${moneyAuto(nextPromotions.fullKey)}元赠${moneyAuto(amount)}元优惠券`
              }
              item.accordPromotion = accordPromotions[accordPromotions.length - 1]
              item.activityUrlApp = accordPromotions[accordPromotions.length - 1].activityUrlApp
            }
          }
        }
      }
      return item
    },
    shoppingCartTitleApi () {
      http('ht-mj-cms-server/setting/getValueByKey/shoppingCartTitle').then((res) => {
        this.shoppingCartTitle = res.value
      })
    },
    maxSkuApi () {
      http('ht-mj-cms-server/setting/getValueByKey/maxSku').then((res) => {
        this.maxSku = parseInt(res.value)
      })
    },
    delmjcartcheckoutState (skuId) {
      if (checkLogin()) {
        http('ht-mj-cart-server/delmjcartcheckoutState', {communityId: localStorage.communityId, skuIdList: {list: [skuId]}}).then((res) => {
          removeCart([skuId])
          this.getList()
        })
      } else {
        let targetIndex = this.list.findIndex(v => { return v.skuId === skuId })
        removeCart([skuId])
        this.list.splice(targetIndex, 1)
      }
    },
    blurFn (remainNum, item) {
      return (e, value) => {
        item.warning = false
        if (value > remainNum) {
          this.toastShow = true
          this.toastTips = '商品库存不足'
          setTimeout(() => {
            item.goodsNum = remainNum || 1
            item.warning = true
          }, 100)
          // e.target.focus()
        } else if (value > this.maxSku) {
          this.toastShow = true
          this.toastTips = `最多只能购买${this.maxSku}件`
          setTimeout(() => {
            item.goodsNum = this.maxSku
          }, 100)
        }
      }
    },
    change (remainNum, item) {
      return (goodsNum) => {
        setTimeout(() => {
          this.setPromotions(item.group)
        }, 0)

        item.warning = false
        if (goodsNum > remainNum) {
          this.toastShow = true
          this.toastTips = '商品库存不足'
          setTimeout(() => {
            item.goodsNum = remainNum || 1
            item.warning = true
            this.setPromotions(item.group)
          }, 100)
        } else if (goodsNum > this.maxSku) {
          this.toastShow = true
          this.toastTips = `最多只能购买${this.maxSku}件`
          setTimeout(() => {
            item.goodsNum = this.maxSku
            this.setPromotions(item.group)
          }, 100)
        }
      }
    },
    del (skuId) {
      this.$vux.confirm.show({
        content: '确认要从购物车中删除吗 ？',
        onConfirm: () => {
          this.delmjcartcheckoutState(skuId)
        }
      })
    },
    gotoGoods (skuId) {
      if (skuId > 0) {
        this.$router.push(`/Product/detail/${skuId}`)
      }
    },
    submitOrder () {
      let _this = this
      let postData = {
        submitOrderCheckVO: {
          communityId: localStorage.communityId,
          money: this.countTotal,
          orderItemVOList: this.list.filter((v) => { return v.checkoutState }).map((v) => {
            const promotion = {}
            promotion.conditionUpdatedTime = 0
            promotion.promotionUpdatedTime = 0
            promotion.conditionId = 0
            promotion.promotionId = 0

            if (v.group && v.group.accordPromotion) {
              promotion.conditionUpdatedTime = v.group.accordPromotion.conditionUpdatedTime
              promotion.promotionUpdatedTime = v.group.accordPromotion.promotionUpdatedTime
              promotion.conditionId = v.group.accordPromotion.conditionId
              promotion.promotionId = v.group.accordPromotion.promotionId
            }

            return {goodsNum: v.goodsNum, salePrice: v.price, skuId: v.skuId, propertyValue: v.property, ...promotion}
          })
        }
      }

      http('ht-mj-order-server/order/wx/submitOrderCheck', postData).then((res) => {
        if (res.code === 0) {
          let submitOrderInfo = {
            money: this.countTotal,
            discount: this.countDiscount,
            orderItemVOList: this.list.filter((v) => { return v.checkoutState }).map((v) => {
              const promotion = {}
              promotion.conditionUpdatedTime = 0
              promotion.promotionUpdatedTime = 0
              promotion.conditionId = 0
              promotion.promotionId = 0

              if (v.group.accordPromotion) {
                promotion.conditionUpdatedTime = v.group.accordPromotion.conditionUpdatedTime
                promotion.promotionUpdatedTime = v.group.accordPromotion.promotionUpdatedTime
                promotion.conditionId = v.group.accordPromotion.conditionId
                promotion.promotionId = v.group.accordPromotion.promotionId
              }

              return { goodsNum: v.goodsNum, salePrice: v.price, skuId: v.skuId, propertyValue: v.property, imgUrl: v.imgUrl, goodsName: v.goodsName, goodsCategoryId: v.goodsCategoryId, merchantId: v.merchantId, ...promotion }
            })
          }

          // 赠品
          const gifts = []
          this.group.forEach((item) => {
            if (item.accordPromotion && item.accordPromotion.conditionType === 3) {
              item.accordPromotion.goodsSkuInfoVos.forEach((v) => {
                const promotion = {}
                promotion.conditionUpdatedTime = 0
                promotion.promotionUpdatedTime = 0
                promotion.conditionId = 0
                promotion.promotionId = 0

                gifts.push({ isGift: 1, goodsNum: v.giftNum, salePrice: v.salePrice, skuId: v.skuId, propertyValue: v.property, imgUrl: v.imgUrl, goodsName: v.goodsName, goodsCategoryId: v.goodsCategoryId, merchantId: v.merchantId, ...promotion })
              })
            }
          })

          submitOrderInfo.orderItemVOList = submitOrderInfo.orderItemVOList.concat(gifts)

          localStorage.submitOrderInfo = JSON.stringify(submitOrderInfo)
          this.$router.push('/Mall/Confirm')
        } else {
          this.$vux.toast.text(res.msg)
          setTimeout(() => {
            _this.getList()
          }, 100)
        }
      })
    }
  },
  computed: {
    countTotal: function () {
      let total = 0
      this.list.forEach((v) => {
        if (v.checkoutState && v['isSellOut'] !== 2 && v['isOffShelves'] !== 2) {
          total += v.goodsNum * v.price
        }
      })

      return total
    },
    countDiscount: function () {
      let discount = 0
      this.group.forEach((v) => {
        let count = 0
        v.skuCompoundVos.forEach((v) => {
          if (v.checkoutState && v['isSellOut'] !== 2 && v['isOffShelves'] !== 2) {
            count += v.goodsNum * v.price
          }
        })

        if (v.conditionType === 2 && v.accordPromotion) {
          if (count >= parseInt(v.accordPromotion.fullKey)) {
            discount += parseInt(v.accordPromotion.fullValue)
          }
        } else if (v.conditionType === 1 && v.accordPromotion) {
          let num = parseInt(count / v.accordPromotion.fullKey)
          discount += parseInt(v.accordPromotion.fullValue) * num
        }
      })
      return discount
    }
  },
  watch: {
    list: {
      handler: function (value) {
        //  合并购物车
        let cartLocal = getCart()
        value.forEach((v) => {
          let index = cartLocal.list.findIndex(v2 => { return v2.skuId === v.skuId })
          if (index > -1) {
            cartLocal.list[index] = {checkoutState: v.checkoutState, goodsNum: v.goodsNum, skuId: v.skuId}
          } else {
            cartLocal.list.push({checkoutState: v.checkoutState, goodsNum: v.goodsNum, skuId: v.skuId})
          }
        })

        // 如果全部勾选则全选
        let tmpArr = value.filter(v => {
          //  跳过不卖的商品
          if (v.isSellOut === 2 || v.isOffShelves === 2) {
            return false
          }
          return true
        })

        if (tmpArr.length > 0) {
          this.selectAll = tmpArr.every(v => {
            return v.checkoutState
          })
        } else {
          this.selectAll = false
        }

        this.someSelect = value.some(v => {
          //  跳过不卖的商品
          if (v.isSellOut === 2 || v.isOffShelves === 2) {
            return false
          }
          return v.checkoutState
        })

        setCart(cartLocal)
      },
      deep: true
    }
  },
  mounted: function () {
    this.refreshmjcartgoodsnum()
    this.shoppingCartTitleApi()
    this.maxSkuApi()
  },
  data () {
    return {
      list: [],
      shoppingCartTitle: '',
      toastTips: '',
      maxSku: undefined,
      toastShow: false,
      selectAll: false,
      total: 0,
      goodsStateOpt: {'2': '已售罄', '3': '已下架'},
      conditionTypeOpt: {1: '满减', 2: '满减', 3: '满赠', 4: '满赠'},
      someSelect: false,
      group: [],
      isLogin: checkLogin(),
      rule: {visiable: false, list: []}
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  background-color:#F3F4F5;
  min-height:-webkit-fill-available;
}
.wrapper /deep/ .vux-check-icon{
  position:absolute;
  left:-68px;
  top:55px;
  transform:scale(0.9);
}
.noice{
  background:#FFFBF0;
  color:#C6A857;
  padding-left:20px;
  line-height:80px;
  i{
    margin-right:15px;
    float:left;
    margin-top:25px;
  }
  marquee{
    float:left;
    width:660px;
  }
  overflow:hidden;
}
.group{
  .tips{
    padding-left:152px;
    padding-top:27px;
    padding-right:20px;
    background:#fff;
    word-break:break-word;
    span{
      font-size: 20px;
      color: #F45B5E;
      line-height: 20px;
      border: 1px solid #F45B5E;
      border-radius: 4px;
      padding:3px 8px;
      margin-right:17px;
      margin-left: -80px;
    }
    font-size: 24px;
    color: #222222;
    line-height: 46px;
    max-height:80px;
  }
  border-bottom:10px #f3f4f5 solid;
}
.group:last-child{
  margin-bottom:100px;
}

.block{
  padding:0 20px 0 72px;
  overflow:hidden;
  background:#fff;
  img:last-of-type{margin-right:0;}
  .good-title{
    font-size:28px;
    width:300px;
  }
  .goods-state{
    position:absolute;
    left:50%;
    top:50%;
    color:#fff;
    width:100px;
    height:100px;
    transform:translate(-50%, -50%);
    background:rgba(34,34,34,0.40);
    border-radius:50%;
    line-height:100px;
    text-align:center;
  }
  .content{
    .imgbox{
      margin-right:20px;
      position:relative;
      lineHeight:1;
      width:170px;
      height:170px;
      background-size:contain;
      background-position:center;
      background-repeat:no-repeat;
    }

    position:relative;
    margin:24px 0;
    padding-bottom:24px;
    border-bottom:#EBEBEB solid 1px;
    .p1{
      margin-left:190px;
      line-height:38px;
      max-height: 76px;
    }
    .price{
      font-size:32px;
      color:#F45B5E;
      float:right
    }
    /deep/ .warning .vux-number-input{
      color: #f00;
    }
    /deep/ .x-number{
      position:absolute;
      bottom:20px;
      left:190px;
      transform:scale(0.95);
      transform-origin:0 100%;
      .vux-number-selector{
        border-color:#A1A7AE;
        margin-top:8px;
      }
      .vux-number-input{
        font-size:14PX;
      }
      .vux-number-input.warning{
        color: #f00;
      }
      .vux-number-selector svg{
        fill:#A1A7AE;
      }
    }
    .p2{
      position:absolute;
      height: 36px;
      bottom:75px;
      font-size:24px;
      margin-left:190px;
      color:#A1A7AE;
      width:310px;
    }
    .change-rule{
      position:absolute;
      bottom:74px;
      right:0;
      font-size: 12PX;
      color: #FFB000;
      background: #FFFBF0;
      border: 1px solid #FFB000;
      border-radius: 29px;
      padding:0px 22px;
    }
    .clear{
      position:absolute;
      bottom:24px;
      right:0;
      transform:scale(1.2);
      transform-origin:100% 100%;
    }
  }
  .content:last-child{
    margin-bottom:0;
    border-bottom:none;
  }

  .contentInner{
    .imgbox{
      margin-right:20px;
      position:relative;
      lineHeight:1;
      width:100px;
      height:100px;
      background-size:contain;
      background-position:center;
      background-repeat:no-repeat;
    }

    overflow:hidden;
    position:relative;
    .p1{padding-top:10px;margin-right:110px;}
    .p2{
      font-size:14PX;
      color:#101010;
    }
    .num{
      position:absolute;
      top:8px;
      right:0;
      color:#222222;
    }

    margin:24px 0;
    border-bottom:#EBEBEB solid 1px;
    padding-bottom:24px;
  }
  .contentInner:last-child{
    margin-bottom:0;
    border-bottom:none;
  }

}
.footer-count{
  position:fixed;
  left:0;
  bottom:0;
  width:100%;
  overflow:hidden;
  background-color:#fff;
  /deep/ .vux-check-icon{
    left:20px;
    top:27px;
  }
  .total-count-txt{
    padding-top:10px;
    font-size:28px;
    .fs16{
      font-size:32px;
    }
  }
  .btn{
    background:#e3cd9b;
    width:260px;
    height:100px;
    color:#fff;
    font-size:32px;
    text-align:center;
    line-height:100px;
  }
  .active{
    background:#FFB000;
  }
  .count{
    margin-left:188px;
    span{color:#F45B5E;}
    .fs12{
      font-size:24px;
    }
  }
}
</style>
