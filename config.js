const mysql = require('mysql');
const con = mysql.createConnection({
    host:"sql6.freemysqlhosting.net",
    user:"sql6639367",
    password:"uZKNUiAwU8",
    database:"sql6639367"
});

con.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected");
    }
})

module.exports = con;