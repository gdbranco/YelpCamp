var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//======================
//USERS ROUTES
//=====================
//SHOW USER - show info of a certain user
router.get("/:id",function(req, res) {
        User.findById(req.params.id,function(error, found){
                if(error)
                {
                   console.log(error);
                   req.flash("error","Something went wrong");
                   return res.redirect("back");
                }
                Campground.find({"author.id" : found._id},function(error, found_camps){
                    if(error){
                        console.log(error);
                        req.flash("error","Something went wrong");
                        return res.redirect("back");
                    }
                    res.render("profiles/show",{user: found, camps: found_camps}); 
                });
        });
});

//EDIT USER - edit info of a certain user
router.get("/:id/edit",middleware.checkProfileOwner,function(req, res) {
    User.findById(req.params.id,function(error,found){
       if(error)
       {
           console.log(error);
           req.flash("error","Something went wrong");
           return res.redirect("/profile/"+req.params.id+"/edit");
       }
       res.render("profiles/edit",{user:found});
    });
});

//UPDATE USER - update info of a certain user
router.put("/:id",middleware.checkProfileOwner,function(req,res){
    var newData = {first: req.body.profile.first, last: req.body.profile.last, email: req.body.profile.email, image: req.body.profile.image};
        User.findByIdAndUpdate(req.params.id,{$set: newData},{new: true},function(error,updated){
            if(error)
            {
                console.log(error);
                req.flash("error","Something went wrong");
                return res.redirect("back");
            }
            Comment.find({"author.id":updated._id},function(error,comment_found){
                if(error){
                    console.log(error);
                    req.flash("error","Something went wrong");
                    return res.redirect("back");
                }
                
                comment_found.forEach(function(comment){
                        comment.author.image = updated.image;
                        comment.save();
                });
                req.flash("success","User updated.");
                res.redirect("/profile/" + req.params.id);
           });
        });
    });

//DELETE USER - delete info of a certain user
router.delete("/:id",middleware.checkProfileOwner,function(req,res){
    User.findByIdAndRemove(req.params.id,function(error,removed){
       if(error)
       {
           console.log(error);
           req.flash("error","Something went wrong");
           return res.redirect("/profile/"+req.params.id);
       }
       Campground.remove({"author.id":removed._id},function(error){
           if(error){
               console.log(error);
               req.flash("error","Something went wrong.");
               return res.redirect("/profile/"+req.params.id);
           }
           Comment.remove({"author.id":removed._id},function(error){
               if(error){
                   console.log(error);
                   req.flash("error","Something went wrong.");
                   return res.redirect("/profile/"+req.params.id);
               }
                req.flash("success","User removed.");
                res.redirect("/");
           });
       });
    });
});

module.exports = router;