var express = require("express");
var router = express.Router();
var controller = require("../controller/message");

router.post("/", controller.post);

module.exports = router;
