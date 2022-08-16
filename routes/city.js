var express = require("express");
var router = express.Router();
var controller = require("../controller/city");

router.post("/", controller.post);
router.get("/", controller.getAll);

module.exports = router;
