import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)



ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey='pk_test_ZXRlcm5hbC1rb2FsYS04MS5jbGVyay5hY2NvdW50cy5kZXYk'>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
)


