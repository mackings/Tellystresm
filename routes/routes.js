const express = require("express");
const { CreateUser,LoginUser, Sendverificationcode, verifyotp, requestResetToken, getUserProfile } = require("../controllers/Users/user");
const { verifyToken } = require("../controllers/utils/tokenservice");
const { followUser, getAllVideos, streamVideo, unfollowUser, search } = require("../controllers/activities/users");
const multer = require("multer");
const { Video } = require("../Models/Usermodel");
const { successResponse, errorResponse } = require("../controllers/utils/utils");
const { uploadMedia } = require("../controllers/Admin/uploadmedia");



const router = express.Router();

router.post("/api/register", CreateUser);
router.post("/api/login", LoginUser);
router.post("/api/req-reset-token",requestResetToken);
router.post("/api/req-vcode", Sendverificationcode);
router.post("/api/verifycode", verifyotp);

//Activities
router.get("/api/profile/:id",getUserProfile);
router.get("/api/allvideos",getAllVideos);
router.post("/api/follow", followUser);
router.post("/api/unfollow", unfollowUser);
router.post("/api/upload", uploadMedia);
router.get('/api/search/:title', search);
router.post('/api/videos/:videoId/stream', streamVideo);


module.exports = router;