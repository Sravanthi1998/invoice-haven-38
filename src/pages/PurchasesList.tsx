
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

const PurchasesList: React.FC = () => {
  const { purchases, getProduct, deletePurchase } = useInvoice();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter purchases based on search term
  const filteredPurchases = purchases.filter(purchase => {
    const product = getProduct(purchase.productId);
    const searchString = `${purchase.vendorName} ${product?.name || ''} ${purchase.date}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });
  
  // Sort purchases by date (most recent first)
  const sortedPurchases = [...filteredPurchases]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <Layout 
      title="Purchase Records" 
      subtitle="View, edit, or delete your purchase records"
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search purchase records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Link to="/purchases/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Purchase
          </Button>
        </Link>
      </div>
      
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Cost</TableHead>
              <TableHead className="text-right">Total Cost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPurchases.length > 0 ? (
              sortedPurchases.map((purchase) => {
                const product = getProduct(purchase.productId);
                const totalCost = purchase.cost * purchase.quantity;
                
                return (
                  <TableRow key={purchase.id}>
                    <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                    <TableCell>{purchase.vendorName}</TableCell>
                    <TableCell>{product?.name || 'Unknown Product'}</TableCell>
                    <TableCell className="text-right">{purchase.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(purchase.cost)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(totalCost)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link to={`/purchases/edit/${purchase.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Purchase Record</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this purchase record?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePurchase(purchase.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  {searchTerm ? 'No matching purchase records found' : 'No purchase records yet'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default PurchasesList;
