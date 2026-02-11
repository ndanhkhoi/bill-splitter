import React from 'react';
import { Wallet, Home } from 'lucide-react';

interface HeaderProps {
  onHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHome }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-blue-500 rounded-xl">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">
            <span className="text-blue-400">Chia</span>
            <span className="text-purple-400"> Bill</span>
          </h1>
        </div>
        <button
          onClick={onHome}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          title="Về trang chủ"
          aria-label="Về trang chủ"
        >
          <Home className="w-6 h-6 text-white" />
        </button>
      </div>
    </header>
  );
};
