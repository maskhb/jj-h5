
<template>
  <div>
    <popup v-model="showDialog" position="bottom" height="70%" class="detailPopup" @on-hide="onHide">
      <div class="detailPopupContent relative">
        <div class="productInfo">
          <div class="imgDom" @click="show">
            <img v-if="imgList[0]" :src="imgList[0]['src']"/>
          </div>
          <div class="productInfoContent">
            <b v-if="selectedSkuObj" class="price">&yen;{{detailObj.packageId!=0 ?(selectedSkuObj.packagePrice/100).toFixed(2) : (selectedSkuObj.salePrice/100).toFixed(2)}}</b>
            <b v-else class="price">&yen;0.00</b>
            <div class="skuInfo display2line">
              <i>已选择:</i><span>{{selectedSku|getSkuStr}}</span>
            </div>
          </div>
        </div>
        <div class="categoryContent">
          <ul class="categoryList">
            <li v-for="(item, index) in categoryList" :key="index">
              <h1>{{item.kname}}</h1>
              <ul>
                <li v-for="(subItem,subIndex) in item.children" :key="subIndex" @click="changeItem(index, subIndex)"
                    :class="{current:item.selectIndex===subIndex, disabled:subItem.disabled}" >{{subItem.vname}}</li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="footer">
          <x-button class="yellowBtn borderRadius0" @click.native="selectOK" :disabled="addCartDisabled">确定</x-button>
        </div>
      </div>
    </popup>
    <div v-transfer-dom>
      <previewer :list="imgList" ref="previewer"></previewer>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue'

  import {
    TransferDom,
    XButton, Popup, Previewer
  } from 'vux'
  import {imgFormat} from '@/utils/filter.js';

  export default {
    props: ['showPopup', 'detail', 'skuId'],
    directives: {
      TransferDom
    },
    components: {
      XButton, Popup, Previewer
    },
    watch:{
      detail(newVal, oldVal){
        if(newVal){
          this.detailObj = newVal;
          this.setCategoryList(newVal);
          this.setDefaultSku(newVal);
        }
      },
      showPopup(newVal, oldVal){
        this.showDialog=newVal;
      },
      selectedSkuObj(newVal, oldVal){
        if(newVal){
          this.setImgList(newVal.goodsImgVoList);
        }
      }
    },
    methods: {
      show () {
        this.$refs.previewer.show(0)
      },

      /*设置图片切换效果*/
      setImgList(goodsImgVoList){
        let imgList = [];
        if(goodsImgVoList){
          goodsImgVoList.map((v,i)=>{
            imgList.push({src:imgFormat(v['imgUrl'], '750X750')});
          })
        }
        this.imgList = imgList;
      },

      /*设置分类数据*/
      setCategoryList(detail){
        let categoryList = [], goodsSkuVoList = [];
        if(detail && detail.goodsSkuVoList){
          goodsSkuVoList = detail.goodsSkuVoList
        }
        if(goodsSkuVoList && goodsSkuVoList.length>0 && goodsSkuVoList[0]['skuPropertyRelationVoSList']){
          this.goodsSkuVoList = goodsSkuVoList;

          let plist = goodsSkuVoList[0]['skuPropertyRelationVoSList'];
          if(plist && plist.length>0){
            plist.map((v,i)=>{
              categoryList.push({kid:v['propertyKeyId'], kname:v['propertyKey'], selectIndex:-1, children:[]});
            });
            goodsSkuVoList.map((v,i)=>{
              if(v['skuPropertyRelationVoSList']){
                v['skuPropertyRelationVoSList'].map((sv, si)=>{
                  categoryList.map((cv,ci)=>{
                    if(sv['propertyKeyId'] == cv['kid']){
                      let flag = true;
                      cv['children'].map((vv,vi)=>{
                        if(vv['vid'] == sv['propertyValueId']){
                          flag = false;
                        }
                      });
                      if(flag){
                        cv['children'].push({vid:sv['propertyValueId'], disabled:false, vname:sv['propertyValue']})
                      }
                    }
                  })
                })
              }
            })
          }
        }
        this.categoryList = categoryList;
//        console.log({categoryList:categoryList});
      },
      /*检查重置可选规格*/
      resetRule(){
        let _this = this;
        let categoryList = this.categoryList;
        let selectedSku = [];
        categoryList.map((v,i)=>{
          if(v['selectIndex'] != -1){
            selectedSku.push({propertyKeyId:v['kid'], propertyKey:v['kname'], propertyValueId:v['children'][v.selectIndex]['vid'], propertyValue:v['children'][v.selectIndex]['vname']});
          }
        });

        /*获取是否有该可选sku*/
        let hasSku = function (fullSku) {
          let flag = false;
          let goodsSkuVoList = _this.goodsSkuVoList;
          let existArr = [];
          goodsSkuVoList.map((gv,gi)=>{
            let res = false;
            let count = 0;
            gv['skuPropertyRelationVoSList'].map((sv,si)=>{
              fullSku.map((fv,fi)=>{
                if(sv['propertyKeyId'] == fv['propertyKeyId'] && sv['propertyValueId'] == fv['propertyValueId']){
                  count++;
                }
              });
            });
            if(count == fullSku.length){
              res = true;
            }
            existArr.push(res);
          });

          existArr.map((v,i)=>{
            if(v){
              flag = true;
            }
          });
          return flag;
        };

        /*设置是否可选*/
        categoryList.map((v,i)=>{
          v['children'].map((cv,ci)=>{
            let fullSku = selectedSku;
            let groupIndex = -1;
            let isExist = false;
            selectedSku.map((sv,si)=>{
              if(sv['propertyKeyId'] == v['kid']){
                groupIndex = si;
                if(sv['propertyValueId'] == cv['vid']){
                  isExist = true;
                }
              }
            });
            if(isExist == false){
              let newSku = {propertyKeyId:v['kid'], propertyKey:v['kname'], propertyValueId:cv['vid'], propertyValue:cv['vname']};
              if(groupIndex!= -1 && newSku['propertyKeyId']==selectedSku[groupIndex]['propertyKeyId']){
                fullSku = selectedSku.concat([]);
                fullSku[groupIndex] = newSku;
              }else{
                fullSku = selectedSku.concat([
                  newSku
                ]);
              }
            }
//            console.log({selectedSku:selectedSku, fullSku:fullSku, groupIndex:groupIndex, isExist:isExist});
            let setDisabled = hasSku(fullSku);
            cv['disabled'] = !setDisabled;
          });
        });
        return selectedSku;
      },
      getSkuObj(selectedSku){
        let obj = null;
        let goodsSkuVoList = this.goodsSkuVoList;
        goodsSkuVoList.map((gv,gi)=>{
          let res = false;
          let count = 0;
          if(selectedSku.length == gv['skuPropertyRelationVoSList'].length){
            gv['skuPropertyRelationVoSList'].map((sv,si)=>{
              selectedSku.map((fv,fi)=>{
                if(sv['propertyKeyId'] == fv['propertyKeyId'] && sv['propertyValueId'] == fv['propertyValueId']){
                  count++;
                }
              });
            });
            if(count == selectedSku.length){
              res = true;
            }
          }

          if(res){
            obj = gv
          }
        });
        return obj;
      },
      /*切换sku规格*/
      changeItem(index, subIndex){
        let isDisabled = this.categoryList[index]['children'][subIndex]['disabled'];
        if(!isDisabled){
          let selectIndex = this.categoryList[index]['selectIndex'];
          if(selectIndex != -1 && selectIndex == subIndex){
            this.categoryList[index]['selectIndex'] = -1;
          }else{
            this.categoryList[index]['selectIndex'] = subIndex;
          }
          let selectedSku = this.resetRule();
          this.selectedSku = selectedSku;

          let selectedSkuObj = this.getSkuObj(selectedSku);
          this.selectedSkuObj = selectedSkuObj;

          let disabled = false;
          this.categoryList.map((v,i)=>{
            if(v['selectIndex'] == -1){
              disabled = true;
            }
          });
          this.addCartDisabled = disabled;
        }
      },
      /*设置默认sku选中*/
      setDefaultSku(detail){
        this.selectedSku=[];
        this.selectedSkuObj=null;
        if(this.skuId){
          this.goodsSkuVoList.map((v,i)=>{
            if(v['skuId'] == this.skuId){
              this.selectedSku = v['skuPropertyRelationVoSList'];
              this.selectedSkuObj =v;
            }
          });

          let selectedSku = this.selectedSku, categoryList = this.categoryList;
          selectedSku.map((sv,si)=>{
            categoryList.map((cv,ci)=>{
              cv['children'].map((vv,vi)=>{
                if(vv['vid'] ==sv['propertyValueId'] && cv['kid'] ==sv['propertyKeyId']){
                  cv['selectIndex'] = vi;
                }
              })
            })
          });
          this.resetRule();
          this.addCartDisabled = false;
        }else if(detail && detail.goodsSkuVoList && detail.goodsSkuVoList[0]){
          this.setImgList(detail.goodsSkuVoList[0]['goodsImgVoList']);
        }
      },
      selectOK(){
        this.$emit('selectOK', this.selectedSkuObj, this.detailObj);
      },
      onHide(){
        this.$emit('onHide');
      }
    },
    mounted(){
      let detailObj = this.detail;
      this.setCategoryList(detailObj);
      this.setDefaultSku(detailObj);
    },
    data () {
      return {
        detailObj:this.detail,
        showDialog:this.showPopup,
        goodsSkuVoList:[],
        selectedSku:[],
        selectedSkuObj:null,
        categoryList:[
        ],
        imgList:[],
        addCartDisabled:true
      }
    }
  }

</script>

<style lang="less" scoped>
  .categoryList{ margin: 20px; background-color: #fff;}
  .categoryList>li{ margin-bottom: 20px;}
  .categoryList ul{ overflow: auto; margin-top:10px; }
  .categoryList ul >li{ margin: 0 10px 10px 0; background-color: #F3F4F5; line-height: 52px; height: 52px; padding: 0 40px; text-align: center; border-radius: 26px;
    float: left; font-size:12PX;
  }
  .categoryList ul >li.current{ background-color:#FFF6E2; color:#f5a623; }
  .categoryList ul >li.disabled{ background-color: #fbfbfb; color:#ddd;}
  /*详情页弹出框*/
  .detailPopup{ background-color: rgba(255,255,255,0); padding-top: 70px;box-sizing: border-box;}
  .detailPopupContent{ background-color: #fff; height: 100%; }
  .productInfo{}
  .productInfo .imgDom{ width: 200px; height: 200px; background: url(../assets/images/normal_bg.jpg) no-repeat left top; background-size: 200px 200px; overflow: hidden; position: absolute; left: 20px; top:-70px; border:1px solid #eee; }
  .productInfo .imgDom img{ width: 100%; height: 100%;}
  .productInfo .productInfoContent{ margin-left: 240px; padding: 20px 20px 0 0;}
  .productInfo .price{ color:#f45b5e;}
  .productInfo .skuInfo{ height: 70px; font-size: 12PX; color:#8e8e8e;}
  .productInfo .skuInfo i{ color:#5f5f5f; margin-right: 10px;}
  .categoryContent{position: absolute; left: 0; right: 0; bottom: 100px; top:130px; overflow: auto;}
</style>
<style lang="less" src="@/assets/x-photoswipe/photoswipe.less"></style>
<style lang="less" src="@/assets/x-photoswipe/default-skin/default-skin.less"></style>
