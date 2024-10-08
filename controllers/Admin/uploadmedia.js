const express = require("express");
const router = express.Router();
const { successResponse, errorResponse } = require("../utils/utils");
const { Video,User } = require("../../Models/Usermodel");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;




cloudinary.config({
    cloud_name: 'dv0anyldo',
    api_key: '838368846159638',
    api_secret: 'urtOYeOUK69LiUqumdH8YVHysf0'
});

const storage = multer.diskStorage({});

const videoUpload = multer({
    storage: storage,
    limits: { fileSize: 10000000 } // 10 MB limit
}).fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]);



exports.uploadMedia = async (req, res) => {
    
    try {
        videoUpload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.log(err);
                return res.status(400).json(errorResponse('File upload error'));
            } else if (err) {
                return res.status(500).json(errorResponse('Internal server error'));
            }
            
            if (!req.files || !req.files['video'] || !req.files['image']) {
                return res.status(400).json(errorResponse('No file uploaded'));
            }

            const { title, description, userId, categories, casts } = req.body;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json(errorResponse('User not found', 404));
            }

            const videoFile = req.files['video'][0]; 
            const imageFile = req.files['image'][0]; 

            const videoResult = await cloudinary.uploader.upload(videoFile.path, {
                resource_type: 'video',
                folder: 'video-uploads',
                allowed_formats: ['mp4', 'avi']
            });

            const imageResult = await cloudinary.uploader.upload(imageFile.path, {
                folder: 'image-uploads',
                allowed_formats: ['jpg', 'jpeg', 'png'],
            });

            // Parse casts data if it's sent as a JSON string
            const parsedCasts = typeof casts === 'string' ? JSON.parse(casts) : casts;

            const newVideo = new Video({
                title: title,
                description: description,
                user: userId,
                videoUrl: videoResult.secure_url,
                imageUrl: imageResult.secure_url,
                categories: categories,
                casts: parsedCasts  // Adding casts to the video document
            });

            await newVideo.save();
            user.videos.push(newVideo._id);
            await user.save();

            res.status(200).json(successResponse('Video uploaded successfully', { video: newVideo }));
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};


