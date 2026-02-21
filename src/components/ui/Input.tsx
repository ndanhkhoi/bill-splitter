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
        <label className="text-sm font-medium text-zinc-300">{label}</label>
      )}
      <input
        className={`w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl
                   text-zinc-100 placeholder-zinc-500
                   focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50
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
        <label className="text-sm font-medium text-zinc-300">{label}</label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl
                   text-zinc-100 placeholder-zinc-500
                   focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50
                   backdrop-blur-xl transition-all resize-none ${className}`}
        {...props}
      />
    </div>
  );
};
