var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//==================
//COMMENTS ROUTE
//==================
//NEW COMMENT FORM
router.get("/new",middleware.isLogged,function(req, res) {
        Campground.findById(req.params.id,function(error,found){
                if(error){
                        console.log(error);
                        req.flash("error","Something went wrong");
                        return res.redirect("back");
                }
                res.render("comments/new",{camp:found});
        });
});

//CREATE COMMENT
router.post("/",function(req, res){
        if(!req.isAuthenticated()){
                res.json({redirect: "/login"});
        }else{
        //lookup camp by id
        Campground.findById(req.params.id,function(error, found) {
                if(error)
                {
                        console.log(error);
                        req.flash("error","Something went wrong");
                        return res.redirect("/campgrounds/" + req.params.id);
                }
                //add comment
                Comment.create(req.body.comment,function(error,comment){
                        if(error)
                        {
                                console.log(error);
                                req.flash("error","Something went wrong");
                                return res.redirect("back");
                        }
                        //link comment to camp
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.author.image = req.user.image;
                        comment.save();
                        console.log(comment);
                        found.comments.push(comment);
                        found.save();
                        //redirect to comments of id
                        if(req.xhr){
                                res.json({comment: comment, camp: found, flash: {type: "success",msg:"Comment created."}});
                        }else{
                                req.flash("success","Comment created");
                                res.redirect("/campgrounds/"+req.params.id);
                        }
                });
        });}
        
});

//EDIT ROUTE FORM
router.get("/:comment_id/edit",middleware.checkCommentOwner,function(req,res){
        Comment.findById(req.params.comment_id,function(error, found) {
           if(error)
           {
                   req.flash("error","Something went wrong");
                   return res.redirect("back");
           }
           res.render("comments/edit",{camp_id:req.params.id,comment: found});
        });
});

//UPDATE ROUTE
router.put("/:comment_id",middleware.checkCommentOwner,function(req,res){
        req.body.comment.text = req.sanitize(req.body.comment.text);
        Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,{new: true},function(error,updated){
                if(error){
                        req.flash("error","Something went wrong");
                        return res.redirect("back");
                }
                console.log(updated);
                if(req.xhr){
                        res.json({comment: updated, camp_id: req.params.id, flash: {type: "success", msg:"Comment updated."}});
                }else{
                        req.flash("success","Comment updated.");
                        res.redirect("/campgrounds/"+req.params.id);
                }
        });
});

//DELETE ROUTE
router.delete("/:comment_id",middleware.checkCommentOwner,function(req,res){
      Comment.findByIdAndRemove(req.params.comment_id,function(error,removed){
              if(error){
                      req.flash("error","Something went wrong");
                      return res.redirect("back");
              }
              if(req.xhr){
                      res.json({camp: removed, flash: {type: "success", msg: "Comment deleted."}});
              }else{
                      req.flash("success","Comment deleted.");
                      res.redirect("/campgrounds/"+req.params.id);
              }
      })  
});

//LIKE ROUTE
router.put("/:comment_id/like",function(req,res){
        if(!req.isAuthenticated()){
                res.json({redirect: "/login"});
        }else{
        Comment.findById(req.params.comment_id, function(error, found){
                if(error){
                        req.flash("error","Something went wrong.");
                        return res.redirect("back");
                }
                found.qtd_likes += 1;
                found.likes.push(req.user._id);
                found.save();
                if(req.xhr){
                        res.json({comment: found, camp_id: req.params.id});
                }else{
                        res.redirect("/campgrounds/"+req.params.id);
                }
        });}
});

//DISLIKE ROUTE
router.put("/:comment_id/dislike",middleware.isLogged,function(req,res){
        if(!req.isAuthenticated()){
                res.json({redirect: "/login"});
        }else{
        Comment.findById(req.params.comment_id, function(error, found){
                if(error){
                        req.flash("error","Something went wrong.");
                        return res.redirect("back");
                }
                found.qtd_likes -= 1;
                found.likes.splice(found.likes.indexOf(req.user._id),1);
                found.save();
                if(req.xhr){
                        res.json({comment: found, camp_id: req.params.id});
                }else{
                        res.redirect("/campgrounds/"+req.params.id);
                }
        });}
});

module.exports = router;