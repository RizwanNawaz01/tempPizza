import prisma from '../../../../utils/prisma'  

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { name,price } = body
  try {
    
      
    // Check if Sub Menu exists
    const existingSubMenu = await prisma.subMenu.findUnique({
      where: { name }
    })
    
    if (existingSubMenu) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Submenu already exists'
      })
    }
    
  // Create submenu
    const submenu = await prisma.subMenu.create({
      data: { name, price: parseFloat(price) }
    })
    
    return {
      success: true,
      user: {
        id: submenu.id,
        name: submenu.name,
        price: submenu.price
      }
    }
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Registration failed'
    })
  }
})