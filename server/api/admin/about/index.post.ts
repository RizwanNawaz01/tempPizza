
import prisma  from '../../../utils/prisma' 

import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  
  
  const form = await readMultipartFormData(event)

  const title = form.find(f => f.name === 'title')?.data.toString() || ''
  const description = form.find(f => f.name === 'description')?.data.toString() || ''
  const servicesRaw = form.find(f => f.name === 'services')?.data.toString() || '[]'
  const address = form.find(f => f.name === 'address')?.data.toString() || ''
  const contact = form.find(f => f.name === 'contact')?.data.toString() || ''
  const services = JSON.parse(servicesRaw)

  // Handle image upload
  let imagePath: string | null = null
  const imageFile = form.find(f => f.name === 'image')
  if (imageFile) {
    const uploadDir = path.resolve('./public/uploads/about')
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
    const fileName = `${Date.now()}_${imageFile.filename}`
    const filePath = path.join(uploadDir, fileName)
    fs.writeFileSync(filePath, imageFile.data)
    imagePath = `/uploads/about/${fileName}`
  }

  // Check if About record exists
  let about = await prisma.about.findFirst()
  if (!about) {
    // create
    about = await prisma.about.create({
      data: {
        title,
        description,
        services,
        address,
        contact,
        image: imagePath || undefined
      }
    })
  } else {
    // update
    about = await prisma.about.update({
      where: { id: about.id },
      data: {
        title,
        description,
        services,
        address,
        contact,
        ...(imagePath && { image: imagePath })
      }
    })
  }

  return { success: true, about }
})
