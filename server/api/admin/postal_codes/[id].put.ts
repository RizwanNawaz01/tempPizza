
import prisma  from '../../../utils/prisma' 
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  try {
    const body = await readBody(event)
    const { name, city } = body

    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'Name is required' })
    }

      
    const updatedPostalCode = await prisma.postalCode.update({
      where: { id },
      data: {
        name,
        ...(city && {
          cities: {
            set: [{ id: Number(city) }], // replaces previous city connection
          },
        }),
      },
      include: {
        cities: true,
      },
    })

    return {
      success: true,
      postalCode: {
        id: updatedPostalCode.id,
        name: updatedPostalCode.name,
        cities: updatedPostalCode.cities.map((c) => ({
          id: c.id,
          name: c.name,
        })),
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update postal code',
    })
  }
})