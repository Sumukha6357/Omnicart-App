import { fetchProductById } from './productApi'

const keyForUser = (userId) => `omnicart_wishlist_${String(userId || 'guest')}`

const readWishlist = (userId) => {
  try {
    const raw = localStorage.getItem(keyForUser(userId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeWishlist = (userId, items) => {
  localStorage.setItem(keyForUser(userId), JSON.stringify(items))
}

export const addToWishlist = async (userId, productId) => {
  const id = String(productId)
  const items = readWishlist(userId)
  if (items.some((i) => String(i.productId) === id)) {
    return { success: true, items }
  }

  let product = null
  try {
    product = await fetchProductById(id)
  } catch {
    product = null
  }

  items.push({
    productId: id,
    name: product?.name || 'Product',
    price: Number(product?.price || 0),
    imageUrl: product?.imageUrl || '',
  })

  writeWishlist(userId, items)
  return { success: true, items }
}

export const removeFromWishlist = async (userId, productId) => {
  const items = readWishlist(userId).filter((i) => String(i.productId) !== String(productId))
  writeWishlist(userId, items)
  return { success: true, items }
}

export const getWishlist = async (userId) => {
  return readWishlist(userId)
}
