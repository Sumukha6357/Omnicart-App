import { fetchProductById } from './productApi'

const keyForUser = (userId) => `omnicart_cart_${String(userId || 'guest')}`

const readCart = (userId) => {
  try {
    const raw = localStorage.getItem(keyForUser(userId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeCart = (userId, items) => {
  localStorage.setItem(keyForUser(userId), JSON.stringify(items))
}

export const getCart = async (userId) => {
  const items = readCart(userId)
  return { items }
}

export const addToCart = async (userId, cartItemRequest) => {
  const productId = String(cartItemRequest?.productId)
  const quantity = Number(cartItemRequest?.quantity || 1)

  const items = readCart(userId)
  const existing = items.find((i) => String(i.productId) === productId)

  let enriched = {}
  try {
    const product = await fetchProductById(productId)
    if (product) {
      enriched = {
        name: product.name,
        price: Number(product.price || 0),
        imageUrl: product.imageUrl || '',
      }
    }
  } catch {
    enriched = {}
  }

  if (existing) {
    existing.quantity += quantity
    existing.price = existing.price ?? enriched.price ?? 0
    existing.name = existing.name ?? enriched.name ?? ''
    existing.imageUrl = existing.imageUrl ?? enriched.imageUrl ?? ''
  } else {
    items.push({
      productId,
      quantity,
      price: enriched.price ?? 0,
      name: enriched.name ?? '',
      imageUrl: enriched.imageUrl ?? '',
    })
  }

  writeCart(userId, items)
  return { items }
}

export const removeFromCart = async (userId, productId) => {
  const items = readCart(userId).filter((i) => String(i.productId) !== String(productId))
  writeCart(userId, items)
  return { items }
}
