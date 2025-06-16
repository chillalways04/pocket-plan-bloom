
import React, { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  targetMonths: number;
  monthlyTarget: number;
  saved: number;
  createdAt: Date;
}

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'saved'>) => void;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ goals, onAddGoal }) => {
  const [showForm, setShowForm] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetMonths, setTargetMonths] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !targetAmount || !targetMonths) return;

    const targetAmountNum = parseFloat(targetAmount);
    const targetMonthsNum = parseInt(targetMonths);
    const monthlyTarget = targetAmountNum / targetMonthsNum;
    
    onAddGoal({
      name: goalName,
      targetAmount: targetAmountNum,
      targetMonths: targetMonthsNum,
      monthlyTarget: monthlyTarget,
      createdAt: new Date()
    });

    setGoalName('');
    setTargetAmount('');
    setTargetMonths('');
    setShowForm(false);
  };

  const goalIcons = ['🛵', '✈️', '🏠', '💎', '🎓', '💻'];

  return (
    <div className="space-y-4">
      {goals.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No savings goals yet</p>
          <Button onClick={() => setShowForm(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Goal
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {goals.map((goal) => {
              const progress = (goal.saved / goal.targetAmount) * 100;
              const randomIcon = goalIcons[goal.id % goalIcons.length];
              
              return (
                <div key={goal.id} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{randomIcon}</span>
                      <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">฿{goal.saved.toLocaleString()} / ฿{goal.targetAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">฿{Math.round(goal.monthlyTarget).toLocaleString()}/month</p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
                </div>
              );
            })}
          </div>
          
          <Button 
            onClick={() => setShowForm(true)} 
            variant="outline" 
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Goal
          </Button>
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Goal</h3>
              
              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g., Buy a motorcycle"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (฿)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="50000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMonths">Target Months</Label>
                <Input
                  id="targetMonths"
                  type="number"
                  value={targetMonths}
                  onChange={(e) => setTargetMonths(e.target.value)}
                  placeholder="12"
                  required
                />
              </div>

              {targetAmount && targetMonths && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    You'll need to save <strong>฿{Math.round(parseFloat(targetAmount) / parseInt(targetMonths)).toLocaleString()}</strong> per month
                  </p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">Create Goal</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsSection;
