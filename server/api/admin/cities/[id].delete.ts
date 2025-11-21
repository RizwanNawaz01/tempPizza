
import prisma  from '../../../utils/prisma' 


export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid city ID' })

  try {
    
  
    await prisma.city.delete({
      where: { id },
    })
    return { message: 'City deleted successfully' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to delete city',
    })
  }
})
