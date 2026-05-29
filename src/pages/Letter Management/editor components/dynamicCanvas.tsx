import { useEditor, type ComponentType } from './EditorContext';
import { Trash2, GripVertical } from 'lucide-react';
import React, { useState } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import TiptapInlineEditor from './TiptapInlineEditor';

const getGridTemplateColumns = (gridType?: string) => {
    switch (gridType) {
        case '100': return '1fr';
        case '50-50': return '1fr 1fr';
        case '33-33-33': return '1fr 1fr 1fr';
        case '25-25-25-25': return '1fr 1fr 1fr 1fr';
        case '33-67': return '1fr 2fr';
        case '67-33': return '2fr 1fr';
        case '75-25': return '3fr 1fr';
        case '25-75': return '1fr 3fr';
        default: return '1fr 1fr';
    }
};

const NodeControls = ({ nodeId }: { nodeId: string }) => {
    const { deleteNode } = useEditor();
    // Access the layout settings sidebar context (inner SidebarProvider)
    // so we can close it on mobile when the user starts dragging a node.
    const { isMobile, setOpen } = useSidebar();

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('moveNodeId', nodeId);
        e.stopPropagation();
        // On mobile, close the layout settings sidebar so the canvas is accessible.
        // Use setTimeout to delay the React state update until after the drag
        // has fully initialized.
        if (isMobile) {
            setTimeout(() => {
                setOpen(false);
            }, 0);
        }
    };

    return (
        <div className="absolute -top-7 right-0 bg-[#202C4B] text-white flex items-center rounded-t-md overflow-hidden shadow-md z-50">
            <div
                className="px-2 py-1.5 cursor-move hover:bg-white/10 transition-colors"
                draggable
                onDragStart={handleDragStart}
                title="Move"
            >
                <GripVertical size={14} />
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); deleteNode(nodeId); }}
                className="px-2 py-1.5 hover:bg-red-500 transition-colors"
                title="Delete"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
};

const RecursiveRenderer = ({ nodeId }: { nodeId: string }) => {
    const { state, selectNode, addNode, moveNode, editingNodeId, setEditingNodeId } = useEditor();
    const node = state.nodes[nodeId];

    const [dragOverPos, setDragOverPos] = useState<'top' | 'bottom' | null>(null);

    if (!node) return null;

    const { type, props, children } = node;
    const isSelected = state.selectedNodeId === nodeId;
    const isEditing = editingNodeId === nodeId;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        selectNode(nodeId);
        if (['text', 'heading', 'paragraph'].includes(type)) {
            setEditingNodeId(nodeId);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverPos(null);

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const dropAtTop = (e.clientY - rect.top) < (rect.height / 2);
        const targetIndex = dropAtTop ? 0 : children.length;

        const componentType = e.dataTransfer.getData('componentType') as ComponentType;
        const moveNodeId = e.dataTransfer.getData('moveNodeId');

        if (componentType) {
            addNode(componentType, nodeId, targetIndex);
        } else if (moveNodeId && moveNodeId !== nodeId) {
            moveNode(moveNodeId, nodeId, targetIndex);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const dropAtTop = (e.clientY - rect.top) < (rect.height / 2);
        setDragOverPos(dropAtTop ? 'top' : 'bottom');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOverPos(null);
    };

    const commonClasses = `relative transition-all duration-200 ${isSelected ? 'outline-2 outline-theme outline-offset-1 z-40' : 'hover:outline-1 hover:outline-theme/50'} ${dragOverPos === 'top' ? 'border-t-4 border-t-theme' : dragOverPos === 'bottom' ? 'border-b-4 border-b-theme' : ''}`;

    // Build common style object
    const commonStyle: React.CSSProperties = {
        padding: props.padding,
        margin: props.margin,
        backgroundColor: props.backgroundColor,
        backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderWidth: props.borderWidth,
        borderStyle: props.borderStyle as React.CSSProperties['borderStyle'],
        borderColor: props.borderColor,
    };

    if (type !== 'image') {
        commonStyle.width = props.width;
        commonStyle.height = props.height;
    } else {
        commonStyle.width = '100%';
    }

    const typographyStyle: React.CSSProperties = {
        fontFamily: props.fontFamily,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        fontStyle: props.fontStyle,
        textDecoration: props.textDecoration,
        color: props.color,
        textAlign: props.textAlign,
        lineHeight: props.lineHeight,
        letterSpacing: props.letterSpacing,
    };

    const renderChildren = () => children.map(childId => <RecursiveRenderer key={childId} nodeId={childId} />);

    const renderEmptyState = (text: string) => (
        <div className="flex flex-col items-center justify-center p-6 bg-muted/30 border border-dashed border-muted-foreground/30 text-muted-foreground text-xs min-h-[100px] pointer-events-none">
            {text}
        </div>
    );

    /** Wraps content in a list element when listType is set */
    const renderListWrapper = (content: React.ReactNode, listType?: string) => {
        if (!listType || listType === 'none') return content;
        if (listType === 'unordered') return <ul className="list-disc pl-6">{content}</ul>;
        if (listType === 'ordered') return <ol className="list-decimal pl-6">{content}</ol>;
        return content;
    };

    /**
     * Renders text content — either as an inline TipTap editor (when editing)
     * or as static HTML (when viewing). Uses dangerouslySetInnerHTML for
     * static display to render stored HTML formatting (bold, italic, lists, etc.)
     */
    const renderTextContent = () => {
        if (isEditing) {
            return (
                <TiptapInlineEditor
                    nodeId={nodeId}
                    style={typographyStyle}
                />
            );
        }

        // Static display — render stored HTML content
        const textContent = props.text || '';
        const hasHtmlTags = /<[^>]+>/.test(textContent);

        if (hasHtmlTags) {
            return (
                <div
                    className="tiptap-content w-full"
                    dangerouslySetInnerHTML={{ __html: textContent }}
                />
            );
        }

        // Plain text fallback (for nodes that haven't been edited with TipTap yet)
        return <>{textContent}</>;
    };

    const renderWrapper = ({ children: innerChildren, isLayout = false, tag = 'div', style = {}, className = '', ...rest }: { children?: React.ReactNode, isLayout?: boolean, tag?: React.ElementType, style?: React.CSSProperties, className?: string, [key: string]: unknown }) => {
        const Tag = tag;
        return (
            <Tag
                onClick={handleClick}
                onDrop={isLayout ? handleDrop : undefined}
                onDragOver={isLayout ? handleDragOver : undefined}
                onDragLeave={isLayout ? handleDragLeave : undefined}
                className={`${commonClasses} ${className}`.trim()}
                style={{ ...commonStyle, ...style }}
                {...rest}
            >
                {isSelected && type !== 'root' && <NodeControls nodeId={nodeId} />}
                {innerChildren}
                {isLayout && children.length === 0 && renderEmptyState('No content here. Drag content from right.')}
            </Tag>
        );
    };

    switch (type) {
        case 'root':
            return (
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`w-full flex-1 flex flex-col ${isSelected ? 'outline-2 outline-theme -outline-offset-2' : ''}`}
                    style={commonStyle}
                >
                    {renderChildren()}
                    {children.length === 0 && renderEmptyState('Canvas is empty. Drag layout blocks or content here.')}
                </div>
            );
        case 'heading': {
            const H = (props.level || 'h2') as React.ElementType;
            let defaultHeadingClass = '';
            switch (props.level || 'h2') {
                case 'h1': defaultHeadingClass = 'text-4xl font-extrabold'; break;
                case 'h2': defaultHeadingClass = 'text-3xl font-bold'; break;
                case 'h3': defaultHeadingClass = 'text-2xl font-bold'; break;
                case 'h4': defaultHeadingClass = 'text-xl font-bold'; break;
                case 'h5': defaultHeadingClass = 'text-lg font-bold'; break;
                case 'h6': defaultHeadingClass = 'text-base font-bold'; break;
            }

            // When editing inline, use a div wrapper instead of heading tag
            // because TipTap manages its own heading elements
            if (isEditing) {
                return renderWrapper({ tag: "div", className: defaultHeadingClass, style: typographyStyle, children: renderTextContent() });
            }

            const headingContent = renderListWrapper(
                renderWrapper({ tag: H, className: defaultHeadingClass, style: typographyStyle, children: renderTextContent() }),
                props.listType
            );
            return headingContent;
        }
        case 'text':
        case 'paragraph':
            // When editing inline, use a div wrapper instead of <p>
            // because TipTap generates its own <p> tags inside
            if (isEditing) {
                return renderWrapper({ tag: "div", style: typographyStyle, children: renderTextContent() });
            }

            return renderListWrapper(
                renderWrapper({ tag: "div", style: typographyStyle, children: renderTextContent() }),
                props.listType
            );
        case 'block':
        case 'column':
            return renderWrapper({ isLayout: true, children: renderChildren() });
        case 'image':
            return renderWrapper({
                style: { textAlign: props.alignment },
                children: props.src ? (
                    <img
                        src={props.src}
                        alt={props.alt || ''}
                        style={{
                            width: props.width || '100%',
                            objectFit: props.objectFit || 'cover',
                            display: 'inline-block'
                        }}
                    />
                ) : (
                    <div className="bg-muted flex items-center justify-center min-h-[150px] w-full text-muted-foreground text-sm">
                        No image selected
                    </div>
                )
            });
        case 'divider':
            return renderWrapper({
                style: { textAlign: props.alignment, margin: `${props.marginY || '16px'} 0` },
                children: (
                    <div style={{
                        borderTopWidth: props.thickness,
                        borderTopStyle: props.borderStyle || 'solid',
                        borderTopColor: props.borderColor || props.color,
                        width: '100%'
                    }} />
                )
            });
        case 'row':
            return renderWrapper({
                style: {
                    display: 'grid',
                    gridTemplateColumns: getGridTemplateColumns(props.gridType),
                    gap: props.gap
                },
                children: renderChildren()
            });
        default:
            return null;
    }
};

export default function DynamicCanvas() {
    return (
        <div className="w-full flex-1 flex flex-col">
            <RecursiveRenderer nodeId="root" />
        </div>
    );
}
