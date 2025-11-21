import prisma  from '../../../utils/prisma' 
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const orderId = event.context.params.id

      
  if (!orderId) throw createError({ statusCode: 400, statusMessage: 'Order ID is required' })

  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
  })

  if (!order) throw createError({ statusCode: 404, statusMessage: 'Order not found' })

  // Merge customerInfo JSON into top-level fields for easier frontend access
  const customerData = order.customerInfo || {}
  const orderData = {
    ...order,
    customerName: customerData.firstName ? `${customerData.firstName} ${customerData.lastName}` : null,
    address: customerData.address,
    street: customerData.street,
    city: customerData.city,
    postalCode: customerData.postalCode,
    phoneNumber: customerData.phoneNumber,
    email: customerData.email
  }

  return { order: orderData }
})
