// server/api/admin/slider/[id].get.ts

import prisma  from '../../../utils/prisma' 


export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })

  try {
    
      
    const slider = await prisma.slider.findUnique({ where: { id } })
    if (!slider) throw createError({ statusCode: 404, statusMessage: 'Slider not found' })
    return slider
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch slider',
    })
  }
})
