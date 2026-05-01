import type { Product } from '../types/product'

export const MOCK_PRODUCT_ID = 'p_10001'

export const mockProduct: Product = {
  id: MOCK_PRODUCT_ID,
  title: 'Lightweight Water-Repellent Backpack (Demo Product)',
  images: [
    {
      id: 'img_1',
      url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
      alt: 'Backpack image 1',
    },
    {
      id: 'img_2',
      url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1200&q=80',
      alt: 'Backpack image 2',
    },
    {
      id: 'img_3',
      url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=80',
      alt: 'Backpack image 3',
    },
  ],
  specDimensions: [
    {
      key: 'color',
      name: 'Color',
      options: [
        { value: 'black', label: 'Black' },
        { value: 'khaki', label: 'Khaki' },
      ],
    },
    {
      key: 'size',
      name: 'Capacity',
      options: [
        { value: '20l', label: '20L' },
        { value: '30l', label: '30L' },
      ],
    },
  ],
  skus: [
    {
      id: 'sku_black_20l',
      specs: { color: 'black', size: '20l' },
      price: { currency: 'CNY', amountFen: 19900 },
      stock: 12,
    },
    {
      id: 'sku_black_30l',
      specs: { color: 'black', size: '30l' },
      price: { currency: 'CNY', amountFen: 21900 },
      stock: 0, // 缺货 SKU
    },
    {
      id: 'sku_khaki_20l',
      specs: { color: 'khaki', size: '20l' },
      price: { currency: 'CNY', amountFen: 18900 },
      stock: 6,
    },
    {
      id: 'sku_khaki_30l',
      specs: { color: 'khaki', size: '30l' },
      price: { currency: 'CNY', amountFen: 20900 },
      stock: 2,
    },
  ],
  description:
    'This is a static product description for demo purposes. The page supports two spec dimensions, real-time SKU price/stock updates, quantity limits, and a full add-to-cart flow with a cart badge.',
}

export type CartLine = { skuId: string; qty: number }

let cartLines: CartLine[] = []

export function getCartCount(): number {
  return cartLines.reduce((sum, l) => sum + l.qty, 0)
}

export function addCartLine(skuId: string, qty: number) {
  const existed = cartLines.find((l) => l.skuId === skuId)
  if (existed) existed.qty += qty
  else cartLines.push({ skuId, qty })
}

export function resetCartForDemo() {
  cartLines = []
}

