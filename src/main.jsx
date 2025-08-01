import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HomeContextProvider from './Context/HomeContext.jsx'

createRoot(document.getElementById('root')).render(
  <HomeContextProvider>
    <App />
  </HomeContextProvider>,
)
