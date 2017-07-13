var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = mongoose.Schema({
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        first: String,
        last: String,
        email: {type: String, unique: true},
        image: String,
        isAdmin: {type: Boolean, required: true, default: false}
});
var options = {
 errorMessages: {
  IncorrectPasswordError: 'Password is incorrect',
  IncorrectUsernameError: 'Username is incorrect'
 }
};
userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User",userSchema);