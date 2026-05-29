import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Type, Heading1, Square, Image as ImageIcon, Minus, Columns } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

/**
 * DraggableNodeList Component
 * Renders a list of draggable elements that can be dropped onto the canvas.
 */
export const DraggableNodeList = () => {
    const { isMobile, setOpen } = useSidebar();

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
        e.dataTransfer.setData('componentType', type);
        if (isMobile) {
            // Use setTimeout to delay the React state update until after the drag
            // has fully initialized. If called synchronously, React re-renders and
            // the browser cancels the drag because the DOM is mutating too early.
            setTimeout(() => {
                setOpen(false);
            }, 0);
        }
    };

    const draggableItemClasses = "flex flex-col items-center justify-center p-2 border border-border rounded cursor-move hover:bg-muted dark:hover:bg-zinc-800 transition-colors";
    const iconClasses = "mb-2 h-6 w-6 text-muted-foreground";
    const labelClasses = "text-muted-foreground font-medium";

    const items = [
        { type: 'text', icon: Type, label: 'Text' },
        { type: 'heading', icon: Heading1, label: 'Heading' },
        { type: 'block', icon: Square, label: 'Container' },
        { type: 'image', icon: ImageIcon, label: 'Image' },
        { type: 'divider', icon: Minus, label: 'Divider' },
        { type: 'row', icon: Columns, label: 'Row Columns' },
    ];

    return (
        <TabsContent value="layout" className="grid grid-cols-2 gap-2 text-xs">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type)}
                        className={draggableItemClasses}
                    >
                        <Icon className={iconClasses} />
                        <span className={labelClasses}>{item.label}</span>
                    </div>
                );
            })}
        </TabsContent>
    );
};
