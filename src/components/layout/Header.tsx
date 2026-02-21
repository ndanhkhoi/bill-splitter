import React from 'react';
import { Home, Receipt } from 'lucide-react';

interface HeaderProps {
  onHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHome }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/50 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
        <div className="flex items-center gap-1 flex-1">
          {/* Logo with Icon + Text */}
          <div className="flex items-center gap-2.5">
            {/* Icon Container */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Receipt className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              {/* Accent Dot */}
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-zinc-950" />
            </div>

            {/* Text */}
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-zinc-100 tracking-tight">
                Chia<span className="text-sky-400">Bill</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">
                Split expenses easily
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onHome}
          className="p-2 rounded-xl hover:bg-zinc-800/50 transition-colors cursor-pointer"
          title="Về trang chủ"
          aria-label="Về trang chủ"
        >
          <Home className="w-6 h-6 text-zinc-400" />
        </button>
      </div>
    </header>
  );
};
