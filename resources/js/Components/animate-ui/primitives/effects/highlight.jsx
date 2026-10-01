import * as React from 'react';
import { cn } from '@/lib/utils';

const HighlightContext = React.createContext(null);

function Highlight({ children, className, containerClassName, enabled = true, ...props }) {
    const [active, setActive] = React.useState(null);
    const value = React.useMemo(() => ({ active, setActive, enabled }), [active, enabled]);
    return (
        <HighlightContext.Provider value={value}>
            <div className={cn(className, containerClassName)} onMouseLeave={() => setActive(null)} {...props}>{children}</div>
        </HighlightContext.Provider>
    );
}

function HighlightItem({ children, activeClassName = '', className, ...props }) {
    const context = React.useContext(HighlightContext);
    const id = React.useId();
    const active = context?.active === id;
    return React.cloneElement(React.Children.only(children), {
        ...props,
        className: cn(children.props.className, className, active && context?.enabled && activeClassName),
        'data-highlight': active && context?.enabled ? '' : undefined,
        onMouseEnter: (event) => {
            children.props.onMouseEnter?.(event);
            context?.setActive(id);
        },
    });
}

export { Highlight, HighlightItem };
