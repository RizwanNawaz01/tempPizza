import { readMultipartFormData, createError } from 'h3'
import fs from 'fs'
import path from 'path'

import prisma  from '../../../utils/prisma' 

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)

    // Extract fields
    const title = formData.find(f => f.title === 'title')?.data?.toString() || ''
    const content = formData.find(f => f.name === 'content')?.data?.toString() || '' 
    const slug = formData.find(f => f.name === 'slug')?.data?.toString() || '' 
    const metaTitle = formData.find(f => f.name === 'metaTitle')?.data?.toString() || '' 
    const metaDescription = formData.find(f => f.name === 'metaDescription')?.data?.toString() || '' 

 
      

    const page = await prisma.page.create({
      data: {
        title,
        content,
        slug,
        metaTitle,
        metaDescription
      }
    })

    return page

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
