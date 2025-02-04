import jwt from 'jsonwebtoken'
import { IUser, UserModel } from '../models/User'

export const verifyToken = (token: string | undefined): string | jwt.JwtPayload => {
  try {
    if (!token) {
      return ''
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded
  } catch (error) {
    return 'error: ' + error
  }
}


export default async function validateTokenAndGetUser(token: string | undefined): Promise<IUser> {
  if (!token) {
    throw new Error('Invalid token')
  }

  const verifiedToken = verifyToken(token)

  if (typeof verifiedToken === 'string') {
    throw new Error('Invalid token')
  }

  const user = await UserModel.findById(verifiedToken.id.toString())

  if (!user) {
    throw new Error('User not found')
  }

  if (user.isActive === false) {
    throw new Error('User is not active')
  }

  return user
}
