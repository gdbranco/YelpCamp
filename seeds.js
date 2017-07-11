var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3805/9667057875_90f0a0d00a.jpg",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu tincidunt velit, eu tincidunt purus. Sed vestibulum imperdiet commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum tortor libero, lacinia sed cursus id, varius sit amet nisi. Suspendisse tempor in elit in dignissim. Donec nec tincidunt neque, eget pharetra nibh. Nam eget mi ipsum. Duis sed ipsum at est gravida luctus. Phasellus sit amet dui nibh. Donec et neque quis odio ultrices maximus. Nulla consequat, ex in sagittis posuere, metus nulla consectetur tortor, eu scelerisque leo enim non justo. Ut condimentum lacus nisi, et porta lacus egestas id. Donec facilisis ligula quis egestas tincidunt. Nullam convallis tristique purus, sit amet ultricies sem varius vel."},
        {name: "Forest",
        image: "https://farm8.staticflickr.com/7285/8737935921_47343b7a5d.jpg",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu tincidunt velit, eu tincidunt purus. Sed vestibulum imperdiet commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum tortor libero, lacinia sed cursus id, varius sit amet nisi. Suspendisse tempor in elit in dignissim. Donec nec tincidunt neque, eget pharetra nibh. Nam eget mi ipsum. Duis sed ipsum at est gravida luctus. Phasellus sit amet dui nibh. Donec et neque quis odio ultrices maximus. Nulla consequat, ex in sagittis posuere, metus nulla consectetur tortor, eu scelerisque leo enim non justo. Ut condimentum lacus nisi, et porta lacus egestas id. Donec facilisis ligula quis egestas tincidunt. Nullam convallis tristique purus, sit amet ultricies sem varius vel."},
        {name: "Daisy Mountain",
        image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu tincidunt velit, eu tincidunt purus. Sed vestibulum imperdiet commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum tortor libero, lacinia sed cursus id, varius sit amet nisi. Suspendisse tempor in elit in dignissim. Donec nec tincidunt neque, eget pharetra nibh. Nam eget mi ipsum. Duis sed ipsum at est gravida luctus. Phasellus sit amet dui nibh. Donec et neque quis odio ultrices maximus. Nulla consequat, ex in sagittis posuere, metus nulla consectetur tortor, eu scelerisque leo enim non justo. Ut condimentum lacus nisi, et porta lacus egestas id. Donec facilisis ligula quis egestas tincidunt. Nullam convallis tristique purus, sit amet ultricies sem varius vel."},
        {name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3805/9667057875_90f0a0d00a.jpg",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu tincidunt velit, eu tincidunt purus. Sed vestibulum imperdiet commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum tortor libero, lacinia sed cursus id, varius sit amet nisi. Suspendisse tempor in elit in dignissim. Donec nec tincidunt neque, eget pharetra nibh. Nam eget mi ipsum. Duis sed ipsum at est gravida luctus. Phasellus sit amet dui nibh. Donec et neque quis odio ultrices maximus. Nulla consequat, ex in sagittis posuere, metus nulla consectetur tortor, eu scelerisque leo enim non justo. Ut condimentum lacus nisi, et porta lacus egestas id. Donec facilisis ligula quis egestas tincidunt. Nullam convallis tristique purus, sit amet ultricies sem varius vel."},
        {name: "Forest",
        image: "https://farm8.staticflickr.com/7285/8737935921_47343b7a5d.jpg",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu tincidunt velit, eu tincidunt purus. Sed vestibulum imperdiet commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum tortor libero, lacinia sed cursus id, varius sit amet nisi. Suspendisse tempor in elit in dignissim. Donec nec tincidunt neque, eget pharetra nibh. Nam eget mi ipsum. Duis sed ipsum at est gravida luctus. Phasellus sit amet dui nibh. Donec et neque quis odio ultrices maximus. Nulla consequat, ex in sagittis posuere, metus nulla consectetur tortor, eu scelerisque leo enim non justo. Ut condimentum lacus nisi, et porta lacus egestas id. Donec facilisis ligula quis egestas tincidunt. Nullam convallis tristique purus, sit amet ultricies sem varius vel."},
        {name: "Daisy Mountain",
        image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu tincidunt velit, eu tincidunt purus. Sed vestibulum imperdiet commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum tortor libero, lacinia sed cursus id, varius sit amet nisi. Suspendisse tempor in elit in dignissim. Donec nec tincidunt neque, eget pharetra nibh. Nam eget mi ipsum. Duis sed ipsum at est gravida luctus. Phasellus sit amet dui nibh. Donec et neque quis odio ultrices maximus. Nulla consequat, ex in sagittis posuere, metus nulla consectetur tortor, eu scelerisque leo enim non justo. Ut condimentum lacus nisi, et porta lacus egestas id. Donec facilisis ligula quis egestas tincidunt. Nullam convallis tristique purus, sit amet ultricies sem varius vel."}
        ];

function seedDB(){
        //remove camps
        Campground.remove({}, function(err){
           if(err)
           {
                   console.log(err);
           }else{
           console.log("All camps removed");
            //add camps
                data.forEach(function(camp){
                   Campground.create(camp,function(err,added){
                           if(err){
                                   console.log(err);
                           }else{
                                   console.log("Added a camp");
                                   console.log(added);
                                   Comment.create(
                                           {text: "Great, wish there was internet!",
                                            author: "Homer"},function(err, comment){
                                                    if(err){
                                                            console.log(err);
                                                    }else{
                                                        added.comments.push(comment);
                                                        added.save();
                                                        console.log("Created a new comment");
                                                    }
                                            });
                           }
                   });
                });
           }
        });
}

module.exports = seedDB;