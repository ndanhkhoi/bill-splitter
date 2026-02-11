import React from 'react';

interface BillFooterProps {
  dateStr: string;
}

export const BillFooter: React.FC<BillFooterProps> = ({ dateStr }) => {
  return (
    <div className="text-center text-white/40 text-sm pt-4">
      <p>Được tạo bởi Chia Bill App</p>
      <p className="text-xs mt-1">{dateStr}</p>
    </div>
  );
};
