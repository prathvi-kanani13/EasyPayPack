import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Ruler } from "./Ruler";
import { useState, useRef } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import EditorCanvasFooter from "./editorCanvasFooter";
import DynamicCanvas from "./dynamicCanvas";

import { useEditor } from "./EditorContext";
import EditorCanvasHeader from "./editorCanvasHeader";

/**
 * EditorCanvas component that provides a ruler-equipped workspace for designing letters.
 * Includes horizontal and vertical scales and a dashed-border document area with draggable elements.
 */
export default function EditorCanvas({
    isMobile,
    setContentSettingsOpen,
    setLayoutSettingsOpen,
}: {
    isMobile: boolean;
    setContentSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setLayoutSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { state: editorState } = useEditor();
    const { zoomLevel, canvasSize } = editorState;
    const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        setScrollPos({ x: target.scrollLeft, y: target.scrollTop });
    };

    return (
        <Card className="shadow-sm w-full h-full dark:bg-background rounded-md gap-0 flex flex-col overflow-hidden border-0">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#E5E7EB] dark:border-gray-700 p-2">
                <EditorCanvasHeader isMobile={isMobile}
                    setContentSettingsOpen={setContentSettingsOpen}
                    setLayoutSettingsOpen={setLayoutSettingsOpen} />
            </CardHeader>

            <CardContent className="relative p-0 pt-1 pl-1 flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 relative flex flex-col overflow-hidden min-w-0">
                    {/* Horizontal Ruler */}
                    <div className="flex flex-row h-6 shrink-0">
                        <div className="w-6 h-6 border-r border-b border-muted shrink-0" />
                        <div className="flex-1 overflow-hidden relative border-b border-muted z-10 min-w-0">
                            <div
                                className="absolute top-0 left-0 h-full"
                                style={{ transform: `translateX(${-scrollPos.x}px)` }}
                            >
                                <Ruler orientation="horizontal" size={(canvasSize.width + 1100) * (zoomLevel / 100)} zoom={zoomLevel / 100} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row flex-1 overflow-hidden min-w-0">
                        {/* Vertical Ruler */}
                        <div className="w-6 overflow-hidden relative border-r border-muted z-10">
                            <div
                                className="absolute top-0 left-0 w-full"
                                style={{ transform: `translateY(${-scrollPos.y}px)` }}
                            >
                                <Ruler orientation="vertical" size={(canvasSize.height + 1100) * (zoomLevel / 100)} zoom={zoomLevel / 100} />
                            </div>
                        </div>

                        {/* Scrollable Canvas Area */}
                        <ScrollArea
                            onScroll={handleScroll}
                            className="flex-1 w-0 min-h-0 bg-muted/10 dark:bg-zinc-900/50"
                        >
                            <div className="flex items-start min-w-max min-h-max">
                                <div
                                    ref={canvasRef}
                                    className="relative bg-white dark:bg-zinc-950 shadow-2xl border-2 border-dashed border-theme/30 transition-transform origin-top-left flex flex-col"
                                    style={{
                                        width: `${canvasSize.width}px`,
                                        minHeight: `${canvasSize.height}px`,
                                        transform: `scale(${zoomLevel / 100})`,
                                    }}
                                >
                                    <DynamicCanvas />
                                </div>
                            </div>
                            <ScrollBar orientation="horizontal" />
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-[#E5E7EB] dark:border-gray-700 p-2">
                <EditorCanvasFooter />
            </CardFooter>
        </Card>
    )
}


