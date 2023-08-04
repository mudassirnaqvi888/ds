const islogin = async(req,resp,next)=>{
    try {
        if(req.session.email){}
        else{
            resp.redirect('/login');
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

const islogout = async(req,resp,next)=>{
    try {
        if(req.session.email){
            resp.redirect('/dashboard');
        }
        next();       
    } catch (error) {
        console.log(error);
    }
}

const logout = (req,resp)=>{
    try {
        req.session.destroy();
        resp.redirect('/')
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    islogin,
    islogout,
    logout
}