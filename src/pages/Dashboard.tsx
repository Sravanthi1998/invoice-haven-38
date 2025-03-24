
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoice } from '@/context/InvoiceContext';
import Layout from '@/components/Layout';
import StockAlert from '@/components/StockAlert';
import EarningsChart from '@/components/EarningsChart';
import StockQuantityCard from '@/components/StockQuantityCard';
import RecentPurchasesTable from '@/components/RecentPurchasesTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { products, purchases, sales, getMonthlyEarnings } = useInvoice();
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get monthly earnings
  const { revenue, costs, profit } = getMonthlyEarnings(currentMonth, currentYear);
  
  // Calculate total stock value
  const totalPurchases = purchases.reduce((total, purchase) => total + (purchase.cost * purchase.quantity), 0);
  
  return (
    <Layout 
      title="Dashboard" 
      subtitle="Monitor your purchase records, stock levels, and earnings"
    >
      <StockAlert />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              MONTHLY REVENUE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              For {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              MONTHLY PROFIT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(profit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              TOTAL INVENTORY VALUE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPurchases)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on purchase costs
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <EarningsChart />
            
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-medium">Recent Purchases</h2>
              <Link to="/purchases">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <RecentPurchasesTable />
          </div>
        </TabsContent>
        
        <TabsContent value="stock" className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-medium">Stock Quantities</h2>
            <Link to="/stock">
              <Button variant="ghost" size="sm" className="gap-1">
                View details <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(product => (
              <StockQuantityCard key={product.id} productId={product.id} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="fixed bottom-6 right-6">
        <Link to="/purchases/new">
          <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Dashboard;
