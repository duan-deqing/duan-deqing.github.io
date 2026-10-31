import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './styles/content-cards.css'
import './styles/projects.css'
import './styles/category-heading.css'
import './styles/stack-list.css'
import './styles/hover-reveal.css'
import './styles/rich-text.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)