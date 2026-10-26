import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const HighlightContext = React.createContext(null);

function Highlight({
    children,
    className,
    containerClassName,
    enabled = true,
    controlledItems,
    forceUpdateBounds,
    hover,
    ...props
}) {
    const [active, setActive] = React.useState(null);

    const value = React.useMemo(
        () => ({
            active,
            setActive,
            enabled,
        }),
        [active, enabled],
    );

    return (
        <HighlightContext.Provider value={value}>
            <div
                className={cn(className, containerClassName)}
                onMouseLeave={() => setActive(null)}
                {...props}
            >
                {children}
            </div>
        </HighlightContext.Provider>
    );
}

const HighlightItem = React.forwardRef(function HighlightItem({
    children,
    activeClassName = "",
    className,
    onMouseEnter,
    ...props
}, ref) {
    const context = React.useContext(HighlightContext);
    const id = React.useId();
    const active = context?.active === id;

    return (
        <Slot.Root
            ref={ref}
            {...props}
            className={cn(className, active && context?.enabled && activeClassName)}
            data-highlight={active && context?.enabled ? "" : undefined}
            onMouseEnter={(event) => {
                onMouseEnter?.(event);
                context?.setActive(id);
            }}
        >
            {React.Children.only(children)}
        </Slot.Root>
    );
});

export { Highlight, HighlightItem };
