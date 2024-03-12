const express = require("express");
const mongoose = require ("mongoose");
const bcrypt = require("bcryptjs");
const {User, Video} = require("../../Models/Usermodel");
const {successResponse , errorResponse} = require("../utils/utils");



exports.getAllVideos = async (req, res) => {
    
    try {
        const videos = await Video.find().populate('user', 'username email');

        const videosWithUrls = videos.map(video => {
            return {
                _id: video._id,
                title: video.title,
                description: video.description,
                user: video.user,
                videoUrl: video.videoUrl,
                imageUrl: video.imageUrl,
                isWatched: video.isWatched,
                isAddedToPlaylist: video.isAddedToPlaylist,
                streams: video.streams,
                likes: video.likes,
                comments: video.comments
            };
        });

        const response = successResponse('List of all videos', { videos: videosWithUrls });
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching videos:', error);
        const response = errorResponse('Internal server error');
        res.status(500).json(response);
    }
};


exports.getVideosByCategory = async (req, res) => {

    try {
        const category = req.params.category;
        const videos = await Video.find({ categories: category })
            .select('title description videoUrl imageUrl streams')
            .populate('user', 'username');
        
        if (videos.length === 0) {
            return res.status(404).json(errorResponse('No videos found for the specified category', 404));
        }

        res.status(200).json(successResponse(`Videos in the category '${category}'`, { videos }));
    } catch (error) {
        console.error('Error fetching videos by category:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};


exports.streamVideo = async (req, res) => {
    const { videoId } = req.params;

    try {
       
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json(errorResponse('Video not found'));
        }

        video.streams += 1;
        await video.save();

        const response = successResponse('Enjoy the Moments with Telly Streams', { video });
        res.status(200).json(response);
    } catch (error) {
        console.error('Error streaming video:', error);
        const response = errorResponse('Internal server error');
        res.status(500).json(response);
    }
};



exports.followUser = async (req, res) => {

    const { userId, followerId } = req.body;

    try {
        if (userId === followerId) {
            return res.status(400).json(errorResponse('Cannot follow yourself', 400));
        }

        const follower = await User.findById(followerId);
        if (!follower) {
            return res.status(404).json(errorResponse('Follower not found', 404));
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        if (user.followers.includes(followerId)) {
            return res.status(400).json(errorResponse('User is already followed', 400));
        }

        user.followers.push(followerId);
        follower.following.push(userId); 
        await user.save();
        await follower.save();

        res.status(200).json(successResponse('User followed successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('An error occurred while processing the request', 500));
    }
};




exports.unfollowUser = async (req, res) => {
    const { userId, followerId } = req.body;

    try {
        if (userId === followerId) {
            return res.status(400).json(errorResponse('Cannot unfollow yourself', 400));
        }

        const follower = await User.findById(followerId);
        if (!follower) {
            return res.status(404).json(errorResponse('Follower not found', 404));
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        if (!user.followers.includes(followerId)) {
            return res.status(400).json(errorResponse('User is not followed', 400));
        }

        user.followers = user.followers.filter(f => f.toString() !== followerId);
        follower.following = follower.following.filter(f => f.toString() !== userId);

        await user.save();
        await follower.save();

        res.status(200).json(successResponse('User unfollowed successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('An error occurred while processing the request', 500));
    }
};



exports.search = async (req, res) => {
    try {
        const searchQuery = req.params.title;
        const videos = await Video.find({ title: { $regex: `^${searchQuery}`, $options: 'i' } })
            .select('title description videoUrl imageUrl')
            .populate('user', 'username');

        res.status(200).json(successResponse('Search results', { videos }));
    } catch (error) {
        console.error('Error searching videos:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};
