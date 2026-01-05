import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}: InputProps) {
  const baseStyles = 'px-3 py-3 rounded border text-base box-border transition-colors';
  const errorStyles = error ? 'border-red-600' : 'border-gray-300';
  const disabledStyles = disabled ? 'bg-gray-100' : 'bg-white';
  const widthStyle = fullWidth ? 'w-full' : '';
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block mb-2 font-bold">
          {label}
        </label>
      )}
      <input
        className={`${baseStyles} ${errorStyles} ${disabledStyles} ${widthStyle} ${className}`}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="text-red-600 text-sm mt-2">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
