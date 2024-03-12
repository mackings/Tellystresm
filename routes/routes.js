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
router.get("/api/profile/:id", verifyToken, getUserProfile);
router.get("/api/allvideos",verifyToken, getAllVideos);
router.post("/api/follow", verifyToken, followUser);
router.post("/api/unfollow", verifyToken, unfollowUser);
router.post("/api/upload", verifyToken, uploadMedia);
router.get('/api/search/:title', verifyToken, search);
router.post('/api/videos/:videoId/stream',verifyToken,streamVideo);


module.exports = router;