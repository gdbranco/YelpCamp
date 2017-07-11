var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {
        logout: function(req,res,next){
                if(!req.isAuthenticated()){
                        req.flash("error","You are not logged in");
                        return req.redirect("/");
                }
                req.logout();
                req.flash("success","Logged you out");
                next();
        },
        isLogged: function(req,res,next){
                if(!req.isAuthenticated()){
                       req.flash("error","Please, login first.")
                       return res.redirect("/login"); 
                }
                next();
        },
        checkCampOwner: function(req,res,next){
                if(!req.isAuthenticated()){
                        req.flash("error","Please, login first.");
                        return res.redirect("back");
                }
                Campground.findById(req.params.id,function(error,found){
                        if(error){
                                req.flash("error","Campground not found.");
                                return res.redirect("back");
                        }
                        if(!found.author.id.equals(req.user._id) && !req.user.isAdmin){
                                req.flash("error","You don't have permission for that.");
                                return res.redirect("back");
                        }
                        next();
                });
        },
        
        checkCommentOwner: function(req,res,next){
                if(!req.isAuthenticated()){
                        req.flash("error","Please, login first.");
                        return res.redirect("back");
                }
                Comment.findById(req.params.comment_id,function(error,found){
                        if(error){
                                req.flash("error","Comment not found.");
                                return res.redirect("back");
                        }
                        if(!found.author.id.equals(req.user._id) && !req.user.isAdmin){
                                req.flash("error","You don't have permission for that.");
                                return res.redirect("back");
                        }
                        next();
                });
        }
};

module.exports = middlewareObj;