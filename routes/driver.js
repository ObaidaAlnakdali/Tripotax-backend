var express = require("express");
var router = express.Router();
var controller = require("../controller/driver");

router.get("/", controller.getAll);
router.get("/:id", controller.getbyID);
router.get("/getAvailableDriver", controller.getAvailableDriver);
router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
router.post("/addRaiting/:id", controller.addRaiting);
router.put("/:id", controller.put);
router.put("/UpdatePassword/:id", controller.UpdatePassword);
router.delete("/:id", controller.delete);

module.exports = router;
