// server/api/auth/orders.post.ts
import { readBody, createError } from 'h3'
import prisma  from '../../../utils/prisma' 

export default defineEventHandler(async (event) => {
  try {
    // Read request body
    const body = await readBody(event)

      
    // Destructure known fields, the rest goes to customerFields
    const { userId, items, totalPrice, deliveryType, ...customerFields } = body

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No items provided' })
    }

    // Generate unique order code
    const generateOrderCode = () => {
      const random = Math.floor(1000 + Math.random() * 9000) // 4-digit random number
      return `ORD-${Date.now()}-${random}`
    }
 
       const orderData = {
      userId: userId || null,
      customerInfo: customerFields, // JSON column
      items,                  // JSON column
      totalPrice: totalPrice || 0,
      deliveryType: deliveryType || 'lieferung',
      status: 'pending',
      orderCode: generateOrderCode(), // ALWAYS pass this explicitly
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Optional: log to verify orderData

    // Create order in database
    const order = await prisma.order.create({
      data: orderData
    })

    return {
      message: 'Order created successfully',
      order
    }
  } catch (error: any) {
    // If it's a known error, pass status code, otherwise default to 500
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }
})
