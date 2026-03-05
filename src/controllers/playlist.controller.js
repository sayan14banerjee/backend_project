import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    return res.status(201).json(new ApiResponse(
        201,
        "Playlist created successfully",
        playlist
    ))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    const playlists = await Playlist.find({owner: userId})
    
    return res.status(200).json(new ApiResponse(
        200,
        "User playlists retrieved successfully",
        playlists
    ))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(playlistId).populate("videos")
    
    if (!playlist) {
        return res.status(404).json(new ApiResponse(
            404,
            "Playlist not found"
        ))
    }

    return res.status(200).json(new ApiResponse(
        200,
        "Playlist retrieved successfully",
        playlist
    ))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: add video to playlist
    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        return res.status(404).json(new ApiResponse(
            404,
            "Playlist not found"
        ))
    }

    if (playlist.videos.includes(videoId)) {
        return res.status(400).json(new ApiResponse(
            400,
            "Video already in playlist"
        ))
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res.status(200).json(new ApiResponse(
        200,
        "Video added to playlist successfully",
        playlist
    ))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const playlist = await Playlist.findById(playlistId)
    
    if (!playlist) {
        return res.status(404).json(new ApiResponse(
            404,
            "Playlist not found"
        ))
    }
    if (!playlist.videos.includes(videoId)) {
        return res.status(400).json(new ApiResponse(
            400,
            "Video not in playlist"
        ))
    }

    playlist.videos = playlist.videos.filter(id => id.toString() !== videoId)
    await playlist.save()

    return res.status(200).json(new ApiResponse(
        200,
        "Video removed from playlist successfully",
        playlist
    ))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        return res.status(404).json(new ApiResponse(
            404,
            "Playlist not found"
        ))
    }

    await Playlist.findByIdAndDelete(playlistId)
    
    return res.status(200).json(new ApiResponse(
        200,
        "Playlist deleted successfully",
        {}
    ))

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    const playlist = await Playlist.findById(playlistId)
    
    if (!playlist) {
        return res.status(404).json(new ApiResponse(
            404,
            "Playlist not found"
        ))
    }

    playlist.name = name || playlist.name
    playlist.description = description || playlist.description
    await playlist.save()

    return res.status(200).json(new ApiResponse(
        200,
        "Playlist updated successfully",
        playlist
    ))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
