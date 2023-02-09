const mongoose = require("mongoose")


const schema = new mongoose.Schema({
 username: {type: String, required: true},
 password: {type: String, required: true, minLength: 8},

 age: {type: Number},
 gender: {type: String},
 role: {type: String},

 image: {type: String}

})


module.exports = mongoose.model('schema', schema)