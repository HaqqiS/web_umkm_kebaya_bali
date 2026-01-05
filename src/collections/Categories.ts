import { CollectionConfig } from 'payload'
import { revalidate } from '../hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Nama Kategori',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL',
      admin: {
        position: 'sidebar',
        description: 'Contoh: kebaya-wisuda (Auto-generate dianjurkan)',
      },
      hooks: {
        // Otomatis ubah "Kebaya Wisuda" jadi "kebaya-wisuda"
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
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
  hooks: {
    afterChange: [revalidate],
    afterDelete: [revalidate],
  },
}
