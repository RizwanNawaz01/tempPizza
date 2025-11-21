// server/api/admin/product/[id].get.ts

import prisma  from '../../../utils/prisma' 


export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })

  try {
      
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
    return product
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch product',
    })
  }
})
