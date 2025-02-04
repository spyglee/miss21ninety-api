import { Request, Response } from "express";
import { LoginSchema, RegisterSchema, UserModel } from "../models/User";
import bcrypt from 'bcryptjs'
import { generateToken } from "../helpers/generateTokens";
import validateTokenAndGetUser from "../helpers/verifyToken";

export class UserController {
  static async register(req: Request<{}, {}, RegisterSchema>, res: Response) {
    try {
      const { email, password, confirmPassword, name } = req.body

      const existingUser = await UserModel.findOne({ email })

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' })
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const user = await UserModel.create({ email, password: hashedPassword, name })

      const token = generateToken({ email, id: user._id })

      res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
        token
      })
    } catch(err) {
      console.error(err)
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

  static async login(req: Request<{}, {}, LoginSchema>, res: Response) {
    try {
      const { email, password } = req.body

      const user = await UserModel.findOne({ email })

      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid email or password' })
      }

      const token = generateToken({ email, id: user._id })

      res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
        token
      })
    } catch(err) {
      console.error(err)
      res.status(500).json({ error: 'Something went wrong' })
    }
  }

  static async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1]

      const user = await validateTokenAndGetUser(token)

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      res.json({
        _id: user._id,
        email: user.email,
        name: user.name
      })
    } catch(err) {
      console.error(err)
      res.status(500).json({ error: 'Something went wrong' })
    }
  }
}