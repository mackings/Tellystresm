const express = require("express");
const { CreateUser,LoginUser, Sendverificationcode, verifyotp, requestResetToken, getUserProfile } = require("../controllers/Users/user");
const { verifyToken } = require("../controllers/utils/tokenservice");
const { followUser, getAllVideos, streamVideo, unfollowUser, search, getVideosByCategory, commentOnVideo, replyToComment } = require("../controllers/activities/users");
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
router.get("/api/search/categories/:category", verifyToken, getVideosByCategory);
router.post('/api/videos/:videoId/stream',verifyToken,streamVideo);
router.post("/api/comment",verifyToken, commentOnVideo);
router.post("/api/replycomment", verifyToken, replyToComment);


module.exports = router;