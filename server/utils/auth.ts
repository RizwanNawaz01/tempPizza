import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const config = useRuntimeConfig()

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 12)
}

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(password, hashedPassword)
}

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' })
}

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch (error) {
    return null
  }
}