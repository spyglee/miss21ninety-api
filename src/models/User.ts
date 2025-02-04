import mongoose, { Schema } from 'mongoose'
import { z } from 'zod'

export interface IUser {
  _id: Schema.Types.ObjectId
  email: string
  password: string
  createdAt: Date
  name: string
  companyId: Schema.Types.ObjectId | null
  isActive: boolean
  deviceTokens: string[]
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
})

export const registerSchema = z.object({
  email: z.string().email('Invalid Email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
  name: z.string(),
})

export const loginSchema = z.object({ 
  email: z.string().email('Invalid Email'),
  password: z.string(),
})

export const UserModel = mongoose.model<IUser>('User', userSchema)

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>