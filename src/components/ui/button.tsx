import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glow';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const variantStyles = {
      default:
        'bg-[#1D4ED8] text-white hover:bg-[#1E40AF] border border-[#1D4ED8] active:bg-[#1E3A8A]',
      destructive:
        'bg-[#B91C1C] text-white hover:bg-[#991B1B] border border-[#B91C1C] active:bg-[#7F1D1D]',
      outline:
        'border border-[#D9DEE5] bg-white hover:bg-[#F5F7FA] text-[#0F172A] active:bg-[#E2E8F0]',
      secondary:
        'bg-white text-[#0F172A] border border-[#D9DEE5] hover:bg-[#F5F7FA] active:bg-[#E2E8F0]',
      ghost:
        'hover:bg-[#F5F7FA] text-[#475569] hover:text-[#0F172A] active:bg-[#E2E8F0]',
      link:
        'text-[#1D4ED8] underline-offset-4 hover:underline p-0 h-auto font-normal',
      glow:
        'bg-[#1D4ED8] text-white hover:bg-[#1E40AF] border border-[#1D4ED8] active:bg-[#1E3A8A]',
    }[variant];

    const sizeStyles = {
      default: 'h-9 px-4 py-2 text-xs font-sans font-medium',
      sm: 'h-7 px-3 text-[11px] font-sans font-medium',
      lg: 'h-10 px-5 text-xs font-sans font-semibold',
      icon: 'h-8 w-8 p-0',
    }[size];

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-[3px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer',
          variantStyles,
          sizeStyles,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
