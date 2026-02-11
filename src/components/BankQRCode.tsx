import React from 'react';
import { QrCode, CreditCard } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { BANK_NAMES } from '../constants/bankNames';

interface BankQRCodeProps {
  bankCode: string;
  accountNumber: string;
  variant?: 'compact' | 'print';
}

export const BankQRCode: React.FC<BankQRCodeProps> = ({
  bankCode,
  accountNumber,
  variant = 'compact',
}) => {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 bg-gradient-to-r from-teal-500 to-green-600 rounded-xl">
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Chuyển tiền qua QR</h3>
        </div>

        <div className="space-y-4">
          {/* QR Code Image */}
          <div className="flex justify-center">
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg">
              <img
                src={`https://img.vietqr.io/image/${bankCode}-${accountNumber}-${variant}.jpg`}
                alt="VietQR Code"
                className="w-52 h-52 sm:w-64 sm:h-64 object-contain"
                onError={(e) => {
                  console.error('Failed to load QR code:', e);
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f3f4f6" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="14">Lỗi load QR</text></svg>');
                }}
              />
            </div>
          </div>

          {/* Bank Info */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/20 to-teal-600/20 rounded-2xl border border-white/20">
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base sm:text-lg truncate">{BANK_NAMES[bankCode] || bankCode}</p>
              <p className="text-white/80 font-mono text-sm sm:text-base">{accountNumber}</p>
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
  );
};
