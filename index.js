const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const con = require('./config');
const bodyParser = require('body-parser');
const { error } = require('console');
const sendMail = require('./mail');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const auth = require('./middleware/auth');
const dirpath = path.join(__dirname, '/public');
const bootstrap = path.join(__dirname, '/node_modules/bootstrap/dist/css/bootsra');
app.use(express.static(dirpath));
app.use(express.static(bootstrap));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret : "secret",
    resave : false,
    saveUninitialized : true,
}))
const random = Math.floor(Math.random()*1000000);



app.get('/',auth.islogout,(req,resp)=>{
    resp.sendFile(__dirname + '/public/home.html');
})

app.get('/registration',auth.islogout,(req,resp)=>{
    resp.sendFile(__dirname + '/public/registration.html');
});


app.post('/registration',(req,resp)=>{
    data ={
         fname : req.body.first,
         lname : req.body.last,
         password : req.body.pass,
         email : req.body.emal }

    resp.cookie("data",data);
    console.log(random);
    sendMail(data.email,random);
    resp.redirect('/verification');
})

app.get('/login',auth.islogout,(req,resp)=>{
    resp.sendFile(__dirname + '/public/login.html');
});

app.post('/login',(req,resp)=>{
    var email = req.body.emal;
    var password = req.body.pass;
   var sql = "SELECT * FROM sign WHERE Email=?";
   con.query(sql,[email],(error,results)=>{
    console.log(results);
    console.log(email);
    console.log(password);
    if(email == results[0].Email & password == results[0].Password){
        req.session.email = results[0].Email;
        return resp.redirect('dashboard');
    }else{
        console.log("invalid password");
    }
   }) 
});

app.get('/dashboard',auth.islogin,(req,resp)=>{
    resp.render('dashboard');
})

app.post('/dashboard',(req,resp)=>{
})

app.get('/verification',(req,resp)=>{
    resp.sendFile(__dirname + '/public/verification.html');
})

app.post('/verification',(req,resp)=>{
    const data = req.cookies.data;
    console.log(data.email);
    console.log(data.fname);
    console.log(data.lname);
    console.log(random);
    if(req.body.verify == random){
        console.log(req.body.verify);
    var sql ="INSERT INTO sign (firstName, lastName, Email, Password) VALUES (?,?,?,?);";
    con.query(sql,[req.cookies.data.fname,req.cookies.data.lname,req.cookies.data.email,req.cookies.data.password],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            console.log(results);
            resp.redirect('/login');
        }
    })

    }else{
        console.log("not insert")
    }
    
})

app.get('/logout',auth.logout,(req,resp)=>{
    resp.sendFile(__dirname + "/public/logout.html")
})

app.listen(5000);