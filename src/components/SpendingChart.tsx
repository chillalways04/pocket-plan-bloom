
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: {
    name: string;
    icon: string;
    color: string;
  };
  description?: string;
  date: Date;
}

interface SpendingChartProps {
  transactions: Transaction[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  if (expenseTransactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No expenses to display</p>
        <p className="text-sm text-gray-400 mt-2">Add some transactions to see your spending breakdown</p>
      </div>
    );
  }

  // Group expenses by category
  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    const categoryName = transaction.category.name;
    acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / totalExpenses) * 100).toFixed(1)
  }));

  const COLORS = {
    'Food': '#FF6B35',
    'Transport': '#3B82F6',
    'Personal Items': '#8B5CF6',
    'Utilities': '#F59E0B',
    'Entertainment': '#10B981',
    'Other': '#6B7280'
  } as Record<string, string>;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">฿{data.value.toLocaleString()}</p>
          <p className="text-gray-500">{data.payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#6B7280'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value} (฿{entry.payload?.value?.toLocaleString()})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;
