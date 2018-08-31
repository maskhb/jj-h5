
<template>
  <div class="addressMain">
    <div class="gray_bg" :class="{bottom_100: isSelected}">
      <view-box ref="viewBox" :body-padding-bottom="0">
        <div>
          <ul class="addressList mb_20" v-if="list && list.length>0">
            <li class="addressItem" :class="{'current':addressId==item.addressId, 'disabled':address && typeof address.areaId!='undefined' && (address.areaId!=item.areaId || address.cityId!=item.cityId || address.provinceId!=item.provinceId)}"
                v-for="(item,index) in list" :key="index" @click="selectAddress(item)">
              <div class="content">
                <flexbox :gutter="0">
                  <flexbox-item span="30">
                    <i class="location_b"></i>
                  </flexbox-item>
                  <flexbox-item>
                    <div class="user">
                      <b>{{item.consignee}}</b>
                      <span>{{item.mobile}}</span>
                    </div>
                    <p class="address">{{item|getFullAdress}}</p>
                  </flexbox-item>
                </flexbox>
              </div>
              <div class="option-menu">
                <a @click="edit(index)"><i class="fa fa-edit fa-1x"></i>编辑</a>
                <a @click="del(index)"><i class="fa fa-trash-o fa-1x"></i>删除</a>
              </div>
            </li>
          </ul>
          <div :class="{pb_20:isSelected}">
            <a class="whiteBtn_nob" @click="add"><i class="fa fa-plus-square-o mr_10 vertical-m"></i>添加地址</a>
          </div>
        </div>
      </view-box>
    </div>

    <div class="footerBtn" v-if="isSelected">
      <a class="greenBtn_nob" @click="ok">确认</a>
    </div>

    <!--收货地址修改-->
    <div class="diyDialog" :class="{show:showDialog}">
      <group class="firstGroup">
        <x-input title="收货人" :max="20" placeholder="请输入收货人" label-width="5" v-model="form.consignee"></x-input>
        <x-input title="手机号码" placeholder="请输入手机号" is-type="china-mobile" label-width="5"  v-model="form.mobile"></x-input>
        <popup-picker :data="areaList" :columns="3" v-model="form.area" value-text-align="left" show-name @on-shadow-change="areaChange" @on-hide="onHide">
          <div slot="title" class="areaTitle">所在地区</div>
        </popup-picker>
        <x-input title="详细地址" :max="300" placeholder="街道、楼号等" label-width="5" v-model="form.address"></x-input>
      </group>
      <div class="btnGroup">
        <x-button class="saveBtn" @click.native="saveAddress">保存</x-button>
        <x-button class="cancelBtn mt_20" @click.native="cancelAddress">取消</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import  { ConfirmPlugin, LoadingPlugin, AlertPlugin, ToastPlugin } from 'vux'
  Vue.use(ConfirmPlugin);
  Vue.use(LoadingPlugin);
  Vue.use(AlertPlugin);
  Vue.use(ToastPlugin);

  import http from "@/http";

  import {
    TransferDom,
    Cell, XInput, Group, Flexbox, FlexboxItem, XButton, Popup, PopupPicker, Scroller, ViewBox
  } from 'vux'

  export default {
    props: ['address'],
    directives: {
      TransferDom
    },
    components: {
      Cell, XInput, Group, Flexbox, FlexboxItem, XButton, Popup, PopupPicker, Scroller, ViewBox
    },
    methods: {
      updateRegions(){
        /*全量加载省市区地址*/
        http('region-api/region/getAllRegionsByLevel', {level:3}, {includeApi:true})
          .then(function(data){
            if(data){
              localStorage['areaList'] = JSON.stringify(data);
              this.areaList = this.renderAddress(data);
            }
          }.bind(this));
      },
      getAllRegions(){
        let areaList = this.areaList;
        if(areaList.length===0){
          let localAreaList = localStorage['areaList'];
          let region = localStorage['region'];
          if(localAreaList){
            /*全量加载省市区地址*/
            http('app-common-api/appAdmin/getDataVersions', {queryParam:['region']}, {includeApi:true})
              .then(function(data){
                if(data.region === region){
                  localAreaList = JSON.parse(localAreaList);
                  this.areaList = this.renderAddress(localAreaList);
                }else{
                  localStorage['region'] = data.region;
                  this.updateRegions();
                }
              }.bind(this));

          }else{
            this.updateRegions();
          }
        }

      },
      selectAddress(item){
        let address = this.addressObj;
        if((item.areaId == address.areaId && item.cityId == address.cityId && item.provinceId == address.provinceId) || typeof address.areaId === 'undefined'){
          if(this.addressId){
            this.addressId = item.addressId;
          }
          this.$emit('selectAddress', item);
        }

      },
      ok(){
        let list = this.list;
        let addressId = this.addressId;
        let nowAddress = {};
        list.map((v,i)=>{
          if(v['addressId']===addressId){
            nowAddress = v;
          }
        });
        this.$emit('selectAddress', nowAddress);
      },
      del(index){
        event.stopPropagation();

        let _this = this;
        this.$vux.confirm.show({
          title:'删除',
          content:'确定要删除该地址吗？',
          onCancel () {
            console.log('onCancel');
          },
          onConfirm () {
            _this.$vux.loading.show({
              text: '删除中...'
            });

            /*删除*/
            http('user-center-server/user/address/delete', {addressId :_this.list[index]['addressId']} )
              .then(function(suc){
                if(suc){
                  _this.list.splice(index, 1);
                  _this.$vux.loading.hide();
                  _this.$vux.toast.text('删除成功!');
                }

              }.bind(this));
          }
        });
      },
      edit(index){
        event.stopPropagation();

        this.getAllRegions();
        let obj = Object.assign({}, this.list[index]);
        obj.area = [obj.provinceId.toString(), obj.cityId.toString(), obj.areaId.toString()];
        this.form = obj;
        this.showDialog=true;
      },
      add(){
        this.getAllRegions();
        this.form = {
          consignee:'',
          mobile:'',
          area:[],
          address:''
        };
        this.showDialog=true;
      },
      areaChange(value){
        if(value && value.length==3){
          this.form.area = value;
        }
      },
      onHide(closeType){
        if(closeType && this.form.area.length==0){
          this.form.area = ["1", "2", "3"]
        }
      },
      saveAddress(){
        let form = this.form;
        let addressObj = {
          provinceId:form.area[0],
          cityId:form.area[1],
          areaId:form.area[2],
          consignee:form.consignee,
          mobile:form.mobile,
          address:form.address,
        };
        if(form && form.addressId){
          addressObj.addressId = form.addressId;
        }
        http('user-center-server/user/address/add-update', {model:addressObj})
          .then(function(suc){
            if(suc){
              this.$vux.toast.text(addressObj.addressId?'保存':'新增' + '成功!');
              this.showDialog=false;
              this.getAddressList();
            }
          }.bind(this));
      },
      cancelAddress(){
        this.showDialog=false;
      },
      /*转换地址信息*/
      renderAddress(list){
        if(list && list.length>0){
          return list.map((v,i)=>{
            return {value:v['regionId'].toString(), parent:v['parentId'].toString(), name:v['regionName']}
          })
        }
      },
      getAddressList(){
        http('user-center-server/user/address', {} )
          .then(function(suc){
            this.list = suc;
          }.bind(this));
      }
    },
    mounted(){
      this.getAddressList();

    },
    watch:{
      address(newVal){
        console.log({address:newVal});
        this.isSelected = true;
        this.addressObj = newVal;
        this.addressId = newVal.addressId;
      }
    },
    data () {
      return {
        isSelected:false,
        addressObj:{},
        addressId:'',
        list:[
        ],
        level1:[],
        level2:[],
        level3:[],
        areaList:[],
        form:{
          consignee:'',
          mobile:'',
          area:[],
          address:''
        },
        showDialog:false
      }
    }
  }

</script>

<style lang="less" scoped>
  .firstGroup /deep/ .vux-cell-value{ color:#000;}
  .addressList{ background-color: #fff; padding: 20px;}
  .addressItem{ background-color: #fff; margin-bottom: 20px; color:#222; border: 1PX solid #eee;}
  .addressItem.current{ border: 1PX solid #ffb000;}
  .addressItem.disabled{ color:#aaa;}
  .user{ line-height: 60px;}
  .user b{ margin-right: 20px; font-weight: normal;}
  .address{ font-size: 12PX; word-break: break-all;}
  .content{ margin: 0 20px 10px;}
  .option-menu{ border-top:1PX solid #eee; text-align: right; padding: 10px 0;}
  .option-menu a{ margin-right: 20px; line-height: 48px; display: inline-block; height: 48px; padding: 0 20px; font-size: 12PX; border-radius: 24px; border: 1PX solid #ccc;}
  .option-menu a i{ margin-right: 6px;}

  .addBtn{ background-color: #fff; font-size: 16PX; line-height: 100px;}
  .addBtn i{ margin-right: 10px;}

  .areaTitle{ width: 105PX;}
  .btnGroup{ margin: 60px 20px 20px;}
  .saveBtn{ background-color: #FFB000; border-radius: 50px; line-height: 100px; height: 100px; color:#fff; font-size: 16PX;}
  .cancelBtn{ background-color: #A1A7AE; border-radius: 50px; line-height: 100px; height: 100px; color:#fff; font-size: 16PX;}
  .addressMain{ height:100%; position: relative;}
  .addressMain .gray_bg{ position: absolute; left: 0; top:0; right:0; bottom: 0;}
  .bottom_100{ bottom: 100px!important;}
</style>
