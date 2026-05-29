import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

import { useEditor } from "./EditorContext";
import { Separator } from '@/components/ui/separator';

/**
 * EditorCanvasFooter Component
 * Displays document settings, word count, and zoom controls
 */
export default function EditorCanvasFooter() {
    const { state: editorState, setZoom: setEditorZoom, getTextStats, setCanvasSize, updateNodeProps } = useEditor();
    const { zoomLevel, canvasSize } = editorState;
    const { words, characters } = getTextStats();

    const [preset, setPreset] = useState("A4");
    const [orientation, setOrientation] = useState("Portrait");
    const [margins, setMargins] = useState(() => editorState.nodes['root']?.props.padding || "20px");
    const [width, setWidth] = useState("794");
    const [height, setHeight] = useState("1123");

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handlePresetChange = (value: string) => {
        setPreset(value);
        if (value === "A4") { setWidth("794"); setHeight("1123"); }
        if (value === "A3") { setWidth("1123"); setHeight("1587"); }
        if (value === "Letter") { setWidth("816"); setHeight("1056"); }
    };

    const handleZoomOut = () => setEditorZoom(zoomLevel - 10);
    const handleZoomIn = () => setEditorZoom(zoomLevel + 10);

    return (
        <div className="flex items-center flex-wrap gap-2 w-full text-[11px] font-medium text-muted-foreground">
            {/* Left Section: Page Settings Trigger */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <button className="hover:text-foreground transition-colors cursor-pointer text-left focus:outline-none">
                        {preset} &bull; {orientation} &bull; Margins: {margins}
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Document Settings</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 text-sm">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="preset" className="text-right text-xs">Preset</Label>
                            <Select value={preset} onValueChange={handlePresetChange}>
                                <SelectTrigger className="col-span-3 h-8 text-xs">
                                    <SelectValue placeholder="Select preset" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A4" className="text-xs">A4</SelectItem>
                                    <SelectItem value="A3" className="text-xs">A3</SelectItem>
                                    <SelectItem value="Letter" className="text-xs">Letter</SelectItem>
                                    <SelectItem value="Custom" className="text-xs">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="orientation" className="text-right text-xs">Orientation</Label>
                            <Select value={orientation} onValueChange={setOrientation}>
                                <SelectTrigger className="col-span-3 h-8 text-xs">
                                    <SelectValue placeholder="Select orientation" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Portrait" className="text-xs">Portrait</SelectItem>
                                    <SelectItem value="Landscape" className="text-xs">Landscape</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {preset === "Custom" && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="width" className="text-right text-xs">Width (px)</Label>
                                    <Input
                                        id="width"
                                        value={width}
                                        onChange={(e) => { setWidth(e.target.value); setPreset("Custom"); }}
                                        className="col-span-3 h-8 text-xs"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="height" className="text-right text-xs">Height (px)</Label>
                                    <Input
                                        id="height"
                                        value={height}
                                        onChange={(e) => { setHeight(e.target.value); setPreset("Custom"); }}
                                        className="col-span-3 h-8 text-xs"
                                    />
                                </div>
                            </>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="margins" className="text-right text-xs">Margins</Label>
                            <Input
                                id="margins"
                                value={margins}
                                onChange={(e) => setMargins(e.target.value)}
                                className="col-span-3 h-8 text-xs"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                                setCanvasSize({ width: Number(width), height: Number(height) });
                                updateNodeProps('root', { padding: margins });
                                setIsDialogOpen(false);
                            }}
                            className="bg-theme hover:bg-[#e65c00] text-white text-xs h-8"
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Separator orientation="vertical" style={{ height: '28px' }} variant='light' />

            {/* Middle Section: Word & Character Count */}
            <div className="flex items-center gap-2 sm:flex">
                <span>Words: {words}</span>
                <span>Characters: {characters}</span>
            </div>

            <div className="flex items-center gap-6 sm:flex">
                <span>{canvasSize.width} x {canvasSize.height} px</span>
            </div>

            <Separator orientation="vertical" style={{ height: '28px' }} variant='light' />

            {/* Right Section: Zoom Controls */}
            <div className="flex items-center gap-2">
                <div className="flex items-center h-7 border border-border rounded-md px-0.5">
                    <Button type="button" variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground hover:bg-muted p-0" onClick={handleZoomOut}>
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center text-[11px]">{zoomLevel}%</span>
                    <Button type="button" variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground hover:bg-muted p-0" onClick={handleZoomIn}>
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
