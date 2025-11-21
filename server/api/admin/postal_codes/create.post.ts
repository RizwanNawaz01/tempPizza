
import prisma  from '../../../utils/prisma' 
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { name, city } = await readBody(event) // 'city' is the selected city ID

  try {
    if (!name || !city) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and City are required.'
      })
    }

      
    // Check if postal code already exists
    const existingPostalCode = await prisma.postalCode.findUnique({
      where: { name },
    })

    if (existingPostalCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Postal Code already exists'
      })
    }

    // Create postal code and link to city
    const postalCode = await prisma.postalCode.create({
      data: {
        name,
        cities: {
          connect: { id: Number(city) } // link city via its ID
        }
      },
      include: {
        cities: true,
      }
    })

    return {
      success: true,
      postalCode: {
        id: postalCode.id,
        name: postalCode.name,
        cities: postalCode.cities.map(c => ({ id: c.id, name: c.name })),
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create postal code'
    })
  }
})
