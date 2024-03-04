const express = require("express");
const { CreateUser,LoginUser, Sendverificationcode, verifyotp, requestResetToken } = require("../controllers/Users/user");
const { verifyToken } = require("../controllers/utils/tokenservice");
const { followUser } = require("../controllers/activities/users");
const router = express.Router();



router.post("/api/register", CreateUser);
router.post("/api/login", LoginUser);
router.post("/api/req-reset-token",requestResetToken);

router.post("/api/req-vcode", Sendverificationcode);
router.post("/api/verifycode", verifyotp);

//Activities
router.post("/api/follow", followUser);

module.exports = router;