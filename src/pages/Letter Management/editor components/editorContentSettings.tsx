import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Menu, Settings, Grid, FileText, Type } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useEditor, type ComponentProps } from "./EditorContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { FontSelector } from "./fontSelector";
import { ALL_AVAILABLE_FIELDS } from "./availableFields";

const SettingLabel = ({ label, tooltip }: { label: string, tooltip: string }) => (
  <div className="flex items-center gap-1.5">
    <Label className="text-[11px] opacity-70 mb-0">{label}</Label>
    <Tooltip>
      <TooltipTrigger asChild type="button">
        <Info className="w-3 h-3 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs max-w-[200px]">{tooltip}</TooltipContent>
    </Tooltip>
  </div>
);

const htmlToPlainText = (html: string) => {
  if (!html) return '';
  let text = html;
  text = text.replace(/<li>(.*?)<\/li>/gi, '• $1\n');
  text = text.replace(/<\/p>/gi, '\n');
  text = text.replace(/<br\s*[/]?>/gi, '\n');
  text = text.replace(/<[^>]*>?/gm, '');
  return text.replace(/\n{3,}/g, '\n\n').trim();
};

const plainTextToHtml = (text: string) => {
  if (!text) return '';
  return text.split('\n').map(line => {
    if (line.trim().startsWith('• ')) {
      return `<ul><li>${line.replace('• ', '').trim()}</li></ul>`;
    }
    return `<p>${line}</p>`;
  }).join('');
};

const TextareaFieldSelector: React.FC<{ onSelect: (field: string) => void }> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="h-6 w-6"
        onPointerDown={(e) => { e.preventDefault(); setOpen(o => !o); }}
      >
        <Type className="h-3 w-3" />
      </Button>
      {open && (
        <div className="absolute bottom-full right-0 mb-1 z-50 w-48 max-h-48 overflow-y-auto rounded-md border border-border shadow-xl bg-popover py-1">
          {ALL_AVAILABLE_FIELDS.map(field => (
            <button
              key={field}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault(); // Prevents textarea focus loss
                onSelect(field);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {field}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function EditorContentSettings() {
  const [openSection, setOpenSection] = useState<string | null>("general");
  const { toggleSidebar, state: sidebarState, setOpen } = useSidebar();
  const { state, updateNodeProps, changeGridType, editingNodeId } = useEditor();

  const selectedNode = state.selectedNodeId && state.selectedNodeId !== 'root' ? state.nodes[state.selectedNodeId] : null;
  const rootNode = state.nodes['root'];

  // Toggle states for optional features
  const [showPadding, setShowPadding] = useState(false);
  const [showMargin, setShowMargin] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const [showBgImage, setShowBgImage] = useState(false);
  const [enableImageWidth, setEnableImageWidth] = useState(true);

  const [signatures, setSignatures] = useState<{ id: string, name: string }[]>([]);
  const [isLoadingSignatures, setIsLoadingSignatures] = useState(false);

  // Document toggle states
  const [showDocBgImage, setShowDocBgImage] = useState(false);

  // Keep a ref so the effect below can call setOpen without it being a
  // dependency — otherwise every toggle re-triggers the effect and immediately
  // re-opens the sidebar.
  const setOpenRef = React.useRef(setOpen);
  React.useEffect(() => { setOpenRef.current = setOpen; });

  // Automatically open sidebar and switch to properties section on node select
  useEffect(() => {
    if (selectedNode) {
      setShowPadding(!!selectedNode.props.padding && selectedNode.props.padding !== '0px');
      setShowMargin(!!selectedNode.props.margin && selectedNode.props.margin !== '0px');
      setShowBorder(!!selectedNode.props.borderWidth && selectedNode.props.borderWidth !== '0px');
      setShowBgImage(!!selectedNode.props.backgroundImage);

      // Automatically open sidebar and properties section
      setOpenRef.current?.(true);
      setOpenSection("general");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode?.id]); // intentionally excludes setOpen — use ref above

  useEffect(() => {
    if (rootNode) {
      setShowDocBgImage(!!rootNode.props.backgroundImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootNode?.props.backgroundImage]);

  useEffect(() => {
    if (selectedNode?.type === 'image' && selectedNode.props.isSignature && signatures.length === 0 && !isLoadingSignatures) {
      setIsLoadingSignatures(true);
      setTimeout(() => {
        setSignatures([
          { id: 'sig1', name: 'CEO Signature' },
          { id: 'sig2', name: 'HR Manager Signature' },
          { id: 'sig3', name: 'Director Signature' }
        ]);
        setIsLoadingSignatures(false);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode?.id, selectedNode?.props.isSignature, signatures.length, isLoadingSignatures]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, nodeId: string, propName: 'src' | 'backgroundImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateNodeProps(nodeId, { [propName]: url });
    }
  };

  return (
    <Sidebar collapsible="icon" className="absolute! h-full! inset-y-0 border-r-0">
      <SidebarHeader className={cn(
        "flex flex-row items-center gap-0 border-b border-muted p-2",
        sidebarState === "collapsed" ? "justify-center" : "justify-between"
      )}>
        {sidebarState !== "collapsed" && (
          <div className="flex-1 px-2 truncate">
            <span className="uppercase tracking-wider opacity-70">
              {selectedNode ? selectedNode.type : 'Document'}
            </span>
          </div>
        )}
        <Button
          type="button"
          variant={'ghost'}
          size={'icon-sm'}
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SidebarHeader>

      {sidebarState === "collapsed" ? (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <span className="-rotate-90 whitespace-nowrap text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Properties
          </span>
        </div>
      ) : (
        <SidebarContent className={`cursor-default transition-all ease-in-out duration-200 overflow-hidden relative`}>
          <ScrollArea className={`h-full flex px-2`}>
            <div className={`flex flex-col`}>

              {/* Show Document Settings ALWAYS */}
              <Collapsible className="group/collapsible pt-2" open={openSection === "document"} onOpenChange={(isOpen) => setOpenSection(isOpen ? "document" : null)}>
                <SidebarGroup className="p-0">
                  <SidebarMenu>
                    <SidebarMenuItem className="flex flex-col gap-1">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted">
                          <FileText className="h-3.5 w-3.5 mr-2" />
                          <span>Body Settings</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-1 py-2 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <SettingLabel label="Doc Width" tooltip="Sets the document width (e.g., 800px or 100%)" />
                            <Input
                              value={rootNode.props.width || ''}
                              onChange={(e) => updateNodeProps('root', { width: e.target.value })}
                              className="h-8 text-xs"
                              placeholder="100%"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <SettingLabel label="Doc Height" tooltip="Sets the document minimum height (e.g., 1100px or auto)" />
                            <Input
                              value={rootNode.props.height || ''}
                              onChange={(e) => updateNodeProps('root', { height: e.target.value })}
                              className="h-8 text-xs"
                              placeholder="auto"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <SettingLabel label="Background Color" tooltip="Sets the background color of the element" />
                          <div className="flex gap-2 border border-input rounded-md p-1">
                            <Input type="color" value={rootNode.props.backgroundColor || '#ffffff'} onChange={(e) => updateNodeProps('root', { backgroundColor: e.target.value })} className="h-6 w-8 p-0 border-0" />
                            <Input value={rootNode.props.backgroundColor || '#ffffff'} onChange={(e) => updateNodeProps('root', { backgroundColor: e.target.value })} className="h-6 flex-1 text-xs uppercase border-0 focus-visible:ring-0 p-0" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <SettingLabel label="Text Color" tooltip="Sets the color of the text content" />
                          <div className="flex gap-2 border border-input rounded-md p-1">
                            <Input type="color" value={rootNode.props.color || '#000000'} onChange={(e) => updateNodeProps('root', { color: e.target.value })} className="h-6 w-8 p-0 border-0" />
                            <Input value={rootNode.props.color || '#000000'} onChange={(e) => updateNodeProps('root', { color: e.target.value })} className="h-6 flex-1 text-xs uppercase border-0 focus-visible:ring-0 p-0" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <SettingLabel label="Font Family" tooltip="Selects the typeface for the text" />
                          <FontSelector
                            value={rootNode.props.fontFamily ?? 'inherit'}
                            onChange={(v) => updateNodeProps('root', { fontFamily: v })}
                            disabled={false}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <SettingLabel label="Font Weight" tooltip="Sets the thickness of the text characters" />
                          <Select value={rootNode.props.fontWeight === 'bold' ? 'bold' : 'normal'} onValueChange={(v) => updateNodeProps('root', { fontWeight: v })}>
                            <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Regular</SelectItem>
                              <SelectItem value="bold">Bold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <SettingLabel label="Alignment" tooltip="Aligns the element within its container" />
                          <Select value={rootNode.props.textAlign || 'left'} onValueChange={(v: string) => updateNodeProps('root', { textAlign: v as ComponentProps['textAlign'] })}>
                            <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                              <SelectItem value="justify">Justify</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5 border-t pt-3">
                          <div className="flex items-center justify-between">
                            <SettingLabel label="Background Image" tooltip="Sets an image as the background" />
                            <Switch checked={showDocBgImage} onCheckedChange={(v) => { setShowDocBgImage(v); if (!v) updateNodeProps('root', { backgroundImage: '' }) }} />
                          </div>
                          {showDocBgImage && (
                            <div className="space-y-2 mt-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'root', 'backgroundImage')}
                                className="h-8 text-xs"
                              />
                              <div className="text-[10px] text-center opacity-50">OR</div>
                              <Input
                                value={rootNode.props.backgroundImage || ''}
                                onChange={(e) => updateNodeProps('root', { backgroundImage: e.target.value })}
                                className="h-8 text-xs"
                                placeholder="Image URL https://..."
                              />
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              </Collapsible>

              {/* Node-Specific Settings */}
              {selectedNode && (
                <>
                  <Collapsible className="group/collapsible pt-2" open={openSection === "general"} onOpenChange={(isOpen) => setOpenSection(isOpen ? "general" : null)}>
                    <SidebarGroup className="p-0">
                      <SidebarMenu>
                        <SidebarMenuItem className="flex flex-col gap-1">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted">
                              <Settings className="h-3.5 w-3.5 mr-2" />
                              <span>{selectedNode.type} Settings</span>
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 py-3 space-y-4">

                            {/* Text / Paragraph / Heading */}
                            {(selectedNode.type === 'text' || selectedNode.type === 'heading' || selectedNode.type === 'paragraph') && (
                              <>
                                {selectedNode.type === 'heading' && (
                                  <div className="space-y-1.5">
                                    <SettingLabel label="Heading Type" tooltip="Settings for Heading Type" />
                                    <Select value={selectedNode.props.level || 'h2'} onValueChange={(v: string) => updateNodeProps(selectedNode.id, { level: v as ComponentProps['level'] })}>
                                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="h1">Heading 1</SelectItem>
                                        <SelectItem value="h2">Heading 2</SelectItem>
                                        <SelectItem value="h3">Heading 3</SelectItem>
                                        <SelectItem value="h4">Heading 4</SelectItem>
                                        <SelectItem value="h5">Heading 5</SelectItem>
                                        <SelectItem value="h6">Heading 6</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                                <div className="space-y-1.5">
                                  <SettingLabel label="Content" tooltip="The text content of the element" />
                                  {editingNodeId === selectedNode.id ? (
                                    <p className="text-[11px] text-muted-foreground italic px-1">
                                      Editing on canvas…
                                    </p>
                                  ) : (
                                    <>
                                      <p className="text-[10px] text-muted-foreground px-1 mb-1">
                                        Double-click the element on canvas to edit inline
                                      </p>
                                      <div className="relative">
                                        <Textarea
                                          id={`textarea-${selectedNode.id}`}
                                          value={htmlToPlainText(selectedNode.props.text || '')}
                                          onChange={(e) => updateNodeProps(selectedNode.id, { text: plainTextToHtml(e.target.value) })}
                                          className="min-h-[80px] text-xs pb-8"
                                        />
                                        <div className="absolute bottom-1 right-1">
                                          <TextareaFieldSelector onSelect={(field) => {
                                            const textarea = document.getElementById(`textarea-${selectedNode.id}`) as HTMLTextAreaElement;
                                            if (textarea) {
                                              const start = textarea.selectionStart;
                                              const end = textarea.selectionEnd;
                                              const val = textarea.value;
                                              const newVal = val.substring(0, start) + `{{${field}}}` + val.substring(end);
                                              updateNodeProps(selectedNode.id, { text: plainTextToHtml(newVal) });
                                              // Refocus textarea and restore cursor position after a tick
                                              setTimeout(() => {
                                                textarea.focus();
                                                textarea.setSelectionRange(start + field.length + 4, start + field.length + 4);
                                              }, 0);
                                            }
                                          }} />
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="space-y-1.5">
                                  <SettingLabel label="Font Family" tooltip="Selects the typeface for the text" />
                                  <FontSelector
                                    value={rootNode.props.fontFamily ?? 'inherit'}
                                    onChange={(v) => updateNodeProps('root', { fontFamily: v })}
                                    disabled={false}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1.5">
                                    <SettingLabel label="Font Size (px)" tooltip="Settings for Font Size (px)" />
                                    <Input
                                      value={selectedNode.props.fontSize?.replace('px', '') || ''}
                                      onChange={(e) => updateNodeProps(selectedNode.id, { fontSize: `${e.target.value}px` })}
                                      type="number"
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <SettingLabel label="Weight" tooltip="Settings for Weight" />
                                    <Select value={selectedNode.props.fontWeight === 'bold' ? 'bold' : 'normal'} onValueChange={(v) => updateNodeProps(selectedNode.id, { fontWeight: v })}>
                                      <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="normal">Regular</SelectItem>
                                        <SelectItem value="bold">Bold</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <SettingLabel label="Color" tooltip="Settings for Color" />
                                  <div className="flex gap-2 border border-input rounded-md p-1">
                                    <Input type="color" value={selectedNode.props.color || '#000000'} onChange={(e) => updateNodeProps(selectedNode.id, { color: e.target.value })} className="h-6 w-8 p-0 border-0" />
                                    <Input value={selectedNode.props.color || '#000000'} onChange={(e) => updateNodeProps(selectedNode.id, { color: e.target.value })} className="h-6 flex-1 text-xs uppercase border-0 focus-visible:ring-0 p-0" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <SettingLabel label="Alignment" tooltip="Aligns the element within its container" />
                                  <Select value={selectedNode.props.textAlign || 'left'} onValueChange={(v: string) => updateNodeProps(selectedNode.id, { textAlign: v as ComponentProps['textAlign'] })}>
                                    <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="left">Left</SelectItem>
                                      <SelectItem value="center">Center</SelectItem>
                                      <SelectItem value="right">Right</SelectItem>
                                      <SelectItem value="justify">Justify</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1.5">
                                  <SettingLabel label="Line Height" tooltip="Sets the vertical spacing between lines of text" />
                                  <Input
                                    value={selectedNode.props.lineHeight || ''}
                                    onChange={(e) => updateNodeProps(selectedNode.id, { lineHeight: e.target.value })}
                                    type="number"
                                    step="0.1"
                                    className="h-8 text-xs"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <SettingLabel label="Letter Spacing (px)" tooltip="Settings for Letter Spacing (px)" />
                                  <Input
                                    value={selectedNode.props.letterSpacing?.replace('px', '') || ''}
                                    onChange={(e) => updateNodeProps(selectedNode.id, { letterSpacing: `${e.target.value}px` })}
                                    type="number"
                                    className="h-8 text-xs"
                                  />
                                </div>
                              </>
                            )}

                            {/* Image Settings */}
                            {selectedNode.type === 'image' && (
                              <>
                                <div className="space-y-1.5 flex items-center justify-between pb-2">
                                  <SettingLabel label="Is Signature" tooltip="Use a signature for this image" />
                                  <Switch
                                    checked={!!selectedNode.props.isSignature}
                                    onCheckedChange={(v) => updateNodeProps(selectedNode.id, { isSignature: v })}
                                  />
                                </div>
                                {selectedNode.props.isSignature && (
                                  <div className="space-y-1.5 pb-2">
                                    <SettingLabel label="Select Signature" tooltip="Select an available signature" />
                                    <Select
                                      value={selectedNode.props.signatureId || ''}
                                      onValueChange={(v) => {
                                        const sig = signatures.find(s => s.id === v);
                                        updateNodeProps(selectedNode.id, { signatureId: v, src: sig ? `https://dummyimage.com/400x200/e0e0e0/000000&text=${sig.name.replace(/ /g, '+')}` : '' });
                                      }}
                                    >
                                      <SelectTrigger className="h-8 text-xs w-full"><SelectValue placeholder={isLoadingSignatures ? "Loading..." : "Select Signature"} /></SelectTrigger>
                                      <SelectContent>
                                        {signatures.map(sig => (
                                          <SelectItem key={sig.id} value={sig.id}>{sig.name}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                                <div className="space-y-1.5">
                                  <SettingLabel label="Image Source" tooltip="Settings for Image Source" />
                                  <div className="space-y-2">
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(e, selectedNode.id, 'src')}
                                      className="h-8 text-xs"
                                    />
                                    <div className="text-[10px] text-center opacity-50">OR</div>
                                    <Input
                                      value={selectedNode.props.src || ''}
                                      onChange={(e) => updateNodeProps(selectedNode.id, { src: e.target.value })}
                                      placeholder="URL: https://..."
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1.5 flex items-center justify-between mt-4">
                                  <SettingLabel label="Custom Width" tooltip="Settings for Custom Width" />
                                  <Switch checked={enableImageWidth} onCheckedChange={setEnableImageWidth} />
                                </div>
                                {enableImageWidth && (
                                  <div className="space-y-2 pt-2">
                                    <Slider
                                      disabled={!selectedNode.props.src}
                                      value={[parseInt(selectedNode.props.width || '100')]}
                                      onValueChange={(v) => updateNodeProps(selectedNode.id, { width: `${v[0]}%` })}
                                      max={100} min={10} step={1}
                                    />
                                    <div className="text-right text-[10px] text-muted-foreground">{selectedNode.props.width || '100%'}</div>
                                  </div>
                                )}
                                <div className="space-y-1.5 mt-2">
                                  <SettingLabel label="Alt Text" tooltip="Alternative text for screen readers and when image fails to load" />
                                  <Input
                                    value={selectedNode.props.alt || ''}
                                    onChange={(e) => updateNodeProps(selectedNode.id, { alt: e.target.value })}
                                    className="h-8 text-xs"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <SettingLabel label="Alignment" tooltip="Aligns the element within its container" />
                                  <Select value={selectedNode.props.alignment || 'center'} onValueChange={(v: string) => updateNodeProps(selectedNode.id, { alignment: v as ComponentProps['alignment'] })}>
                                    <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="left">Left</SelectItem>
                                      <SelectItem value="center">Center</SelectItem>
                                      <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </>
                            )}

                            {/* Divider Settings */}
                            {selectedNode.type === 'divider' && (
                              <>
                                <div className="space-y-1.5">
                                  <SettingLabel label="Color" tooltip="Settings for Color" />
                                  <div className="flex gap-2 border border-input rounded-md p-1">
                                    <Input type="color" value={selectedNode.props.borderColor || '#e5e7eb'} onChange={(e) => updateNodeProps(selectedNode.id, { borderColor: e.target.value })} className="h-6 w-8 p-0 border-0" />
                                    <Input value={selectedNode.props.borderColor || '#e5e7eb'} onChange={(e) => updateNodeProps(selectedNode.id, { borderColor: e.target.value })} className="h-6 flex-1 text-xs uppercase border-0 focus-visible:ring-0 p-0" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1.5">
                                    <SettingLabel label="Thickness (px)" tooltip="Settings for Thickness (px)" />
                                    <Input
                                      value={selectedNode.props.thickness?.replace('px', '') || '1'}
                                      onChange={(e) => updateNodeProps(selectedNode.id, { thickness: `${e.target.value}px` })}
                                      type="number"
                                      className="h-8 text-xs"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <SettingLabel label="Line Style" tooltip="Settings for Line Style" />
                                    <Select value={selectedNode.props.borderStyle || 'solid'} onValueChange={(v: string) => updateNodeProps(selectedNode.id, { borderStyle: v as ComponentProps['borderStyle'] })}>
                                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="solid">Solid</SelectItem>
                                        <SelectItem value="dashed">Dashed</SelectItem>
                                        <SelectItem value="dotted">Dotted</SelectItem>
                                        <SelectItem value="double">Double</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-1.5 flex items-center justify-between mt-2">
                                  <SettingLabel label="Margin Y" tooltip="Sets the vertical spacing above and below the divider" />
                                  <Switch checked={showMargin} onCheckedChange={(v) => { setShowMargin(v); if (!v) updateNodeProps(selectedNode.id, { marginY: '0px' }) }} />
                                </div>
                                {showMargin && (
                                  <Input
                                    value={selectedNode.props.marginY || ''}
                                    onChange={(e) => updateNodeProps(selectedNode.id, { marginY: e.target.value })}
                                    className="h-8 text-xs"
                                    placeholder="e.g. 16px"
                                  />
                                )}
                                <div className="space-y-1.5">
                                  <SettingLabel label="Alignment" tooltip="Aligns the element within its container" />
                                  <Select value={selectedNode.props.alignment || 'center'} onValueChange={(v: string) => updateNodeProps(selectedNode.id, { alignment: v as ComponentProps['alignment'] })}>
                                    <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="left">Left</SelectItem>
                                      <SelectItem value="center">Center</SelectItem>
                                      <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </>
                            )}

                            {/* Layout Elements Settings (Background) */}
                            {(selectedNode.type === 'column' || selectedNode.type === 'block' || selectedNode.type === 'row') && (
                              <div className="space-y-1.5">
                                <SettingLabel label="Background Color" tooltip="Sets the background color of the element" />
                                <div className="flex gap-2 border border-input rounded-md p-1">
                                  <Input type="color" value={selectedNode.props.backgroundColor || '#ffffff'} onChange={(e) => updateNodeProps(selectedNode.id, { backgroundColor: e.target.value })} className="h-6 w-8 p-0 border-0" />
                                  <Input value={selectedNode.props.backgroundColor || '#ffffff'} onChange={(e) => updateNodeProps(selectedNode.id, { backgroundColor: e.target.value })} className="h-6 flex-1 text-xs uppercase border-0 focus-visible:ring-0 p-0" />
                                </div>
                              </div>
                            )}

                            {/* Row specific (Gap) */}
                            {selectedNode.type === 'row' && (
                              <div className="space-y-1.5">
                                <SettingLabel label="Column Gap" tooltip="Settings for Column Gap" />
                                <Input value={selectedNode.props.gap || '0px'} onChange={(e) => updateNodeProps(selectedNode.id, { gap: e.target.value })} className="h-8 text-xs" placeholder="e.g. 16px" />
                              </div>
                            )}

                            {/* Advanced toggles (Padding, Margin, Border, BgImage) available for most elements */}
                            {selectedNode.type !== 'divider' && selectedNode.type !== 'image' && (
                              <>
                                <div className="pt-4 space-y-3 border-t border-muted">
                                  {/* Padding Toggle */}
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <SettingLabel label="Padding" tooltip="Adds internal spacing inside the element (e.g., 20px or 10px 20px 10px 20px)" />
                                      <Switch checked={showPadding} onCheckedChange={(v) => { setShowPadding(v); if (!v) updateNodeProps(selectedNode.id, { padding: '0px' }) }} />
                                    </div>
                                    {showPadding && (
                                      <Input value={selectedNode.props.padding || ''} onChange={(e) => updateNodeProps(selectedNode.id, { padding: e.target.value })} className="h-8 text-xs" placeholder="e.g. 10px 20px" />
                                    )}
                                  </div>

                                  {/* Margin Toggle */}
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <SettingLabel label="Margin" tooltip="Adds external spacing outside the element (e.g., 20px or 10px 20px 10px 20px)" />
                                      <Switch checked={showMargin} onCheckedChange={(v) => { setShowMargin(v); if (!v) updateNodeProps(selectedNode.id, { margin: '0px' }) }} />
                                    </div>
                                    {showMargin && (
                                      <Input value={selectedNode.props.margin || ''} onChange={(e) => updateNodeProps(selectedNode.id, { margin: e.target.value })} className="h-8 text-xs" placeholder="e.g. 10px 20px" />
                                    )}
                                  </div>

                                  {/* Border Toggle */}
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <SettingLabel label="Border" tooltip="Sets the thickness of the border (e.g., 1px or 2px 0 0 2px)" />
                                      <Switch checked={showBorder} onCheckedChange={(v) => { setShowBorder(v); if (!v) updateNodeProps(selectedNode.id, { borderWidth: '0px' }) }} />
                                    </div>
                                    {showBorder && (
                                      <div className="flex gap-2">
                                        <Input value={selectedNode.props.borderWidth || '1px'} onChange={(e) => updateNodeProps(selectedNode.id, { borderWidth: e.target.value })} className="h-8 text-xs w-16" placeholder="Width" />
                                        <Input type="color" value={selectedNode.props.borderColor || '#000000'} onChange={(e) => updateNodeProps(selectedNode.id, { borderColor: e.target.value })} className="h-8 w-10 p-1" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Background Image Toggle (For Layouts) */}
                                  {(selectedNode.type === 'column' || selectedNode.type === 'block' || selectedNode.type === 'row') && (
                                    <div className="space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <SettingLabel label="Background Image" tooltip="Sets an image as the background" />
                                        <Switch checked={showBgImage} onCheckedChange={(v) => { setShowBgImage(v); if (!v) updateNodeProps(selectedNode.id, { backgroundImage: '' }) }} />
                                      </div>
                                      {showBgImage && (
                                        <div className="space-y-2 mt-2">
                                          <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, selectedNode.id, 'backgroundImage')}
                                            className="h-8 text-xs"
                                          />
                                          <div className="text-[10px] text-center opacity-50">OR</div>
                                          <Input
                                            value={selectedNode.props.backgroundImage || ''}
                                            onChange={(e) => updateNodeProps(selectedNode.id, { backgroundImage: e.target.value })}
                                            className="h-8 text-xs"
                                            placeholder="URL: https://..."
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}

                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroup>
                  </Collapsible>

                  {/* Row specific Grid Settings */}
                  {selectedNode.type === 'row' && (
                    <Collapsible className="group/collapsible pt-2" open={openSection === "grid"} onOpenChange={(isOpen) => setOpenSection(isOpen ? "grid" : null)}>
                      <SidebarGroup className="p-0">
                        <SidebarMenu>
                          <SidebarMenuItem className="flex flex-col gap-1">
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted">
                                <Grid className="h-3.5 w-3.5 mr-2" />
                                <span>Column Settings</span>
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 py-3 space-y-4">
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { id: '100', label: '100%' },
                                  { id: '50-50', label: '50 / 50' },
                                  { id: '33-33-33', label: '33 / 33 / 33' },
                                  { id: '25-25-25-25', label: '25 / 25 / 25 / 25' },
                                  { id: '33-67', label: '33 / 67' },
                                  { id: '67-33', label: '67 / 33' },
                                  { id: '75-25', label: '75 / 25' },
                                  { id: '25-75', label: '25 / 75' },
                                ].map(layout => (
                                  <button
                                    key={layout.id}
                                    onClick={() => changeGridType(selectedNode.id, layout.id as ComponentProps['gridType'])}
                                    className={`h-12 border rounded flex items-center justify-center text-[10px] bg-muted/50 transition-colors ${selectedNode.props.gridType === layout.id ? 'border-theme ring-1 ring-theme' : 'border-border hover:bg-muted'}`}
                                  >
                                    {layout.label}
                                  </button>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarGroup>
                    </Collapsible>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </SidebarContent>
      )}
    </Sidebar>
  )
}
