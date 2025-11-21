import { createError } from 'h3'
import prisma  from '../../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    
      
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
      },
    })

    const formattedOrders = orders.map((order) => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
      customer: order.user
        ? `${order.user.firstName} ${order.user.lastName}`
        : order.guestName || 'Guest',
    }))

    return { orders: formattedOrders }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch orders',
    })
  }
})
