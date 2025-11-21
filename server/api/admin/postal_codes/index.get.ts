
import prisma  from '../../../utils/prisma' 
import { defineEventHandler, createError } from 'h3'


export default defineEventHandler(async (event) => {
  try {

    const query = getQuery(event)
    const city = query.city ? String(query.city) : null
  

       // Build condition (optional filter)
    const where = city
      ? { cities: { some: { name: city } } }
      : {}

      
    const postalCodes = await prisma.postalCode.findMany({
       where,
      include: {
        cities: true, // include related cities
      },
      orderBy: {
        id: 'desc',
      },
    })

    // Transform structure to match your table (postalCode.city.name)
    const formatted = postalCodes.map(p => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      city: p.cities[0] ? { id: p.cities[0].id, name: p.cities[0].name } : { id: null, name: '-' },
    }))

    return formatted
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch postal codes',
    })
  }
})