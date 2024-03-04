const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accounttype: {
        type: String,
        enum: ['individual', 'company'],
        required: true
    },
    profile: {
        firstName: String,
        lastName: String,
        avatar: String, 
        bio: String
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    streamingProperties: {
        preferredBitrate: String,
        preferredResolution: String,
    }
}, { timestamps: true });

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    isWatched: {
        type: Boolean,
        default: false
    },
    isAddedToPlaylist: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Video = mongoose.model('Video', videoSchema);

module.exports = {
    User,
    Video
};