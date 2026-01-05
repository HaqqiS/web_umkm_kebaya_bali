import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidate = ({ doc, req: { payload }, collection }: any) => {
  payload.logger.info(`Revalidating ${collection.slug}...`)

  switch (collection.slug) {
    case 'products':
      revalidatePath('/products')
      revalidatePath('/')
      if (doc?.slug) {
        revalidatePath(`/products/${doc.slug}`)
      }
      break
    case 'categories':
      revalidatePath('/products')
      revalidatePath('/')
      break
    case 'media':
      revalidatePath('/')
      revalidatePath('/products')
      break
    default:
      break
  }

  return doc
}
