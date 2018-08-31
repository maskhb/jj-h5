import Vue from 'vue';
import {
  TransferDom, ToastPlugin, ConfirmPlugin,
  Cell, Group, Flexbox, FlexboxItem, Swiper, SwiperItem, Popup, XButton, ButtonTab, ButtonTabItem, Divider, Icon,
  InlineXNumber, CheckIcon, ViewBox, Previewer
} from 'vux';
import http from "@/http";
import SkuSelect from '@/components/skuSelect.vue';
import {getSkuStr} from '@/utils/filter.js';
import wx from '@/lib/wxTools'
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);

export default {
  directives: {
    TransferDom
  },
  components: {
    SkuSelect,
    Cell, Group, Flexbox, FlexboxItem, Swiper, SwiperItem, Popup, XButton, ButtonTab, ButtonTabItem, Divider, Icon,
    InlineXNumber, CheckIcon, ViewBox, Previewer
  },
  methods: {
    /*点击加减*/
    clickNum(val){
      this.saveSkuInfo();
      this.calculatePrice();
    },
    /*套餐sku变更存储本地缓存*/
    saveSkuInfo(){
      let packageInfo = {
        packageId:parseInt(this.packageId),
        comboIncludeList:this.comboIncludeList,
        comboList: this.comboList
      };
      localStorage['packageInfo'] = JSON.stringify(packageInfo);
    },
    /*获取套餐详情*/
    getPackageDetail(packageId){
      http('ht-mj-goods-server/package/queryDetailForWechat', {packageId :packageId})
        .then(function(suc){
          // suc['packageSpaceVoQs'][1]['packageGoodsList'][0].status = 2;
          this.package = suc;

          this.setComboList(suc.packageSpaceVoQs);
          this.setComboIncludeList(suc.packageSpaceVoQs);
          this.setImgList(suc.album);
        }.bind(this), function (err) {
          if(err.busCode === 883010)
          setTimeout(function () {
            this.$router.back(-1);
          }.bind(this), 2000)
        }.bind(this));
    },
    /*设置套餐包含商品列表*/
    setComboList(packageSpaceVoQs){
      let comboList = [];
      let _this = this;
      /*缓存更新套餐信息*/
      let comboIncludeList = [];
      let packageInfoStr = localStorage['packageInfo'];
      let flag = true;
      if(packageInfoStr){
        let packageInfo = JSON.parse(packageInfoStr);
        if(packageInfo.packageId === _this.packageId){
          comboIncludeList = packageInfo['comboIncludeList'];
          comboList = packageInfo['comboList'];
          flag = false;
        }else{
          localStorage.removeItem("packageInfo");
        }
      }

      if(flag && packageSpaceVoQs){
        packageSpaceVoQs.map((v,i)=>{
          let item = Object.assign({},v);
          if(item['selectPackageGoodsList']){
            item['selectPackageGoodsList'].map((sv,si)=>{
              sv['children'] = [];
              if(flag === false){
                comboIncludeList.map((cv,ci)=>{
                  if(v['spaceId'] === cv['spaceId']){
                    item['packageGoodsList'] = cv['packageGoodsList']
                  }
                })
              }
              if(item['packageGoodsList']){
                item['packageGoodsList'].map((pv,pi)=>{
                  if(pv['goodsId'] === sv['goodsId']){
                    sv['children'].push(pv);
                  }
                })
              }
            });
          }

          delete item['packageGoodsList'];
          comboList.push(item);
        });
      }

      console.log({comboList:comboList});
      this.comboList = comboList;
    },
    /*设置套餐包含商品列表*/
    setComboIncludeList(comboList, code, data){
      let comboIncludeList = [];
      let packageInfoStr = localStorage['packageInfo'];
      let flag = true;
      if(packageInfoStr){
        let packageInfo = JSON.parse(packageInfoStr);
        if(packageInfo.packageId === this.packageId){
          flag = false;
          comboIncludeList = packageInfo['comboIncludeList'];

          if(code === 125 && data.length>0){
            comboIncludeList.map((v,i)=>{
              v['packageGoodsList'].map((pv,pi)=>{
                data.map((dv,di)=>{
                  if(dv === pv['skuId']){
                    pv['status'] = 3;
                    pv['selected'] = false;
                  }
                })
              })
            })
          }
          if(code === 130 && data.length>0){
            comboIncludeList.map((v,i)=>{
              v['packageGoodsList'].map((pv,pi)=>{
                data.map((dv,di)=>{
                  if(dv === pv['skuId']){
                    pv['remainNum'] = 0;
                    pv['selected'] = false;
                  }
                })
              })
            })
          }


          /*更新备选商品列表*/
          // this.updateComboList(comboIncludeList);
        }else{
          localStorage.removeItem("packageInfo");
        }
      }
      if(flag && comboList){
        comboList.map((v,i)=>{
          let item = Object.assign({},v);
          delete item['selectPackageGoodsList'];
          if(item['packageGoodsList'] && item['packageGoodsList'].length>0){
            item['packageGoodsList'].map((pv,pi)=>{
              pv['num'] = 1;
              pv['selected'] = true;
              pv['isDefault'] = 1;

              if(pv['status'] !== 2 || pv['remainNum']===0){
                pv['selected'] = false;
              }
            })
          }
          comboIncludeList.push(item);
        });
      }
      console.log({comboIncludeList:comboIncludeList});
      this.comboIncludeList = comboIncludeList;

      /*套餐下架*/
      if(code && (code===460 || code===465)){
        this.package.status = 2;
      }

      /*校验*/
      this.checkedAllSelect();
      this.saveSkuInfo();
      this.calculatePrice();
    },
    setImgList(album){
      let imgList = [];
      if(album){
        album.map((v,i)=>{
          imgList.push({src:v});
        })
      }
      this.imgList = imgList;
    },
    showImg(index){
      this.$refs.previewer.show(index)
    },
    /*清单和介绍切换*/
    detailChange(index){
      this.detailIndex = index;
    },
    /*删除非默认sku*/
    delSku(comboIndex, index){
      event.stopPropagation();
      let _this = this;
      this.$vux.confirm.show({
        content: '确认要删除该商品吗？',
        onConfirm: () => {
          let comboIncludeList = this.comboIncludeList;
          let packageGoodsList = comboIncludeList[comboIndex]['packageGoodsList'];

          let item = packageGoodsList[index];
          _this.delFromComboList(item);
          packageGoodsList.splice(index,1);

          /*保存sku选中信息，计算价格*/
          _this.saveSkuInfo();
          _this.calculatePrice();
        }
      })

    },

    /*单个商品勾选*/
    changeChecked(comboIndex, index){
      let comboIncludeList = this.comboIncludeList;
      let item = comboIncludeList[comboIndex]['packageGoodsList'][index];
      if(item.status === 2 && item.remainNum >0){
        item['selected'] = !item['selected'];
        if(!item['num']){
          item['num'] = 1;
        }
        this.$set(comboIncludeList[comboIndex]['packageGoodsList'], index, item);

        /*校验*/
        this.checkedAllSelect();

        /*保存sku选中信息，计算价格*/
        this.saveSkuInfo();
        this.calculatePrice();
      }
    },
    /*全选*/
    clickAll(){
      this.selectAll = !this.selectAll;
      let comboIncludeList = this.comboIncludeList;
      comboIncludeList.map((v,i)=>{
        if(v['packageGoodsList']){
          v['packageGoodsList'].map((cv,ci)=>{
            cv['selected'] = this.selectAll;
            if(!cv['num']){
              cv['num'] = 1;
            }
            if(cv['status'] !==2 || cv['remainNum'] ===0){
              cv['selected'] = false;
            }
          })
        }
      });

      /*保存sku选中信息，计算价格*/
      this.saveSkuInfo();
      this.calculatePrice();
    },
    /*校验全选按钮*/
    checkedAllSelect(){
      let selectAll = true;
      let comboIncludeList = this.comboIncludeList;
      comboIncludeList.map((v,i)=>{
        if(v['packageGoodsList']){
          v['packageGoodsList'].map((cv,ci)=>{
            if(cv['selected'] != true){
              selectAll = false;
            }
          })
        }
      });
      this.selectAll = selectAll;
    },
    /*计算价格*/
    calculatePrice(){
      let totalPackagePrice = 0, totalSalePrice=0, selectedNum=0;
      let comboIncludeList = this.comboIncludeList;
      comboIncludeList.map((v,i)=>{
        if(v['packageGoodsList']){
          v['packageGoodsList'].map((cv,ci)=>{
            if(cv['selected']){
              selectedNum+=1;
              let num = cv['num'];
              totalPackagePrice += num*cv['packagePrice'];
              totalSalePrice += num*cv['salePrice'];
            }
          })
        }
      });
      if(selectedNum===0){
        this.toOrderDisabled = true;
      }else{
        this.toOrderDisabled = false;
      }
      this.totalPackagePrice = totalPackagePrice;
      this.totalSalePrice = totalSalePrice;
    },
    /*
    * 计算滚动，传入index返回top，传入top返回index
    * */
    // calculateScroll(type, num){
    //   let res = 0;
    //   let productList = this.productList;
    //   let rate = this.rate;
    //   switch (type){
    //     case 'top':
    //       let top = num;
    //       let topList = [];
    //       productList.map((v,i)=>{
    //         topList.push(res);
    //         res +=50*rate;
    //         let length = v['children'].length;
    //         res += 106*rate*length-10*rate;
    //       });
    //       topList.map((v,i)=>{
    //         if(v<=top){
    //           res = i;
    //         }
    //       });
    //       break;
    //     case 'index':
    //       let index = num;
    //       for(let i=0;i<index; i++){
    //         res +=50*rate;
    //         let length = productList[i]['children'].length;
    //         res += 106*rate*length-10*rate;
    //       }
    //       break;
    //   }
    //   return res;
    // },
    /*添加商品切换分类*/
    selectSpace(index){
      this.selectSpaceIndex = index;
      // let top = this.calculateScroll('index', index);
      // this.$refs.viewBox_Product.scrollTo(top);
    },
    // handleScroll(){
    //   let scrollTop = this.$refs.viewBox_Product.getScrollTop();
    //   let index = this.calculateScroll('top', scrollTop);
    //   this.selectSpaceIndex = index;
    // },
    /* 点击添加商品 */
    addGoods(){
      this.showAddProduct = true;
      // let scrollHeight = this.$refs.subMenuLeft.scrollHeight,
      //   innerHeight = this.$refs.subMenuLeft.offsetHeight;
      // if(scrollHeight <= innerHeight) { // 当不存在滚动条时，禁用subMenuLeft的滑动事件，避免多滚动条的问题
      //   this.$refs.subMenuLeft.addEventListener('touchmove', function(e){
      //     e.preventDefault();
      //   });
      // }
    },
    /*确定添加*/
    save(){
      this.showAddProduct = false;
      this.updateComboIncludeList();
      this.calculatePrice();
    },
    /*更新备选商品列表*/
    delFromComboList(item){
      let comboList = this.comboList;
      let arr = [];
      comboList.map((v,i)=>{
        if(v['spaceId'] == item['spaceId']){
          v['selectPackageGoodsList'].map((sv,si)=>{
            if(sv['goodsId'] == item['goodsId']){
              sv['children'].map((scv,sci)=>{
                if(scv['skuId'] == item['skuId']){
                  arr=[i, si, sci];
                }
              })
            }
          })
        }
      });
      if(arr.length==3){
        comboList[arr[0]]['selectPackageGoodsList'][arr[1]]['children'].splice(arr[2], 1);
      }
    },
    /*更新备选商品列表*/
    updateComboList(includeList){
      if(includeList){
        this.comboIncludeList = includeList;
      }
      let comboIncludeList = this.comboIncludeList;
      let comboList = this.comboList;

      comboIncludeList.map((v,i)=>{
        comboList.map((cv,ci)=>{
          if(v['spaceId'] == cv['spaceId']){
            cv['selectPackageGoodsList'].map((sv,si)=>{
              if(sv['goodId'] == v['goodId']){

                v['packageGoodsList'].map((pv,pi)=>{
                  let flag = true;
                  sv['children'].map((scv,sci)=>{
                    if(sv['goodsId'] == pv['goodsId'] && scv['skuId'] == pv['skuId']){
                      flag = false;
                    }
                  });
                  if(flag){
                    sv['children'].push(pv);
                  }
                });
              }
            })
          }
        });
      });

      this.saveSkuInfo();
    },
    /*更新选中商品列表*/
    updateComboIncludeList(){
      let comboIncludeList = this.comboIncludeList;
      let comboList = this.comboList;
      comboIncludeList.map((v,i)=>{
        comboList.map((cv,ci)=>{
          if(v['spaceId'] == cv['spaceId']){
            cv['selectPackageGoodsList'].map((sv,si)=>{
              sv['children'].map((scv,sci)=>{
                let flag = true;
                v['packageGoodsList'].map((pv,pi)=>{
                  if(sv['goodsId'] == pv['goodsId'] && scv['skuId'] == pv['skuId']){
                    flag = false;
                  }
                });
                if(flag){
                  let selected = true;
                  if(scv['status'] !==2 || scv['remainNum'] === 0){
                    selected = false;
                  }
                  let item = Object.assign({num:1, selected:selected}, scv);
                  v['packageGoodsList'].push(item);
                }
              })
            })

          }
        })
      });

      this.saveSkuInfo();
    },
    /*一键下单*/
    placeOrder(){
      if(this.package.status ===1 && this.toOrderDisabled===false){
        let comboIncludeList = this.comboIncludeList;
        console.log({comboIncludeList:comboIncludeList});
        let getExtendObj = function (list) {
          let money = 0;
          let orderItemVOList = [];
          if(list){
            list.map((v,i)=>{
              if(v['packageGoodsList'] && v['packageGoodsList'].length>0){
                v['packageGoodsList'].map((pv,pj)=>{
                  if(pv['selected']){
                    money += pv['packagePrice']*pv['num'];
                    let item = {goodsNum:pv['num'], propertyValue:pv['specifications'], salePrice:pv['salePrice'], skuId:pv['skuId']};
                    orderItemVOList.push(item);
                  }
                })
              }
            })
          }
          return {
            money:money,
            orderItemVOList:orderItemVOList
          }
        };
        let params = {
          communityId: localStorage['communityId'],
          packageId: this.packageId
        };
        let postData = Object.assign({}, params, getExtendObj(comboIncludeList));

        http('ht-mj-order-server/order/wx/submitOrderCheck', {submitOrderCheckVO:postData})
          .then(function(suc){
            if(suc.code==0){
              this.$router.push('/Mall/Confirm/0');
            }else{
              if(suc.code===460){
                suc.msg = '当前套餐已下架，请选择其它商品'
              }
              this.$vux.toast.text(suc.msg);
              this.setComboIncludeList([],  suc.code, suc.data);
            }
          }.bind(this), function (err) {}.bind(this));

      }

    },
    toDetail(product){
      this.$router.push('/Product/Detail/' + product.skuId + '/' + product.packageId + '/' + product.spaceId);
    },
    /*筛选规格*/
    showSkuSelect(goods){
      event.stopPropagation();

      let searchParams = {
        skuId:goods['skuId'],
        packageId:goods['packageId'],
        spaceId:goods['spaceId']
      };
      this.selection = Object.assign({}, goods);
      http('ht-mj-goods-server/goods/foreQueryDetail', {foreQueryVo:searchParams})
        .then(function(suc){
          this.detail = suc;
          this.showPopup = true;
        }.bind(this));
    },
    selectOK(selectedSkuObj, detail){
      console.log({selectedSkuObj:selectedSkuObj});
      this.showPopup = false;

      let comboList = this.comboList;
      let selection = this.selection;

      let addSkuObj = {
        goodsId:detail.goodsId,
        goodsName:detail.goodsName,
        imgUrl:selectedSkuObj['goodsImgVoList']?selectedSkuObj['goodsImgVoList'][0]['imgUrl']:'',
        isDefault:0,
        packageId:selection.packageId,
        spaceId:selection.spaceId,
        packagePrice:selectedSkuObj.packagePrice,
        salePrice:selectedSkuObj.salePrice,
        skuCode:selectedSkuObj.skuCode,
        skuId:selectedSkuObj.skuId,
        status:selectedSkuObj.status,
        remainNum: selectedSkuObj.remainNum,
        specifications:getSkuStr(selectedSkuObj.skuPropertyRelationVoSList),
      };
      comboList.map((v,i)=>{
        if(v['spaceId'] == selection['spaceId']){
          let selectPackageGoodsList = v['selectPackageGoodsList'];
          if(selectPackageGoodsList){
            selectPackageGoodsList.map((sv,si)=>{
              if(sv['goodsId'] == addSkuObj['goodsId']){
                let flag = true;
                sv['children'].map((cv,ci)=>{
                  if(cv['skuId'] == addSkuObj['skuId']){
                    flag = false;
                  }
                });
                if(flag){
                  sv['children'].push(addSkuObj);
                }
              }
            })
          }
        }
      });
      selection = {};

      this.saveSkuInfo();
    },
    onHide(){
      this.showPopup = false;
      this.selection = {};
    }
  },
  mounted:function(){
    wx.showAllNonBaseMenuItem();

    this.rate = this.$refs.footer.offsetHeight/100;

    let {params} = this.$route;
    if(params && params.pid) {
      this.packageId = parseInt(params.pid);
      this.getPackageDetail(this.packageId);
    }
  },
  data () {
    return {
      viewHeight:document.documentElement.clientHeight-50,
      toOrderDisabled:false,
      rate:1,
      packageId:'',
      package:{
      },
      imgList:[],
      showAddProduct:false,
      showPopup:false,
      selection:{},
      detailIndex:0,
      selectAll:false,
      comboList:[],
      comboIncludeList:[],
      totalPackagePrice:0,
      totalSalePrice:0,
      selectSpaceIndex:0,
      skuId:3,
      detail:{
        // goodsName:'喜临门 泰国进口天然乳胶枕 舒眠系列',
        // goodsImgGroupVoList:[],
        // goodsSkuVoList:[
        //   {isDefault:1, skuId:1, salePrice:88800, skuPropertyRelationVoSList:[
        //     { propertyKeyId:1, propertyKey:'颜色', propertyValueId:11, propertyValue:'红'},
        //     { propertyKeyId:2, propertyKey:'大小', propertyValueId:21, propertyValue:'大'},
        //     { propertyKeyId:3, propertyKey:'版本', propertyValueId:31, propertyValue:'1.0'},
        //   ], goodsImgVoList:[{
        //       imgUrl: 'http://img.jiaju.htmimi.cn/img/2017/1/4/13909207530454571418276_640X640.jpg'
        //     },{
        //       imgUrl: 'http://img.jiaju.htmimi.com/img/2015/12/23/90136_640X640.jpg'
        //     }
        //   ]},
        //   {isDefault:0, skuId:2, salePrice:88800, skuPropertyRelationVoSList:[
        //     { propertyKeyId:1, propertyKey:'颜色', propertyValueId:11, propertyValue:'红'},
        //     { propertyKeyId:2, propertyKey:'大小', propertyValueId:22, propertyValue:'小'},
        //     { propertyKeyId:3, propertyKey:'版本', propertyValueId:31, propertyValue:'1.0'},
        //   ], goodsImgVoList:[{
        //     imgUrl: 'http://img.jiaju.htmimi.cn/img/2017/1/4/13909207530454571418276_640X640.jpg'
        //   },{
        //     imgUrl: 'http://img.jiaju.htmimi.com/img/2015/12/23/90136_640X640.jpg'
        //   }
        //   ]},
        //   {isDefault:0, skuId:3, salePrice:88800, skuPropertyRelationVoSList:[
        //     { propertyKeyId:1, propertyKey:'颜色', propertyValueId:12, propertyValue:'白'},
        //     { propertyKeyId:2, propertyKey:'大小', propertyValueId:22, propertyValue:'小'},
        //     { propertyKeyId:3, propertyKey:'版本', propertyValueId:32, propertyValue:'2.0'},
        //   ], goodsImgVoList:[{
        //     imgUrl: 'http://img.jiaju.htmimi.com/img/2017/10/30/17114292361826251163332_640X640.jpg'
        //   },{
        //     imgUrl: 'http://img.jiaju.htmimi.com/img/2018/4/20/37305965451511248579828_640X640.jpg'
        //   }
        //   ]},
        //   {isDefault:0, skuId:4, salePrice:88800, skuPropertyRelationVoSList:[
        //     { propertyKeyId:1, propertyKey:'颜色', propertyValueId:13, propertyValue:'蓝'},
        //     { propertyKeyId:2, propertyKey:'大小', propertyValueId:22, propertyValue:'小'},
        //     { propertyKeyId:3, propertyKey:'版本', propertyValueId:32, propertyValue:'2.0'},
        //   ], goodsImgVoList:[{
        //     imgUrl: 'http://img.jiaju.htmimi.cn/img/2017/1/4/13909207530454571418276_640X640.jpg'
        //   },{
        //     imgUrl: 'http://img.jiaju.htmimi.com/img/2015/12/23/90136_640X640.jpg'
        //   }
        //   ]},
        //   {isDefault:0, skuId:5, salePrice:88800, skuPropertyRelationVoSList:[
        //     { propertyKeyId:1, propertyKey:'颜色', propertyValueId:14, propertyValue:'黄'},
        //     { propertyKeyId:2, propertyKey:'大小', propertyValueId:22, propertyValue:'小'},
        //     { propertyKeyId:3, propertyKey:'版本', propertyValueId:33, propertyValue:'3.0'},
        //   ], goodsImgVoList:[{
        //     imgUrl: 'http://img.jiaju.htmimi.cn/img/2017/1/4/13909207530454571418276_640X640.jpg'
        //   },{
        //     imgUrl: 'http://img.jiaju.htmimi.com/img/2015/12/23/90136_640X640.jpg'
        //   }
        //   ]}
        // ]
      }
    }
  }
}
