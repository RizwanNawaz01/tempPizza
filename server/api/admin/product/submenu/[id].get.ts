import prisma from '../../../../utils/prisma'  


export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })

  try {
    
      
    const submenu = await prisma.subMenu.findUnique({ where: { id } })
    if (!submenu) throw createError({ statusCode: 404, statusMessage: 'SubMenu not found' })
    return submenu
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch submenu',
    })
  }
})
