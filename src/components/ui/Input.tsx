import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-white/80">{label}</label>
      )}
      <input
        className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl
                   text-white placeholder-white/40
                   focus:outline-none focus:ring-2 focus:ring-purple-500/50
                   backdrop-blur-xl transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-white/80">{label}</label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl
                   text-white placeholder-white/40
                   focus:outline-none focus:ring-2 focus:ring-purple-500/50
                   backdrop-blur-xl transition-all resize-none ${className}`}
        {...props}
      />
    </div>
  );
};
