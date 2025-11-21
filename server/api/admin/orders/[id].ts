import { readBody, createError } from 'h3'
import prisma  from '../../../utils/prisma' 

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params
    const orderId = parseInt(id, 10)
    if (isNaN(orderId)) throw createError({ statusCode: 400, statusMessage: 'Invalid Order ID' })

    const method = event.req.method?.toUpperCase()

      
    if (method === 'GET') {
      
      const order = await prisma.order.findUnique({ where: { id: orderId } })
      if (!order) throw createError({ statusCode: 404, statusMessage: 'Order not found' })
      return { order }
    }

    if (method === 'PATCH' || method === 'PUT') {
      const body = await readBody(event)
      const { status } = body

      if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid status value' })
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status }
      })

      return { message: 'Order updated successfully', order: updatedOrder }
    }

    throw createError({ statusCode: 405, statusMessage: `Method ${method} not allowed` })
  } catch (err: any) {
    throw createError({ statusCode: err.statusCode || 500, statusMessage: err.message })
  }
})
