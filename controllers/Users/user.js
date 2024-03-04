const express = require("express");
const mongoose = require ("mongoose");
const bcrypt = require("bcrypt");
const {successResponse,errorResponse}= require("../utils/utils");
const { User } = require("../../Models/Usermodel");
const saltrounds = 10;
const OTPService = require("../utils/emailservice");
const jwt = require("jsonwebtoken");


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
            isVerified: false,
            accounttype: req.body.accounttype
        });

        await newUser.save();
        
        const otpService = new OTPService();
        const isSent = await otpService.sendOTP(req.body.email);

        if (isSent) {
            console.log('OTP sent successfully');
            res.status(200).json(successResponse("User Registered Successfully. OTP sent to your email for verification", newUser));
        } else {
            console.error('Error sending OTP email');
            res.status(500).json(errorResponse("Error sending OTP email"));
        }
        
    } catch (error) {
        console.error('Error creating user:', error.message);
        if (error.code && error.code === 11000) {

            const keyPattern = Object.keys(error.keyPattern)[0];
            const keyValue = error.keyValue[keyPattern];
            return res.status(400).json(errorResponse(`The ${keyPattern} '${keyValue}' is already taken. Please choose another one.`, 400));
        }
        res.status(500).json(errorResponse("Internal Server Error"));
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

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json(successResponse("Login successful", { user, token }));
        
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json(errorResponse("Internal Server Error"));
    }
};

exports.requestResetToken = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        const otpService = new OTPService();
        const isSent = await otpService.sendOTP(email);

        if (isSent) {
            return res.status(200).json(successResponse('Password reset email sent successfully'));
        } else {
            console.error('Error sending OTP email');
            return res.status(500).json(errorResponse('Error sending OTP email', 500));
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse('An error occurred while processing the request', 500));
    }
};

exports.Sendverificationcode = async (req,res)=>{

    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(errorResponse("User not found", 404));
        }

        if (user.isVerified) {
            return res.status(400).json(errorResponse("User is already verified", 400));
        }

        const otpService = new OTPService();
        const isSent = await otpService.sendOTP(email);

        if (isSent) {
            return res.status(200).json(successResponse("Verification code sent successfully", {}));
        } else {
            return res.status(500).json(errorResponse("Error sending verification code", 500));
        }
    } catch (error) {
        console.error('Error requesting verification code:', error.message);
        return res.status(500).json(errorResponse("Internal Server Error", 500));
    }

}

exports.verifyotp = async (req, res) => {
    try {
      const { userId, otp } = req.body;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json(errorResponse("User not found", 404));
      }

      const otpService = new OTPService();
      const isValid = otpService.verifyOTP(otp);
  
      if (isValid) {
        console.log('OTP is valid');
  
        user.isVerified = true;
        await user.save();
  
        return res.status(200).json(successResponse("OTP verified successfully", {}));
      } else {
        console.log(isValid);
        console.error('Invalid OTP');
        return res.status(401).json(errorResponse("Invalid OTP", 401));
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      return res.status(500).json(errorResponse("Internal server error", 500));
    }
  };
  
