
import React from 'react';
import { useInvoice } from '@/context/InvoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StockQuantityCardProps {
  productId: string;
}

const StockQuantityCard: React.FC<StockQuantityCardProps> = ({ productId }) => {
  const { getProduct, getProductStock } = useInvoice();
  
  const product = getProduct(productId);
  if (!product) return null;
  
  const stockQuantity = getProductStock(productId);
  const stockPercentage = Math.min(100, (stockQuantity / product.stockThreshold) * 100);
  
  let statusColor = 'bg-green-500';
  if (stockQuantity <= product.stockThreshold * 0.5) {
    statusColor = 'bg-red-500';
  } else if (stockQuantity <= product.stockThreshold) {
    statusColor = 'bg-yellow-500';
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{product.name}</CardTitle>
        <CardDescription>
          Stock Threshold: {product.stockThreshold}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-semibold">{stockQuantity}</span>
          <span className={`h-2 w-2 rounded-full ${statusColor}`}></span>
        </div>
        <Progress value={stockPercentage} className="h-2" />
      </CardContent>
    </Card>
  );
};

export default StockQuantityCard;
