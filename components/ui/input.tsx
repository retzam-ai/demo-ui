import * as React from 'react';

import { cn } from '#/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  append?: React.ReactNode | string;
  prepend?: React.ReactNode | string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, append, prepend, ...props }, ref) => {
    return (
      <div className="flex">
        {prepend && (
          <div
            className={cn(
              'border-input ring-offset-background flex items-center rounded-md rounded-r-none border border-r-0 bg-transparent px-3 py-2 text-sm',
            )}
          >
            {prepend}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 grow rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
            {
              'rounded-l-none border-l-transparent': prepend,
              'rounded-r-none border-r-transparent': append,
            },
          )}
          ref={ref}
          autoComplete="aus"
          data-form-type="other"
          data-lpignore="true"
          {...props}
        />
        {/* {!append && <div className="mr-1" />} */}
        {append && (
          <div
            className={cn(
              'border-input ring-offset-background flex items-center rounded-md rounded-l-none border border-l-0 bg-transparent px-3 py-2 text-sm',
            )}
          >
            {append}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
