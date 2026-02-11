import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface ScreenHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = false,
  onBack,
}) => {
  if (!showBackButton && !title) return null;

  return (
    <div className="flex items-center gap-3 mb-6">
      {showBackButton && (
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      {title && (
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      )}
    </div>
  );
};
