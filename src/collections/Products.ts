import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // --- Baris 1: Informasi Dasar ---
    {
      name: 'name',
      type: 'text',
      label: 'Nama Produk',
      required: true,
    },
    {
      type: 'row', // Biar Price & Category sebelahan
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Harga (IDR)',
          required: true,
          admin: {
            placeholder: 'Contoh: 150000',
          },
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          label: 'Kategori',
          required: true,
        },
      ],
    },

    // --- Baris 2: Visual (Gallery) ---
    {
      name: 'images',
      type: 'array',
      label: 'Galeri Foto',
      minRows: 1,
      required: true,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    // --- Baris 3: Detail Spesifik Kebaya ---
    {
      type: 'row',
      fields: [
        {
          name: 'sizes',
          type: 'select',
          label: 'Ukuran Tersedia',
          hasMany: true, // Bisa pilih lebih dari satu (misal: S dan M)
          options: [
            { label: 'S (Small)', value: 's' },
            { label: 'M (Medium)', value: 'm' },
            { label: 'L (Large)', value: 'l' },
            { label: 'XL (X-Large)', value: 'xl' },
            { label: 'Jumbo / Big Size', value: 'jumbo' },
            { label: 'Custom Size', value: 'custom' },
            { label: 'All Size (Fit to L)', value: 'allsize' },
          ],
        },
        {
          name: 'material',
          type: 'select',
          label: 'Bahan Kain',
          options: [
            { label: 'Brokat Semi Prancis', value: 'brokat_semi' },
            { label: 'Brokat Corneli', value: 'brokat_corneli' },
            { label: 'Katun Jepang', value: 'katun' },
            { label: 'Sutra', value: 'sutra' },
            { label: 'Balotelli', value: 'balotelli' },
            { label: 'Lainnya', value: 'other' },
          ],
        },
      ],
    },

    // --- Baris 4: Deskripsi & Stok ---
    {
      name: 'description',
      type: 'textarea', // Pakai textarea biar simpel (tanpa setup RichText editor dulu)
      label: 'Deskripsi Lengkap',
      required: true,
    },
    {
      name: 'stockStatus',
      type: 'select',
      label: 'Status Stok',
      defaultValue: 'ready',
      options: [
        { label: 'Ready Stock', value: 'ready' },
        { label: 'Pre-Order (PO)', value: 'po' },
        { label: 'Habis / Sold Out', value: 'sold' },
      ],
      admin: {
        position: 'sidebar', // Muncul di sidebar kanan admin
      },
    },

    // --- Baris 5: Slug (Untuk URL) ---
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL (Unique)',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            }
            return value
          },
        ],
      },
    },
  ],
}
