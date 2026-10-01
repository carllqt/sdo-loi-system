import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef(({ className, ...props }, ref) => <AvatarPrimitive.Root ref={ref} className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)} {...props} />);
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => <AvatarPrimitive.Image ref={ref} className={cn('aspect-square size-full object-cover', className)} {...props} />);
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => <AvatarPrimitive.Fallback ref={ref} className={cn('flex size-full items-center justify-center rounded-full bg-muted', className)} {...props} />);

export { Avatar, AvatarImage, AvatarFallback };
