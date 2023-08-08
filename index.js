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
    resp.render('login',{invalid:null});
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
        resp.cookie('email',email)
        return resp.redirect('dashboard');
    }else{
        return resp.render('login',{invalid:"Invalid Email & Password"});
    }
   }) 
});

app.get('/dashboard',auth.islogin,(req,resp)=>{
    resp.render('dashboard');
})

app.post('/dashboard',(req,resp)=>{
    var patient = req.body.patient;
    var specialist = req.body.specialist;
    var doctor = req.body.doctor;
    var time = req.body.time;
    var phone = req.body.phone;
    var email = req.cookies.email;
    var sql ="INSERT INTO appointment (PATIENTNAME, SPECIALIST, DOCTORS, APPOINTMENTTIME, PHONENUMBER, Email) VALUES (?,?,?,?,?,?);";
    con.query(sql,[patient,specialist,doctor,time,phone,email],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            resp.redirect('/dashboard');
        }
    })
    
})

app.get('/verification',(req,resp)=>{
    resp.render('verification',{invalid:null});
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
        return resp.render('verification',{invalid:"invalid Verification Code"});
    }
    
})

app.get('/logout',auth.logout,(req,resp)=>{
    resp.sendFile(__dirname + "/public/logout.html")
})

app.get('/appointmenthistory',auth.islogin,(req,resp)=>{
    var email = req.cookies.email;
    var sql = "SELECT * FROM appointment WHERE Email=?";
    con.query(sql,[email],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            resp.render("appointmenthistory",{results});
        }
    })
})

app.get('/userprofile',auth.islogin,(req,resp)=>{
    var email = req.cookies.email;
    var sql = "SELECT * FROM sign WHERE Email=?";
    con.query(sql,[email],(error,results)=>{
        if(error){
            console.log(error);
        }else{
            console.log(results);
            resp.render('user',{results});
        }
    })
})

app.get('/country',(req,resp)=>{
    resp.sendFile(__dirname + "/public/country.html")
})

app.get('/weatherapp',(req,resp)=>{
    resp.render('weather',{temp:null,feel:null,hum:null,wind:null,name:null,icon:null,cloud:null});
})

app.post('/weatherapp',(req,resp)=>{
    var city = req.body.tempcity;
    var apikey = "5041b2685724c541fd01a72c5004e46d";
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    fetch(url).then(x=>x.json()).then(y=>{
        var temp = Math.round(y.main.temp);
        var feel = Math.round(y.main.feels_like);
        var hum = y.main.humidity;
        var wind = Math.round((y.wind.speed * 18)/5);
        var name = y.name;
        var icon = y.weather[0].icon;
        var cloud = y.weather[0].description;
        resp.render('weather',{temp:temp,feel:feel,hum:hum,wind:wind,name:name,icon:icon,cloud:cloud});      
    });
    
})


app.listen(5000);
