/**
 * Injects a Cloudinary transformation string into a Cloudinary URL.
 *
 * @param originalUrl The original Cloudinary image URL.
 * @param transformation The transformation string to inject (e.g., "e_gen_recolor:prompt_clothing;to-color_red").
 * @returns The transformed URL or the original URL if it's not a valid Cloudinary URL.
 */
export const getTransformedUrl = (originalUrl: string, transformation: string): string => {
  if (!originalUrl || typeof originalUrl !== 'string') return originalUrl || ''

  // Check if it's a Cloudinary URL
  if (!originalUrl.includes('cloudinary.com')) {
    return originalUrl
  }

  // Split by '/upload/' to find the insertion point
  const parts = originalUrl.split('/upload/')

  if (parts.length !== 2) {
    // URL structure doesn't match expected Cloudinary format
    return originalUrl
  }

  // specific fix: ensure we don't double slash if transformation has/missing slash,
  // but Cloudinary transformations are usually comma or slash separated.
  // Standard practice: .../upload/{transformation}/{version}/{public_id}
  // The user asked to inject *after* /upload/.

  // Clean up transformation string to avoid double slashes if user provided one
  const cleanTransformation = transformation.startsWith('/')
    ? transformation.substring(1)
    : transformation

  // Check if there is already a version or other path parts ensuring we join correctly.
  // We basically just want to insert the transformation segment.
  // e.g. https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
  // -> https://res.cloudinary.com/demo/image/upload/e_gen_recolor.../v1234/sample.jpg

  return `${parts[0]}/upload/${cleanTransformation}/${parts[1]}`
}
