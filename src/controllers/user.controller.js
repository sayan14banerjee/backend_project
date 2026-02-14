import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';

const genarateAccessAndRefreshTokens = async (userId) => {
    try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
     
    // save refresh token in db
    user.refreshtoken = refreshToken;
    await user.save({validateBeforeSave: false});

    return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new ApiError(500, "Failed to generate tokens");
    }
}


const registerUser = asyncHandler(async (req, res) => {
    // get user data from frontend and normalize common variants
    const raw = req.body || {};
    console.log(raw);
    const fullName = raw.fullName ?? raw.fullname ?? "";
    const email = raw.email ?? "";
    const username = raw.username ?? raw.usename ?? "";
    const password = raw.password ?? "";

    // validation - not empty
    if (
        [fullName, email, username, password].some((field) =>
            (field ?? "").toString().trim() === ""
        )
    ) {
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
    console.log("Avatar uploaded to Cloudinary:", avatar.url);
    console.log("Cover image uploaded to Cloudinary:", coverImage?.url);
    // create user object - create entry db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: (username ?? "").toLowerCase(),
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

const loginUser = asyncHandler(async (req, res) => {
    // get data from frontend
    console.log(req.body);
    const {email, username, password} = req.body
    // validation user name, email
    if (!email || !username) {
        throw new ApiError(400, "Email or username is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    // check if user exists
    const user = await User.findOne({
        $or: [{email}, {username}]
    })
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // check if password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // generate access token and refresh token
    const { accessToken, refreshToken } = await genarateAccessAndRefreshTokens(user._id);

    // send coockies with refresh token, set httpOnly and secure flags
    const logUser = await User.findById(user._id).select("-password -refreshtoken");

    const options = {
        httpOnly: true,
        secure: true, // Set to true in production (requires HTTPS)
    }
    // return response to frontend with access token and refress token and user data except password and refresh token
    return res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse( 
        200, 
        {user: logUser, 
            accessToken, 
            refreshToken},
        "User logged in successfully" 
    ) 
);

});

const logoutUser = asyncHandler(async (req, res) => {
    // get user id from auth middleware
    const userId = req.user._id;
    // find user in db and remove refresh token
    await User.findByIdAndUpdate(
        userId, 
        { $set: 
            { refreshtoken: undefined } 
        }, 
        { 
            new: true 
        }
    );

    // clear cookies
    const options = {
        httpOnly: true,
        secure: true, // Set to true in production (requires HTTPS)
    }

    return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse
        (200, null, "User logged out successfully")
    );

});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // get refresh token from cookies
    const incommingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken || req.headers("Authorization")?.replace("Bearer ", "");
    if (!incommingRefreshToken) {
        throw new ApiError(401, "Unauthorized: No refresh token provided");
    }
    // verify refresh token
    try {
        const decoded = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        // check if refresh token is valid and exists in db
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshtoken !== incommingRefreshToken) {
            throw new ApiError(401, "Unauthorized: Invalid refresh token");
        }

        if (incommingRefreshToken !== user.refreshtoken) {
        throw new ApiError(401, "Unauthorized: Refresh token mismatch");
        }
        // generate new access token
        const options = {
            httpOnly: true,
            secure: true, // Set to true in production (requires HTTPS)
        }
        const { accessToken, refreshToken } = await genarateAccessAndRefreshTokens(user._id);
        
        // return new access token to frontend
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200, 
            { accessToken, refreshToken }, 
            "Access token refreshed successfully"
        ));

    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized: Invalid refresh token");
    }
});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
    // get user id from auth middleware
    const {oldPassword, newPassword} = req.body;
    const userId = req.user._id;
        // validation
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }
    // find user in db
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    // check if old password is correct
    const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isOldPasswordValid) {
        throw new ApiError(401, "Invalid old password");
    }
    // update password
    user.password = newPassword;
    await user.save({validateBeforeSave: true});

    // return response to frontend
    return res.status(200).json(new ApiResponse(
        200, 
        null, 
        "Password changed successfully"
    ));

});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        {user: req.user}, 
        "Current user fetched successfully"
    ));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "Full name and email are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { 
            $set: {
                fullName,
                email: email
            }
        },
        { new: true,}
    ).select("-password -refreshtoken")
    
    return res.status(200)
    .json(new ApiResponse(
        200,
        user,
        "Account details updated successfully"
    ));

});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { 
            $set: {
                avatar: avatar.url
            }
        },
        { new: true,}
    ).select("-password -refreshtoken")

    return res.status(200)
    .json(new ApiResponse(
        200,
        user,
        "Avatar updated successfully"
    ));

});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path; 
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is required");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage) {
        throw new ApiError(500, "Failed to upload cover image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password -refreshtoken");
    
    return res.status(200)
    .json(new ApiResponse(
        200,
        user,
        "Cover image updated successfully"
    ));

});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage

};