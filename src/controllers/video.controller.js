import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from 'mongoose';


// upload video
const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];
    
    console.log("Received video file:", videoFile);
    console.log("Received thumbnail file:", thumbnailFile);
    
    if (!videoFile) {
        throw new ApiError(400, "Video file is required");
    }
    
    if (!thumbnailFile) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    // Upload video to Cloudinary
    const videoUploadResult = await uploadOnCloudinary(videoFile.path, "videos");
    if (!videoUploadResult || !videoUploadResult.secure_url) {
        throw new ApiError(500, "Failed to upload video");
    }

    // Upload thumbnail to Cloudinary
    const thumbnailUploadResult = await uploadOnCloudinary(thumbnailFile.path, "thumbnails");
    if (!thumbnailUploadResult || !thumbnailUploadResult.secure_url) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    // Extract duration from video metadata or use default
    const duration = videoUploadResult.duration || 0;

    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoUploadResult.secure_url,
        thumbnail: thumbnailUploadResult.secure_url,
        duration: duration,
        owner: req.user._id,
        isPublished: true
    });

    console.log("New video created:", newVideo);

    return res.status(201)
    .json(new ApiResponse(
        201, 
        "Video uploaded successfully", 
        newVideo));
});

// get video by id and increment view count and add video id to user's watch history
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    // fetch video
    let video = await Video.findById(videoId).populate("owner", "username avatar");
    if (!video) throw new ApiError(404, "Video not found");

    if (req.user) {
        // add to user's watch history
        await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { watchhistory: video._id } },
            { new: true }
        );

        // add viewer id to video's viewers array (unique) and return updated doc
        video = await Video.findByIdAndUpdate(
            videoId,
            { $addToSet: { viewers: req.user._id } },
            { new: true }
        ).populate("owner", "username avatar");

        // compute unique viewers count and sync `views` field if needed
        const viewsCount = (video.viewers || []).length;
        if (video.views !== viewsCount) {
            video.views = viewsCount;
            await video.save();
        }
    } else {
        // anonymous: simple increment
        video.views += 1;
        await video.save();
        // refresh populated owner
        video = await Video.findById(videoId).populate("owner", "username avatar");
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        "Video retrieved successfully",
        video));
});


// get all videos of a owner
const getMyVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ owner: req.user._id });

    return res.status(200)
    .json(new ApiResponse(
        200, 
        "Videos retrieved successfully", 
        videos));
});
// update video details
const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
    const { title, description, isPublished } = req.body;
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description,
                isPublished
            }
        },
        { new: true }
    );

    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    return res.status(200)
    .json(new ApiResponse(
        200, 
        "Video updated successfully", 
        video));
});



export { 
    uploadVideo,
    getMyVideos,
    updateVideoDetails,
    getVideoById
 };