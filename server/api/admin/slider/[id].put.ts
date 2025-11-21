import { readMultipartFormData, createError } from 'h3'
import fs from 'fs'
import path from 'path'

import prisma  from '../../../utils/prisma' 

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid slider ID' })

  try {
    const formData = await readMultipartFormData(event)

    const title = formData.find(f => f.name === 'title')?.data?.toString() || ''
    const subtitle = formData.find(f => f.name === 'subtitle')?.data?.toString() || ''
    const gradient = formData.find(f => f.name === 'gradient')?.data?.toString() || ''
    const smallTitle = formData.find(f => f.name === 'smallTitle')?.data?.toString() || ''
    const smallSubtitle = formData.find(f => f.name === 'smallSubtitle')?.data?.toString() || ''
    const link = formData.find(f => f.name === 'link')?.data?.toString() || ''  
    const linkName = formData.find(f => f.name === 'linkName')?.data?.toString() || ''
    const order = parseInt(formData.find(f => f.name === 'order')?.data?.toString() || '0')
    const isActive = formData.find(f => f.name === 'isActive')?.data?.toString() === 'true'

      
    // Handle file (if uploaded)
    const fileField = formData.find(f => f.filename)
    let imagePath: string | undefined
    if (fileField && fileField.filename && fileField.data) {
      const publicDir = path.resolve('./public/images/sliders')
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

      const fileName = `${Date.now()}_${fileField.filename}`
      const filePath = path.join(publicDir, fileName)
      fs.writeFileSync(filePath, fileField.data)
      imagePath = `/images/sliders/${fileName}`
    }

    const updateData: any = {
      title,
      subtitle,
      gradident: gradient,
      smallTitle,
      smallSubtitle,
      link,
      linkName,
      order,
      isActive
    }
    if (imagePath) updateData.image = imagePath

    const updatedSlider = await prisma.slider.update({
      where: { id },
      data: updateData
    })

    return updatedSlider

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
