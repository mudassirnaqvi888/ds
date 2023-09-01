const mysql = require('mysql');
const con = mysql.createConnection({
    host:"34.131.4.229",
    user:"mudassir",
    password:"mudassir",
    database:"verify",
});

con.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected");
    }
})

module.exports = con;