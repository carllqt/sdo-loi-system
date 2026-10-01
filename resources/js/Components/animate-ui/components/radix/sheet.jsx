import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetContent = React.forwardRef(function SheetContent(
    { side = 'right', className, children, ...props },
    ref,
) {
    const sideClasses = {
        left: 'inset-y-0 left-0 h-full border-r data-[state=closed]:-translate-x-full',
        right: 'inset-y-0 right-0 h-full border-l data-[state=closed]:translate-x-full',
        top: 'inset-x-0 top-0 border-b data-[state=closed]:-translate-y-full',
        bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:translate-y-full',
    };
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out" />
            <DialogPrimitive.Content
                ref={ref}
                data-side={side}
                className={cn('fixed z-50 flex flex-col bg-background shadow-lg outline-none transition-transform duration-300', sideClasses[side], className)}
                {...props}
            >
                {children}
                <DialogPrimitive.Close aria-label="Close" className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
                    <X className="size-4" />
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
});

const SheetHeader = ({ className, ...props }) => <div className={cn('flex flex-col gap-2 p-4', className)} {...props} />;
const SheetTitle = React.forwardRef((props, ref) => <DialogPrimitive.Title ref={ref} {...props} />);
const SheetDescription = React.forwardRef((props, ref) => <DialogPrimitive.Description ref={ref} {...props} />);

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetDescription };
