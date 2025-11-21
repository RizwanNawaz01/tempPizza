
import prisma  from '../../../utils/prisma' 


export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { name } = body
   
  
  try {
    
  
    // Check if user exists
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    })
    
    if (existingCategory) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists'
      })
    }
    
    // Create user
    const category = await prisma.category.create({
      data: {
        name
      }
    })
    
    // Generate token and set cookie 
     
    
    return {
      success: true,
      user: {
        id: category.id,
        name: category.name,
      }
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Registration failed'
    })
  }
})