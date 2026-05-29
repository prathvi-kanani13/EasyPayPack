import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useEditor, type ComponentProps } from './EditorContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Undo2,
    Redo2,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    ChevronDown,
    List,
    ListOrdered,
    SquareDashed,
    Menu,
    Type,
} from 'lucide-react';
import { FontSelector, useInjectGoogleFonts } from './fontSelector';
import { ALL_AVAILABLE_FIELDS } from './availableFields';

// ─────────────────────────────────────────────────────────────────────────────
// List type options
// ─────────────────────────────────────────────────────────────────────────────
type ListTypeValue = 'none' | 'unordered' | 'ordered' | 'checklist';

const LIST_OPTIONS: { label: string; value: ListTypeValue; icon: React.ReactNode }[] = [
    { label: 'None', value: 'none', icon: <SquareDashed size={14} /> },
    { label: 'Bullet List', value: 'unordered', icon: <List size={14} /> },
    { label: 'Numbered List', value: 'ordered', icon: <ListOrdered size={14} /> },
];

// ─────────────────────────────────────────────────────────────────────────────
// Small reusable toolbar button wrapper with tooltip
// ─────────────────────────────────────────────────────────────────────────────
interface ToolbarButtonProps {
    tooltip: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

/** A compact icon button with a tooltip for use in the editor toolbar */
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ tooltip, active, disabled, onClick, children }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button
                type="button"
                variant={active ? 'secondary' : 'ghost'}
                size="icon-sm"
                disabled={disabled}
                onClick={onClick}
                className={`h-7 w-7 rounded shrink-0 ${active ? 'ring-1 ring-theme/60' : ''}`}
            >
                {children}
            </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
            {tooltip}
        </TooltipContent>
    </Tooltip>
);

// ─────────────────────────────────────────────────────────────────────────────
// List type selector (compact dropdown)
// ─────────────────────────────────────────────────────────────────────────────
interface ListSelectorProps {
    value: ListTypeValue;
    onChange: (v: ListTypeValue) => void;
    disabled?: boolean;
}

/** Dropdown selector for bullet / numbered / checklist / none list types */
const ListSelector: React.FC<ListSelectorProps> = ({ value, onChange, disabled }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const current = LIST_OPTIONS.find(o => o.value === value) ?? LIST_OPTIONS[0];

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div ref={containerRef} className="relative">
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setOpen(o => !o)}
                        className="h-7 flex items-center gap-1 px-2 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {current.icon}
                        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">List Type</TooltipContent>
            </Tooltip>

            {open && (
                <div className="absolute top-full left-0 mt-1 z-50 w-40 rounded-md border border-border shadow-xl bg-popover py-1">
                    {LIST_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors ${opt.value === value ? 'bg-accent/50 font-medium' : ''}`}
                        >
                            {opt.icon}
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Field Selector (Insert Dynamic Fields)
// ─────────────────────────────────────────────────────────────────────────────
interface FieldSelectorProps {
    disabled?: boolean;
    onSelect: (field: string) => void;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({ disabled, onSelect }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    return (
        <div ref={containerRef} className="relative">
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        onPointerDown={(e) => {
                            if (disabled) return;
                            e.preventDefault();
                            setOpen(o => !o);
                        }}
                        className="h-7 flex items-center gap-1 px-2 rounded border border-input bg-background hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Type size={12} /> <span className="text-xs font-medium">Field</span>
                        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Insert Field</TooltipContent>
            </Tooltip>

            {open && (
                <div className="absolute top-full left-0 mt-1 z-50 w-48 max-h-64 overflow-y-auto rounded-md border border-border shadow-xl bg-popover py-1">
                    {ALL_AVAILABLE_FIELDS.map(field => (
                        <button
                            key={field}
                            type="button"
                            onPointerDown={(e) => {
                                e.preventDefault(); // Prevents editor focus loss
                                onSelect(field);
                                setOpen(false);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            {field}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Text Color Picker
// ─────────────────────────────────────────────────────────────────────────────
interface ColorPickerProps {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
}

/** Compact text color picker with a popover showing a native color input */
const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, disabled }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Popover>
            <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={disabled}
                            className="h-7 w-7 flex flex-col items-center justify-center gap-0.5 rounded shrink-0"
                        >
                            <span className="text-xs font-bold leading-none" style={{ color: value || '#000000' }}>A</span>
                            <span
                                className="w-4 h-1 rounded-full"
                                style={{ backgroundColor: value || '#000000' }}
                            />
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">Text Color</TooltipContent>
            </Tooltip>
            <PopoverContent side="bottom" className="w-auto p-3 flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">Text Color</p>
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="color"
                        value={value || '#000000'}
                        onChange={e => onChange(e.target.value)}
                        className="w-8 h-8 rounded border border-input cursor-pointer p-0.5"
                    />
                    <input
                        type="text"
                        value={value || '#000000'}
                        onChange={e => onChange(e.target.value)}
                        className="flex-1 h-8 text-xs border border-input rounded px-2 bg-background uppercase w-24"
                        placeholder="#000000"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Toolbar
// ─────────────────────────────────────────────────────────────────────────────

/** Editor formatting toolbar — controls apply to the selected element in the canvas */
export default function EditorCanvasHeader({
    isMobile,
    setContentSettingsOpen,
    setLayoutSettingsOpen,
}: {
    isMobile: boolean;
    setContentSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setLayoutSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    useInjectGoogleFonts();

    const { state, updateNodeProps, undo, redo, canUndo, canRedo, activeTiptapEditor } = useEditor();
    const { selectedNodeId, nodes } = state;

    const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

    // Only text-like nodes support typography tools
    const isTextNode = selectedNode && ['heading', 'text', 'paragraph'].includes(selectedNode.type);
    const disabled = !isTextNode;

    // When TipTap editor is active, read active states from it
    const hasTiptap = !!activeTiptapEditor && !activeTiptapEditor.isDestroyed && !!activeTiptapEditor.view;

    const props = selectedNode?.props ?? {};

    // ── Derived values: TipTap-aware ──
    // When TipTap is active, read formatting state from the editor instance.
    // When not active, fall back to node-level props.
    const fontFamily = hasTiptap && activeTiptapEditor
        ? (activeTiptapEditor.getAttributes('textStyle')?.fontFamily || 'inherit')
        : (props.fontFamily ?? 'inherit');

    const isBold = hasTiptap && activeTiptapEditor
        ? activeTiptapEditor.isActive('bold')
        : (props.fontWeight === 'bold' || Number(props.fontWeight) >= 700);

    const isItalic = hasTiptap && activeTiptapEditor
        ? activeTiptapEditor.isActive('italic')
        : ((props as { fontStyle?: string }).fontStyle === 'italic');

    const isUnderline = hasTiptap && activeTiptapEditor
        ? activeTiptapEditor.isActive('underline')
        : ((props as { textDecoration?: string }).textDecoration === 'underline');

    const textColor = hasTiptap && activeTiptapEditor
        ? (activeTiptapEditor.getAttributes('textStyle')?.color || '#000000')
        : (props.color ?? '#000000');

    const textAlign = hasTiptap && activeTiptapEditor
        ? (() => {
            if (activeTiptapEditor.isActive({ textAlign: 'center' })) return 'center';
            if (activeTiptapEditor.isActive({ textAlign: 'right' })) return 'right';
            if (activeTiptapEditor.isActive({ textAlign: 'justify' })) return 'justify';
            return 'left';
        })()
        : (props.textAlign ?? 'left');

    const listType: ListTypeValue = hasTiptap && activeTiptapEditor
        ? (() => {
            if (activeTiptapEditor.isActive('bulletList')) return 'unordered';
            if (activeTiptapEditor.isActive('orderedList')) return 'ordered';
            return 'none';
        })()
        : ((props as { listType?: ListTypeValue }).listType ?? 'none');

    // ── Update handler: TipTap-aware ──
    const update = useCallback((patch: Partial<ComponentProps & { fontStyle?: string; textDecoration?: string; listType?: string }>) => {
        if (!selectedNodeId) return;
        updateNodeProps(selectedNodeId, patch as Partial<ComponentProps>);
    }, [selectedNodeId, updateNodeProps]);

    // ── Action handlers ──
    const handleBold = () => {
        if (hasTiptap && activeTiptapEditor) {
            activeTiptapEditor.chain().focus().toggleBold().run();
        } else {
            update({ fontWeight: isBold ? 'normal' : 'bold' });
        }
    };

    const handleItalic = () => {
        if (hasTiptap && activeTiptapEditor) {
            activeTiptapEditor.chain().focus().toggleItalic().run();
        } else {
            update({ fontStyle: isItalic ? 'normal' : 'italic' } as Partial<ComponentProps>);
        }
    };

    const handleUnderline = () => {
        if (hasTiptap && activeTiptapEditor) {
            activeTiptapEditor.chain().focus().toggleUnderline().run();
        } else {
            update({ textDecoration: isUnderline ? 'none' : 'underline' } as Partial<ComponentProps>);
        }
    };

    const handleAlign = (align: ComponentProps['textAlign']) => {
        if (hasTiptap && activeTiptapEditor) {
            activeTiptapEditor.chain().focus().setTextAlign(align || 'left').run();
        } else {
            update({ textAlign: align });
        }
    };

    const handleFont = (v: string) => {
        if (hasTiptap && activeTiptapEditor) {
            activeTiptapEditor.chain().focus().setFontFamily(v).run();
        } else {
            update({ fontFamily: v });
        }
    };

    const handleColor = (v: string) => {
        if (hasTiptap && activeTiptapEditor) {
            activeTiptapEditor.chain().focus().setColor(v).run();
        } else {
            update({ color: v });
        }
    };

    const handleList = (v: ListTypeValue) => {
        if (hasTiptap && activeTiptapEditor) {
            if (v === 'unordered') {
                activeTiptapEditor.chain().focus().toggleBulletList().run();
            } else if (v === 'ordered') {
                activeTiptapEditor.chain().focus().toggleOrderedList().run();
            } else {
                // 'none' — remove any active list
                if (activeTiptapEditor.isActive('bulletList')) {
                    activeTiptapEditor.chain().focus().toggleBulletList().run();
                }
                if (activeTiptapEditor.isActive('orderedList')) {
                    activeTiptapEditor.chain().focus().toggleOrderedList().run();
                }
            }
        } else {
            update({ listType: v } as Partial<ComponentProps>);
        }
    };

    const handleInsertField = (field: string) => {
        if (hasTiptap && activeTiptapEditor) {
            try {
                activeTiptapEditor.chain().focus().insertContent(`{{${field}}}`).run();
            } catch (err) {
                console.warn('Failed to insert placeholder into active Tiptap editor:', err);
            }
        }
    };

    return (
        <div className='flex flex-col gap-2 w-full' data-editor-toolbar>
            <div className="flex items-center gap-2 flex-wrap w-full">

                {/* ── Undo / Redo ── */}
                <div className='flex items-center gap-1'>
                    <ToolbarButton tooltip="Undo" disabled={!canUndo} onClick={undo}>
                        <Undo2 size={14} />
                    </ToolbarButton>
                    <ToolbarButton tooltip="Redo" disabled={!canRedo} onClick={redo}>
                        <Redo2 size={14} />
                    </ToolbarButton>
                </div>

                <Separator orientation="vertical" style={{ height: '32px' }} variant="light" />

                <div className='flex items-center gap-1'>
                    {/* ── Font Family ── */}
                    <FontSelector
                        value={fontFamily}
                        onChange={handleFont}
                        disabled={disabled}
                    />

                    {/* ── Bold / Italic / Underline ── */}
                    <ToolbarButton tooltip="Bold" active={isBold} disabled={disabled} onClick={handleBold}>
                        <Bold size={14} />
                    </ToolbarButton>
                    <ToolbarButton tooltip="Italic" active={isItalic} disabled={disabled} onClick={handleItalic}>
                        <Italic size={14} />
                    </ToolbarButton>
                    <ToolbarButton tooltip="Underline" active={isUnderline} disabled={disabled} onClick={handleUnderline}>
                        <Underline size={14} />
                    </ToolbarButton>

                    {/* ── Text Color ── */}
                    <ColorPicker value={textColor} onChange={handleColor} />
                </div>


                <Separator orientation="vertical" style={{ height: '32px' }} variant="light" />

                <div className='flex items-center gap-1'>
                    {/* ── Alignment ── */}
                    <ToolbarButton tooltip="Align Left" active={textAlign === 'left'} disabled={disabled} onClick={() => handleAlign('left')}>
                        <AlignLeft size={14} />
                    </ToolbarButton>
                    <ToolbarButton tooltip="Align Center" active={textAlign === 'center'} disabled={disabled} onClick={() => handleAlign('center')}>
                        <AlignCenter size={14} />
                    </ToolbarButton>
                    <ToolbarButton tooltip="Align Right" active={textAlign === 'right'} disabled={disabled} onClick={() => handleAlign('right')}>
                        <AlignRight size={14} />
                    </ToolbarButton>
                    <ToolbarButton tooltip="Justify" active={textAlign === 'justify'} disabled={disabled} onClick={() => handleAlign('justify')}>
                        <AlignJustify size={14} />
                    </ToolbarButton>

                    {/* ── List Type ── */}
                    <ListSelector value={listType} onChange={handleList} disabled={disabled} />

                    <Separator orientation="vertical" style={{ height: '32px' }} variant="light" className="mx-1" />

                    {/* ── Insert Field ── */}
                    <FieldSelector disabled={!hasTiptap} onSelect={handleInsertField} />
                </div>

            </div>

            {isMobile && <div className='flex items-center justify-between gap-2 w-full'>
                {/* ── Content Settings ── */}
                <Button
                    variant="ghost"
                    onClick={() => setContentSettingsOpen(prev => !prev)}
                    type='button'
                >
                    <Menu size={16} /> Content Settings
                </Button>

                {/* ── Layout Settings ── */}
                <Button
                    variant="ghost"
                    onClick={() => setLayoutSettingsOpen(prev => !prev)}
                    type='button'
                >
                    Layout Settings <Menu size={16} />
                </Button>
            </div>}
        </div>
    );
}
