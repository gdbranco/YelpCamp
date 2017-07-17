var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
        text: String,
        author: {id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
                username: String,
                image: String},
        date: { type: Date, default: Date.now },
        qtd_likes: {type: Number, default: 0},
        likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
        //rating: {type: Number, default: 3}
});

module.exports = mongoose.model("Comment",commentSchema);