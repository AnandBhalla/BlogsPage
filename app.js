const express=require("express")
const app=express()
const path=require("path")
const bcrypt=require("bcrypt")
const cookieparser=require("cookie-parser")
const {model1,model2} =require('./models/user');
const jwt=require("jsonwebtoken")
app.set("view engine","ejs")
app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())

app.get('/' , (req,res)=>{
    res.render("login");
})
app.get('/signup' , (req,res)=>{
    res.render("signup");
})
app.get('/login' , (req,res)=>{
    res.render("login");
})
app.get('/logout' , (req,res)=>{
    res.cookie("token","")
    res.redirect("/login");
})
app.get('/main' , isloggedin, async(req,res)=>{
    let allBlogs=await model2.find()
    res.render("main",{allBlogs:allBlogs})
})

app.post('/login' , async (req,res)=>{
    let {username,password}=req.body;
    let checkUser=await model1.findOne({username:username})
    if(!checkUser)  return res.send("something went wrong. try again later.")
    bcrypt.compare(password,checkUser.password,async function(err,result){
        if(result){
            let token = jwt.sign({username:username,userid:checkUser._id},"secreat")
            res.cookie("token",token)
            let allBlogs=await model2.find()
            res.render("main",{allBlogs:allBlogs})
        }  
        else return res.send("something went wrong. try again later.")
})

})
app.post('/signup' , (req,res)=>{
    let {username,name,email,password}=req.body;

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async function(err,hash){
            let newUser=await model1.create({
                username,name,email,password:hash
            })
            res.send(newUser)
            res.render("login");
        })
    }) 
})

app.get('/create' ,isloggedin,(req,res)=>{
    res.render("create");
})

app.post('/create',async (req,res)=>{
    let {name,date,title,imageLink,content}=req.body;

    let newBlog=await model2.create({
        name,date,title,imageLink,content
    })

    let allBlogs=await model2.find()
    res.render("main",{allBlogs:allBlogs})
})


function isloggedin(req,res,next){
    const token = req.cookies.token;

    if (!token) {
        return res.render("login");
    }
    const data = jwt.verify(token, "secreat");
    req.user = data;
    next();
}

app.listen(3000)

