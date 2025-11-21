
import prisma  from '../../../utils/prisma' 


export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid Slider ID' })

  try {
    
      
    await prisma.slider.delete({
      where: { id },
    })
    return { message: 'Slider deleted successfully' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to delete Slider',
    })
  }
})
