
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

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

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions yet</p>
        <p className="text-sm text-gray-400 mt-2">Start by adding your first income or expense</p>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${transaction.category.color}`}>
              <span className="text-lg">{transaction.category.icon}</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{transaction.category.name}</p>
              {transaction.description && (
                <p className="text-sm text-gray-500">{transaction.description}</p>
              )}
              <p className="text-xs text-gray-400">
                {new Date(transaction.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {transaction.type === 'income' ? (
              <ArrowUpCircle className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowDownCircle className="w-4 h-4 text-red-600" />
            )}
            <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'income' ? '+' : '-'}฿{transaction.amount.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
