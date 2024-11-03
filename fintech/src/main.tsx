import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PaymentForm from "./components/PaymentForm.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PaymentForm/>
  </StrictMode>,
)
