var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var moment = require("moment");
var geocoder = require("geocoder");

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$!#\s]/g, "\\$&");
    
}
//======================
//CAMPGROUND ROUTES
//======================
//INDEX CAMPGROUNDS - show all
router.get("/",function(req, res) {
    if(req.query.search && req.query.search != ""){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex},function(error,allCampgrounds){
            if(req.xhr){
                if(allCampgrounds.length < 1){
                    res.json({campgrounds: null, flash: {type: "warn", msg: "No campground found."}});
                }
                else{
                    res.json({campgrounds: allCampgrounds});
                }
            }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
            }
        });
    }else{
        Campground.find({},function(error,allCampgrounds){
            if(error)
            {
                console.log(error);
                req.flash("error","Something went wrong");
                return res.redirect("back");
            }
            if(req.xhr){
                res.json({campgrounds: allCampgrounds});
            }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
            }
        });
    }
});

//NEW CAMPGROUND - show form
router.get("/new",middleware.isLogged,function(req, res) {
        res.render("campgrounds/new");
});

//CREATE CAMPGROUND - add new campground
router.post("/",middleware.isLogged,function(req,res){
    var name = req.body.camp.name;
    var image = req.body.camp.image;
    var price = req.body.camp.price;
    req.body.camp.desc = req.sanitize(req.body.camp.desc);
    var desc = req.body.camp.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.camp.location, function(err,data){
         if(err){
             console.log(err);
             req.flash("error","Invalid location.");
             return res.redirect("back");
         }
         var lat = data.results[0].geometry.location.lat;
         var lng = data.results[0].geometry.location.lng;
         var location = data.results[0].formatted_address;
         var newCamp = {name: name, price: price,image: image, desc: desc, author: author, location: location, lat: lat, lng: lng};
         Campground.create(newCamp,function(error, camp){
            if(error){
                console.log(error);
                req.flash("error","Something went wrong");
                return res.redirect("back");
            }
            console.log(camp);
            req.flash("success","Campground created");
            res.redirect("/campgrounds");
         });
    });
});

//SHOW CAMPGROUND - show info of a certain campground
router.get("/:id",function(req, res) {
        Campground.findById(req.params.id).populate({path:"comments"}).exec(function(error, found){
                if(error)
                {
                   console.log(error);
                   req.flash("error","Something went wrong");
                   return res.redirect("back");
                }
                //found.comments.sort(function(l,r){return moment.utc(r.date).diff(moment.utc(l.date))});
                found.comments.sort(function(l,r){return l.qtd_likes < r.qtd_likes});
                res.render("campgrounds/show",{camp: found});
        });
});

//EDIT CAMPGROUND - edit info of a certain campground
router.get("/:id/edit",middleware.checkCampOwner,function(req, res) {
    Campground.findById(req.params.id,function(error,found){
       if(error)
       {
           console.log(error);
           req.flash("error","Something went wrong");
           return res.redirect("/campgrounds/"+req.params.id+"/edit");
       }
       res.render("campgrounds/edit",{camp:found});
    });
});

//UPDATE CAMPGROUND - update info of a certain campground
router.put("/:id",middleware.checkCampOwner,function(req,res){
    req.body.camp.desc = req.sanitize(req.body.camp.desc);
    geocoder.geocode(req.body.camp.location,function(err,data){
        if(err){
            console.log(err);
            req.flash("error","Invalid location.");
            return res.redirect("back");
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.camp.name, image: req.body.camp.image, desc: req.body.camp.desc, price: req.body.camp.price, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id,{$set: newData},function(error,updated){
            if(error)
            {
                console.log(error);
                req.flash("error","Something went wrong");
                return res.redirect("back");
            }
            req.flash("success","Campground updated.");
            res.redirect("/campgrounds/" + req.params.id);
        });
    });
});

//DELETE CAMPGROUND - delete info of a certain campground
router.delete("/:id",middleware.checkCampOwner,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(error,removed){
       if(error)
       {
           console.log(error);
           req.flash("error","Something went wrong");
           return res.redirect("back");
       }
       removed.comments.forEach(function(comment){
          Comment.findByIdAndRemove(comment.id,function(error){
              if(error){
                  console.log(error);
                  req.flash("error","Something went wrong");
                  return res.redirect("back");
              }
          }) 
       });
       req.flash("success","Campground removed.");
       res.redirect("/campgrounds");
    });
});

//RATING ROUTE
router.put("/:id/rating",function(req,res){
    if(!req.isAuthenticated()){
        res.json({redirect: "/login"});
    }else{
   Campground.findById(req.params.id,function(error,found){
       if(error){
           console.log(error);
           req.flash("error","Something went wrong");
           res.json({redirect : "/campgrounds/"+req.params.id});
       }
       var index = found.ratings.findIndex(function(item, i){
          return item.user.equals(req.user._id);
        });
       console.log(index);
       if(index!=-1){
           found.ratings[index].rate = req.body.camp.rating;
       }else{
            var obj = {user: req.user._id, rate: req.body.camp.rating};
            found.ratings.push(obj);
       }
       var avg = 0;
            for(var i=0;i<found.ratings.length;i++){
                avg += found.ratings[i].rate;
            }
       found.avg_rating = avg / found.ratings.length;
        found.save();
        console.log(found);
        if(req.xhr){
           res.json({camp: found, flash: {type: "success", msg: "You rated the campground."}});
        }
   }) ;
    }
});

module.exports = router;