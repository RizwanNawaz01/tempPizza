import { readMultipartFormData, createError } from 'h3'
import fs from 'fs'
import path from 'path'

import prisma  from '../../../utils/prisma' 

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid product ID' })

  try {
    const formData = await readMultipartFormData(event)

    // Extract fields
    const name = formData.find(f => f.name === 'name')?.data?.toString() || ''
    const description = formData.find(f => f.name === 'description')?.data?.toString() || ''
    const priceDelivery = parseFloat(formData.find(f => f.name === 'price_delivery')?.data?.toString() || '0')
    const pricePickup = parseFloat(formData.find(f => f.name === 'price_pickup')?.data?.toString() || '0')
    const categoryId = parseInt(formData.find(f => f.name === 'category')?.data?.toString() || '0')
    const subMenu = JSON.parse(formData.find(f => f.name === 'subMenu')?.data?.toString() || '[]')
    const isHighlighted = formData.find(f => f.name === 'isHighlighted')?.data?.toString() === 'true'

      

    // Handle file (if uploaded)
    const fileField = formData.find(f => f.filename)
    let imagePath: string | undefined = undefined
    if (fileField && fileField.filename && fileField.data) {
      const publicDir = path.resolve('./public/images/dishes')
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

      const fileName = `${Date.now()}_${fileField.filename}`
      const filePath = path.join(publicDir, fileName)
      fs.writeFileSync(filePath, fileField.data)
      imagePath = `/images/dishes/${fileName}` // path to save in DB
    }

    // Prepare update data
    const updateData: any = {
      name,
      description,
      priceDelivery,
      pricePickup,
      categoryId,
      subMenu,
      isHighlighted:isHighlighted
    }
    if (imagePath) updateData.image = imagePath // only update image if new file uploaded

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    })

    return updatedProduct

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
