import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronDown, ChevronUp, ChevronsUpDown, QrCode, Download } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { formatCurrency } from '../utils/calculateSettlement';
import type { Settlement } from '../types';
import type { PersonDetails } from '../utils/calculatePersonDetails';

interface SettlementDetailsCardProps {
  settlements: Settlement[];
  personDetailsMap: Map<string, PersonDetails>;
  peopleCount: number;
  bankCode?: string;
  accountNumber?: string;
  billName?: string;
}

export const SettlementDetailsCard: React.FC<SettlementDetailsCardProps> = ({
  settlements,
  personDetailsMap,
  peopleCount,
  bankCode,
  accountNumber,
  billName = '',
}) => {
  const [expandedPersonIds, setExpandedPersonIds] = useState<Set<string>>(new Set());
  const [downloadingQr, setDownloadingQr] = useState<string | null>(null);

  const downloadQR = async (personName: string, amount: number) => {
    if (!bankCode || !accountNumber) return;

    setDownloadingQr(personName);
    try {
      const response = await fetch(
        `https://img.vietqr.io/image/${bankCode}-${accountNumber}-print.png?amount=${amount}&addInfo=${encodeURIComponent(`${personName} share bill ${billName}`)}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-chuyen-tien-${personName.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR:', error);
    } finally {
      setDownloadingQr(null);
    }
  };

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
    if (expandedPersonIds.size === peopleCount) {
      setExpandedPersonIds(new Set());
    } else {
      setExpandedPersonIds(new Set(settlements.map(s => s.personId)));
    }
  };

  const isAllExpanded = expandedPersonIds.size === peopleCount;

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Chi tiết chia tiền</h3>
            </div>
            <p className="text-xs text-white/40 mt-1 ml-9 sm:ml-11">Nhấn vào dòng để xem chi tiết</p>
          </div>
          <button
            onClick={toggleExpandAll}
            className="text-xs text-white/60 hover:text-white flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            <ChevronsUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{isAllExpanded ? 'Thu gọn tất cả' : 'Mở tất cả'}</span>
            <span className="sm:hidden">{isAllExpanded ? 'Thu gọn' : 'Mở hết'}</span>
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
                  className="flex items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleExpand(settlement.personId)}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0
                      ${isOwed
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : amount < 0
                          ? 'bg-gradient-to-r from-red-500 to-pink-600'
                          : 'bg-white/20'
                      }`}
                    >
                      <span className="text-sm">{settlement.personName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-white font-medium text-sm sm:text-base block truncate">{settlement.personName}</span>
                      {details && details.totalPaid !== '0' && (
                        <p className="text-xs text-white/40">Đã chi: {formatCurrency(details.totalPaid)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-right">
                      <p className={`text-base sm:text-lg font-bold
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
                        {isOwed ? 'Cần nhận' : amount < 0 ? 'Cần trả' : 'Đã cân bằng'}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 flex-shrink-0" />
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
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-black/20">
                      {/* Đã thanh toán */}
                      {details.paidExpenses.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Đã thanh toán ({details.paidExpenses.length} bill)
                          </p>
                          <div className="space-y-2 pl-3 sm:pl-4">
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
                          <div className="space-y-2 pl-3 sm:pl-4">
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

                      {/* QR Code cho người cần trả tiền */}
                      {amount < 0 && bankCode && accountNumber && (
                        <div className="pt-3 border-t border-white/10">
                          <p className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                            <QrCode className="w-4 h-4" />
                            Chuyển tiền qua QR
                          </p>
                          <div className="flex flex-col items-center gap-4">
                            <div className="bg-white p-0 rounded-2xl shadow-lg">
                              <img
                                src={`https://img.vietqr.io/image/${bankCode}-${accountNumber}-print.png?amount=${Math.abs(amount)}&addInfo=${encodeURIComponent(`${settlement.personName} share bill ${billName}`)}`}
                                alt="VietQR Code"
                                className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
                                onError={(e) => {
                                  console.error('Failed to load QR code:', e);
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="224" height="224" viewBox="0 0 200 200"><rect fill="#f3f4f6" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="14">Lỗi load QR</text></svg>');
                                }}
                              />
                            </div>
                            <button
                              onClick={() => downloadQR(settlement.personName, Math.abs(amount))}
                              disabled={downloadingQr === settlement.personName}
                              className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Lưu QR về máy"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
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
  );
};
