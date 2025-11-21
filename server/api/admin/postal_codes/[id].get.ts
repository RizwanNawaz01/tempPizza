
import prisma  from '../../../utils/prisma' 
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  try {
    
      
    // ✅ Fetch postal code with all related cities
    const postalCode = await prisma.postalCode.findUnique({
      where: { id },
      include: { cities: true }, // many-to-many relation
    })

    if (!postalCode) {
      throw createError({ statusCode: 404, statusMessage: 'Postal Code not found' })
    }

    // ✅ Return clean structured response
    return {
      id: postalCode.id,
      name: postalCode.name,
      createdAt: postalCode.createdAt,
      updatedAt: postalCode.updatedAt,
      cities: postalCode.cities.map(city => ({
        id: city.id,
        name: city.name,
      })),
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch postal code',
    })
  }
})
