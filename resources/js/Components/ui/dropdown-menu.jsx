import * as React from 'react';
import { DropdownMenu as Menu } from 'radix-ui';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DropdownMenu = Menu.Root;
const DropdownMenuTrigger = Menu.Trigger;
const DropdownMenuGroup = Menu.Group;
const DropdownMenuPortal = Menu.Portal;
const DropdownMenuSub = Menu.Sub;
const DropdownMenuRadioGroup = Menu.RadioGroup;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => <Menu.SubTrigger ref={ref} className={cn('flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent', inset && 'pl-8', className)} {...props}>{children}<ChevronRight className="ml-auto size-4" /></Menu.SubTrigger>);
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => <Menu.SubContent ref={ref} className={cn('z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md', className)} {...props} />);
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => <Menu.Portal><Menu.Content ref={ref} sideOffset={sideOffset} className={cn('z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md', className)} {...props} /></Menu.Portal>);
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => <Menu.Item ref={ref} className={cn('relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0', inset && 'pl-8', className)} {...props} />);
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => <Menu.CheckboxItem ref={ref} checked={checked} className={cn('relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)} {...props}><span className="absolute left-2 flex size-3.5 items-center justify-center"><Menu.ItemIndicator><Check className="size-4" /></Menu.ItemIndicator></span>{children}</Menu.CheckboxItem>);
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => <Menu.RadioItem ref={ref} className={cn('relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)} {...props}><span className="absolute left-2 flex size-3.5 items-center justify-center"><Menu.ItemIndicator><Circle className="size-2 fill-current" /></Menu.ItemIndicator></span>{children}</Menu.RadioItem>);
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => <Menu.Label ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)} {...props} />);
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => <Menu.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />);
const DropdownMenuShortcut = ({ className, ...props }) => <span className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props} />;

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup };
