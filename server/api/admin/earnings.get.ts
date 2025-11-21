import prisma  from '../../utils/prisma' 
import { subDays, format } from 'date-fns'

export default defineEventHandler(async () => {
  try {
    const today = new Date()
    const sevenDaysAgo = subDays(today, 6)

      
    // Fetch all orders in the last 7 days (successful ones only)
    const orders = await prisma.order.findMany({
      where: {
        status: 'completed',
        createdAt: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
    })

    // Aggregate by day
    const dailyTotals: Record<string, number> = {}
    for (let i = 0; i < 7; i++) {
      const day = format(subDays(today, i), 'yyyy-MM-dd')
      dailyTotals[day] = 0
    }

    orders.forEach(order => {
      const day = format(order.createdAt, 'yyyy-MM-dd')
      if (dailyTotals[day] !== undefined) {
        dailyTotals[day] += order.totalPrice
      }
    })

    // Convert to array (for chart labels and data)
    const chartData = Object.entries(dailyTotals)
      .reverse()
      .map(([date, total]) => ({
        date,
        total,
      }))

    return chartData
  } catch (error) {
    console.error('Error fetching earnings chart data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch earnings data',
    })
  }
})
