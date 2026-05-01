import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const v: Record<string, string> = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-white/20 bg-transparent hover:bg-white/10 text-white',
      ghost: 'hover:bg-white/10 text-white',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    };
    const s: Record<string, string> = {
      default: 'h-9 px-4 py-2', sm: 'h-8 px-3 text-xs', lg: 'h-10 px-6', icon: 'h-8 w-8',
    };
    return (
      <button ref={ref} className={cn('inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer', v[variant], s[size], className)} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button };
