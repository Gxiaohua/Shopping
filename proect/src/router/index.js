import Vue from 'vue'
import Router from 'vue-router'

import GoodList from '@/views/GoodList.vue'  //商品列表
import Cart from '@/views/Cart.vue'          //加入购物车
import Address from '@/views/Address.vue'    //地址
import OrderConfirm from '@/views/OrderConfirm.vue'
import orderSuccess from '@/views/orderSuccess.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodList',
      component: GoodList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/orderConfirm/:addressId?',
      name: 'OrderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess/:orderId?',
      name: 'orderSuccess',
      component: orderSuccess
    },
  ]
})
