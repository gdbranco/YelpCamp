var express = require('express');
var router = express.Router();
//======================
//404 ROUTE
//======================
//ERROR ROUTE
router.get("*",function(req,res){
        res.send("404");     
});

module.exports = router;