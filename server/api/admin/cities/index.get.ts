
import prisma  from '../../../utils/prisma' 

export default defineEventHandler(async (event) => { 
   
  
  try {
    
  
    // Check if user exists
     const cities = await prisma.city.findMany({
        orderBy: { createdAt: 'asc' } // optional, newest first
      })
    return cities
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Registration failed'
    })
  }
})