import { Router } from "express";
import {
    uploadVideo,
    getMyVideos,
    updateVideoDetails,
    getVideoById
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
.route("/upload")
.post(
    verifyJWT, 
    upload.fields([
        {
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        }
    ]), 
    uploadVideo
);
router.route("/my-videos").get(verifyJWT, getMyVideos);
router.route("/get-video/:videoId").get(verifyJWT,getVideoById);
router.route("/update-video-details/:videoId").patch(verifyJWT, updateVideoDetails);
// router.route("/:videoId").delete(verifyJWT, deleteVideo);

export default router;

