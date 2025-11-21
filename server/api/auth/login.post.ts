import prisma  from '../../utils/prisma' 


export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { email, password } = body
  
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }
  
  try {
    
      
    // Find user by email with Prisma
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }
    
    // Verify password
    if (!verifyPassword(password, user.password)) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }
    
    // Generate JWT token
    const token = generateToken(user.id)
    
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Login failed'
    })
  }
})