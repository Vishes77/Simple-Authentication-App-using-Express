const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

app.set('view engine','ejs');
app.set('views','views');

mongoose.connect('mongodb://localhost:27017/Auth-app', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(express.urlencoded({extended:true}));

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
        res.send('Welcome');
    }else{
        res.send('PLease Try again');
    }
    // res.send(req.body);
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

app.listen(3000,()=>{
    console.log('App Started');
})