import { StoreContext } from './stores/StoreContext'
import { RootStore } from './stores/RootStore'
import { PdpPage } from './pages/pdp/PdpPage'

const rootStore = new RootStore()

export default function App() {
  return (
    <StoreContext.Provider value={rootStore}>
      <PdpPage />
    </StoreContext.Provider>
  )
}
