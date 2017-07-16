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
router.post("/",middleware.isLogged,function(req, res){
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
                        found.comments.push(comment);
                        found.save();
                        //redirect to comments of id
                        req.flash("success","Comment created");
                        if(req.xhr){
                                res.json({comment: comment, camp: found});
                        }else{
                        res.redirect("/campgrounds/"+req.params.id);
                        }
                });
        });
        
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
                req.flash("success","Comment updated.");
                if(req.xhr){
                        res.json({comment: updated, camp_id: req.params.id});
                }else{
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
              req.flash("success","Comment deleted.");
              if(req.xhr){
                      res.json(removed);
              }else{
              res.redirect("/campgrounds/"+req.params.id);
                      
              }
      })  
});

module.exports = router;