import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String, //cloudnary public_id
        required: true,
    },
    coverImage:{
        type: String, //cloudnary public_id
    },
    watchhistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    }],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshtoken: {
        type: String,
    }
}, { timestamps: true });

userSchema.pre("save", async function (){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
            userId: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName
         },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { userId: this._id },   
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
}

export const User = mongoose.model("User", userSchema);