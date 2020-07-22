var express=require('express');
var router=express.Router();
var passport=require('passport/lib');
var User=require('../models/user');
//root route
router.get('/',function(req,res){
    res.render('landing');
});



//============
//Aut routes
//++++++++++++
router.get('/register',function(req,res){
    res.render('register');
});
// handell sign up 
router.post('/register',function(req,res){
    var newUser= new User({username:req.body.username});
    User.register(newUser,req.body.password, function(err,user){
        if(err)
        {
            req.flash('error', err.message);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success','Welcome to YelpCamp '+user.username);
            res.redirect('/campgrounds');
        });
    });
});
//show login form
router.get('/login',function(req,res){
    res.render('login');
});
//app.post('/login',middleware,callback function);
router.post('/login', passport.authenticate('local',
{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}
),function(req,res){

});
//logout
router.get('/logout',function(req,res){
    req.logout();
    req.flash('success',"logged you out");
    res.redirect('/campgrounds');
});
// middlwware

module.exports=router;