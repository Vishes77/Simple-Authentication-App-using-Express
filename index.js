const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

app.set('view engine','ejs');
app.set('views','views');

mongoose.connect('mongodb://localhost:27017/Auth-app', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
});

// Demo use id & password are {usename : abc , password:abc}

const requireLogin = (req,res,next)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    next();
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.urlencoded({extended:true}));
app.use(session({secret:'notagoodsecret'}));

app.get('/',(req,res)=>{
    res.send("This is the Home Page");
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login',async(req,res)=>{
    const { username , password } = req.body;
    const user = await User.findOne({username});
    const validuser = await bcrypt.compare(password,user.password);
    if(validuser){
        req.session.user_id = user._id;
        res.redirect('/secret');
    }else{
        res.send('/login');
    }
})

app.post('/register', async(req,res)=>{
    const { username , password } = req.body;
    const hash = await bcrypt.hash(password,12);
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    res.redirect('/')
})

app.get('/secret',requireLogin,(req,res)=>{
    res.render('secret');
})

app.get('/topsecret',requireLogin,(req,res)=>{
    res.send('Top Secret');
})

app.post('/logout',(req,res)=>{
    req.session.user_id = null;
    // req.session.destroy(); // this is destory entire session. for now above line will also work.
    res.redirect('/login');
})

app.listen(3000,()=>{
    console.log('App Started');
})