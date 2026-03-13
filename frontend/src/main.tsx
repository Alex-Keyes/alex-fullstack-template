import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import { CustomProvider } from './components/ui/provider'
import { AuthProvider } from './hooks/useAuth'

const queryClient = new QueryClient()

const router = createRouter({ routeTree })
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </CustomProvider>
  </StrictMode>,
)
