import { makeAutoObservable, runInAction } from 'mobx'
import { addToCart } from '../api/cartApi'
import type { Sku } from '../types/product'
import { track } from '../analytics'
import type { ApiResult } from '../types/api'
import type { AddToCartResponse } from '../api/cartApi'

export class CartStore {
  cartCount = 0
  adding = false
  lastError: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async add(sku: Sku, qty: number): Promise<ApiResult<AddToCartResponse>> {
    this.adding = true
    this.lastError = null
    const res = await addToCart({ skuId: sku.id, qty })
    runInAction(() => {
      this.adding = false
      if (!res.ok) {
        this.lastError = res.message
        return
      }
      this.cartCount = res.data.cartCount
    })

    // 埋点：加入购物车
    track({
      name: 'pdp_add_to_cart',
      ts: Date.now(),
      payload: { skuId: sku.id, qty },
    })

    return res
  }
}

