const mongoose=require("mongoose")
mongoose.connect(`mongodb://localhost:27017/blogspage`)
const firstSchema=mongoose.Schema({
    "name":String,
    "username":String,
    "email":String,
    "password":String,
})
const secondSchema=mongoose.Schema({
    "name":String,
    "date":Date,
    "title":String,
    "content":String,
    "imageLink":String,
})
let model1=mongoose.model("firstModel",firstSchema)
let model2=mongoose.model("secondModel",secondSchema)

module.exports={model1,model2};