
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PurchaseForm from "./pages/PurchaseForm";
import PurchasesList from "./pages/PurchasesList";
import StockManagement from "./pages/StockManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/purchases/new" element={<PurchaseForm />} />
        <Route path="/purchases/edit/:id" element={<PurchaseForm />} />
        <Route path="/purchases" element={<PurchasesList />} />
        <Route path="/stock" element={<StockManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
