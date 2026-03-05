import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const like = await Like.findOne({user: req.user._id, video: videoId})
    if (like) {
        // If like exists, remove it (unlike)
        await like.remove()
        return res.status(200).json(new ApiResponse(true, "Video unliked successfully"))
    } else {
        // If like does not exist, create it (like)
        await Like.create({user: req.user._id, video: videoId})
        return res.status(200).json(new ApiResponse(true, "Video liked successfully"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const like = await Like.findOne({user: req.user._id, comment: commentId})
    if (like) {
        // If like exists, remove it (unlike)
        await like.remove()
        return res.status(200).json(new ApiResponse(true, "Comment unliked successfully"))
    } else {
        // If like does not exist, create it (like)
        await Like.create({user: req.user._id, comment: commentId})
        return res.status(200).json(new ApiResponse(true, "Comment liked successfully"))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const like = await Like.findOne({user: req.user._id, tweet: tweetId})
    if (like) {
        // If like exists, remove it (unlike)
        await like.remove()
        return res.status(200).json(new ApiResponse(true, "Tweet unliked successfully"))
    } else {
        // If like does not exist, create it (like)
        await Like.create({user: req.user._id, tweet: tweetId})
        return res.status(200).json(new ApiResponse(true, "Tweet liked successfully"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.find({user: req.user._id, video: {$exists: true}}).populate("video")
    const videos = likedVideos.map(like => like.video)

    return res.status(200)
    .json(new ApiResponse(
        200,
        "Liked videos retrieved successfully",
        videos
    ))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}