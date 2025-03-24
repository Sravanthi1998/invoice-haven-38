
import React from 'react';
import { useInvoice } from '@/context/InvoiceContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

const RecentPurchasesTable: React.FC = () => {
  const { purchases, getProduct } = useInvoice();
  
  // Sort purchases by date (most recent first) and take the most recent 5
  const recentPurchases = [...purchases]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Total Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentPurchases.length > 0 ? (
            recentPurchases.map((purchase) => {
              const product = getProduct(purchase.productId);
              return (
                <TableRow key={purchase.id}>
                  <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                  <TableCell>{purchase.vendorName}</TableCell>
                  <TableCell>{product?.name || 'Unknown Product'}</TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(purchase.cost * purchase.quantity)}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No recent purchases found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentPurchasesTable;
