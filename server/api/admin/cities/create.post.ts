
import prisma  from '../../../utils/prisma' 
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event)

  try {
    
  
    const existingCity = await prisma.city.findUnique({ where: { name } })

    if (existingCity) {
      throw createError({
        statusCode: 400,
        statusMessage: 'City already exists'
      })
    }

    const city = await prisma.city.create({ data: { name } })

    return {
      success: true,
      city: {
        id: city.id,
        name: city.name
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create city'
    })
  }
})
