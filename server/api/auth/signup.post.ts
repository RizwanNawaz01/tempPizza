// server/api/auth/signup.post.ts
import prisma  from '../../utils/prisma' 

import { hashPassword, generateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { email, password, firstName, lastName, phoneNumber, street, city, postalCode } = body
  
  // Validation
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }
  
  try {
    
      
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists'
      })
    }
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword(password),
        firstName,
        lastName,
        phoneNumber,
        street,
        city,
        postalCode
      }
    })
    
    // Generate token and set cookie
    const token = generateToken(user.id)
    
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Registration failed'
    })
  }
})