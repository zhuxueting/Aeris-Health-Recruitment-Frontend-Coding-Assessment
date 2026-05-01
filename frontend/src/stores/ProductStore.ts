import { computed, makeAutoObservable, runInAction } from 'mobx'
import { getProductDetail } from '../api/productApi'
import type { Product, SpecKey, Sku } from '../types/product'
import { MOCK_PRODUCT_ID } from '../api/mockDb'

type LoadState = 'idle' | 'loading' | 'success' | 'error'

const SPEC_KEYS: SpecKey[] = ['color', 'size']

export class ProductStore {
  state: LoadState = 'idle'
  errorMessage: string | null = null
  product: Product | null = null

  selectedSpecs: Partial<Record<SpecKey, string>> = {}

  constructor() {
    makeAutoObservable(this, {
      selectedSku: computed,
      availableStock: computed,
      priceText: computed,
      isOutOfStock: computed,
    })
  }

  async load(productId: string = MOCK_PRODUCT_ID) {
    this.state = 'loading'
    this.errorMessage = null
    const res = await getProductDetail(productId)
    runInAction(() => {
      if (!res.ok) {
        this.state = 'error'
        this.errorMessage = res.message
        this.product = null
        return
      }

      this.product = res.data
      this.state = 'success'
      // 默认选中第一组可用规格组合（优先有库存）
      const firstInStock = res.data.skus.find((s) => s.stock > 0) ?? res.data.skus[0]
      this.selectedSpecs = { ...firstInStock.specs }
    })
  }

  retry() {
    void this.load()
  }

  setSpec(key: SpecKey, value: string) {
    this.selectedSpecs[key] = value
    // 若当前组合不存在 SKU，则自动修正到最接近的可用 SKU（按已选维度匹配）
    const sku = this.selectedSku
    if (!sku && this.product) {
      const candidate = this.product.skus.find((s) => {
        return SPEC_KEYS.every((k) => {
          const v = this.selectedSpecs[k]
          return v ? s.specs[k] === v : true
        })
      })
      if (candidate) this.selectedSpecs = { ...candidate.specs }
    }
  }

  get selectedSku(): Sku | null {
    if (!this.product) return null
    const { selectedSpecs } = this
    if (!SPEC_KEYS.every((k) => selectedSpecs[k])) return null
    return (
      this.product.skus.find(
        (s) =>
          s.specs.color === selectedSpecs.color && s.specs.size === selectedSpecs.size,
      ) ?? null
    )
  }

  get availableStock(): number {
    return this.selectedSku?.stock ?? 0
  }

  get isOutOfStock(): boolean {
    // 页面“缺货无货”在这里体现：SKU 不存在或库存为 0
    return !this.selectedSku || this.availableStock <= 0
  }

  get priceText(): string {
    const sku = this.selectedSku
    if (!sku) return '--'
    const yuan = (sku.price.amountFen / 100).toFixed(2)
    return `¥${yuan}`
  }
}

