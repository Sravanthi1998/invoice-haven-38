
import React from 'react';
import { useInvoice } from '@/context/InvoiceContext';
import Layout from '@/components/Layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import StockAlert from '@/components/StockAlert';

const StockManagement: React.FC = () => {
  const { products, getProductStock } = useInvoice();
  
  // Sort products by name
  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <Layout 
      title="Stock Management" 
      subtitle="Monitor current stock levels for all products"
    >
      <StockAlert />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {products.filter(p => getProductStock(p.id) < p.stockThreshold).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Out of Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {products.filter(p => getProductStock(p.id) === 0).length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stock Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.map((product) => {
              const stockQuantity = getProductStock(product.id);
              const stockPercentage = Math.min(100, (stockQuantity / product.stockThreshold) * 100);
              
              let statusText = 'In Stock';
              let statusColor = 'text-green-600';
              
              if (stockQuantity === 0) {
                statusText = 'Out of Stock';
                statusColor = 'text-red-600';
              } else if (stockQuantity < product.stockThreshold) {
                statusText = 'Low Stock';
                statusColor = 'text-yellow-600';
              }
              
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{stockQuantity}</TableCell>
                  <TableCell>{product.stockThreshold}</TableCell>
                  <TableCell className={statusColor}>{statusText}</TableCell>
                  <TableCell className="w-[30%]">
                    <div className="flex items-center gap-2">
                      <Progress value={stockPercentage} className="h-2" />
                      <span className="text-xs w-12">{Math.round(stockPercentage)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default StockManagement;
