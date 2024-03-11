const express = require("express");
const mongoose = require ("mongoose");
const bcrypt = require("bcrypt");
const {User} = require("../../Models/Usermodel");
const {successResponse , errorResponse} = require("../utils/utils");


exports.followUser = async (req, res) => {
    const userId = req.body.userId;
    const followerId = req.body.followerId; 

    try {
        if (userId === followerId) {
            return res.status(400).json(errorResponse('Action cannot be carried out', 400));
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
        await user.save();

        res.status(200).json(successResponse('User followed successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('An error occurred while processing the request', 500));
    }
};





exports.unfollowUser = async (req, res) => {
    const userId = req.body.userId;
    const followerId = req.body.followerId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        if (!user.followers.includes(followerId)) {
            return res.status(400).json(errorResponse('User is not followed', 400));
        }

        user.followers = user.followers.filter(f => f.toString() !== followerId);
        await user.save();

        res.status(200).json(successResponse('User unfollowed successfully'));
    } catch (error) {
        console.error(error);
        res.status(500).json(errorResponse('An error occurred while processing the request', 500));
    }
};