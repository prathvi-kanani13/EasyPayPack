/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { Editor } from '@tiptap/react';

export type ComponentType = 'root' | 'heading' | 'text' | 'paragraph' | 'row' | 'column' | 'image' | 'divider' | 'block';

export interface ComponentProps {
    // General Settings
    padding?: string;
    margin?: string;
    border?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
    borderWidth?: string;
    borderColor?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    width?: string;
    height?: string;

    // Typography
    text?: string;
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: string;
    letterSpacing?: string;
    listType?: 'none' | 'unordered' | 'ordered' | 'checklist';

    // Image
    src?: string;
    alt?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none';
    isSignature?: boolean;
    signatureId?: string;

    // Grid (Row/Column)
    gridType?: '100' | '50-50' | '33-33-33' | '25-25-25-25' | '33-67' | '67-33' | '75-25' | '25-75';
    columns?: number;
    gap?: string;

    // Divider
    thickness?: string;
    marginY?: string;
    alignment?: 'left' | 'center' | 'right';
}

export interface ComponentNode {
    id: string;
    type: ComponentType;
    props: ComponentProps;
    children: string[];
    parentId: string | null;
}

export interface EditorState {
    nodes: Record<string, ComponentNode>;
    selectedNodeId: string | null;
    zoomLevel: number;
    canvasSize: { width: number, height: number };
}

const initialNodes: Record<string, ComponentNode> = {
    root: {
        id: 'root',
        type: 'root',
        props: {
            padding: '20px',
            backgroundColor: '#ffffff',
            width: '100%',
            height: '100%',
        },
        children: [],
        parentId: null,
    }
};

interface EditorContextType {
    state: EditorState;
    addNode: (type: ComponentType, parentId: string, index?: number, initialProps?: ComponentProps) => string;
    updateNodeProps: (id: string, props: Partial<ComponentProps>) => void;
    changeGridType: (id: string, gridType: ComponentProps['gridType']) => void;
    selectNode: (id: string | null) => void;
    moveNode: (id: string, newParentId: string, index: number) => void;
    deleteNode: (id: string) => void;
    setZoom: (zoom: number) => void;
    getTextStats: () => { words: number; characters: number };
    generateHtml: () => string;
    // Undo / Redo
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    // Inline TipTap editing
    activeTiptapEditor: Editor | null;
    setActiveTiptapEditor: (editor: Editor | null) => void;
    editingNodeId: string | null;
    setEditingNodeId: (id: string | null) => void;
    setCanvasSize: (size: { width: number, height: number }) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children, initialNodes: initialNodesProp }: { children: ReactNode, initialNodes?: Record<string, ComponentNode> }) => {
    const [state, setState] = useState<EditorState>({
        nodes: initialNodesProp || initialNodes,
        selectedNodeId: null,
        zoomLevel: 100,
        canvasSize: { width: 800, height: 1100 },
    });

    // Track the active TipTap editor instance so the toolbar can drive commands
    const activeTiptapEditorRef = useRef<Editor | null>(null);
    const [activeTiptapEditor, _setActiveTiptapEditor] = useState<Editor | null>(null);
    const setActiveTiptapEditor = useCallback((editor: Editor | null) => {
        activeTiptapEditorRef.current = editor;
        _setActiveTiptapEditor(editor);
    }, []);

    // Track which node is currently being inline-edited
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

    const setCanvasSize = useCallback((size: { width: number, height: number }) => {
        setState(prev => ({ ...prev, canvasSize: size }));
    }, []);

    // History stacks for undo/redo (store nodes snapshots only)
    const pastRef = useRef<Record<string, ComponentNode>[]>([]);
    const futureRef = useRef<Record<string, ComponentNode>[]>([]);
    const [historySize, setHistorySize] = useState({ past: 0, future: 0 });

    /** Push current nodes onto the past stack before a mutating operation */
    const pushHistory = useCallback((currentNodes: Record<string, ComponentNode>) => {
        pastRef.current = [...pastRef.current.slice(-49), currentNodes];
        futureRef.current = [];
        setHistorySize({ past: pastRef.current.length, future: 0 });
    }, []);

    const undo = useCallback(() => {
        if (pastRef.current.length === 0) return;
        const previous = pastRef.current[pastRef.current.length - 1];
        pastRef.current = pastRef.current.slice(0, -1);
        setState(prev => {
            futureRef.current = [prev.nodes, ...futureRef.current.slice(0, 49)];
            setHistorySize({ past: pastRef.current.length, future: futureRef.current.length });
            return { ...prev, nodes: previous };
        });
    }, []);

    const redo = useCallback(() => {
        if (futureRef.current.length === 0) return;
        const next = futureRef.current[0];
        futureRef.current = futureRef.current.slice(1);
        setState(prev => {
            pastRef.current = [...pastRef.current, prev.nodes];
            setHistorySize({ past: pastRef.current.length, future: futureRef.current.length });
            return { ...prev, nodes: next };
        });
    }, []);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addNode = useCallback((type: ComponentType, parentId: string, index?: number, initialProps: ComponentProps = {}) => {
        const id = generateId();

        let props: ComponentProps = { ...initialProps };
        if (type === 'heading') props = { text: 'Heading', level: 'h2', fontSize: '22px', fontWeight: 'bold', fontFamily: 'inherit', color: '#000000', textAlign: 'left', lineHeight: '1.2', letterSpacing: '0px', ...props };
        if (type === 'text') props = { text: 'Type your text here...', fontSize: '14px', fontWeight: 'normal', fontFamily: 'inherit', color: '#000000', textAlign: 'left', lineHeight: '1.2', letterSpacing: '0px', ...props };
        if (type === 'image') props = { src: '', alt: '', width: '100%', alignment: 'center', ...props };
        if (type === 'row') props = { gridType: '50-50', gap: '16px', padding: '20px', ...props };
        if (type === 'column') props = { backgroundColor: 'transparent', padding: '20px', ...props };
        if (type === 'divider') props = { borderColor: '#e5e7eb', thickness: '1px', borderStyle: 'solid', marginY: '16px', alignment: 'center', ...props };

        const newNode: ComponentNode = {
            id,
            type,
            props,
            children: [],
            parentId,
        };

        setState(prev => {
            pushHistory(prev.nodes);
            const parent = prev.nodes[parentId];
            if (!parent) return prev;

            const newChildren = [...parent.children];
            if (index !== undefined) {
                newChildren.splice(index, 0, id);
            } else {
                newChildren.push(id);
            }

            // If it's a row, auto-generate columns based on gridType
            const additionalNodes: Record<string, ComponentNode> = {};
            if (type === 'row') {
                const gridType = props.gridType || '50-50';
                const cols = gridType.split('-').length;
                for (let i = 0; i < cols; i++) {
                    const colId = generateId();
                    additionalNodes[colId] = {
                        id: colId,
                        type: 'column',
                        props: { padding: '16px', backgroundColor: 'transparent', border: '1px dashed rgba(0,0,0,0.1)' },
                        children: [],
                        parentId: id,
                    };
                    newNode.children.push(colId);
                }
            }

            return {
                ...prev,
                selectedNodeId: id, // auto select newly added node
                nodes: {
                    ...prev.nodes,
                    [id]: newNode,
                    ...additionalNodes,
                    [parentId]: {
                        ...parent,
                        children: newChildren,
                    }
                }
            };
        });
        return id;
    }, []);

    const deleteNode = useCallback((id: string) => {
        setState(prev => {
            pushHistory(prev.nodes);
            if (id === 'root') return prev; // Cannot delete root

            const nodeToDelete = prev.nodes[id];
            if (!nodeToDelete) return prev;

            const newNodes = { ...prev.nodes };

            // Remove from parent's children array
            if (nodeToDelete.parentId) {
                const parent = newNodes[nodeToDelete.parentId];
                if (parent) {
                    newNodes[nodeToDelete.parentId] = {
                        ...parent,
                        children: parent.children.filter(childId => childId !== id)
                    };
                }
            }

            // Recursive delete function to remove children
            const removeRecursive = (nodeId: string) => {
                const node = newNodes[nodeId];
                if (node) {
                    node.children.forEach(removeRecursive);
                    delete newNodes[nodeId];
                }
            };

            removeRecursive(id);

            return {
                ...prev,
                nodes: newNodes,
                selectedNodeId: prev.selectedNodeId === id ? null : prev.selectedNodeId
            };
        });
    }, []);

    const updateNodeProps = useCallback((id: string, props: Partial<ComponentProps>) => {
        setState(prev => {
            pushHistory(prev.nodes);
            if (!prev.nodes[id]) return prev;
            return {
                ...prev,
                nodes: {
                    ...prev.nodes,
                    [id]: {
                        ...prev.nodes[id],
                        props: {
                            ...prev.nodes[id].props,
                            ...props
                        }
                    }
                }
            };
        });
    }, []);

    const changeGridType = useCallback((id: string, gridType: ComponentProps['gridType']) => {
        setState(prev => {
            pushHistory(prev.nodes);
            const node = prev.nodes[id];
            if (!node || node.type !== 'row') return prev;

            const cols = (gridType || '50-50').split('-').length;
            const newNodes = { ...prev.nodes };
            const newChildren = [...node.children];

            // Add columns if needed
            while (newChildren.length < cols) {
                const colId = generateId();
                newNodes[colId] = {
                    id: colId,
                    type: 'column',
                    props: { padding: '16px', backgroundColor: 'transparent', border: '1px dashed rgba(0,0,0,0.1)' },
                    children: [],
                    parentId: id,
                };
                newChildren.push(colId);
            }

            // Remove columns if needed
            while (newChildren.length > cols) {
                const colId = newChildren.pop()!;
                // Delete children of this column recursively
                const removeRecursive = (nodeId: string) => {
                    const childNode = newNodes[nodeId];
                    if (childNode) {
                        childNode.children.forEach(removeRecursive);
                        delete newNodes[nodeId];
                    }
                };
                removeRecursive(colId);
            }

            newNodes[id] = { ...node, props: { ...node.props, gridType }, children: newChildren };

            return { ...prev, nodes: newNodes, selectedNodeId: prev.selectedNodeId && !newNodes[prev.selectedNodeId] ? null : prev.selectedNodeId };
        });
    }, []);

    const selectNode = useCallback((id: string | null) => {
        setState(prev => ({ ...prev, selectedNodeId: id }));
    }, []);

    const moveNode = useCallback((id: string, newParentId: string, index: number) => {
        setState(prev => {
            pushHistory(prev.nodes);
            const node = prev.nodes[id];
            const oldParentId = node.parentId;
            if (!oldParentId) return prev; // Cannot move root

            const oldParent = prev.nodes[oldParentId];
            const newParent = prev.nodes[newParentId];

            if (!oldParent || !newParent) return prev;

            const oldChildren = oldParent.children.filter(childId => childId !== id);

            if (oldParentId === newParentId) {
                const newChildren = [...oldChildren];
                newChildren.splice(index, 0, id);
                return {
                    ...prev,
                    nodes: {
                        ...prev.nodes,
                        [oldParentId]: {
                            ...oldParent,
                            children: newChildren
                        }
                    }
                };
            }

            const newChildren = [...newParent.children];
            newChildren.splice(index, 0, id);

            return {
                ...prev,
                nodes: {
                    ...prev.nodes,
                    [id]: {
                        ...node,
                        parentId: newParentId
                    },
                    [oldParentId]: {
                        ...oldParent,
                        children: oldChildren
                    },
                    [newParentId]: {
                        ...newParent,
                        children: newChildren
                    }
                }
            };
        });
    }, []);

    const setZoom = useCallback((zoom: number) => {
        setState(prev => ({ ...prev, zoomLevel: Math.max(10, Math.min(200, zoom)) }));
    }, []);

    const getTextStats = useCallback(() => {
        let text = '';
        Object.values(state.nodes).forEach(node => {
            if (node.props.text) {
                // Remove HTML tags if any (basic approach)
                const plainText = node.props.text.replace(/<[^>]*>?/gm, '');
                text += ' ' + plainText;
            }
        });
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.trim().length;
        return { words, characters };
    }, [state.nodes]);

    const generateHtml = useCallback(() => {
        const renderNodeToHtml = (nodeId: string): string => {
            const node = state.nodes[nodeId];
            if (!node) return '';

            const { type, props, children } = node;
            const childHtml = children.map(renderNodeToHtml).join('');

            const getStyleString = (p: ComponentProps) => {
                let style = '';
                if (p.padding) style += `padding: ${p.padding}; `;
                if (p.margin) style += `margin: ${p.margin}; `;
                if (p.backgroundColor) style += `background-color: ${p.backgroundColor}; `;
                if (p.backgroundImage) style += `background-image: url('${p.backgroundImage}'); background-size: cover; background-position: center; `;
                if (p.color) style += `color: ${p.color}; `;
                if (p.textAlign) style += `text-align: ${p.textAlign}; `;
                if (p.width) style += `width: ${p.width}; `;
                if (p.height) style += `height: ${p.height}; `;
                if (p.borderWidth) style += `border: ${p.borderWidth} ${p.borderStyle || 'solid'} ${p.borderColor || '#000'}; `;
                if (p.fontFamily) style += `font-family: ${p.fontFamily}; `;
                if (p.fontSize) style += `font-size: ${p.fontSize}; `;
                if (p.fontWeight) style += `font-weight: ${p.fontWeight}; `;
                if (p.lineHeight) style += `line-height: ${p.lineHeight}; `;
                if (p.letterSpacing) style += `letter-spacing: ${p.letterSpacing}; `;
                return style;
            };

            const styleStr = getStyleString(props);

            switch (type) {
                case 'root':
                    return `<div class="tiptap-content" style="box-sizing: border-box; ${styleStr}">${childHtml}</div>`;
                case 'heading': {
                    const H = props.level || 'h2';
                    return `<${H} style="${styleStr}">${props.text || ''}</${H}>`;
                }
                case 'text':
                case 'paragraph':
                    return `<p style="${styleStr}">${props.text || ''}</p>`;
                case 'block':
                case 'column':
                    return `<div style="${styleStr}">${childHtml}</div>`;
                case 'row': {
                    // Simple flex implementation for rows in HTML emails/exports
                    return `<div style="display: flex; gap: ${props.gap || '0px'}; ${styleStr}">${childHtml}</div>`;
                }
                case 'image':
                    return `<div style="text-align: ${props.alignment || 'center'}; margin: ${props.margin || '0'}">
                        <img src="${props.src || ''}" alt="${props.alt || ''}" style="width: ${props.width || '100%'}; object-fit: ${props.objectFit || 'cover'}; display: inline-block; ${styleStr}" />
                    </div>`;
                case 'divider':
                    return `<hr style="border: none; border-top: ${props.thickness || '1px'} ${props.borderStyle || 'solid'} ${props.borderColor || '#e5e7eb'}; margin: ${props.marginY || '16px'} 0; ${styleStr}" />`;
                default:
                    return '';
            }
        };

        return renderNodeToHtml('root');
    }, [state.nodes]);

    return (
        <EditorContext.Provider value={{ state, addNode, updateNodeProps, changeGridType, selectNode, moveNode, deleteNode, setZoom, getTextStats, generateHtml, undo, redo, canUndo: historySize.past > 0, canRedo: historySize.future > 0, activeTiptapEditor, setActiveTiptapEditor, editingNodeId, setEditingNodeId, setCanvasSize }}>
            {children}
        </EditorContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEditor = () => {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};
