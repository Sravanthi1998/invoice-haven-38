
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { useInvoice, Product } from '@/context/InvoiceContext';

const StockAlert: React.FC = () => {
  const { products, getProductStock } = useInvoice();
  
  // Find products with low stock
  const lowStockProducts = products.filter(product => {
    const stock = getProductStock(product.id);
    return stock < product.stockThreshold;
  });
  
  if (lowStockProducts.length === 0) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-6 animate-fade-in">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Low stock alert</AlertTitle>
      <AlertDescription>
        <p>The following products are below their stock threshold:</p>
        <ul className="mt-2 list-disc list-inside">
          {lowStockProducts.map(product => (
            <li key={product.id}>
              {product.name}: <strong>{getProductStock(product.id)}</strong> left 
              (threshold: {product.stockThreshold})
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default StockAlert;
