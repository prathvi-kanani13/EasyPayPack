import { useEffect, useRef } from 'react';
import { useEditor as useTiptapEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { useEditor } from './EditorContext';

interface TiptapInlineEditorProps {
    nodeId: string;
    /** CSS styles inherited from the node's typography settings */
    style?: React.CSSProperties;
    /** Additional className for the wrapper */
    className?: string;
}

/**
 * Inline TipTap rich-text editor that replaces static text display on double-click.
 * Supports bold, italic, underline, lists, alignment, text color, and font family.
 * Content is saved back to EditorContext on blur.
 */
export default function TiptapInlineEditor({ nodeId, style, className }: TiptapInlineEditorProps) {
    const { state, updateNodeProps, setActiveTiptapEditor, setEditingNodeId } = useEditor();
    const node = state.nodes[nodeId];
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Determine initial content from the node's text prop
    const initialContent = node?.props.text || '';

    const editor = useTiptapEditor({
        extensions: [
            StarterKit.configure({
                // Disable heading if this is a plain text/paragraph node — keep it for headings
                heading: node?.type === 'heading' ? { levels: [1, 2, 3, 4, 5, 6] } : false,
            }),
            // Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            FontFamily,
        ],
        content: initialContent,
        autofocus: 'end',
        editorProps: {
            attributes: {
                class: 'outline-none min-h-[1em] w-full',
            },
        },
        // Sync the active editor reference on every transaction for toolbar state
        onTransaction: ({ editor: e }) => {
            setActiveTiptapEditor(e);
        },
    });

    // Register the editor in context on mount, and clean up on unmount
    useEffect(() => {
        if (editor) {
            setActiveTiptapEditor(editor);
        }
        return () => {
            // Save content before unmounting
            if (editor) {
                const html = editor.getHTML();
                updateNodeProps(nodeId, { text: html });
            }
            setActiveTiptapEditor(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);

    // Handle click outside to deactivate the editor
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                // Check if the click is on a toolbar button — don't deactivate in that case
                const target = e.target as HTMLElement;
                const isToolbarClick = target.closest('[data-editor-toolbar]');
                if (isToolbarClick) return;

                // Save content and deactivate
                if (editor) {
                    const html = editor.getHTML();
                    updateNodeProps(nodeId, { text: html });
                }
                setEditingNodeId(null);
                setActiveTiptapEditor(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, nodeId]);

    // Handle Escape key to deactivate
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (editor) {
                    const html = editor.getHTML();
                    updateNodeProps(nodeId, { text: html });
                }
                setEditingNodeId(null);
                setActiveTiptapEditor(null);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, nodeId]);

    if (!editor) return null;

    return (
        <div
            ref={wrapperRef}
            className={`tiptap-inline-editor w-full ${className || ''}`}
            style={style}
            onClick={(e) => e.stopPropagation()}
        >
            <EditorContent editor={editor} className="w-full" />
        </div>
    );
}
