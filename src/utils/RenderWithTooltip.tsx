import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useState, useRef } from 'react';

const RenderWithTooltip = React.forwardRef<
    HTMLElement,
    {
        trigger: React.ReactElement<Record<string, unknown>> & { ref?: React.Ref<HTMLElement> },
        content: React.ReactNode,
        onlyOnOverflow?: boolean,
        side?: "top" | "bottom" | "left" | "right"
    } & React.HTMLAttributes<HTMLElement>
>(({
    trigger,
    content,
    onlyOnOverflow = true,
    side = 'top',
    ...props
}, ref) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const triggerRef = useRef<HTMLElement | null>(null);

    const handleMouseEnter = () => {
        if (!onlyOnOverflow) {
            setIsOverflowing(true);
            return;
        }

        if (triggerRef.current) {
            const { scrollWidth, offsetWidth, scrollHeight, offsetHeight } = triggerRef.current;
            const hasOverflow = scrollWidth > offsetWidth || scrollHeight > offsetHeight;
            setIsOverflowing(hasOverflow);
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild onMouseEnter={handleMouseEnter} {...props}>
                {React.cloneElement(trigger as React.ReactElement<{ ref?: React.Ref<HTMLElement> }>, {
                    ...props,
                    ref: (node: HTMLElement | null) => {
                        // Set our local ref
                        triggerRef.current = node;

                        // Propagate to the component ref
                        if (typeof ref === 'function') {
                            ref(node);
                        } else if (ref) {
                            (ref as React.MutableRefObject<HTMLElement | null>).current = node;
                        }

                        // Propagate to the original ref of the trigger
                        const originalRef = trigger.ref;
                        if (typeof originalRef === 'function') {
                            originalRef(node);
                        } else if (originalRef && typeof originalRef === 'object' && 'current' in originalRef) {
                            (originalRef as React.MutableRefObject<HTMLElement | null>).current = node;
                        }
                    }
                })}
            </TooltipTrigger>
            {(!onlyOnOverflow || isOverflowing) && (
                <TooltipContent side={side}>
                    {content}
                </TooltipContent>
            )}
        </Tooltip>
    );
});

RenderWithTooltip.displayName = "RenderWithTooltip";

export default RenderWithTooltip;
