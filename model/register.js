var mongoose = require('mongoose');
 
var schema = new mongoose.Schema({        

    name:{type:String,unique:true},
    password:String,
    online:{type:String, default:"offline"}

});


module.exports=mongoose.model('user',schema);