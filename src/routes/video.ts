import { Router } from 'express';
import { VideoController } from '../controllers/video.controller';
import upload from '../middleware/upload';
import { videoUpload } from '../models/Video';
import validateRequest from '../middleware/validateRequest';

const router = Router();

router.get('/', (req, res) => {
    return VideoController.getVideos(req, res)
})

router.get('/:id', (req, res) => {
    return VideoController.getVideoById(req, res)
})

router.post('/upload', upload.single('file'), (req, res) => {
    return VideoController.uploadVideo(req, res)
})

router.post('/create', validateRequest(videoUpload), (req, res) => {
    console.log(req.body)
    return VideoController.createVideo(req, res)
})



export default router;