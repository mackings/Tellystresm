const express = require("express");
const { CreateUser,LoginUser } = require("../controllers/Users/user");
const router = express.Router();



router.post("/api/register", CreateUser);
router.post("/api/login", LoginUser);


module.exports = router;