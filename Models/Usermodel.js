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
    isVerified: {
        type: Boolean,
        default: false
    },

    accountType: {
        type: String,
        enum: ['individual', 'organization'],
        required: false
    },

    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        bio: String
    },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    streamingProperties: {
        preferredBitrate: String,
        preferredResolution: String
    }
}, { timestamps: true });


const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videoUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isWatched: { type: Boolean, default: false },
    isAddedToPlaylist: { type: Boolean, default: false },
    streams: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        replies: [{
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          content: { type: String, required: true },
          createdAt: { type: Date, default: Date.now }
        }],
        createdAt: { type: Date, default: Date.now }
      }],

    categories: {
        type: [String],
        enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Documentary', 'Family', 'Musical', 'Western', 'Biography', 'Crime', 'History', 'Sport', 'War'],
        required: true
    },

    // Adding the casts field
    casts: [{
        name: { type: String, required: true },
        role: { type: String, required: true }
    }]
}, 
{ timestamps: true });



const User = mongoose.model('User', userSchema);
const Video = mongoose.model('Video', videoSchema);

module.exports = { User, Video };
