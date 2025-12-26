import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  // access: {
  //   read: () => true,
  // },
  // fields: [
  //   {
  //     name: 'alt',
  //     type: 'text',
  //     required: true,
  //   },
  // ],
  // upload: true,

  upload: {
    staticDir: 'media', // Folder penyimpanan file
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
        height: 1024, // Rasio Portrait untuk kartu produk
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'], // Hanya boleh upload gambar
  },
  access: {
    read: () => true, // Semua orang (termasuk public) bisa lihat gambar
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text (Untuk SEO)',
      required: true,
    },
  ],
}
