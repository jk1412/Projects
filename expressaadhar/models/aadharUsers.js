var moongoose = require('mongoose')
var Schema = moongoose.Schema
var bcrypt = require('bcrypt')

var schema = new Schema({
    fname:{type:String, require:true},
    lname:{type:String, require:true},
    phonenumber:{type:String,require:true},
    email:{type:String, require:true},
    username:{type:String, require:true},
    password:{type:String, require:true},
    address:{type:String,require:true},
    creationDT:{type:Date, require:true},
})

schema.statics.hashPassword = function hashPassword (password)
{
    return bcrypt.hashSync(password,10)
}

schema.methods.isValid = function(hashedPassword)
{
    return bcrypt.compareSync(hashedPassword, this.password)
}

schema.path('phonenumber').validate(async (number) => {
    console.log("Number is ======>",number)
    const phonecount = await moongoose.models.User.countDocuments({phonenumber:number})
    console.log("Phonecount variable is ========>",phonecount)
    return !phonecount
},'Number already exist')

module.exports = moongoose.model('User',schema )