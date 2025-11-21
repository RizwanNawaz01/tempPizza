import { readMultipartFormData, createError } from 'h3'
import fs from 'fs'
import path from 'path'
import prisma  from '../../utils/prisma' 

export default defineEventHandler(async (event) => {
      
  // === GET: return current site settings ===
  if (event.method === 'GET') {
    const settings = await prisma.siteSettings.findFirst()
    return settings || null
  }

  // === POST: save site settings ===
  if (event.method === 'POST') {
    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) return null

    const body = {}
    let logoPath = null
    let faviconPath = null

    // Create public/images directory if missing
    const publicDir = path.resolve('./public/images/')
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

    // === Handle uploaded files ===
    const logoFile = formData.find(f => f.name === 'logo' && f.filename)
    const faviconFile = formData.find(f => f.name === 'favicon' && f.filename)

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/x-icon', 'image/svg+xml']

    if (logoFile) {
      if (!allowedTypes.includes(logoFile.type)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid logo file type' })
      }
      const fileName = `${Date.now()}_logo_${logoFile.filename}`
      const filePath = path.join(publicDir, fileName)
      fs.writeFileSync(filePath, logoFile.data)
      logoPath = `/images/${fileName}`
    }

    if (faviconFile) {
      if (!allowedTypes.includes(faviconFile.type)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid favicon file type' })
      }
      const fileName = `${Date.now()}_favicon_${faviconFile.filename}`
      const filePath = path.join(publicDir, fileName)
      fs.writeFileSync(filePath, faviconFile.data)
      faviconPath = `/images/${fileName}`
    }

    // === Extract non-file fields ===
    formData.forEach(f => {
      if (!f.filename){
        body[f.name] = f.data?.toString('utf8') || ''
      }
    })

 
    // === Parse JSON fields (services, openingHours) ===
    
    try {
      if (typeof body.services === 'string') {
        body.services = JSON.parse(body.services)
      } else if (!Array.isArray(body.services)) {
        body.services = []
      }

      if (typeof body.openingHours === 'string') {
        body.openingHours = JSON.parse(body.openingHours)
      } else if (!Array.isArray(body.openingHours)) {
        body.openingHours = []
      }
    } catch (e) {
      console.error('Invalid JSON fields in settings:', e)
      body.services = []
      body.openingHours = []
    }

    // === Perform upsert ===
    try {
      const updated = await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: {
          siteName: body.siteName || undefined,
          title: body.title || undefined,
          description: body.description || undefined,
          metaTitle: body.metaTitle || body.title || undefined,
          metaDescription: body.metaDescription || body.description || undefined,
          services: body.services || undefined,
          address: body.address || undefined,
          contact: body.contact || undefined,
          currency: body.currancy || undefined,
          order_outside_time: body.order_outside_time || undefined,
          minOrder: body.minOrder ? Number(body.minOrder) : undefined,
          openingHours: body.openingHours || undefined,
          ...(logoPath ? { logo: logoPath } : {}),
          ...(faviconPath ? { favicon: faviconPath } : {}),
        },
        create: {
          siteName: body.siteName || '',
          title: body.title || '',
          description: body.description || '',
          metaTitle: body.metaTitle || body.title || '',
          metaDescription: body.metaDescription || body.description || '',
          services: body.services || [],
          address: body.address || '',
          contact: body.contact || '',
          minOrder: Number(body.minOrder) || 0,
          openingHours: body.openingHours || [],
          logo: logoPath || '',
          currency: body.currancy || '',
          order_outside_time: body.order_outside_time || '',
          favicon: faviconPath || '',
        },
      })

      return updated
    } catch (err) {
      console.error('Database update error:', err)
      throw createError({ statusCode: 500, statusMessage: 'Failed to save settings' })
    }
  }

  return null
})
