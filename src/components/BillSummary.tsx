import React from 'react';
import { Receipt, Users, ListTodo } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { formatCurrency } from '../utils/calculateSettlement';

interface BillSummaryProps {
  total: string;
  peopleCount: number;
  expenseCount?: number;
}

export const BillSummary: React.FC<BillSummaryProps> = ({ total, peopleCount, expenseCount }) => {
  return (
    <Card>
      <CardContent className="py-4 sm:py-6">
        <div className={`grid gap-4 sm:gap-6 text-center ${expenseCount !== undefined ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <div>
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl">
              <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mb-1">Tổng chi tiêu</p>
            <p className="text-lg sm:text-2xl font-bold text-zinc-100">{formatCurrency(total)}</p>
          </div>
          <div>
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mb-1">Số người</p>
            <p className="text-lg sm:text-2xl font-bold text-zinc-100">{peopleCount}</p>
          </div>
          {expenseCount !== undefined && (
            <div>
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 mb-1">Số chi tiêu</p>
              <p className="text-lg sm:text-2xl font-bold text-zinc-100">{expenseCount}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
