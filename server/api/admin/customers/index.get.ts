
import prisma  from '../../../utils/prisma' 

export default defineEventHandler(async () => {
  try {
    
  
    // Fetch all customers with their category
    const customers = await prisma.user.findMany({
      
      orderBy: {
        createdAt: 'desc',
      },
    })

    return customers
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch customers',
    })
  }
})
