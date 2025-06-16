
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const categories = {
  expense: [
    { id: 'food', name: 'Food', icon: '🍚', color: 'bg-orange-100 text-orange-800' },
    { id: 'transport', name: 'Transport', icon: '🚃', color: 'bg-blue-100 text-blue-800' },
    { id: 'personal', name: 'Personal Items', icon: '🛍', color: 'bg-purple-100 text-purple-800' },
    { id: 'utilities', name: 'Utilities', icon: '💡', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: 'bg-green-100 text-green-800' },
    { id: 'other', name: 'Other', icon: '🔄', color: 'bg-gray-100 text-gray-800' }
  ],
  income: [
    { id: 'salary', name: 'Salary', icon: '💼', color: 'bg-green-100 text-green-800' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: 'bg-blue-100 text-blue-800' },
    { id: 'investment', name: 'Investment', icon: '📈', color: 'bg-purple-100 text-purple-800' },
    { id: 'other', name: 'Other Income', icon: '💰', color: 'bg-yellow-100 text-yellow-800' }
  ]
};

interface Transaction {
  type: 'income' | 'expense';
  amount: number;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  description?: string;
  date: Date;
}

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel }) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    const selectedCategory = categories[type].find(c => c.id === category);
    if (!selectedCategory) return;
    
    onSubmit({
      type,
      amount: parseFloat(amount),
      category: selectedCategory,
      description,
      date: new Date(date)
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setType('expense');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Add Transaction</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Transaction Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Transaction Type</Label>
        <RadioGroup value={type} onValueChange={(value: 'income' | 'expense') => setType(value)} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expense" id="expense" />
            <Label htmlFor="expense" className="text-red-600 font-medium">Expense</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="income" id="income" />
            <Label htmlFor="income" className="text-green-600 font-medium">Income</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount (฿)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="text-lg"
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories[type].map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description (Optional)</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a note..."
        />
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm font-medium text-gray-700">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Add Transaction
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
