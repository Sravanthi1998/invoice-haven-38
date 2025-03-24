
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvoice } from '@/context/InvoiceContext';
import Layout from '@/components/Layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, CheckCircle, InfoIcon, TruckIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import TooltipWrapper from '@/components/TooltipWrapper';

// Create schema for form validation
const purchaseSchema = z.object({
  vendorName: z.string().min(1, 'Vendor name is required'),
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().int().positive('Quantity must be a positive number'),
  cost: z.coerce.number().positive('Cost must be a positive number'),
  date: z.date({
    required_error: 'Date is required',
  }),
  notes: z.string().optional(),
  deliveryMethod: z.enum(['pickup', 'delivery', 'digital']).default('pickup'),
  paymentStatus: z.enum(['pending', 'paid', 'partial']).default('pending'),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

const PurchaseForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getPurchase, addPurchase, updatePurchase } = useInvoice();
  const [loading, setLoading] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const isEditing = Boolean(id);
  
  // Initialize form with default values or existing purchase data
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      vendorName: '',
      productId: '',
      quantity: 1,
      cost: 0,
      date: new Date(),
      notes: '',
      deliveryMethod: 'pickup',
      paymentStatus: 'pending',
    },
  });
  
  // Load purchase data if editing
  useEffect(() => {
    if (isEditing) {
      const purchase = getPurchase(id!);
      if (purchase) {
        form.reset({
          vendorName: purchase.vendorName,
          productId: purchase.productId,
          quantity: purchase.quantity,
          cost: purchase.cost,
          date: new Date(purchase.date),
          notes: purchase.notes || '',
          deliveryMethod: purchase.deliveryMethod || 'pickup',
          paymentStatus: purchase.paymentStatus || 'pending',
        });
      } else {
        // If purchase not found, redirect to list
        navigate('/purchases');
      }
    }
  }, [isEditing, id, getPurchase, form, navigate]);
  
  const onSubmit = async (values: PurchaseFormValues) => {
    setLoading(true);
    try {
      if (isEditing) {
        updatePurchase({
          id: id!,
          vendorName: values.vendorName,
          productId: values.productId,
          quantity: values.quantity,
          cost: values.cost,
          date: format(values.date, 'yyyy-MM-dd'),
          notes: values.notes,
          deliveryMethod: values.deliveryMethod,
          paymentStatus: values.paymentStatus,
        });
      } else {
        addPurchase({
          vendorName: values.vendorName,
          productId: values.productId,
          quantity: values.quantity,
          cost: values.cost,
          date: format(values.date, 'yyyy-MM-dd'),
          notes: values.notes,
          deliveryMethod: values.deliveryMethod,
          paymentStatus: values.paymentStatus,
        });
      }
      
      setSubmissionSuccess(true);
      
      // Delay navigation to show success animation
      setTimeout(() => {
        navigate('/purchases');
      }, 1500);
      
    } catch (error) {
      console.error('Failed to save purchase:', error);
      toast.error('Failed to save purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get total cost
  const totalCost = form.watch('cost') * form.watch('quantity') || 0;
  
  if (submissionSuccess) {
    return (
      <Layout 
        title="Success" 
        subtitle="Your purchase record has been saved"
      >
        <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-medium mb-2">Success!</h2>
          <p className="text-muted-foreground mb-6">Your purchase record has been saved successfully.</p>
          <p className="text-sm text-muted-foreground">Redirecting to purchases list...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout 
      title={isEditing ? 'Edit Purchase Record' : 'Create Purchase Record'}
      subtitle={isEditing ? 'Update the details of an existing purchase' : 'Add a new purchase to your records'}
    >
      <div className="max-w-xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="vendorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter vendor name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the supplier or vendor.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Product</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The product being purchased.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium mb-4">Purchase Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Number of units purchased.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost per Unit</FormLabel>
                      <FormControl>
                        <Input type="number" min="0.01" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Cost per unit in dollars.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Cost:</span>
                  <TooltipWrapper
                    tooltip="Quantity × Cost per Unit"
                    side="left"
                    animation="scale"
                  >
                    <span className="font-medium text-lg flex items-center">
                      ${totalCost.toFixed(2)}
                      <InfoIcon className="ml-1 h-4 w-4 text-muted-foreground" />
                    </span>
                  </TooltipWrapper>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Purchase Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date when the purchase was made.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium mb-4">Additional Information</h3>
              
              <FormField
                control={form.control}
                name="deliveryMethod"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Delivery Method</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select delivery method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pickup">
                          <div className="flex items-center">
                            <span className="mr-2">🚗</span> Pickup
                          </div>
                        </SelectItem>
                        <SelectItem value="delivery">
                          <div className="flex items-center">
                            <TruckIcon className="h-4 w-4 mr-2" /> Delivery
                          </div>
                        </SelectItem>
                        <SelectItem value="digital">
                          <div className="flex items-center">
                            <span className="mr-2">💻</span> Digital
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How the purchase will be delivered.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Payment Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></span> Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="partial">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span> Partial
                          </div>
                        </SelectItem>
                        <SelectItem value="paid">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span> Paid
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The current payment status of this purchase.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any additional notes here..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional additional information about this purchase.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/purchases')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Purchase' : 'Add Purchase')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default PurchaseForm;
