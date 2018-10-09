
var express = require('express')
//拿到框架的路由
var router = express.Router()
//获取mongoose
var mongoose = require('mongoose')
//获取模型表
var Goods = require('../models/goods')
//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/dbdemo')

//监听数据是否连接成功
mongoose.connection.on('connected',function(){
    console.log('MongoDB connected success')
})
//失败
mongoose.connection.on('error',function(){
    console.log('MongoDB connected fail')
})
//断开
mongoose.connection.on('disconnected',function(){
    console.log('MongoDB connected disconnected')
})

//二级路由  查询商品列表信息接收回调   （请求，输出，往下走）
router.get('/list',function(req,res,next){
    //分页的参数  get请求通过param拿参数
    let page = parseInt(req.param("page"))
    //每页展示数量
    let pageSize = parseInt(req.param("pageSize"));
    //排序   通过req.param接收从前端传过来的参数
    let sort = req.param("sort");
    //价格过滤
    let priceIndex = req.param("priceIndex") 
    //价格的判断
    //定义最小值和最大值
    var minPrice = "" ,maxPrice = ""
    let params = {};
    if(priceIndex != 'all'){  //当他等于all的时候就全部显示
        switch(priceIndex){   //如果存在为真
            case '0': 
                minPrice = 0;
                maxPrice = 100;
                break;
            case '1': 
                minPrice = 100;
                maxPrice = 500;
                break;
            case '2': 
                minPrice = 500;
                maxPrice = 1000;
                break;
            case '3': 
                minPrice = 1000;
                maxPrice = 5000;
                break;
        }
        //把价格传进去然后在数据库进行查找
        params = {
            salePrice:{
                $gt: minPrice,
                $lte: maxPrice
            }
        }
    }
    //skip默认跳过几条数据
    let skip = (page-1)*pageSize
    //查找  通过find找到模型   limit限制数量
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
    //调用mongoose下的方法  排序  mongodb接收obj  sort:1升序；-1降序
    goodsModel.sort({'salePrice':sort});  //对那个字段进pageSize行排序
    //查询mongodb数据库  列表模型有findAPI 第一个是参数，第二个是回调
    goodsModel.exec(function(err,doc){  //doc查到的文档
        if(err){
            //如果报错  输出json文件
           res.json({
                status:'1',
                msg:err.message
            });
        }else{
            //成功
           res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,  //总条数
                    list:doc   //查到的文档，集合
                }
            })
        }
    // res.send('hello,goods.list')
    })
})
//加入购物车  向服务器提交数据用post
router.post('/addCarList',function(req,res,next){
    var userId = '100000077';  //登录 需要用户Id
    var productId = req.body.productId  //从前端拿过来的id
    var User = require('../models/user')  //拿到user模型，用来拿到数据
    //拿用户的信息  往用户插数据
    User.findOne({   //只拿一个用户
        userId:userId
    },function(err,useDoc){
        if(err){
           res.json({
                status:'1',
                message:err.message
            })
        }else{
            //拿到用户信息  当数据存在时
            if(useDoc){
                let getDoc = "";  //用来存商品信息
                useDoc.cartList.forEach((item) => {
                    if(item.productId == productId){
                        getDoc = item;
                        item.productNum++   //数量加以
                     }
                });
                if(getDoc){  //判断这个商品信息是否已经有加入购物车，如果有就保存在数据库中
                    useDoc.save(function(err1,doc1){   //回调函数是可选项,第一个参数为err,第二个参数为保存的文档对象
                        if(err1){
                            res.json({
                                status:'1',
                                message:err1.message
                            })
                        }else{
                          res.json({
                                status:'0',
                                message:'',
                                result:'suc'
                            })
                        }
                    })
                }else{  //如果这个商品信息没有加入购物车，就重新加入进去
                    Goods.findOne({productId:productId},function(err2,doc2){  //从goods数据中查找加入购物车的商品信息
                        if(err2){
                          res.json({
                                status:'1',
                                message:err2.message
                            })
                        }else{
                            if(doc2){
                                doc2.productNum = 1 ; //第一次加入
                                doc2.checked = 1 ;
                                //把新加入的商品信息加入到carList中
                                useDoc.cartList.push(doc2)
                                //然后保存到数据库
                                useDoc.save(function(err3,doc3){
                                    if(err3){
                                        res.json({
                                            status:'1',
                                            message:err3.message
                                        })
                                    }else{
                                       res.json({
                                            status:'0',
                                            message:'',
                                            result:'suc'  //成功
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })  
})
//输出之后才可以在app.js 中拿到goods
module.exports = router