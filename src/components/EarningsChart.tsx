
import React, { useEffect, useState } from 'react';
import { useInvoice } from '@/context/InvoiceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const currentYear = new Date().getFullYear();
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const EarningsChart: React.FC = () => {
  const { getMonthlyEarnings } = useInvoice();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate data for all months in the selected year
    const data = monthNames.map((month, index) => {
      const { revenue, costs, profit } = getMonthlyEarnings(index, selectedYear);
      return {
        name: month,
        revenue,
        costs,
        profit
      };
    });
    
    setChartData(data);
  }, [selectedYear, getMonthlyEarnings]);
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monthly Earnings Summary</CardTitle>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {[currentYear - 2, currentYear - 1, currentYear].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
                formatter={(value) => [`$${value}`, '']}
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="costs" name="Costs" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsChart;
