import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const subscription = await Subscription.findOne({subscriber: req.user._id, channel: channelId})
    if (subscription) {
        // If subscription exists, remove it (unsubscribe)
        await subscription.remove()
        return res.status(200).json(new ApiResponse(true, "Unsubscribed successfully"))
    } else {
        // If subscription does not exist, create it (subscribe)
        await Subscription.create({subscriber: req.user._id, channel: channelId})
        return res.status(200).json(new ApiResponse(true, "Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscribers = await Subscription.find({channel: channelId}).populate("subscriber")
    return res.status(200).json(new ApiResponse(200, "Subscriber list retrieved successfully", subscribers))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const channels = await Subscription.find({subscriber: subscriberId}).populate("channel")
    return res.status(200).json(new ApiResponse(200, "Subscribed channels retrieved successfully", channels))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}