// middle ware goes here
var Campground=require('../models/campground');
var Comment    =require('../models/comment');
var middlewareObj={};
middlewareObj.checkCampgroundOwnership =
    function(req,res,next){
        if(req.isAuthenticated())
        {
            // does user own the campground
    
            Campground.findById(req.params.id,function(err,foundCampground){
                if(err)
                {
                    req.flash('error','Campground not found');
                    res.redirect('back');
                }
                else
                {
                    //does user own campground
                    if (foundCampground.author.id.equals(req.user._id))
                    {
                        next();
                    }
                    else{
                        req.flash('error','you dont have permission to do that');
                        res.redirect('back');
                    }
                    
                }
            });
        }
        else
        {
            req.flash('error','You need to be logged in to do that');
            res.redirect('back');
        }
    }
middlewareObj.checkCommentOwnership=
function(req,res,next){
    if(req.isAuthenticated())
    {
        // does user own the campground

        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err)
            {
                req.flash('error','Comment not found');
                res.redirect('back');

            }
            else
            {
                //does user own comment
                if (foundComment.author.id.equals(req.user._id))
                {
                    next();
                }
                else{
                    req.flash('error','you dont have permission to do that');
                    res.redirect('back');
                }
                
            }
        });
    }
    else
    {
        req.flash('error','You need to be logged in to do that');
        res.redirect('back');
    }
}
middlewareObj.isLoggedIn=
function(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error','You need to be Logged in to do that');
    res.redirect('/login');
}

module.exports=middlewareObj