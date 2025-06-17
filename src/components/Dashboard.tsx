
import React, { useState } from 'react';
import { PlusCircle, Target, TrendingUp, Wallet, RotateCcw, LogOut, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import TransactionForm from './TransactionForm';
import GoalsSection from './GoalsSection';
import SpendingChart from './SpendingChart';
import TransactionList from './TransactionList';

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

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  targetMonths: number;
  monthlyTarget: number;
  saved: number;
  createdAt: Date;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now() };
    setTransactions([...transactions, newTransaction]);
    
    // If it's income, automatically allocate towards savings goals
    if (transaction.type === 'income' && goals.length > 0) {
      const incomeAmount = transaction.amount;
      const totalMonthlyTargets = goals.reduce((sum, goal) => sum + goal.monthlyTarget, 0);
      
      if (totalMonthlyTargets > 0) {
        setGoals(prevGoals => 
          prevGoals.map(goal => {
            // Calculate proportional allocation based on monthly target
            const allocationRatio = goal.monthlyTarget / totalMonthlyTargets;
            const allocation = Math.min(
              incomeAmount * allocationRatio,
              goal.targetAmount - goal.saved // Don't exceed target
            );
            
            return {
              ...goal,
              saved: Math.min(goal.saved + allocation, goal.targetAmount)
            };
          })
        );
      }
    }
    
    setShowTransactionForm(false);
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'saved'>) => {
    setGoals([...goals, { ...goal, id: Date.now(), saved: 0 }]);
  };

  const resetAllData = () => {
    setTransactions([]);
    setGoals([]);
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with User Info */}
        <div className="flex justify-between items-center py-6">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Personal Finance Tracker</h1>
            <p className="text-slate-600 dark:text-slate-300">Take control of your financial future</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user?.name}</span>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:text-rose-400 dark:border-rose-800 dark:hover:bg-rose-950"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Balance</CardTitle>
              <Wallet className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                ฿{balance.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Current balance</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ฿{totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Monthly Expenses</CardTitle>
              <Target className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                ฿{totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            onClick={() => setShowTransactionForm(true)}
            className="bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
          
          <Button 
            onClick={() => setShowResetConfirm(true)}
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950 px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Data
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Chart */}
          <Card className="bg-white dark:bg-slate-800 shadow-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Spending Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingChart transactions={transactions} />
            </CardContent>
          </Card>

          {/* Goals Section */}
          <Card className="bg-white dark:bg-slate-800 shadow-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Savings Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <GoalsSection goals={goals} onAddGoal={addGoal} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-white dark:bg-slate-800 shadow-sm border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={transactions.slice(-10)} />
          </CardContent>
        </Card>

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
              <TransactionForm
                onSubmit={addTransaction}
                onCancel={() => setShowTransactionForm(false)}
              />
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <RotateCcw className="w-12 h-12 text-rose-500 dark:text-rose-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Reset All Financial Data</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  This will permanently delete all your transactions and savings goals. This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    onClick={resetAllData}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white"
                  >
                    Yes, Reset All
                  </Button>
                  <Button 
                    onClick={() => setShowResetConfirm(false)}
                    variant="outline" 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
