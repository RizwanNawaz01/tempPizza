import { readMultipartFormData, createError } from 'h3'
import fs from 'fs'
import path from 'path'

import prisma  from '../../../utils/prisma' 

export default defineEventHandler(async (event) => {
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


      
    // Handle file
    const fileField = formData.find(f => f.filename)
    let imagePath = null
    if (fileField && fileField.filename && fileField.data) {
      const publicDir = path.resolve('./public/images/dishes')
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

      const fileName = `${Date.now()}_${fileField.filename}`
      const filePath = path.join(publicDir, fileName)
      fs.writeFileSync(filePath, fileField.data)
      imagePath = `/images/dishes/${fileName}` // path to save in DB
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        priceDelivery,
        pricePickup,
        categoryId,
        image: imagePath,
        subMenu,
        isHighlighted:isHighlighted
      }
    })

    return product

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
