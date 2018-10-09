
<template>
    <div>
        <!-- assets和static都是用来放静态文件，assets主要放组件的文件 ，
        static用来存放比较大的图片，不会被解析-->
        <nav-header></nav-header>
        <bread>
            <span>Goods</span>
            <!-- <span solt = "B">测试</span> -->
        </bread>
        <div class="accessory-result-page accessory-page">
          <div class="container">
            <div class="filter-nav">
              <span class="sortby">Sort by:</span>
              <a href="javascript:void(0)" class="default cur">Default</a>
              <a href="javascript:void(0)"
                   class="price"
                   @click = "sortGoods"
              >Price 
                   <svg class="icon icon-arrow-short" :class = "{icondeg : !sortFlag}">
                        <use xlink:href="#icon-arrow-short"></use>
                   </svg>
              </a>
              <a href="javascript:void(0)" 
                class="filterby stopPop"
                @click = "popPrice"
              >Filter by</a>
            </div>
            <div class="accessory-result">
              <!-- filter -->
              <div class="filter stopPop" id="filter"
                  :class = "{'filterby-show' : pricePop}"
              >
                <dl class="filter-price">
                  <dt>Price:</dt>
                  <!-- 点击价格，点击那个价格给哪个价格加颜色，通过索引操作class -->
                  <dd>
                    <a href="javascript:void(0)"
                        :class = "{'cur':priceIndex == 'all'}"
                        @click="setPriceIndex('all')"
                    >All</a>
                  </dd>
                  <dd v-for ="(item,i) in priceList" :key="i" 
                      @click="setPriceIndex(i)"
                  >
                    <a href="javascript:void(0)" :class = "{'cur':priceIndex==i}">{{item.start}} - {{item.end}}</a>
                  </dd>
                </dl>
              </div>

              <!-- search result accessories list -->
              <div class="accessory-list-wrap">
                <div class="accessory-list col-4">
                  <ul>
                    <li v-for="(item,i) in goodsList"
                        :key = "i"
                    >
                      <div class="pic">
                        <a href="#"><img :src="'./static/'+item.productImage" alt=""></a>
                      </div>
                      <div class="main">
                        <div class="name">{{item.productName}}</div>
                        <div class="price">{{item.salePrice}}</div>
                        <div class="btn-area">
                          <a href="javascript:;" 
                              class="btn btn--m"
                              @click = 'addCar(item.productId)'
                          >加入购物车</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class = "loadMore" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                       <img src="./../assets/loading-spinning-bubbles.svg" 
                           alt=""
                           v-show="loading"
                        >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 控制显示隐藏   动态绑定key值，传参(传参给子组件)
              父子间传递通过$emit  给父组件绑点一个自定义事件
        -->
        <modal :mdShow = "mdShow" @close = "closeModal">
            <p slot="message">
              未登录，不能加入购物车
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
            </div>
        </modal>
         <modal :mdShow = "mdShowCart" @close = "closeModal">
            <p slot="message">
              <svg class="icon-status-ok">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
              </svg>
              <span>加入购物车</span>
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
                <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
            </div>
        </modal>
        <div class="md-overlay " 
             v-show = "overHidden"
             @click = "closemd"
        ></div>
       <nav-footer></nav-footer>
    </div>
</template>
<script>
import NavHeader from '@/components/Header.vue'
import NavFooter from '@/components/Footer.vue'
import Bread from '@/components/Bread.vue'
import Modal from '@/components/Modal.vue'
import axios from 'axios'
// 每个组件都是独立的
export default {
    data(){
      return{
        priceIndex:'all',  //默认为all，记录下标
        pricePop:false,    //状态默认是关闭的  价格
        overHidden:false,   //遮罩的状态
        goodsList:[],   //记录请求的数据
        sortFlag:true,     //排序默认为1
        page:1,          //分页
        pageSize:8,      //每页的数量
        busy:true,       //vue插件，状态记录是否加载
        loading:false,  //loading  默认不显示
        mdShow:false,    //模态框的状态
        mdShowCart:false,  //登录之后模态框的状态
        priceList:[
          {
            start:'0.00',
            end:'100.00'
          },
           {
            start:'100.00',
            end:'500.00'
          },
           {
            start:'500.00',
            end:'1000.00'
          },
           {
            start:'1000.00',
            end:'5000.00'
          },
        ]
      }
    },
    components:{
      NavHeader,
      NavFooter,
      Bread,
      Modal
    },
    //生命周期初始化加载商品列表
    mounted(){
      this.getGoodsList()
    },
    methods:{
      //请求数据
      getGoodsList(flag){
        var param = {
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag?1:-1,
          priceIndex:this.priceIndex
        }
        this.loading = true
        //初始化的时候需要获取数据，当滚动加载，分页时也需要获取数据，但是分页时获取的数据需要累加一页8条二页16条
        axios.get("/goods/list",{params:param}).then((response)=>{
          let res = response.data;
           this.loading = false
          if(res.status == "0"){
            if(flag){  //当加载滚动时，数据累加，传入true说明正在滚动加载，获取的数据累加
              this.goodsList = this.goodsList.concat(res.result.list);
              //当获取数据成功时，说明可以滚动
              if(res.result.count == 0){  //当数据总条数为0时说明没有数据可以加载，禁用滚动
                  this.busy = true
              }else{
                this.busy = false
              }
            }else{
                this.goodsList = res.result.list;
                this.busy = false
            }
          }else{
            this.goodsList = []
          }         
        });
      },
      //排序
      sortGoods(){
          this.sortFlag = !this.sortFlag;
          this.page = 1;
          this.getGoodsList();
      },
      //响应式 价格消失，当点击时改变状态，让他出现
      //遮罩层出现
      popPrice(){
          this.pricePop = true;
          this.overHidden = true;
      },
      //当点击价格范围时，点击哪个给哪个加高亮，遮罩和价格全部消失
      setPriceIndex(index){
          this.priceIndex=index;
          this.page = 1
           this.getGoodsList()
          this.closemd()
      },
      //当点击遮罩层时是价格和遮罩层隐藏
      closemd(){
          this.pricePop = false;
          this.overHidden = false;
      },
      //滚动加载
      loadMore(){
        this.busy = true;  //当滚动时先禁用
        setTimeout(() => {   //用来控制请求，一个请求完啦在发第二个
          this.page++;
          this.getGoodsList(true)  //使页数加一，重新渲染页面
        }, 500);
      },
      //加入购物车
      addCar(productId){
          axios.post('/goods/addCarList',{productId:productId}).then((res)=>{
            // console.log(res,res.data,res.status)
            if(res.data.status == "0"){
                this.mdShowCart = true
                 this.$store.commit('cartCount',1)
            }else{
              this.mdShow = true;
            }
          })
      },
      closeModal(){
          this.mdShow = false;
          this.mdShowCart = false
      }
    }
}
</script>

