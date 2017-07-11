var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = mongoose.Schema({
        username: String,
        password: String,
        email: String,
        isAdmin: {type: Boolean, default: false}
});
var options = {
 errorMessages: {
  IncorrectPasswordError: 'Password is incorrect',
  IncorrectUsernameError: 'Username is incorrect'
 }
};
userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User",userSchema);