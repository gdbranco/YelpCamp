var express = require('express');
var router = express.Router();
//======================
//LANDING ROUTE
//======================
router.get("/",function(req,res){
        res.render("landing");
});

module.exports = router;