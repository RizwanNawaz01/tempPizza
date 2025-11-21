
import prisma  from '../../../utils/prisma' 


export default defineEventHandler(async () => {
  try {
    
      
    // Fetch all products with their category
    const sliders = await prisma.slider.findMany({ 
      orderBy: {
        createdAt: 'desc',
      },
    })

    return sliders
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch slider',
    })
  }
})
