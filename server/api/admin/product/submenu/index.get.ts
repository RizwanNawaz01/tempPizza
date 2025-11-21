import prisma from '../../../../utils/prisma'  


export default defineEventHandler(async (event) => { 
   
  
  try {
    
      
    // Check if user exists
     const submenus = await prisma.subMenu.findMany({
        orderBy: { createdAt: 'asc' } // optional, newest first
      })
    return submenus
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Registration failed'
    })
  }
})