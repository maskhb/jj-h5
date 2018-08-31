<template>
  <div>
    <div class="wrapper groupLink">
      <group v-if="hasAddress" class="weui-cells-top">
        <cell is-link class="addressCell" @click.native="showAddressList=true">
          <flexbox :gutter="0" slot="title">
            <flexbox-item span="30">
              <i class="location_b"></i>
            </flexbox-item>
            <flexbox-item>
              <div class="user">
                <span class="mr_10">{{submitOrderVO.receiptVO.consigneeName}}</span>
                <span>{{submitOrderVO.receiptVO.consigneeMobile}}</span>
              </div>
              <p class="address">{{submitOrderVO.receiptVO.regionName}}{{submitOrderVO.receiptVO.detailedAddress}}</p>
            </flexbox-item>
          </flexbox>
        </cell>
      </group>
      <group v-else title="" class="weui-cells_form weui-cells-top">
        <x-input title="收货人" placeholder="请输入收货人" :max="20" label-width="5" v-model="submitOrderVO.receiptVO.consigneeName"></x-input>
        <x-input title="手机号码" placeholder="请输入手机号" is-type="china-mobile" label-width="5" v-model="submitOrderVO.receiptVO.consigneeMobile" ></x-input>
        <x-input title="所在地区" label-width="5" disabled v-model="submitOrderVO.receiptVO.regionName">
          <a slot="right" class="helpBtn" @click="showAreaHelp">
            <!--<i class="fa fa-question"></i>-->
          </a>
        </x-input>
        <x-input title="详细地址" placeholder="请输入街道、楼牌号" :max="100" label-width="5" v-model="submitOrderVO.receiptVO.detailedAddress"></x-input>
      </group>
      <group class="productList">
        <flexbox :gutter="0" class="m_5" v-if="!showProduct">
          <flexbox-item v-if="index<3" span="90" v-for="(product,index) in localOrderInfo.orderItemVOList">
            <div class="imgDom">
              <img :src="product.imgUrl"/>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="explain" @click="showProduct=true">
              <span>共{{localOrderInfo.orderItemVOList|getSumSkuNum}}件，详情</span><i class="fa fa-angle-down"></i>
            </div>
          </flexbox-item>
        </flexbox>
        <div v-else>
          <ul class="productList_v">
            <li v-for="(product,index) in localOrderInfo.orderItemVOList">
              <flexbox :gutter="0">
                <flexbox-item span="90">
                  <div class="imgDom">
                    <img :src="product.imgUrl"/>
                  </div>
                </flexbox-item>
                <flexbox-item>
                  <div class="productInfo">
                    <div class="title display1line">{{product.goodsName}}</div>
                    <div class="desc display2line">{{product.propertyValue}}</div>
                    <div class="amount">x{{product.goodsNum}}</div>
                  </div>
                </flexbox-item>
                <flexbox-item span="90">
                  <div class="price">
                    &yen;{{product.salePrice|money}}
                  </div>
                </flexbox-item>
              </flexbox>
            </li>
          </ul>
          <a class="upBtn" @click="showProduct=false" v-if="localOrderInfo.orderItemVOList.length>3">
            <span>收起</span>
            <i class="fa fa-angle-up"></i>
          </a>
        </div>
      </group>
      <group>
        <cell title="支付方式" value="在线支付"></cell>
        <cell title="发票" :value="submitOrderVO.invoiceVO.type-1===0?'不开发票':invoiceVO.title" is-link @click.native="showBill=true"></cell>
      </group>
      <group>
        <cell title="配送方式" value="免费配送"></cell>
        <cell title="使用优惠券" :value="couponEnabled?(coupon && coupon.codeId?'修改':'有可用优惠券'):'无可用优惠券'" @click.native="openSelectCoupon"></cell>
        <ul class="discountList" v-if="coupon && coupon.codeId">
          <li>
            <span>家居商品满{{coupon.conditionAmount|money(0)}}减{{coupon.amount|money(0)}}优惠券，可抵扣</span>
            <i>-&yen;{{coupon.amount|money(0)}}</i>
          </li>
        </ul>
      </group>
      <group>
        <cell title="实付金额:" is-link  :arrow-direction="showMoney?'up':'down'" @click.native="showMoney=!showMoney">
          <div slot="title" class="center">
            <span>实付金额：</span>
            <span>&yen;{{(localOrderInfo.money-(coupon.amount?coupon.amount:0)-(localOrderInfo.discount?localOrderInfo.discount:0))|money}}</span>
          </div>
        </cell>
        <div class="slide" :class="showMoney?'animate':''">
          <div class="moneyList">
            <div class="moneyRow">
              <span>商品金额</span>
              <b>&yen;{{moneyObj.money|money}}</b>
            </div>
            <div class="moneyRow">
              <span>配送费</span>
              <b>&yen;{{moneyObj.postage|money}}</b>
            </div>
            <div class="moneyRow" v-if="moneyObj.discount>0">
              <span>满减优惠</span>
              <b>-&yen;{{moneyObj.discount|money}}</b>
            </div>
            <div class="moneyRow">
              <span>优惠券</span>
              <b>-&yen;{{moneyObj.coupon|money}}</b>
            </div>
            <div class="moneyRow" v-if="moneyObj.earnest>0">
              <span>定金</span>
              <b>&yen;{{moneyObj.earnest|money}}</b>
            </div>
          </div>
        </div>
      </group>

      <group>
        <cell title="使用预存款" v-if="canPreDepositAmount" is-link :arrow-direction="depositObj.isSelected?'up':'down'" @click.native="depositClick">
          <div slot="title">
            <span>
              <icon v-if="depositObj.isSelected" type="success-circle"></icon>
              <icon v-else type="circle"></icon>
              <span>使用预存款</span>
            </span>
          </div>
          <span class="black">&yen;{{depositObj.balance|money}}</span>
        </cell>
        <div class="slide" v-if="canPreDepositAmount" :class="depositObj.isSelected?'animate':''">
          <p class="cellContent">
            您有预存款&yen;{{depositObj.balance|money}}, 本次可用&yen;{{getDepositCanUse()}}</br>
            有效期：{{depositObj.validityEnd|date}}
          </p>
          <x-input title="" placeholder="请输入本次抵扣金额" type="number" :min="0" @on-change="changeMoney" v-model="submitOrderVO.preDepositAmount"></x-input>
        </div>

        <cell title="蜜家钱包抵扣" is-link  :arrow-direction="walletObj.isSelected?'up':'down'" @click.native="walletClick">
          <div slot="title">
            <span>
              <icon v-if="walletObj.isSelected" type="success-circle"></icon>
              <icon v-else type="circle"></icon>
              <span>蜜家钱包抵扣</span>
            </span>
          </div>
          <span class="black">&yen;{{walletObj.balance|money}}</span>
        </cell>
        <div class="slide" :class="walletObj.isSelected?'animate':''">
          <x-input title="" placeholder="请输入本次抵扣金额" type="number" :min="0" @on-change="changeMoney" v-model="submitOrderVO.walletAmount"></x-input>
        </div>

        <x-input title="" :max="200" placeholder="给卖家留言" v-model="submitOrderVO.receiptVO.userRemark"></x-input>
      </group>

      <group>
        <agree v-model="valueTrue" class="mt_20 mb_20">同意<a href="javascript:void(0);" @click="showAgree=true">《恒腾密蜜家居商城销售协议》</a></agree>
      </group>
    </div>

    <div class="footer">
      <flexbox :gutter="0">
        <flexbox-item :span="2/3">
          <div class="pl_20" v-if="needPayAmount!=='' && needPayAmount>=0">
            还需支付：<span class="red">&yen;{{needPayAmount|money}}</span>
          </div>
        </flexbox-item>
        <flexbox-item :span="1/3">
          <a class="yellowBtn footerLink" :class="{'disabled': !valueTrue}" @click="submitOrder">提交订单</a>
        </flexbox-item>
      </flexbox>
    </div>

    <!--收货地址修改-->
    <div class="diyDialog" :class="{show:showAddressList}">
      <address-select :address="address" @selectAddress="selectAddress"></address-select>
    </div>

    <!--优惠券修改-->
    <div class="diyDialog" :class="{show:showCouponList}">
      <coupon-select :orderInfo="localOrderInfo" :skuId="skuId" :coupon="coupon" @selectCoupon="selectCoupon" @hasEnabled="hasEnabled"></coupon-select>
    </div>

    <!--发票-->
    <div v-transfer-dom>
      <popup v-model="showBill" position="bottom" class="billDialog">
        <div>
          <div class="hint">
            <i class="fa fa-info-circle mr_10"></i>使用品牌家居券支付的商品，无法提供发票
          </div>
          <div class="billMenu">
            <h1>选择发票</h1>
            <ul>
              <li :class="{current:invoiceVO.type==index+1}" v-for="(bill,index) in billTypes" @click="changeBillType(index)">{{bill.name}}</li>
            </ul>
          </div>
          <div>
            <group v-if="invoiceVO.type!=1">
              <x-input title="发票抬头" :max="100" placeholder="请输入发票抬头" v-model="invoiceVO.title"></x-input>
              <x-input title="发票内容" :max="100" placeholder="发票内容" value="商品明细" readonly></x-input>
              <x-input v-if="invoiceVO.type==3" :max="100"
                       title="纳税人识别号" placeholder="请输入纳税人识别号" label-width="5" v-model="invoiceVO.taxId"></x-input>
            </group>
          </div>
          <div class="toolBar m_20">
            <x-button class="yellowBtn" @click.native="saveInvoiceVO">保存</x-button>
          </div>
        </div>
      </popup>
    </div>

    <!--销售协议-->
    <div v-transfer-dom>
      <popup v-model="showAgree" position="bottom" class="agreeDialog" height="100%">

        <div class="relative h_100per">
          <x-header title="密蜜家居商城销售协议" :left-options="{backText: '',preventGoBack:true}" @on-click-back="showAgree=false"/>
          <div class="agreeContent">
            <view-box body-padding-bottom="0px">
              <div class="p_20">
                <p>《密蜜家居商城销售协议》（以下简称“本协议”）是您（或称“用户”，指注册、登录、使用、浏览本服务的个人或组织）与恒腾网络公司运营的家居平台密蜜家居（以下简称“密蜜家居”）之间关于密蜜家居网站（jiaju.htmimi.com）与密蜜家居商品销售所订立的协议。</p>
                <p>密蜜家居在此特别提醒用户认真阅读、充分理解本协议，未成年人应在法定监护人陪同下阅读。您点击“同意”将视为对本协议的接受，并同意接受本协议各项条款的约束。除非用户接受本协议所有条款，否则用户无权购买密蜜家居商品。</p>
                <p>用户理解并接受：</p>
                <p class="mt_20"><b>第1条 商品信息</b></p>
                <p>本站上的商品价格、数量、是否有货等商品信息随时都有可能发生变动，本站不作特别通知。由于网站上商品信息的数量极其庞大，虽然本站会尽最大努力保证您所浏览商品信息的准确性，但由于众所周知的互联网技术因素等客观原因存在，本站网页显示的信息可能会有一定的滞后性或差错，对此情形您知悉并理解。</p>
                <p class="mt_20"><b>第2条 订单</b></p>
                <p>2.1 在您下订单时，请您仔细确认所购商品的名称、价格、数量、型号、规格、尺寸、联系地址、电话、收货人等信息。收货人与用户本人不一致的，收货人的行为和意思表示视为用户的行为和意思表示，用户应对收货人的行为及意思表示的法律后果承担连带责任。</p>
                <p>2.2 除法律另有强制性规定外，双方约定如下：本站上销售方展示的商品和价格等信息仅仅是交易信息的发布，您下单时须填写您希望购买的商品数量、价款及支付方式、收货人、联系方式、收货地址等内容；系统生成的订单信息是计算机信息系统根据您填写的内容自动生成的数据，仅是您向销售方发出的交易诉求；销售方收到您的订单信息后，只有在销售方将您在订单中订购的商品从仓库实际直接向您发出时（ 以商品出库为标志），方视为您与销售方之间就实际直接向您发出的商品建立了交易关系；如果您在一份订单里订购了多种商品并且销售方只给您发出了部分商品时，您与销售方之间仅就实际直接向您发出的商品建立了交易关系；只有在销售方实际直接向您发出了订单中订购的其他商品时，您和销售方之间就订单中该其他已实际直接向您发出的商品才成立交易关系。您可以随时登录您在本站注册的账户，查询您的订单状态。</p>
                <p>2.3 如果您选择支付预存款而后补齐全款的付款方式，请及时根据系统指示完成付款。您接受并认可，当您支付预存款而逾期支付全款的情形发生时，密蜜家居将没收您已经支付的预存款，并且取消订单。</p>
                <p>2.4 关于退款：以支付宝或微信支付的订单需要退款的退款方式是原路返回。</p>
                <p class="mt_20"><b>第3条 配送</b></p>
                <p>3.1销售方将会把商品（货物）送到指定的收货地址，所有在本站上列出的送货时间为参考时间，参考时间的计算是根据库存状况、正常的处理过程和送货时间、送货地点的基础上估计得出的。</p>
                <p>3.2因如下情况造成订单延迟或无法配送等，销售方不承担延迟配送的责任：</p>
                <p>（1）用户提供的信息错误、地址不详细等原因导致的；</p>
                <p>（2）货物送达后无人签收，导致无法配送或延迟配送的；</p>
                <p>（3）情势变更因素导致的；</p>
                <p>（4）不可抗力因素导致的，例如：自然灾害、交通戒严、突发战争等。</p>
                <p class="mt_20"><b>4、其它</b></p>
                <p>4.1 本协议适用中华人民共和国法律。如果双方发生纠纷，应本着友好的原则协商解决；如协商不成，应向广州市天河区人民法院提起诉讼。</p>
                <p>4.2 若本协议中的某些条款因故无法适用，则本协议的其他条款继续适用且无法适用的条款将会被修改，以便其能够依法适用。</p>
                <p>4.3 “密蜜家居商城注册协议”也构成本协议的一部分，若本协议的条款与“密蜜家居用户协议”的条款冲突，则以本协议为准。</p>
                <p>4.4 密蜜家居保留在中华人民共和国大陆地区法施行之法律允许的范围内独自决定拒绝服务、关闭用户账户、清除或编辑内容或取消订单的权利。</p>
              </div>
            </view-box>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import Confirm from './js/confirm.js';
  export default Confirm;
</script>

<style lang="less" scoped>
  @import './css/style.less';
</style>
