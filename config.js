const mysql = require('mysql');
const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"verify"
});

con.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected");
    }
})

module.exports = con;