import prisma  from '../../utils/prisma' 

export default defineEventHandler(async () => {
  try {
    
      
    // Get all necessary counts
    const [
      totalOrders,
      successOrders,
      pendingOrders,
      cancelledOrders,
      totalProducts,
      totalCategories,
      totalUsers,
      totalEarnings
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'completed' } }),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'cancelled' } }),
      prisma.product.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
      }),
    ])

    return {
      totalOrders,
      successOrders,
      pendingOrders,
      cancelledOrders,
      totalProducts,
      totalCategories,
      totalUsers,
      totalEarnings: totalEarnings._sum.totalPrice || 0,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load dashboard stats',
    })
  }
})
