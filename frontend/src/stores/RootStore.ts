import { CartStore } from './CartStore'
import { ProductStore } from './ProductStore'

export class RootStore {
  productStore = new ProductStore()
  cartStore = new CartStore()
}

