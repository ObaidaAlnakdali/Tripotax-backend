var express = require("express");
var router = express.Router();
var controller = require("../controller/user");

router.get("/", controller.getAll);
router.get("/:id", controller.getbyID);
router.get("/getOrderActiveByUser/:id", controller.getOrderActiveByUser);
router.put("/:id", controller.put);
router.put("/UpdatePassword/:id", controller.UpdatePassword);
router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
router.delete("/:id", controller.delete); 
 
module.exports = router;