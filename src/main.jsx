import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' 
import { RouterProvider } from 'react-router'
import { router } from './Components/utils/router.jsx'
import AuthProvider from './context/AuthContext/AuthProvider.jsx'
import { Toaster } from "react-hot-toast"; 
import { 
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
