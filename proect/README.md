# proect

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



#利用mongdb数据库存数据
用node 起服务
node-express框架  搭建后端关联数据库拿数据同时渲染在前端
[server->models->goods(定义商品模型)]
[server->routes->goods(router 和数据库关联拿数据，在app.js中增加路由)]

商品列表升降序和价格的过滤，以及商品列表的分页和loading
    [server->routes->goods]  在router接口中实现分页，排序
    利用mongoose中的方法

加入购物车
[server->models->user(定义模型)]
[server->routes->goods(router 和数据库关联拿数据，用post向后端发送请求，属于二级路由)]


登录模块
    登录
    登出
    登录拦截，没有登录禁止加入购物车
       在server的app.js中写登录拦截
       用户信息的校验  刷新浏览器，用户信息不消失  1.cookie  2.Vuex
    全局模态框组件实现
        父子通信  通过props  $emit

购物车页面
    定义后端路由 加入购物车的据
    删除商品

     $pull删除所有符合条件的元素
        根据集合profiles集合文档

        { _id: 1, votes: [ 3, 5, 6, 7, 7, 8 ] }

        如下操作会删除掉votes数组中元素大于等于6的元素
        db.profiles.update( { _id: 1 }, { $pull: { votes: { $gte: 6 } } } )

    商品修改功能的实现
        更新文档 update
            /第一个参数conditions为查询条件,第二个参数doc为需要修改的数据,
            //第三个参数options为控制选项,第四个参数是回调函数
            // Model.update(conditions, doc, [options], [callback])
  
    购物车全选和商品实时计算功能实现
         computed  计算属性

         // util文件夹  放公用的工具
         //currency.js  用来格式化金额   https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/currency.js

        当引入currency 需要实现过滤器的功能
        过滤器分为{
            局部过滤器：只用于当前页面 在组件内部定义{
                filters(可定义多个):{
                    currency:currency  [使用：| currency('$')]
                }
            }
            全局过滤器： 所有的组件都可以使用 main.js中定义{
                main.js中{
                    导入currency
                    定义：Vue.filter("currency",currency)
                }
            }
        }


地址模块
    地址列表的功能实现
    地址的切换和展开功能
        展开：限制条数 通过计算属性
            computed：
                模板中尽可能的少些逻辑，否则模板会臃肿，不好维护
                需要把data中的数据做进一步的处理

            computed:{
            // 定义计算属性，对应的值是一个函数
            // 内部会把函数执行了，把逻辑写在函数中
            // 作为函数的返回值
            // 那么属性名对应的值就是函数的返回值
            // 这些属性都会挂载实例上
                reverseTitle:function(){

                    return 1
                }
            }

            当需要把值计算一次，然后多次使用，不需要重复计算，选择计算属性

            每次都需要重新计算一个值，需要使用methods
            
    
    设置默认地址    
          错误：在后端改完数据，没有重新保存在数据库中，以至于报错，
               (failed) net::ERR_EMPTY_RESPONSE  后端没有接口
            
    删除地址
          找到相对应的id来删除

    添加新的地址
          需要把名字，地址，电话，id，状态传入后端接口，加入到地址列表内
          判断输入的值的类型  typeof  isNaN



订单确认模块
    订单列表的渲染功能
    支付
    返回


    创建订单：
       包含{
           1.地址
           2.选中的商品
           3.总价格
           4.订单的id
           5.创建的时间
       }
       后端接口：需要传入用户id，总价格，还有地址的id

    
    通过订单id查找订单信息

         Error occured while trying to proxy to: localhost:8081/users/orderList?order
         Can\'t set headers after they are sent？

        问题：用get请求{
                        1.参数没有传进去，导致出现错误
                        2.把一系列if判断写在了forEach循环中，导致出现错误
                      }


通过Vuex实现登录和购物车数量
    
            
