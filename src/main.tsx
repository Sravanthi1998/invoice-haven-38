
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { InvoiceProvider } from './context/InvoiceContext.tsx'

createRoot(document.getElementById("root")!).render(
  <InvoiceProvider>
    <App />
  </InvoiceProvider>
);
