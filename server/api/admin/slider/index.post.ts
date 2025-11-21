// server/api/admin/slider.post.ts
import { readMultipartFormData, createError } from 'h3'
import fs from 'fs'
import path from 'path'
import prisma  from '../../../utils/prisma' 

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)

    // Extract fields
    const title = formData.find(f => f.name === 'title')?.data?.toString() || ''
    const subtitle = formData.find(f => f.name === 'subtitle')?.data?.toString() || ''
    const gradident = formData.find(f => f.name === 'gradident')?.data?.toString() || ''
    const smallTitle = formData.find(f => f.name === 'smallTitle')?.data?.toString() || ''
    const linkName = formData.find(f => f.name === 'linkName')?.data?.toString() || ''
    const smallSubtitle = formData.find(f => f.name === 'smallSubtitle')?.data?.toString() || ''
    const link = formData.find(f => f.name === 'link')?.data?.toString() || null
    const order = parseInt(formData.find(f => f.name === 'order')?.data?.toString() || '0')
    const isActive = formData.find(f => f.name === 'isActive')?.data?.toString() === 'true'

      
    // Handle file
    const fileField = formData.find(f => f.filename)
    let imagePath = null
    if (fileField && fileField.filename && fileField.data) {
      const publicDir = path.resolve('./public/images/sliders')
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

      const fileName = `${Date.now()}_${fileField.filename}`
      const filePath = path.join(publicDir, fileName)
      fs.writeFileSync(filePath, fileField.data)
      imagePath = `/images/sliders/${fileName}` // path to save in DB
    }

    // Save to DB
    const slider = await prisma.slider.create({
      data: {
        title,
        subtitle,
        gradident,
        smallTitle,
        linkName,
        smallSubtitle,
        link,
        order,
        isActive,
        image: imagePath
      }
    })

    return slider

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
