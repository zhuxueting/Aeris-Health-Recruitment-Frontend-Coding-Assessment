import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import type { SpecDimension, SpecKey } from '../../types/product'
import { useStores } from '../../stores/StoreContext'
import styles from './pdp.module.css'
import { Toast } from '../../components/Toast/Toast'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export const PdpPage = observer(function PdpPage() {
  const { productStore, cartStore } = useStores()
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  useEffect(() => {
    void productStore.load()
  }, [productStore])

  // SKU/库存变化时，修正数量上限
  useEffect(() => {
    const max = Math.max(1, productStore.availableStock)
    setQty((q) => clamp(q, 1, max))
  }, [productStore.availableStock])

  const product = productStore.product
  const selectedSku = productStore.selectedSku

  const specDims: SpecDimension[] = useMemo(
    () => product?.specDimensions ?? [],
    [product?.specDimensions],
  )

  function onSelectSpec(key: SpecKey, value: string) {
    productStore.setSpec(key, value)
  }

  async function onAddToCart() {
    if (!selectedSku) {
      setToast({ open: true, message: 'Please select all specs before adding.' })
      return
    }
    if (productStore.availableStock <= 0) {
      setToast({ open: true, message: 'Out of stock for the selected variant.' })
      return
    }
    const max = productStore.availableStock
    const safeQty = clamp(qty, 1, max)
    const res = await cartStore.add(selectedSku, safeQty)
    if (res.ok === false) {
      setToast({ open: true, message: res.message })
      return
    }
    setToast({ open: true, message: 'Added to cart.' })
  }

  if (productStore.state === 'loading' || productStore.state === 'idle') {
    return (
      <div className={styles.page}>
        <TopBar cartCount={cartStore.cartCount} />
        <div className={styles.centerState}>Loading…</div>
      </div>
    )
  }

  if (productStore.state === 'error') {
    return (
      <div className={styles.page}>
        <TopBar cartCount={cartStore.cartCount} />
        <div className={styles.centerState}>
          <div className={styles.errorTitle}>Load failed</div>
          <div className={styles.errorMsg}>{productStore.errorMessage}</div>
          <button className={styles.primaryBtn} onClick={() => productStore.retry()}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!product) return null

  const activeImg = product.images[activeImageIdx] ?? product.images[0]
  const stockText =
    !selectedSku
      ? 'Select a variant'
      : selectedSku.stock > 0
        ? `In stock (${selectedSku.stock} available)`
        : 'Out of stock'

  const canDec = qty > 1
  const canInc = selectedSku ? qty < Math.max(1, selectedSku.stock) : true
  const maxQty = Math.max(1, productStore.availableStock)

  return (
    <div className={styles.page}>
      <TopBar cartCount={cartStore.cartCount} />

      <div className={styles.layout}>
        <section className={styles.gallery}>
          <div className={styles.mainImage}>
            {/* 性能：lazy + async decode */}
            <img
              src={activeImg.url}
              alt={activeImg.alt}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className={styles.thumbs}>
            {product.images.map((img, idx) => (
              <button
                key={img.id}
                className={idx === activeImageIdx ? styles.thumbActive : styles.thumb}
                onClick={() => setActiveImageIdx(idx)}
                aria-label={`切换到图片 ${idx + 1}`}
              >
                <img src={img.url} alt={img.alt} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </section>

        <section className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.metaRow}>
            <div className={styles.price}>{productStore.priceText}</div>
            <div className={styles.stock}>{stockText}</div>
          </div>

          <div className={styles.card}>
            {specDims.map((dim) => (
              <SpecSelector
                key={dim.key}
                dim={dim}
                value={productStore.selectedSpecs[dim.key] ?? null}
                onChange={(v) => onSelectSpec(dim.key, v)}
              />
            ))}

            <div className={styles.qtyRow}>
              <div className={styles.label}>Quantity</div>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => clamp(q - 1, 1, maxQty))}
                  disabled={!canDec}
                >
                  −
                </button>
                <input
                  className={styles.qtyInput}
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) => {
                    const n = Number(e.target.value)
                    if (Number.isNaN(n)) return
                    setQty(clamp(Math.floor(n), 1, maxQty))
                  }}
                />
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => clamp(q + 1, 1, maxQty))}
                  disabled={!canInc}
                >
                  +
                </button>
              </div>
              <div className={styles.qtyHint}>Min 1, max not exceeding available stock</div>
            </div>

            <button
              className={styles.primaryBtn}
              onClick={() => void onAddToCart()}
              disabled={cartStore.adding || productStore.isOutOfStock}
            >
              {productStore.isOutOfStock
                ? 'Out of stock'
                : cartStore.adding
                  ? 'Adding…'
                  : 'Add to cart'}
            </button>
          </div>

          <div className={styles.desc}>
            <div className={styles.descTitle}>Description</div>
            <div className={styles.descText}>{product.description}</div>
          </div>
        </section>
      </div>

      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast({ open: false, message: '' })}
      />
    </div>
  )
})

function TopBar({ cartCount }: { cartCount: number }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>Demo Shop</div>
      <div className={styles.cart}>
        Cart
        <span className={styles.badge} aria-label={`Cart count ${cartCount}`}>
          {cartCount}
        </span>
      </div>
    </header>
  )
}

const SpecSelector = observer(function SpecSelector({
  dim,
  value,
  onChange,
}: {
  dim: SpecDimension
  value: string | null
  onChange: (v: string) => void
}) {
  return (
    <div className={styles.specRow}>
      <div className={styles.label}>{dim.name}</div>
      <div className={styles.specOptions}>
        {dim.options.map((opt) => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              className={active ? styles.specBtnActive : styles.specBtn}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
})

