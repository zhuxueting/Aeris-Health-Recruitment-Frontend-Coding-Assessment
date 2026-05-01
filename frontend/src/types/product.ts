export type SpecKey = 'color' | 'size'

export type MoneyCny = {
  currency: 'CNY'
  amountFen: number
}

export type ProductImage = {
  id: string
  url: string
  alt: string
}

export type SpecOption = {
  value: string
  label: string
}

export type SpecDimension = {
  key: SpecKey
  name: string
  options: SpecOption[]
}

export type Sku = {
  id: string
  specs: Record<SpecKey, string>
  price: MoneyCny
  stock: number
}

export type Product = {
  id: string
  title: string
  images: ProductImage[]
  specDimensions: SpecDimension[]
  skus: Sku[]
  description: string
}

