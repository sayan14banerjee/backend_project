import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized: No token provided");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);

        const user = await User.findById(decoded.userId).select("-password -refreshToken")
        console.log(user);
        if (!user) {
            throw new ApiError(401, "Unauthorized: Invalid token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized: Invalid token");
    }
});
