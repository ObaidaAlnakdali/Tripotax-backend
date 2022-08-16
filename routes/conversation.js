var express = require("express");
var router = express.Router();
var controller = require("../controller/conversation");

router.post("/", controller.post);
router.get("/", controller.get);
router.get("/getByDriver/:id", controller.getByDriver);
router.get("/getByUser/:id", controller.getByUser);

module.exports = router;
