var express = require('express');
var router = express.Router();
var User = require('../models/user')
require('./../unit/util')
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
//登录
router.post('/login',function(req,res,next){
   var param = {
    userName: req.body.userName,
    userPwd: req.body.passWord,
   }
   User.findOne(param,function(err,doc){
     if(err){
       res.json({
          status:'1',
          message:err.message
        })
     }else{
        if(doc){
          //存储  往服务端写cookie     存用户id   通过传入属性名及其属性值，设置cookie，默认为30天，可以自己修改
           res.cookie('userId',doc.userId,{  //第一个参数cookie名称，第二个是值，3.参数
              path:'/' , //放到根目录
              maxAge:1000*60*60   //cookie周期
          })  
           res.cookie('userName',doc.userName,{  //第一个参数cookie名称，第二个是值，3.参数
            path:'/' , //放到根目录
            maxAge:1000*60*60   //cookie周期
         })
        //  req.sessioin.user = doc 也可储存 需要安装插件
          //客户端发的请求
          // req.session.user = doc
          res.json({
            status:'0',
            message:'',
            result:{   //返回数据给前端
              userName:doc.userName,
              userPwd:doc.userPwd
            }
          })
        }
     }
   })
})

//往服务器发送请求都使用post
//登出
router.post('/logout',function(req,res,next){
  //清除cookie   res.cookie获取到所有的cookie  
    res.cookie('userId','',{
      path:'/',
      maxAge:-1
  })
   res.json({
    status:'0',
    message:'',
    result:''
  })
})
//校验 
router.get('/checkLogin',function(req,res,next){
  //判断用户是否存在
  if(req.cookies.userId){
      res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || '' //输出数据
    })
  }else{
     res.json({
      status:'1',
      msg:'未登录',
      result:''
    })
  }
})
//查询当前用户加入购物车数据
router.get('/CarList',function(req,res,next){
  //req是取  res是写入
  var userId = req.cookies.userId
  User.findOne({userId:userId},function(err,doc){
    if(err){
       res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
          res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
})
// 购物车中删除商品
router.post('/cartDel',function(req,res,next){
  //用户id
  var userId = req.cookies.userId,productId = req.body.productId
  //删除  1.条件 2.$pull 删除谁
  User.update({
    userId:userId
  },{
    $pull:{  //删除
      "cartList":{
        'productId':productId
      }
    }
  },function(err,doc){
    if(err){
        res.json({
        status:'1',
        msg:err.message,
        result:''
      })  
    }else{
        res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  })
})
//商品数量修改  加减 在用户id下
router.post('/cartEdit',function(req,res,next){
  var userId = req.cookies.userId,
       productId = req.body.productId,
       productNum = req.body.productNum,
       checked = req.body.checked
  //更新 (update)
  //第一个参数conditions为查询条件,第二个参数doc为需要修改的数据,
  //第三个参数options为控制选项,第四个参数是回调函数
  // Model.update(conditions, doc, [options], [callback])

  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },function(err,doc){
    if(err){
        res.json({
        status:'1',
        msg:err.message,
        result:''
      })  
    }else{
        res.json({
        status:'0',
        msg:'',
        result:'suc'
      })
    }
  })
})

//全选
router.post('/checkAll',function(req,res,next){
  var userId = req.cookies.userId,
      checkedAll = req.body.checkedAll ? '1' : '0'
  //遍历更新 批量更新
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })  
    }else{
      if(doc){
        doc.cartList.forEach((item)=>{
          item.checked = checkedAll
        })
        doc.save(function(err1,doc1){
          if(err1){
             res.json({
              status:'1',
              msg:err1.message,
              result:''
            })  
          }else{
              res.json({
                status:'0',
                msg:'',
                result:'suc'
            }) 
          }
        })
      }
    }
  })
})
//地址模块，拿到数据渲染地址列表 拿数据
router.get('/addressList',function(req,res,next){
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,doc){
    if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
      })
    }else{
       res.json({
          status:'0',
          msg:'',
          result:doc.addressList
      })
    }
  })
})
//设置默认地址  通过isDefault的状态
router.post('/editDefault',function(req,res,next){
  var userId = req.cookies.userId,
      addressId = req.body.addressId
     if(!addressId){  //判断一下有没有传过来
       res.json({
          status:'1001',
          msg:'没传值',
          result:''
       })
     }else{
      User.findOne({userId:userId},function(err,doc){
        if(err){
            res.json({
              status:'1',
              msg:err.message,
              result:''
          })
        }else{
          doc.addressList.forEach((item)=>{
            if(item.addressId == addressId){
              item.isDefault = true
            }else{
              item.isDefault = false
            }
          })
          doc.save(function(err1,doc1){
            if(err){
               res.json({
                  status:'1',
                  msg:err1.message,
                  result:''
              })
            }else{
               res.json({
                status:'0',
                msg:'',
                result:''
            })
            }
          })
        }
      })
    } 
})
//删除数据（地址）
router.post('/sureDel',function(req,res,next){
    var userId = req.cookies.userId,
        addressId = req.body.addressId
    User.update({userId:userId
    },{
      $pull:{
          "addressList":{
            "addressId":addressId
          }
      }
    },function(err,doc){
      if(err){
          res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
          res.json({
          status:'0',
          msg:'',
          result:'suc'
        })
      }
    })
})
//添加地址
router.post('/addNewInner',function(req,res,next){
  var userId = req.cookies.userId,
      userName = req.body.userName,
      streetName = req.body.streetName,
      tel = req.body.tel;
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      // addressId
      let addressId = Date.now() + doc.addressList.length
      let postCode = addressId + Math.floor(Math.random()*20) + doc.addressList.length
      let add = {
        addressId:addressId,
        userName:userName,
        streetName:streetName,
        tel:tel,
        postCode:postCode,
        isDefault:false
      }
      console.log(add)
      doc.addressList.push(add)
      doc.save(function(err1,doc1){
        if(err1){
          res.json({
            status:'1',
            msg:err1.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:doc1.addressList
          })
        }
      })
    }
  })
})









//订单页面
router.post('/payment',function(req,res,next){
  var userId = req.cookies.userId,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal
  User.findOne({userId:userId},function(err,doc){
    if(err){
        res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      //地址，查询选中的地址
      var addressInfo = "" ,goodsList = []
      doc.addressList.forEach((item)=>{
        //判断每个id等不等于传过来的id，等于就代表选中的id
        if(item.addressId == addressId){
          addressInfo = item
        }
      })      
      //购物车中选中的商品
      doc.cartList.filter((item)=>{
        if(item.checked == '1'){
           goodsList.push(item)
        } 
      })
      //创建的时间
      // var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
       //id
      var orderId = Date.now() + doc.cartList.length
      let order = {
        orderId:orderId,                   //订单的id
        orderTotal:orderTotal,        //总价
        addressInfo:addressInfo,      //地址
        goodsList:goodsList,          //选中的商品
        orderStatus:1,                //选中的状态
        createDate:createDate                // 创建的时间
      }
      //把订单加入到orderList中
      doc.orderList.push(order)
      //保存
      doc.save(function(err1,doc1){
        if(err1){
           res.json({
            status:'1',
            msg:err1.message,
            result:''
          })
        }else{
           res.json({
              status:'0',
              msg:'',
              result:{  //返回orderId和orderTotal
                orderId:order.orderId,
                orderTotal:order.orderTotal,               
              }
          })
        }
      })
     
    }
  })
})
//通过订单id查找订单信息
router.get('/orderList',function(req,res,next){
  var userId = req.cookies.userId,
      orderId = req.param("orderId")
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      //拿到订单列表
      var orderList = doc.orderList
      if(orderList.length > 0){
        var orderTotal = 0;
        orderList.forEach((item)=>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal
          }
        });
        if(orderTotal > 0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:'10022',
            msg:'无此订单',
            result:''
          })
        }
      }else{
        res.json({
          status:'10021',
          msg:'当前无订单',
          result:''
        })
      }
    }
  })
})
//购物车数量
router.get('/cartListNum',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId
    User.findOne({userId:userId},function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        //拿到购物车中的列表
        let cartList = doc.cartList
        //用来记录购物车中商品的数量
        let total = 0
        cartList.forEach((item)=>{
          total += parseInt(item.productNum)
        })
        res.json({
          status:'0',
          msg:'',
          result:total
        })
      }
    })
  }
})
module.exports = router;
