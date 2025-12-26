import type { CollectionConfig } from 'payload'
import { cloudinary } from '../payload.config'
import fs from 'fs'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    disableLocalStorage: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'full',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  hooks: {
    afterRead: [
      async ({ doc }) => {
        // CRITICAL: PayloadCMS transforms URL to /api/media/file even with disableLocalStorage
        // We need to restore the original Cloudinary URL
        if (doc.cloudinary_id && doc.url && doc.url.includes('cloudinary.com')) {
          // URL is already correct Cloudinary URL, keep it
          return doc
        } else if (doc.cloudinary_id) {
          // URL was transformed, we need to restore it from cloudinary_id
          // This should not happen if our beforeChange hook worked, but just in case
          console.warn('Media URL was transformed, this should not happen:', doc.filename)
        }
        return doc
      },
    ],
    beforeChange: [
      async ({ data, req, operation }) => {
        // console.log('🔍 [Media Hook] beforeChange triggered')
        // console.log('📋 Operation:', operation)
        // console.log('📁 req.file:', req.file ? 'EXISTS' : 'NOT FOUND')

        // Check Cloudinary credentials
        const hasCloudinary = !!(
          process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET
        )

        // console.log('☁️  Cloudinary configured:', hasCloudinary)
        // console.log('🔑 CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET')

        if (!hasCloudinary) {
          console.error('❌ Cloudinary credentials not found in environment variables')
          console.error(
            '💡 Make sure to set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env',
          )
          return data
        }

        // On create, upload file to Cloudinary
        if (operation === 'create' && req.file) {
          try {
            // console.log('📤 Starting Cloudinary upload...')
            // console.log('📝 File details:', {
            //   tempFilePath: req.file.tempFilePath,
            //   name: req.file.name,
            //   size: req.file.size,
            //   mimetype: req.file.mimetype,
            //   hasBuffer: !!req.file.data,
            // })

            // PayloadCMS stores file in memory as buffer (req.file.data)
            // We need to convert buffer to base64 data URI for Cloudinary
            let uploadSource: string

            if (req.file.tempFilePath && req.file.tempFilePath.trim() !== '') {
              // Use file path if available
              uploadSource = req.file.tempFilePath
              // console.log('� Uploading from temp file:', uploadSource)
            } else if (req.file.data) {
              // Convert buffer to base64 data URI
              const base64Data = req.file.data.toString('base64')
              uploadSource = `data:${req.file.mimetype};base64,${base64Data}`
              // console.log('🚀 Uploading from memory buffer (size:', req.file.size, 'bytes)')
            } else {
              console.error('❌ No file data available for upload')
              console.error('🔍 Available req.file keys:', Object.keys(req.file))
              throw new Error('No file data available')
            }

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(uploadSource, {
              folder: 'kebaya-bali/media',
              resource_type: 'auto',
              overwrite: false,
              unique_filename: true,
              public_id: req.file.name.replace(/\.[^/.]+$/, ''), // Use original filename without extension
            })

            // console.log('✅ Cloudinary upload successful!')
            // console.log('🌐 URL:', result.secure_url)
            // console.log('🆔 Public ID:', result.public_id)

            // Update data with Cloudinary URL
            data.url = result.secure_url
            data.cloudinary_id = result.public_id
            data.filename = result.public_id

            // IMPORTANT: Store Cloudinary URL in separate field
            // PayloadCMS transforms 'url' field, but won't touch custom fields
            data.cloudinary_url = result.secure_url

            // console.log('💾 Updated data.url to:', data.url)

            // Clean up temp file if it exists
            if (req.file.tempFilePath && fs.existsSync(req.file.tempFilePath)) {
              fs.unlinkSync(req.file.tempFilePath)
              // console.log('🗑️  Cleaned up temp file')
            }
          } catch (error) {
            console.error('❌ Cloudinary upload error:', error)
            console.error('📊 Error details:', JSON.stringify(error, null, 2))
            // Fall back will happen automatically since we don't have staticDir
            throw error // Re-throw to prevent save with incomplete data
          }
        }

        return data
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        // Only attempt Cloudinary deletion if configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !doc.cloudinary_id) {
          return
        }

        try {
          await cloudinary.uploader.destroy(doc.cloudinary_id)
        } catch (error) {
          console.error('Cloudinary delete error:', error)
        }
      },
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text (Untuk SEO)',
      required: true,
    },
    {
      name: 'cloudinary_id',
      type: 'text',
      admin: {
        hidden: true, // Hide from admin UI
      },
    },
    {
      name: 'cloudinary_url',
      type: 'text',
      label: 'Cloudinary URL',
      admin: {
        readOnly: true, // Read-only, populated by hook
        description: 'Direct Cloudinary URL (auto-populated)',
      },
    },
  ],
}
