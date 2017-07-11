//===============================================================
// EXPRESS SETUP
var express               = require("express");
var sassMiddleware        = require("node-sass-middleware");
var path                  = require("path");
var bodyParser            = require("body-parser");
var methodOverride        = require("method-override");
var expressSanitizer      = require("express-sanitizer");
var passport              = require("passport");
var localStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var flash                 = require("connect-flash");
// SETTING TIMEZONE
var moment                = require('moment');
var utcDate               = moment.utc().toDate();

// SESSION SETUP
var expressSession        = require("express-session");
var session               = expressSession({
                                secret: "thisisagreatsecret",
                                key: "mybgo.sid",
                                resave: false,
                                saveUninitialized: false,
                            });
// MONGOOSE SETUP
var mongoose              = require("mongoose");
//mongoose.connect("mongodb://localhost/yelpcamp");
mongoose.connect("mongodb://dbranco:badqwe123@ds147882.mlab.com:47882/yelpcamp");

mongoose.Promise = global.Promise;
//====================
// IMPORT MODELS
// var Campground            = require("./models/campground");
// var Comment               = require("./models/comment");
var User                  = require("./models/user"); //need the user for passport
//====================
// RESTART DB
// var seedDB                = require("./seeds");
//seedDB();
//====================
// APP START
var app = express();

app.use(flash());
// SASS SETUP
 app.use(
     sassMiddleware({
         src: __dirname + '/sass', 
         dest: __dirname + '/public/stylesheets',
         prefix:  '/stylesheets',
         indentedSyntax: true,
         debug: true,         
     })
  );   
//BODY PARSER SETUP
app.use(bodyParser.urlencoded({extended: true}));

//SANITIZER SETUP
app.use(expressSanitizer());

//SESSION SETUP
app.use(session);

//PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//SETUP GLOBAL VARIABLES
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   app.locals.moment = require("moment");
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   res.locals.warning = req.flash("warning");
   next();
});
//USE PUBLIC TO LOOKUP  
app.use(express.static(path.join(__dirname, '/public')));

//USE METHOD OVERRIDE
app.use(methodOverride("_method"));
//EJS AS PRIMARY VIEW ENGINE SETUP
app.set("view engine","ejs");
//===============================================================
//ROUTES
var indexRoutes = require("./routes/index");
var authRoutes = require("./routes/auth");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var errorRoutes = require("./routes/404");
app.use("/",indexRoutes);
app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(errorRoutes);
//=================================================================================
// User.findByUsername("gdb",function(error,found){
//     if(error){
//         console.log(error);
//     }else{
//         found.isAdmin = true;
//         found.save();
//     }
// });
//======================
//SERVER LISTENING AT SETUP
//======================
app.listen(process.env.PORT,process.env.IP,function(){
        console.log("Server started");
});