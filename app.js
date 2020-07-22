// const bodyParser = require('body-parser');
// const { urlencoded } = require('body-parser');

var express=require('express'),
    app    =express(),
    bodyParser=require('body-parser'),
    mongoose=require('mongoose'),
    Campground=require('./models/campground'),
    seedDB=require('./seeds'),
    passport=require('passport'),
    localStrategy=require('passport-local'),
    User=require('./models/user'),
    Comment=require('./models/comment'),
    methodOverride=require('method-override'),
    flash  =require('connect-flash');
// Requiring routes from other files
var commentRoutes=require('./routes/comments'),
    campgroundRoutes=require('./routes/campgrounds'),
    indexRoutes=require('./routes/index');


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));
app.use(flash());
// console.log(__dirname);

//seedDB();  //seed the db

mongoose.connect("mongodb://localhost/yelp_camp");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));



port=process.env.PORT || 3000;

//===========================
//passport configuration
//===========================
app.use(require('express-session')(
    {
        secret:"Once again Rusty wins cutesst dog!",
        resave:false,
        saveUninitialized:false
    }
));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(indexRoutes);
app.use('/campgrounds/:id/comments',commentRoutes); 
app.use('/campgrounds',campgroundRoutes); // adds /campgrounds to the begining of all routes in campgrounds

app.listen(port,function(){
    console.log('app started');
});