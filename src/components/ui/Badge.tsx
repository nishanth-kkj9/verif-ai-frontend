import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-700/50 text-slate-200 border border-slate-600/30',
  success: 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30',
  warning: 'bg-amber-600/20 text-amber-300 border border-amber-500/30',
  error: 'bg-red-600/20 text-red-300 border border-red-500/30',
  info: 'bg-blue-600/20 text-blue-300 border border-blue-500/30',
  secondary: 'bg-purple-600/20 text-purple-300 border border-purple-500/30',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={`
        inline-flex items-center justify-center font-medium rounded-full
        ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

Badge.displayName = 'Badge';
