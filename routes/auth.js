var express = require('express');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
//======================
//AUTH ROUTES
//======================
router.get("/login",function(req,res){
        res.render("login");
});

router.post("/login",passport.authenticate('local',{successRedirect: "/campgrounds",failureRedirect: "/login",failureFlash: true}),function(req,res){
});

router.get("/logout",middleware.logout,function(req,res){
        res.redirect("/");
});

router.get("/register",function(req,res){
        res.render("register");
});

router.post("/register",function(req,res){
        User.register(new User({username: req.body.username}),req.body.password,function(error,user){
                if(error){
                        console.log(error);
                        req.flash("error","We couldn't register you. Reason: " + error.message);
                        return res.redirect("/register");
                }
                passport.authenticate('local')(req,res,function(){
                        req.flash("success","User has been registered.");
                        res.redirect("/campgrounds");
                });
        });
});

module.exports = router;