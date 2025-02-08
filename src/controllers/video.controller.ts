import { Request, Response } from 'express';
import { Video, videoUploadSchema } from '../models/Video';
import { Upload } from '@aws-sdk/lib-storage';
import { PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { verifyToken } from '../helpers/verifyToken';
import fs from 'fs';
import { createReadableVideo } from '../helpers/createReadableVideo';

const s3 = new S3({
  region: process.env.AWS_REGION!
});

export class VideoController {
  static async getVideos(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!verifyToken(token)) {
        res.status(401).json({ message: 'Unauthorized' });
        return
      }
      const videos = await Video.find();
      res.status(200).json({ videos });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting videos' });
    }
  }

  static async getVideoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization?.split(' ')[1];
      if (!verifyToken(token)) {
        res.status(401).json({ message: 'Unauthorized' });
        return
      }
      const video = await Video.findById(id);

      if (!video) {
        res.status(404).json({ message: 'Video not found' });
        return
      }

      const videoUrl = await createReadableVideo(video.videoName);

      console.log(videoUrl);

      res.status(200).json({ title: video.title, description: video.description, videoUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting video' });
    }
  }

  static async uploadVideo(req: Request<{}, {}, videoUploadSchema>, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!verifyToken(token)) {
        res.status(401).json({ message: 'Unauthorized' });
        return
      }

      const file = req.file;
      
      if (!file) {
          res.status(400).json({ message: 'No file uploaded' });
          return
      }

      const uploadParams: PutObjectCommandInput = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype
      };

      fs.rmdir('../../uploads/', () => {
        console.log('File deleted');
      })
      
      const result = await new Upload({
          client: s3,
          params: uploadParams
      }).done();
      res.status(200).json({ message: 'Video uploaded successfully', videoName: file.originalname });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading video' });
    }
  }

  static async createVideo(req: Request<{}, {}, videoUploadSchema>, res: Response) {
    try {
      const { title, description, videoName } = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      if (!verifyToken(token)) {
        res.status(401).json({ message: 'Unauthorized' });
        return
      }

      const video = await Video.create({ title, description, videoName });

      res.status(200).json({ message: 'Video created successfully', video });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating video' });
    }
  }
}