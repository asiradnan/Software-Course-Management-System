// models/discussionModel.js
import mongoose from "mongoose";

const discussionPostSchema = mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sections',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        content: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const DiscussionPost = mongoose.models.discussionposts || mongoose.model("discussionposts", discussionPostSchema);

export default DiscussionPost;