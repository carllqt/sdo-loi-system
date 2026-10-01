import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

const TooltipProvider = ({ children, ...props }) => <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(function TooltipContent(
    { className, sideOffset = 4, hidden, ...props },
    ref,
) {
    if (hidden) return null;
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} className={cn('z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md', className)} {...props} />
        </TooltipPrimitive.Portal>
    );
});

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
