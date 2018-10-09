
import Vue from 'vue'
import App from './App'
import router from './router'
import  inginiterScroll from 'vue-infinite-scroll'  //滚动加载
// import vueLazyLoad from 'vue-lazyload'  //懒加载
import {currency} from './util/currency'   //格式化价格，工具类
import Vuex from 'vuex'

//css文件
import '@/assets/css/global.css'
// Vue.use(vueLazyLoad,{
//   loading:"/static/loding-svg/loading-balls.svg"
// })     //插件
Vue.use(Vuex)
Vue.use(inginiterScroll)
Vue.filter("currency",currency)

//定义一个Vuex的仓库
let store = new Vuex.Store({
  state:{
    loginName:'',
    cartCount:0,
  },
  mutations:{
    //登录名
    loginName(state,name){
        state.loginName = name
    },
    //购物车数量
    cartCount(state,num){
      state.cartCount += num
    },
    //购物车初始化数量，防止累加
    initCartCount(state,cartNum){
      state.cartCount = cartNum
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
