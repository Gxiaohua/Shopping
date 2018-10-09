
var mongoose = require('mongoose')
//建立一个模型
var userSchema = new mongoose.Schema({
    'userId':String,
    'userName':String,
    'userPwd':String,
    'orderList':Array,  //订单列表
    'cartList':[
       { 
        'productId':String,               //key：类型
        'productName':String,
        'salePrice':Number,
        'productImage':String,
        'checked':String,  //是否选中
        'productNum':String,   //选中的数量
      }
    ],
    'addressList':[    //地址
      {
        "addressId" : String,
        "userName" :String,
        "streetName" : String,
        "postCode" : Number,
        "tel" :  Number,
        "isDefault" : Boolean,
      }
    ] 
})
module.exports = mongoose.model('Good',userSchema)