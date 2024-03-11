const express = require("express");
const router = express.Router();
const { successResponse, errorResponse } = require("../utils/utils");
const { Video,User } = require("../../Models/Usermodel");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



cloudinary.config({
    cloud_name: 'dv0anyldo',
    api_key: '838368846159638',
    api_secret: 'urtOYeOUK69LiUqumdH8YVHysf0'
});

// Multer storage configuration
const storage = multer.diskStorage({});

// Multer upload configuration
const videoUpload = multer({
    storage: storage,
    limits: { fileSize: 10000000 } // 10 MB limit
}).single('video'); // Assuming the input field name for the video file is 'video'

exports.uploadMedia = async (req, res) => {

    try {

        videoUpload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(400).json(errorResponse('File upload error'));
            } else if (err) {
                // An unknown error occurred
                return res.status(500).json(errorResponse('Internal server error'));
            }
        
            // Check if req.file is undefined
            if (!req.file) {
                return res.status(400).json(errorResponse('No file uploaded'));
            }
        
            // Proceed with file upload process...
            const { title, description, userId } = req.body;

            // Check if the user exists and is of organization type
            const user = await User.findById(userId);
            if (!user || user.accounttype !== 'organization') {
                return res.status(403).json(errorResponse('Only organization accounts can upload videos'));
            }
            // Upload video to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'video',
                folder: 'video-uploads',
                allowed_formats: ['mp4', 'avi']
            });

            // Create new video document
            const newVideo = new Video({
                title: title,
                description: description,
                user: userId,
                videoUrl: result.secure_url
            });

            // Save new video
            await newVideo.save();
            // Update user's video list
            user.videos.push(newVideo._id);
            await user.save();

            // Send success response
            res.status(200).json(successResponse('Video uploaded successfully', { video: newVideo }));
        });
        
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

//module.exports = videoUpload;

