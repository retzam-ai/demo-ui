import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '#/lib/utils';
import LoadingSpinner from '#/components/ui/loading-spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background relative',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-secondary text-secondary-foreground hover:bg-destructive/90 hover:text-destructive-foreground',
        alwaysDestructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary bg-button-background-color text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground ',
        quiet:
          'hover:bg-accent hover:text-accent-foreground bg-card-background-color',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        xs: 'h-8 px-2 rounded-md',
        xxs: 'h-6 px-1.5 rounded-md',
        icon: 'h-10 w-10',
      },
      loading: {
        true: 'opacity-50 pointer-events-none flex items-center justify-center gap-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  start?: React.ReactNode;
  end?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, start, end, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={!!loading}
        {...props}
      >
        {!!start && <div className="absolute left-4">{start}</div>}
        {loading && <LoadingSpinner size="xs" />}
        {props.children}
        {!!end && <div className="absolute right-4">{end}</div>}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
