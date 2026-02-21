import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  className = '',
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
            ${checked
              ? 'bg-gradient-to-r from-sky-500 to-sky-600 border-transparent'
              : 'border-zinc-600 bg-zinc-900/50 hover:border-zinc-500'
            }`}
        >
          {checked && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-zinc-300">{label}</span>}
    </label>
  );
};
