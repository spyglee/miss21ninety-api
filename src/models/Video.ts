import { model, Schema } from "mongoose";
import { z } from "zod";

export interface IVideo {
  _id: Schema.Types.ObjectId
  title: string
  description: string
  createdAt: Date
  videoName: string
}

const videoSchema = new Schema<IVideo>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  videoName: {
    type: String,
    required: true,
  },
})

export const videoUpload = z.object({
  title: z.string(),
  description: z.string(),
  videoName: z.string(),
})

export type videoUploadSchema = z.infer<typeof videoUpload>

export const Video = model<IVideo>('Video', videoSchema)