const express = require("express");
const mongoose = require ("mongoose");
const bcrypt = require("bcrypt");
const {successResponse,errorResponse}= require("./utils");
const { User } = require("../../Models/Usermodel");
const saltrounds = 10;



exports.CreateUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json(errorResponse("Username or Email already exists", 400));
        }

        const hashedPassword = await bcrypt.hash(req.body.password, saltrounds);

        const newUser = new User({

            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            accounttype:req.body.accounttype

        });

        await newUser.save();
        
        res.status(200).json(successResponse("User Registered Successfully", newUser));
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json(errorResponse("Internal Server Error",));
    }
};


exports.LoginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(errorResponse("User not found", 400));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json(errorResponse("Invalid password", 400));
        }

        res.status(200).json(successResponse("Login successful", { user }));
        
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json(errorResponse("Internal Server Error"));
    }
};