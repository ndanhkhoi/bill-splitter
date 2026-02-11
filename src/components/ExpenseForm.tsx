import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Checkbox } from './ui/Checkbox';
import { useBillStore } from '../stores/billStore';
import { parseCurrencyInput, formatCurrency } from '../utils/calculateSettlement';

export const ExpenseForm: React.FC = () => {
  const { currentBill, addExpense } = useBillStore();
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  const payerOptions = currentBill?.people.map(p => ({
    value: p.id,
    label: p.name,
  })) || [];

  const handleSubmit = () => {
    if (!expenseName.trim() || !expenseAmount || !payerId || participantIds.length === 0) {
      return;
    }

    addExpense({
      name: expenseName.trim(),
      amount: parseCurrencyInput(expenseAmount),
      payerId,
      participantIds,
    });

    // Reset form
    setExpenseName('');
    setExpenseAmount('');
    setPayerId('');
    setParticipantIds([]);
  };

  const toggleParticipant = (id: string) => {
    setParticipantIds(prev =>
      prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (currentBill && participantIds.length === currentBill.people.length) {
      setParticipantIds([]);
    } else if (currentBill) {
      setParticipantIds(currentBill.people.map(p => p.id));
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Thêm chi tiêu</h2>
        </div>

        <Input
          label="Tên món / khoản chi"
          placeholder="Ví dụ: Cà phê, Trưa, Taxi..."
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              label="Số tiền (VNĐ)"
              placeholder="0"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value.replace(/[^\d]/g, ''))}
            />
            {expenseAmount && (
              <div className="absolute right-4 bottom-3 text-white/60 text-sm">
                {formatCurrency(parseCurrencyInput(expenseAmount))}
              </div>
            )}
          </div>
        </div>

        <Select
          label="Người trả tiền"
          value={payerId}
          onChange={setPayerId}
          options={payerOptions}
          placeholder="Chọn người trả..."
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white/80">Người chia sẻ</label>
            <button
              onClick={handleSelectAll}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              {currentBill && participantIds.length === currentBill.people.length
                ? 'Bỏ chọn tất cả'
                : 'Chọn tất cả'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentBill?.people.map((person) => (
              <Checkbox
                key={person.id}
                checked={participantIds.includes(person.id)}
                onChange={() => toggleParticipant(person.id)}
                label={person.name}
              />
            ))}
          </div>

          {currentBill?.people.length === 0 && (
            <p className="text-center text-white/40 text-sm py-4">
              Chưa có người tham gia nào
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!expenseName.trim() || !expenseAmount || !payerId || participantIds.length === 0}
          className="w-full"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm khoản chi
        </Button>
      </CardContent>
    </Card>
  );
};
