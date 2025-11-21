
import prisma  from '../../../utils/prisma'


export default defineEventHandler(async () => {
  
  
  const about = await prisma.about.findFirst()
  return about || {}
})
