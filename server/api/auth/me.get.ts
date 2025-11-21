import prisma  from '../../utils/prisma' 

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }
  
  const decoded = verifyToken(token)
  
  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
  
      
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      street: true,
      city: true,
      userType: true,
      postalCode: true,
      createdAt: true
    }
  })
  
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }
  
  return {
    success: true,
    data: { user }
  }
})