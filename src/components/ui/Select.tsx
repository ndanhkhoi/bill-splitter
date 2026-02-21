import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Chọn...',
  className = '',
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-zinc-300">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl
                   text-zinc-100
                   focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50
                   backdrop-blur-xl transition-all cursor-pointer ${className}`}
      >
        <option value="" className="bg-zinc-900">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-zinc-900">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
