import { readMultipartFormData, createError } from 'h3'

import prisma  from '../../../utils/prisma' 

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid page ID' })

  try {
    const formData = await readMultipartFormData(event)

    // Extract fields correctly
    const title = formData.find(f => f.name === 'title')?.data?.toString() || ''
    const content = formData.find(f => f.name === 'content')?.data?.toString() || ''
    const slug = formData.find(f => f.name === 'slug')?.data?.toString() || ''
    const metaTitle = formData.find(f => f.name === 'metaTitle')?.data?.toString() || '' 
    const metaDescription = formData.find(f => f.name === 'metaDescription')?.data?.toString() || ''  

      
    const updateData: any = {
      title,
      content,
      slug,
      metaTitle,
      metaDescription
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: updateData
    })

    return updatedPage

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
