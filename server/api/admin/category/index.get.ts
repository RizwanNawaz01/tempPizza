
import prisma  from '../../../utils/prisma' 


export default defineEventHandler(async (event) => { 
   
  
  try {
    
  
    // Check if user exists
     const categories = await prisma.category.findMany({
        orderBy: { createdAt: 'asc' } // optional, newest first
      })
    return categories
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Registration failed'
    })
  }
})