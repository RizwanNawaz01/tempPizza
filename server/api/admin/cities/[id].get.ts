
import prisma  from '../../../utils/prisma' 


export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })

  try {
    
  
    const city = await prisma.city.findUnique({ where: { id } })
    if (!city) throw createError({ statusCode: 404, statusMessage: 'City not found' })
    return city
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch city',
    })
  }
})
