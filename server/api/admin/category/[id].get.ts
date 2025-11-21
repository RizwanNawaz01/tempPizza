// server/api/admin/category/[id].get.ts

import prisma  from '../../../utils/prisma'


export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })

  try {
    
  
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) throw createError({ statusCode: 404, statusMessage: 'Category not found' })
    return category
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch category',
    })
  }
})
