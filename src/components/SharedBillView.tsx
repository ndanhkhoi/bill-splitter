import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Wallet, Users, Receipt, ChevronDown, ChevronUp, ChevronsUpDown, Home, QrCode, CreditCard } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { calculateSettlement, formatCurrency } from '../utils/calculateSettlement';
import type { Bill, Expense } from '../types';
import Big from 'big.js';

// Danh sách tên ngân hàng đầy đủ
const BANK_NAMES: Record<string, string> = {
  'ICB': 'VietinBank',
  'VCB': 'Vietcombank',
  'BIDV': 'BIDV',
  'VBA': 'Agribank',
  'OCB': 'OCB',
  'MB': 'MBBank',
  'TCB': 'Techcombank',
  'ACB': 'ACB',
  'VPB': 'VPBank',
  'TPB': 'TPBank',
  'STB': 'Sacombank',
  'HDB': 'HDBank',
  'VCCB': 'VietCapitalBank',
  'SCB': 'SCB',
  'VIB': 'VIB',
  'SHB': 'SHB',
  'EIB': 'Eximbank',
  'MSB': 'MSB',
  'CAKE': 'CAKE',
  'Ubank': 'Ubank',
  'VTLMONEY': 'ViettelMoney',
  'TIMO': 'Timo',
  'VNPTMONEY': 'VNPTMoney',
  'SGICB': 'SaigonBank',
  'BAB': 'BacABank',
  'momo': 'MoMo',
  'PVDB': 'PVcomBank Pay',
  'PVCB': 'PVcomBank',
  'MBV': 'MBV',
  'NCB': 'NCB',
  'SHBVN': 'ShinhanBank',
  'ABB': 'ABBANK',
  'VAB': 'VietABank',
  'NAB': 'NamABank',
  'PGB': 'PGBank',
  'VIETBANK': 'VietBank',
  'BVB': 'BaoVietBank',
  'SEAB': 'SeABank',
  'COOPBANK': 'COOPBANK',
  'LPB': 'LPBank',
  'KLB': 'KienLongBank',
  'KBank': 'KBank',
  'MAFC': 'MAFC',
  'HLBVN': 'HongLeong',
  'KEBHANAHN': 'KEBHANAHN',
  'KEBHANAHCM': 'KEBHanaHCM',
  'CITIBANK': 'Citibank',
  'CBB': 'CBBank',
  'CIMB': 'CIMB',
  'DBS': 'DBSBank',
  'Vikki': 'Vikki',
  'VBSP': 'VBSP',
  'GPB': 'GPBank',
  'KBHCM': 'KookminHCM',
  'KBHN': 'KookminHN',
  'WVN': 'Woori',
  'VRB': 'VRB',
  'HSBC': 'HSBC',
  'IBK - HN': 'IBKHN',
  'IBK - HCM': 'IBKHCM',
  'IVB': 'IndovinaBank',
  'UOB': 'UnitedOverseas',
  'NHB HN': 'Nonghyup',
  'SCVN': 'StandardChartered',
  'PBVN': 'PublicBank',
};

interface SharedBillViewProps {
  bill: Bill;
  onGoHome: () => void;
}

// Helper để tính chi tiết cho từng người
interface PersonDetails {
  totalPaid: string;
  paidExpenses: Array<{ expense: Expense; amount: string }>;
  participatedExpenses: Array<{ expense: Expense; share: string }>;
}

function calculatePersonDetails(personId: string, bill: { expenses: Expense[] }): PersonDetails {
  const paidExpenses: Array<{ expense: Expense; amount: string }> = [];
  const participatedExpenses: Array<{ expense: Expense; share: string }> = [];
  let totalPaid = new Big(0);

  bill.expenses.forEach(expense => {
    const amount = new Big(expense.amount);

    // Người này trả tiền
    if (expense.payerId === personId) {
      totalPaid = totalPaid.plus(amount);
      paidExpenses.push({ expense, amount: expense.amount });
    }

    // Người này tham gia
    if (expense.participantIds.includes(personId)) {
      const sharePerPerson = amount.div(expense.participantIds.length);
      participatedExpenses.push({
        expense,
        share: sharePerPerson.round(0, Big.roundHalfUp).toFixed(0),
      });
    }
  });

  return {
    totalPaid: totalPaid.round(0, Big.roundHalfUp).toFixed(0),
    paidExpenses,
    participatedExpenses,
  };
}

export const SharedBillView: React.FC<SharedBillViewProps> = ({ bill, onGoHome }) => {
  // State để theo dõi những người đang mở rộng chi tiết (cho phép mở nhiều cùng lúc)
  const [expandedPersonIds, setExpandedPersonIds] = useState<Set<string>>(new Set());

  // Tính chi tiết cho từng người
  const personDetailsMap = useMemo(() => {
    const map = new Map<string, PersonDetails>();
    bill.people.forEach(person => {
      map.set(person.id, calculatePersonDetails(person.id, bill));
    });
    return map;
  }, [bill]);

  const { settlements, transactions, total } = calculateSettlement(bill);

  const dateStr = new Date(bill.date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const toggleExpand = (personId: string) => {
    setExpandedPersonIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(personId)) {
        newSet.delete(personId);
      } else {
        newSet.add(personId);
      }
      return newSet;
    });
  };

  const toggleExpandAll = () => {
    if (expandedPersonIds.size === bill.people.length) {
      // Đang mở hết -> thu gọn tất cả
      setExpandedPersonIds(new Set());
    } else {
      // Mở tất cả
      setExpandedPersonIds(new Set(bill.people.map(p => p.id)));
    }
  };

  const isAllExpanded = expandedPersonIds.size === bill.people.length;

  return (
    <div className="space-y-6">
      {/* Report Content */}
      <div className="space-y-6 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium mb-4">
            <Receipt className="w-4 h-4" />
            Được chia sẻ bởi bạn bè
          </div>
          <h1 className="text-3xl font-bold text-white">{bill.name}</h1>
          <p className="text-white/60">{dateStr}</p>
        </motion.div>

        {/* Summary */}
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
                <p className="text-2xl font-bold text-white">{bill.people.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settlement Details */}
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Chi tiết công nợ
              </h3>
              <button
                onClick={toggleExpandAll}
                className="text-xs text-white/60 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <ChevronsUpDown className="w-4 h-4" />
                {isAllExpanded ? 'Thu gọn tất cả' : 'Mở tất cả'}
              </button>
            </div>

            <div className="space-y-3">
              {settlements.map((settlement) => {
                const amount = parseFloat(settlement.amountOwed);
                const isOwed = amount > 0;
                const details = personDetailsMap.get(settlement.personId);
                const isExpanded = expandedPersonIds.has(settlement.personId);

                return (
                  <motion.div
                    key={settlement.personId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
                  >
                    {/* Main row - clickable */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => toggleExpand(settlement.personId)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                          ${isOwed
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : amount < 0
                              ? 'bg-gradient-to-r from-red-500 to-pink-600'
                              : 'bg-white/20'
                          }`}
                        >
                          {settlement.personName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-white font-medium">{settlement.personName}</span>
                          {details && details.totalPaid !== '0' && (
                            <p className="text-xs text-white/40">Đã chi: {formatCurrency(details.totalPaid)}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-lg font-bold
                            ${isOwed
                              ? 'text-green-400'
                              : amount < 0
                                ? 'text-red-400'
                                : 'text-white/60'
                            }`}
                          >
                            {isOwed ? '+' : ''}{formatCurrency(settlement.amountOwed)}
                          </p>
                          <p className="text-xs text-white/40">
                            {isOwed ? 'Cần nhận lại' : amount < 0 ? 'Cần trả thêm' : 'Đã cân bằng'}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-white/60" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white/60" />
                        )}
                      </div>
                    </div>

                    {/* Expandable details */}
                    {isExpanded && details && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-4 space-y-4 bg-black/20">
                          {/* Đã thanh toán */}
                          {details.paidExpenses.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Đã thanh toán ({details.paidExpenses.length} bill)
                              </p>
                              <div className="space-y-2 pl-4">
                                {details.paidExpenses.map(({ expense, amount }, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center text-sm bg-white/5 rounded-lg p-2"
                                  >
                                    <span className="text-white/70">{expense.name}</span>
                                    <span className="text-green-400 font-medium">{formatCurrency(amount)}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center text-sm pt-1 border-t border-white/10 mt-2">
                                  <span className="text-white/80 font-medium">Tổng đã chi</span>
                                  <span className="text-green-400 font-bold">{formatCurrency(details.totalPaid)}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tham gia */}
                          {details.participatedExpenses.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Tham gia ({details.participatedExpenses.length} bill)
                              </p>
                              <div className="space-y-2 pl-4">
                                {details.participatedExpenses.map(({ expense, share }, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center text-sm bg-white/5 rounded-lg p-2"
                                  >
                                    <span className="text-white/70">{expense.name}</span>
                                    <span className="text-blue-400 font-medium">{formatCurrency(share)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {details.paidExpenses.length === 0 && details.participatedExpenses.length === 0 && (
                            <p className="text-sm text-white/40 text-center py-2">Chưa có giao dịch nào</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Transactions - Ẩn tạm thời, xóa class 'hidden' để hiển thị lại */}
        {transactions.length > 0 && (
          <Card className="hidden">
            <CardContent className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowDownUp className="w-5 h-5" />
                Cách thanh toán tối ưu
              </h3>

              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl border border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white font-bold">
                        {transaction.from.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.from}</p>
                        <p className="text-xs text-white/60">chuyển cho</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ArrowDownUp className="w-5 h-5 text-white/60" />
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{formatCurrency(transaction.amount)}</p>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                        {transaction.to.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.to}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-center text-sm text-white/60">
                  Chỉ cần <span className="font-bold text-white">{transactions.length}</span> lần chuyển tiền
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code - Hiển thị nếu có thông tin ngân hàng */}
        {bill.bankCode && bill.accountNumber && (
          <Card>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Chuyển tiền qua QR
              </h3>

              <div className="space-y-4">
                {/* QR Code Image */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <img
                      src={`https://img.vietqr.io/image/${bill.bankCode}-${bill.accountNumber}-print.jpg`}
                      alt="VietQR Code"
                      className="w-64 h-64 object-contain"
                      onError={(e) => {
                        console.error('Failed to load QR code:', e);
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f3f4f6" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="14">Lỗi load QR</text></svg>');
                      }}
                    />
                  </div>
                </div>

                {/* Bank Info */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/20 to-teal-600/20 rounded-2xl border border-white/20">
                  <CreditCard className="w-8 h-8 text-green-400" />
                  <div className="flex-1">
                    <p className="text-white font-bold text-lg">{BANK_NAMES[bill.bankCode] || bill.bankCode}</p>
                    <p className="text-white/80 font-mono">{bill.accountNumber}</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="w-full p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <p className="text-sm text-white/70 text-center">
                    1. Mở app ngân hàng của bạn<br />
                    2. Chọn "Quét mã" hoặc "VietQR"<br />
                    3. Quét mã bên trên để chuyển tiền
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-white/40 text-sm pt-4">
          <p>Được tạo bởi Chia Bill App</p>
          <p className="text-xs mt-1">{dateStr}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="primary" onClick={onGoHome} className="w-full">
          <Home className="w-5 h-5 mr-2" />
          Tạo bill của bạn
        </Button>
      </div>
    </div>
  );
};
