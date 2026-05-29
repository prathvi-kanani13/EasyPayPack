import React from 'react';
import { useNode } from '@craftjs/core';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rnd } from 'react-rnd';

// --- Text Node ---
export interface TextProps {
    text: string;
    fontSize: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    color: string;
    fontWeight: string;
}

export const TextNode = ({ text, fontSize, textAlign, color, fontWeight }: TextProps) => {
    const { connectors: { connect, drag }, hasSelectedNode, actions: { setProp } } = useNode((state) => ({
        hasSelectedNode: state.events.selected,
    }));

    return (
        <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`relative ${hasSelectedNode ? 'ring-2 ring-theme' : ''}`} style={{ padding: '5px' }}>
            <p
                style={{ fontSize, textAlign, color, fontWeight, margin: 0 }}
                contentEditable={hasSelectedNode}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                    setProp((props: TextProps) => props.text = e.currentTarget.innerText);
                }}
            >
                {text}
            </p>
        </div>
    );
};

export const TextSettings = () => {
    const { actions: { setProp }, fontSize, textAlign, color, fontWeight } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        textAlign: node.data.props.textAlign,
        color: node.data.props.color,
        fontWeight: node.data.props.fontWeight,
    }));

    return (
        <div className="flex flex-col gap-4 p-4 text-sm">
            <div className="flex flex-col gap-2">
                <Label>Font Size</Label>
                <Input type="text" value={fontSize} onChange={(e) => setProp((props: TextProps) => props.fontSize = e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Font Weight</Label>
                <Select value={fontWeight} onValueChange={(v) => setProp((props: TextProps) => props.fontWeight = v)}>
                    <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="lighter">Lighter</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Text Align</Label>
                <Select value={textAlign} onValueChange={(v: 'left' | 'center' | 'right' | 'justify') => setProp((props: TextProps) => props.textAlign = v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                    <Input type="color" value={color} onChange={(e) => setProp((props: TextProps) => props.color = e.target.value)} className="w-12 h-10 p-1" />
                    <Input type="text" value={color} onChange={(e) => setProp((props: TextProps) => props.color = e.target.value)} className="flex-1" />
                </div>
            </div>
        </div>
    );
};

TextNode.craft = {
    props: {
        text: 'Type your text here...',
        fontSize: '14px',
        textAlign: 'left',
        color: '#333333',
        fontWeight: 'normal'
    },
    related: {
        settings: TextSettings,
    }
};

// --- Heading Node ---
export interface HeadingProps {
    text: string;
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    textAlign: 'left' | 'center' | 'right' | 'justify';
    color: string;
}

export const HeadingNode = ({ text, level, textAlign, color }: HeadingProps) => {
    const { connectors: { connect, drag }, hasSelectedNode, actions: { setProp } } = useNode((state) => ({
        hasSelectedNode: state.events.selected,
    }));

    const Tag = level;

    return (
        <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`relative ${hasSelectedNode ? 'ring-2 ring-theme' : ''}`} style={{ padding: '5px' }}>
            <Tag
                style={{ textAlign, color, margin: 0, fontWeight: 'bold' }}
                className={level === 'h1' ? 'text-4xl' : level === 'h2' ? 'text-3xl' : level === 'h3' ? 'text-2xl' : 'text-xl'}
                contentEditable={hasSelectedNode}
                suppressContentEditableWarning={true}
                onBlur={(e: React.FocusEvent<HTMLElement>) => {
                    setProp((props: HeadingProps) => props.text = e.currentTarget.innerText);
                }}
            >
                {text}
            </Tag>
        </div>
    );
};

export const HeadingSettings = () => {
    const { actions: { setProp }, level, textAlign, color } = useNode((node) => ({
        level: node.data.props.level,
        textAlign: node.data.props.textAlign,
        color: node.data.props.color,
    }));

    return (
        <div className="flex flex-col gap-4 p-4 text-sm">
            <div className="flex flex-col gap-2">
                <Label>Level</Label>
                <Select value={level} onValueChange={(v: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => setProp((props: HeadingProps) => props.level = v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="h1">Heading 1</SelectItem>
                        <SelectItem value="h2">Heading 2</SelectItem>
                        <SelectItem value="h3">Heading 3</SelectItem>
                        <SelectItem value="h4">Heading 4</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Text Align</Label>
                <Select value={textAlign} onValueChange={(v: 'left' | 'center' | 'right' | 'justify') => setProp((props: HeadingProps) => props.textAlign = v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                    <Input type="color" value={color} onChange={(e) => setProp((props: HeadingProps) => props.color = e.target.value)} className="w-12 h-10 p-1" />
                    <Input type="text" value={color} onChange={(e) => setProp((props: HeadingProps) => props.color = e.target.value)} className="flex-1" />
                </div>
            </div>
        </div>
    );
};

HeadingNode.craft = {
    props: {
        text: 'Heading',
        level: 'h2',
        textAlign: 'left',
        color: '#111827',
    },
    related: {
        settings: HeadingSettings,
    }
};

// --- Container Node ---
export interface ContainerProps {
    backgroundColor: string;
    padding: string;
    width: string;
    height: string;
    children?: React.ReactNode;
}

export const ContainerNode = ({ backgroundColor, padding, width, height, children }: ContainerProps) => {
    const { connectors: { connect, drag }, hasSelectedNode } = useNode((state) => ({
        hasSelectedNode: state.events.selected,
    }));

    return (
        <div
            ref={(ref) => { if (ref) connect(drag(ref)); }}
            className={`relative min-h-[50px] ${hasSelectedNode ? 'ring-2 ring-theme ring-inset' : 'ring-1 ring-dashed ring-gray-300'}`}
            style={{ backgroundColor, padding, width, height }}
        >
            {children}
        </div>
    );
};

export const ContainerSettings = () => {
    const { actions: { setProp }, backgroundColor, padding, width, height } = useNode((node) => ({
        backgroundColor: node.data.props.backgroundColor,
        padding: node.data.props.padding,
        width: node.data.props.width,
        height: node.data.props.height,
    }));

    return (
        <div className="flex flex-col gap-4 p-4 text-sm">
            <div className="flex flex-col gap-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                    <Input type="color" value={backgroundColor} onChange={(e) => setProp((props: ContainerProps) => props.backgroundColor = e.target.value)} className="w-12 h-10 p-1" />
                    <Input type="text" value={backgroundColor} onChange={(e) => setProp((props: ContainerProps) => props.backgroundColor = e.target.value)} className="flex-1" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Padding</Label>
                <Input type="text" value={padding} onChange={(e) => setProp((props: ContainerProps) => props.padding = e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Width</Label>
                <Input type="text" value={width} onChange={(e) => setProp((props: ContainerProps) => props.width = e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Height</Label>
                <Input type="text" value={height} onChange={(e) => setProp((props: ContainerProps) => props.height = e.target.value)} />
            </div>
        </div>
    );
};

ContainerNode.craft = {
    props: {
        backgroundColor: 'transparent',
        padding: '16px',
        width: '100%',
        height: 'auto',
    },
    related: {
        settings: ContainerSettings,
    },
    rules: {
        canDrag: () => true,
    }
};

// --- Image Node ---
export interface ImageProps {
    src: string;
    width: string;
    height: string;
    objectFit: 'cover' | 'contain' | 'fill' | 'none';
    borderRadius: string;
}

export const ImageNode = ({ src, width, height, objectFit, borderRadius }: ImageProps) => {
    const { connectors: { connect, drag }, hasSelectedNode, actions: { setProp } } = useNode((state) => ({
        hasSelectedNode: state.events.selected,
    }));

    return (
        <Rnd
            default={{ x: 0, y: 0, width: parseInt(width) || 200, height: parseInt(height) || 200 }}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onResizeStop={(_e, _direction, ref, _delta, _position) => {
                setProp((props: ImageProps) => {
                    props.width = ref.style.width;
                    props.height = ref.style.height;
                });
            }}
            disableDragging={true}
            enableResizing={hasSelectedNode}
        >
            <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`w-full h-full relative ${hasSelectedNode ? 'ring-2 ring-theme' : ''}`}>
                <img src={src} style={{ width: '100%', height: '100%', objectFit, borderRadius }} alt="Canvas Element" draggable={false} />
            </div>
        </Rnd>
    );
};

export const ImageSettings = () => {
    const { actions: { setProp }, src, objectFit, borderRadius } = useNode((node) => ({
        src: node.data.props.src,
        width: node.data.props.width,
        height: node.data.props.height,
        objectFit: node.data.props.objectFit,
        borderRadius: node.data.props.borderRadius,
    }));

    return (
        <div className="flex flex-col gap-4 p-4 text-sm">
            <div className="flex flex-col gap-2">
                <Label>Image URL</Label>
                <Input type="text" value={src} onChange={(e) => setProp((props: ImageProps) => props.src = e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Object Fit</Label>
                <Select value={objectFit} onValueChange={(v: 'cover' | 'contain' | 'fill' | 'none') => setProp((props: ImageProps) => props.objectFit = v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="contain">Contain</SelectItem>
                        <SelectItem value="fill">Fill</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Border Radius</Label>
                <Input type="text" value={borderRadius} onChange={(e) => setProp((props: ImageProps) => props.borderRadius = e.target.value)} />
            </div>
        </div>
    );
};

ImageNode.craft = {
    props: {
        src: 'https://via.placeholder.com/300x200',
        width: '300px',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '0px'
    },
    related: {
        settings: ImageSettings,
    }
};

// --- Divider Node ---
export interface DividerProps {
    color: string;
    thickness: string;
    margin: string;
}

export const DividerNode = ({ color, thickness, margin }: DividerProps) => {
    const { connectors: { connect, drag }, hasSelectedNode } = useNode((state) => ({
        hasSelectedNode: state.events.selected,
    }));

    return (
        <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`relative ${hasSelectedNode ? 'ring-2 ring-theme' : ''}`} style={{ padding: '10px 0' }}>
            <div style={{ backgroundColor: color, height: thickness, margin, width: '100%' }} />
        </div>
    );
};

export const DividerSettings = () => {
    const { actions: { setProp }, color, thickness, margin } = useNode((node) => ({
        color: node.data.props.color,
        thickness: node.data.props.thickness,
        margin: node.data.props.margin,
    }));

    return (
        <div className="flex flex-col gap-4 p-4 text-sm">
            <div className="flex flex-col gap-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                    <Input type="color" value={color} onChange={(e) => setProp((props: DividerProps) => props.color = e.target.value)} className="w-12 h-10 p-1" />
                    <Input type="text" value={color} onChange={(e) => setProp((props: DividerProps) => props.color = e.target.value)} className="flex-1" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Thickness</Label>
                <Input type="text" value={thickness} onChange={(e) => setProp((props: DividerProps) => props.thickness = e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Margin (Top/Bottom)</Label>
                <Input type="text" value={margin} onChange={(e) => setProp((props: DividerProps) => props.margin = e.target.value)} />
            </div>
        </div>
    );
};

DividerNode.craft = {
    props: {
        color: '#e5e7eb',
        thickness: '2px',
        margin: '16px 0',
    },
    related: {
        settings: DividerSettings,
    }
};

// --- Row Node (Columns) ---
export interface RowProps {
    columns: number;
    gap: string;
    children?: React.ReactNode;
}

export const RowNode = ({ columns, gap, children }: RowProps) => {
    const { connectors: { connect, drag }, hasSelectedNode } = useNode((state) => ({
        hasSelectedNode: state.events.selected,
    }));

    return (
        <div
            ref={(ref) => { if (ref) connect(drag(ref)); }}
            className={`w-full grid ${hasSelectedNode ? 'ring-2 ring-theme' : ''}`}
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}
        >
            {children}
        </div>
    );
};

export const RowSettings = () => {
    const { actions: { setProp }, columns, gap } = useNode((node) => ({
        columns: node.data.props.columns,
        gap: node.data.props.gap,
    }));

    return (
        <div className="flex flex-col gap-4 p-4 text-sm">
            <div className="flex flex-col gap-2">
                <Label>Columns</Label>
                <Select value={columns.toString()} onValueChange={(v) => setProp((props: RowProps) => props.columns = parseInt(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1 Column</SelectItem>
                        <SelectItem value="2">2 Columns</SelectItem>
                        <SelectItem value="3">3 Columns</SelectItem>
                        <SelectItem value="4">4 Columns</SelectItem>
                        <SelectItem value="6">6 Columns</SelectItem>
                        <SelectItem value="12">12 Columns</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <Label>Gap</Label>
                <Input type="text" value={gap} onChange={(e) => setProp((props: RowProps) => props.gap = e.target.value)} />
            </div>
        </div>
    );
};

RowNode.craft = {
    props: {
        columns: 2,
        gap: '16px',
    },
    related: {
        settings: RowSettings,
    }
};
