import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

// Define types
export interface Product {
  id: string;
  name: string;
  stockThreshold: number;
}

export interface PurchaseRecord {
  id: string;
  vendorName: string;
  productId: string;
  quantity: number;
  cost: number;
  date: string;
  notes?: string;
  deliveryMethod?: 'pickup' | 'delivery' | 'digital';
  paymentStatus?: 'pending' | 'paid' | 'partial';
}

export interface SaleRecord {
  id: string;
  customerName: string;
  productId: string;
  quantity: number;
  price: number;
  date: string;
  notes?: string;
  paymentStatus?: 'pending' | 'paid' | 'partial';
}

interface StockItem {
  productId: string;
  quantity: number;
}

interface InvoiceContextType {
  products: Product[];
  purchases: PurchaseRecord[];
  sales: SaleRecord[];
  stock: StockItem[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addPurchase: (purchase: Omit<PurchaseRecord, 'id'>) => void;
  updatePurchase: (purchase: PurchaseRecord) => void;
  deletePurchase: (id: string) => void;
  addSale: (sale: Omit<SaleRecord, 'id'>) => void;
  updateSale: (sale: SaleRecord) => void;
  deleteSale: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getPurchase: (id: string) => PurchaseRecord | undefined;
  getProductStock: (productId: string) => number;
  getMonthlyEarnings: (month: number, year: number) => { revenue: number; costs: number; profit: number };
  getPendingPayments: () => { purchases: PurchaseRecord[]; sales: SaleRecord[] };
}

const defaultProducts: Product[] = [
  { id: '1', name: 'Laptop', stockThreshold: 5 },
  { id: '2', name: 'Smartphone', stockThreshold: 10 },
  { id: '3', name: 'Tablet', stockThreshold: 8 },
  { id: '4', name: 'Headphones', stockThreshold: 15 },
  { id: '5', name: 'Monitor', stockThreshold: 7 },
];

const defaultPurchases: PurchaseRecord[] = [
  { id: '1', vendorName: 'Tech Suppliers Inc.', productId: '1', quantity: 10, cost: 800, date: '2023-06-10' },
  { id: '2', vendorName: 'Gadget Wholesale', productId: '2', quantity: 20, cost: 400, date: '2023-06-15' },
  { id: '3', vendorName: 'Digital Distributors', productId: '3', quantity: 15, cost: 250, date: '2023-07-05' },
  { id: '4', vendorName: 'Tech Suppliers Inc.', productId: '4', quantity: 30, cost: 50, date: '2023-07-12' },
  { id: '5', vendorName: 'Screen Solutions', productId: '5', quantity: 8, cost: 180, date: '2023-07-20' },
];

const defaultSales: SaleRecord[] = [
  { id: '1', customerName: 'John Doe', productId: '1', quantity: 2, price: 1200, date: '2023-06-20' },
  { id: '2', customerName: 'Jane Smith', productId: '2', quantity: 3, price: 700, date: '2023-06-25' },
  { id: '3', customerName: 'Mike Johnson', productId: '3', quantity: 1, price: 450, date: '2023-07-10' },
  { id: '4', customerName: 'Sarah Williams', productId: '4', quantity: 5, price: 100, date: '2023-07-15' },
  { id: '5', customerName: 'David Brown', productId: '5', quantity: 2, price: 300, date: '2023-07-25' },
];

const InvoiceContext = createContext<InvoiceContextType>({
  products: [],
  purchases: [],
  sales: [],
  stock: [],
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  addPurchase: () => {},
  updatePurchase: () => {},
  deletePurchase: () => {},
  addSale: () => {},
  updateSale: () => {},
  deleteSale: () => {},
  getProduct: () => undefined,
  getPurchase: () => undefined,
  getProductStock: () => 0,
  getMonthlyEarnings: () => ({ revenue: 0, costs: 0, profit: 0 }),
  getPendingPayments: () => ({ purchases: [], sales: [] }),
});

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });
  
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem('purchases');
    return saved ? JSON.parse(saved) : defaultPurchases;
  });
  
  const [sales, setSales] = useState<SaleRecord[]>(() => {
    const saved = localStorage.getItem('sales');
    return saved ? JSON.parse(saved) : defaultSales;
  });

  const [stock, setStock] = useState<StockItem[]>([]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('purchases', JSON.stringify(purchases));
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [products, purchases, sales]);

  useEffect(() => {
    const newStock: StockItem[] = [];
    
    products.forEach(product => {
      newStock.push({ productId: product.id, quantity: 0 });
    });
    
    purchases.forEach(purchase => {
      const stockItem = newStock.find(item => item.productId === purchase.productId);
      if (stockItem) {
        stockItem.quantity += purchase.quantity;
      }
    });
    
    sales.forEach(sale => {
      const stockItem = newStock.find(item => item.productId === sale.productId);
      if (stockItem) {
        stockItem.quantity -= sale.quantity;
      }
    });
    
    setStock(newStock);
  }, [products, purchases, sales]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts([...products, newProduct]);
    toast.success('Product added successfully');
  };

  const updateProduct = (product: Product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
    toast.success('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    const usedInPurchase = purchases.some(p => p.productId === id);
    const usedInSale = sales.some(s => s.productId === id);
    
    if (usedInPurchase || usedInSale) {
      toast.error('Cannot delete product that is used in purchases or sales');
      return;
    }
    
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const addPurchase = (purchase: Omit<PurchaseRecord, 'id'>) => {
    const newPurchase = { ...purchase, id: Date.now().toString() };
    setPurchases([...purchases, newPurchase]);
    toast.success('Purchase record added successfully');
  };

  const updatePurchase = (purchase: PurchaseRecord) => {
    setPurchases(purchases.map(p => p.id === purchase.id ? purchase : p));
    toast.success('Purchase record updated successfully');
  };

  const deletePurchase = (id: string) => {
    setPurchases(purchases.filter(p => p.id !== id));
    toast.success('Purchase record deleted successfully');
  };

  const addSale = (sale: Omit<SaleRecord, 'id'>) => {
    const stockItem = stock.find(item => item.productId === sale.productId);
    if (!stockItem || stockItem.quantity < sale.quantity) {
      toast.error('Not enough stock to complete this sale');
      return;
    }
    
    const newSale = { ...sale, id: Date.now().toString() };
    setSales([...sales, newSale]);
    toast.success('Sale record added successfully');
  };

  const updateSale = (sale: SaleRecord) => {
    const originalSale = sales.find(s => s.id === sale.id);
    if (!originalSale) return;
    
    const quantityDifference = sale.quantity - originalSale.quantity;
    
    if (quantityDifference > 0) {
      const stockItem = stock.find(item => item.productId === sale.productId);
      if (!stockItem || stockItem.quantity < quantityDifference) {
        toast.error('Not enough stock to update this sale');
        return;
      }
    }
    
    setSales(sales.map(s => s.id === sale.id ? sale : s));
    toast.success('Sale record updated successfully');
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter(s => s.id !== id));
    toast.success('Sale record deleted successfully');
  };

  const getProduct = (id: string) => products.find(p => p.id === id);
  
  const getPurchase = (id: string) => purchases.find(p => p.id === id);

  const getProductStock = (productId: string) => {
    const stockItem = stock.find(item => item.productId === productId);
    return stockItem ? stockItem.quantity : 0;
  };

  const getMonthlyEarnings = (month: number, year: number) => {
    const monthPurchases = purchases.filter(p => {
      const date = new Date(p.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
    
    const monthSales = sales.filter(s => {
      const date = new Date(s.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
    
    const costs = monthPurchases.reduce((total, p) => total + (p.cost * p.quantity), 0);
    const revenue = monthSales.reduce((total, s) => total + (s.price * s.quantity), 0);
    
    return {
      costs,
      revenue,
      profit: revenue - costs
    };
  };

  const getPendingPayments = () => {
    const pendingPurchases = purchases.filter(p => p.paymentStatus === 'pending' || p.paymentStatus === 'partial');
    const pendingSales = sales.filter(s => s.paymentStatus === 'pending' || s.paymentStatus === 'partial');
    
    return {
      purchases: pendingPurchases,
      sales: pendingSales
    };
  };

  const value = {
    products,
    purchases,
    sales,
    stock,
    addProduct,
    updateProduct,
    deleteProduct,
    addPurchase,
    updatePurchase,
    deletePurchase,
    addSale,
    updateSale,
    deleteSale,
    getProduct,
    getPurchase,
    getProductStock,
    getMonthlyEarnings,
    getPendingPayments
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => useContext(InvoiceContext);
