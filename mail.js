const nodemailer = require('nodemailer');


const sendMail = async(email,random)=>{

    const transporter =nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"mudassir.abbas293@gmail.com",
        pass:"gbghfyvjrciguknb"
    }
})

 const info = {
    from:"mudassir.abbas293@gmail.com",
    to:email,
    subject:"Email Verification",
    html:"<h3>your Verification code is<h3>" + " " +random
 }

   
    transporter.sendMail(info,(err,results)=>{
    if(err){
        console.log("message is not send",err);
    }else{
        console.log("message has been sent",info);
    }
 })

}

module.exports = sendMail;