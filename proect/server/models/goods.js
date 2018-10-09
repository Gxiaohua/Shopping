//node.js基于common规范，通过module.express实现
//require引入模块，
var mongoose = require('mongoose')
//Schema 用来定义列表模型
var Schema = mongoose.Schema;
//商品模型   new一个对象用来定义模型
var productSchema = new Schema({
    'productId':String,               //key：类型
    'productName':String,
    'salePrice':Number,
    'productImage':String,
    'checked':String,  //是否选中
    'productNum':String,   //选中的数量
});
//输出  匿名输出     输出 【1.定义一个Good，Good会从数据库中找goods  
                      //2.模型是produtSchema，把模型输出，基于模型调API方法  
                      //3.第三个参数指定和数据库中那个集合关联】
module.exports = mongoose.model('Cargoods',productSchema)
