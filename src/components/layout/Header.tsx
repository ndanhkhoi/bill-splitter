import React from 'react';
import { Home } from 'lucide-react';

interface HeaderProps {
  onHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHome }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
        <div className="flex items-center gap-1 flex-1">
          <h1 className="text-xl font-bold tracking-tight px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <span className="text-white">Chia</span>
            <span className="ml-1 px-2 py-0.5 bg-white rounded-md text-purple-600">Bill</span>
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
