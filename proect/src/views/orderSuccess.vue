<template>
    <!--这个页面用来实现订单成功，返回订单的id和总金额 -->
    <div>
        <nav-header></nav-header>
        <div class="container">
            <div class="page-title-normal">
                <h2 class="page-title-h2"><span>check out</span></h2>
            </div>
            <!-- 进度条 -->
            <div class="check-step">
                <ul>
                    <li class="cur"><span>Confirm</span> address</li>
                    <li class="cur"><span>View your</span> order</li>
                    <li class="cur"><span>Make</span> payment</li>
                    <li class="cur"><span>Order</span> confirmation</li>
                </ul>
            </div>

            <div class="order-create">
                <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
                <div class="order-create-main">
                    <h3>Congratulations! <br>Your order is under processing!</h3>
                    <p>
                        <span>Order ID：{{orderId}}</span>
                        <span>Order total：{{orderTotal | currency('$')}}</span>
                    </p>
                    <div class="order-create-btn-wrap">
                        <div class="btn-l-wrap">
                            <!-- <a href="javascript:;" class="btn btn--m">Cart List</a> -->
                            <!-- //购物车列表 -->
                            <router-link class="btn btn--m" to="/cart">Cart List</router-link>
                        </div>
                        <div class="btn-r-wrap">
                            <!-- <a href="javascript:;" class="btn btn--m">Goods List</a> -->
                             <router-link class="btn btn--m" to="/">Cart List</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <modal :mdShow  = "mdState">
            <p slot="message">没有订单 </p>
        </modal>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from '@/components/Header.vue'
    import NavFooter from '@/components/Footer.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    export default {
        data(){
            return{
                mdState:false,
                orderId:'',
                orderTotal:0
            }
        },
         components:{
            NavHeader,
            NavFooter,
            Modal    
        },
        //初始化数据拿到数据
        mounted(){
            this.init()
        },
        methods:{
            //拿到订单信息
            init(){
                //通过订单id来拿数据
                let orderId = this.$route.query.orderId
                console.log(orderId)
                if(!orderId) return
                axios.get('/users/orderList',{
                    params:{
                       orderId:orderId
                    }
                }).then((response)=>{
                    let res = response.data;
                    if(res.status == '0'){
                        this.orderId = orderId;
                        if(res.result.orderTotal == 0){
                            this.mdState = true
                        }else{
                            this.orderTotal = res.result.orderTotal;
                        }

                    }
                })
            }
        }
    }
</script>

