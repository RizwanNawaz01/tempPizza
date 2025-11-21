import prisma  from '../../utils/prisma' 

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid slug' })
  }

  try {
    
      
    const page = await prisma.page.findUnique({
      where: { slug },
    })

    if (!page) {
      throw createError({ statusCode: 404, statusMessage: 'Page not found' })
    }

    return page
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch page',
    })
  }
})
