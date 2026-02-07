import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    // get user data from frontend
    const {fullName, email, username, password} = req.body;
    console.log(req.body);
    // validation - not empty
    if (
        [fullName, email, username, password].some((field) => 
            field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }
    // check if user already exists : username, email
    const existingUser = await User.findOne({
        $or: [{email}, {username}]
    });

    if (existingUser) {
        console.log(existingUser);
        throw new ApiError(409, "User with this email or username already exists");
    }
    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // upload image to cloudinary, check avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;
    
    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar image");
    }
    
    // create user object - create entry db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    });
    
    // remove password and refress token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // check for user creation 
    if (!createdUser) {
        console.log(createdUser);
        throw new ApiError(500, "Failed to create user");
    }
    // return response to frontend
    return res.status(201).json(
        new ApiResponse(
            201, 
            createdUser, 
            "User registered successfully"));
});

export {registerUser};