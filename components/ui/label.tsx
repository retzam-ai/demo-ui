'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '#/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none text-right peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  uiRequired?: boolean;
  asterixClassName?: string;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, uiRequired, ...props }, ref) => (
  <div className="flex items-center">
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
    {uiRequired && (
      <div className={`ml-1 flex items-start ${props.asterixClassName || ''}`}>
        <span className="text-muted-foreground text-sm">*</span>
      </div>
    )}{' '}
    {!uiRequired && (
      <div className={`ml-1 flex items-start ${props.asterixClassName || ''}`}>
        <span className="text-sm text-transparent">*</span>
      </div>
    )}
  </div>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
