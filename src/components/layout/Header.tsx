import React from 'react';
import { Wallet, Home } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  onHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Chia Bill',
  showBackButton = false,
  onBack,
  onHome,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
        <button
          onClick={onHome}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          title="Về trang chủ"
        >
          <Home className="w-6 h-6 text-white" />
        </button>
      </div>
    </header>
  );
};
