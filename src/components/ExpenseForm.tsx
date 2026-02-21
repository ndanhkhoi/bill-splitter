import React, { useState } from 'react';
import Select from 'react-select';
import { Plus } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { useBillStore } from '../stores/billStore';
import { parseCurrencyInput, formatCurrency } from '../utils/calculateSettlement';
import { ChevronDown } from 'lucide-react';

interface PersonOption {
  value: string;
  label: string;
}

// Custom styles cho react-select - Dark theme
const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    border: '1px solid #27272a',
    borderRadius: '0.75rem',
    padding: '4px',
    minHeight: '52px',
    cursor: 'pointer',
    '&:hover': {
      borderColor: 'rgba(14, 165, 233, 0.5)',
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0 12px',
    color: '#fafafa',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#fafafa',
    margin: '0',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#71717a',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#fafafa',
    fontWeight: '500',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#18181b',
    borderRadius: '0.75rem',
    border: '1px solid #3f3f46',
    marginTop: '8px',
    zIndex: 50,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: '8px',
    borderRadius: '0.75rem',
    maxHeight: '200px',
    backgroundColor: '#18181b',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
    color: state.isFocused ? '#fafafa' : '#a1a1aa',
    padding: '12px 16px',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
    },
    '&:active': {
      backgroundColor: 'rgba(14, 165, 233, 0.3)',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#71717a',
    padding: '8px',
    '&:hover': {
      color: '#a1a1aa',
    },
  }),
  noOptionsMessage: (provided: any) => ({
    ...provided,
    color: '#71717a',
  }),
};

const DropdownIndicator = () => (
  <ChevronDown className="w-5 h-5 text-zinc-500 mr-2" />
);

export const ExpenseForm: React.FC = () => {
  const { currentBill, addExpense } = useBillStore();
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedPayer, setSelectedPayer] = useState<PersonOption | null>(null);
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  const payerOptions: PersonOption[] = currentBill?.people.map(p => ({
    value: p.id,
    label: p.name,
  })) || [];

  const handleSubmit = () => {
    if (!expenseName.trim() || !expenseAmount || !selectedPayer?.value || participantIds.length === 0) {
      return;
    }

    addExpense({
      name: expenseName.trim(),
      amount: parseCurrencyInput(expenseAmount),
      payerId: selectedPayer.value,
      participantIds,
    });

    // Reset form
    setExpenseName('');
    setExpenseAmount('');
    setSelectedPayer(null);
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
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Thêm chi tiêu</h2>
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
              <div className="absolute right-4 bottom-3 text-zinc-500 text-sm">
                {formatCurrency(parseCurrencyInput(expenseAmount))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-300 mb-2 block">
            Người trả tiền
          </label>
          <Select
            value={selectedPayer}
            onChange={(option) => setSelectedPayer(option)}
            options={payerOptions}
            placeholder="Tìm kiếm người trả..."
            styles={customStyles}
            isSearchable
            isClearable
            components={{ DropdownIndicator }}
            noOptionsMessage={() => 'Không tìm thấy người'}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">Người chia sẻ</label>
            <button
              onClick={handleSelectAll}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
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
            <p className="text-center text-zinc-500 text-sm py-4">
              Chưa có người tham gia nào
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!expenseName.trim() || !expenseAmount || !selectedPayer?.value || participantIds.length === 0}
          className="w-full"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm khoản chi
        </Button>
      </CardContent>
    </Card>
  );
};
