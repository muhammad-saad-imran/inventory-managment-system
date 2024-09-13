import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { render, type RenderOptions } from '@testing-library/react'

import { AppStore, makeStore } from '@/store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    // Automatically create a store instance if no store was passed in
    store = makeStore(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }  
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}