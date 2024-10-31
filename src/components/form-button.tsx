import * as React from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils'; // Ensure this utility is available for class name composition
import { buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';

const customButtonStyles = cn(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 h-9 px-4 py-2 group relative w-full gap-2 overflow-hidden font-semibold tracking-tighter transform-gpu transition-all ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2',
);

interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const FormButton = React.forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          buttonVariants({ variant: 'default', size: 'default' }),
          customButtonStyles,
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* Animated overlay */}
        <span className='absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform-gpu bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-96 dark:bg-black'></span>
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);

FormButton.displayName = 'FormButton';

export { FormButton, type FormButtonProps };
