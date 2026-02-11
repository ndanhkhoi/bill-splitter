import React from 'react';
import { Receipt, Users } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { formatCurrency } from '../utils/calculateSettlement';

interface BillSummaryProps {
  total: string;
  peopleCount: number;
}

export const BillSummary: React.FC<BillSummaryProps> = ({ total, peopleCount }) => {
  return (
    <Card>
      <CardContent className="py-6">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-white/60 mb-1">Tổng chi tiêu</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
          </div>
          <div>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-white/60 mb-1">Số người</p>
            <p className="text-2xl font-bold text-white">{peopleCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
