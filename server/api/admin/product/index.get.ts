
import prisma  from '../../../utils/prisma' 
export default defineEventHandler(async () => {
  try {
    
      
    // Fetch all products with their category
    const products = await prisma.product.findMany({
      include: {
        category: true, // include category name
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return products
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch products',
    })
  }
})
