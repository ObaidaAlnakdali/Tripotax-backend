var express = require("express");
var router = express.Router();
var controller = require("../controller/order");

router.put("/:id", controller.put);
router.post("/:id", controller.post);
router.delete("/:id", controller.delete);

module.exports = router;
