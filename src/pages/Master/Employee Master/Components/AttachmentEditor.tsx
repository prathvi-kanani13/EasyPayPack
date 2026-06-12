/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Crop, Maximize, Scan, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface AttachmentEditorProps {
  onChange?: (dataUrl: string) => void;
}

// Generate a default mock signature similar to the screenshot S. Patel signature
const generateMockSignature = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Fill white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the signature line in deep purple theme color
    ctx.strokeStyle = '#6D28D9';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();

    // Draw 'S'
    ctx.moveTo(80, 120);
    ctx.bezierCurveTo(70, 70, 110, 60, 110, 90);
    ctx.bezierCurveTo(110, 120, 70, 130, 90, 160);
    ctx.bezierCurveTo(100, 170, 120, 160, 130, 140);

    // Draw dot '.'
    ctx.moveTo(145, 155);
    ctx.arc(145, 155, 2.5, 0, Math.PI * 2);

    // Draw 'P'
    ctx.moveTo(165, 170);
    ctx.lineTo(170, 80);
    ctx.moveTo(170, 80);
    ctx.bezierCurveTo(190, 65, 210, 80, 200, 110);
    ctx.bezierCurveTo(190, 130, 172, 130, 172, 130);

    // Draw 'a'
    ctx.moveTo(215, 130);
    ctx.bezierCurveTo(210, 120, 225, 115, 228, 122);
    ctx.bezierCurveTo(230, 130, 222, 135, 218, 132);
    ctx.lineTo(228, 132);

    // Draw 't'
    ctx.moveTo(238, 135);
    ctx.lineTo(242, 95);
    ctx.moveTo(234, 110);
    ctx.lineTo(248, 110);

    // Draw 'e'
    ctx.moveTo(248, 130);
    ctx.bezierCurveTo(256, 120, 260, 123, 256, 132);

    // Draw 'l'
    ctx.moveTo(266, 135);
    ctx.lineTo(270, 90);
    ctx.bezierCurveTo(274, 85, 278, 100, 274, 135);

    // Flourish underline
    ctx.moveTo(130, 175);
    ctx.quadraticCurveTo(250, 120, 420, 95);
    ctx.moveTo(280, 145);
    ctx.lineTo(440, 110);

    ctx.stroke();
  }
  return canvas.toDataURL('image/png');
};

/**
 * ImageEditorToolbar component provides standard image action buttons:
 * Zoom In, Zoom Out, Reset Changes, Crop Toggle, and Reset Zoom.
 */
function ImageEditorToolbar({
  onZoomIn,
  onZoomOut,
  onResetChanges,
  onToggleCrop,
  onResetZoom,
  isCropping,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetChanges: () => void;
  onToggleCrop: () => void;
  onResetZoom: () => void;
  isCropping: boolean;
}) {
  return (
    <div className="flex justify-center gap-4" id="editor-toolbar">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        title="Zoom In"
        className="text-theme border-border dark:border-gray-800 hover:text-theme-secondary hover:bg-accent h-10 w-10 cursor-pointer"
      >
        <ZoomIn className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        title="Zoom Out"
        className="text-theme border-border dark:border-gray-800 hover:text-theme-secondary hover:bg-accent h-10 w-10 cursor-pointer"
      >
        <ZoomOut className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onResetChanges}
        title="Reset Changes"
        className="text-theme border-border dark:border-gray-800 hover:text-theme-secondary hover:bg-accent h-10 w-10 cursor-pointer"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant={isCropping ? "default" : "outline"}
        size="icon"
        onClick={onToggleCrop}
        title="Crop Image"
        className={`h-10 w-10 cursor-pointer ${isCropping
          ? "bg-theme text-white hover:bg-theme/90"
          : "text-theme border-border dark:border-gray-800 hover:text-theme-secondary hover:bg-accent"
          }`}
      >
        <Crop className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onResetZoom}
        title="Reset Zoom"
        className="text-theme border-border dark:border-gray-800 hover:text-theme-secondary hover:bg-accent h-10 w-10 cursor-pointer"
      >
        <Maximize className="h-5 w-5" />
      </Button>
    </div>
  );
}

/**
 * ImagePreviewSection component handles displaying the image within a border frame,
 * manages panning & zoom transforms, and renders the interactive crop box overlay when active.
 */
function ImagePreviewSection({
  imageSrc,
  zoom,
  pan,
  isCropping,
  cropBox,
  setCropBox,
  onImageLoad,
  imgRef,
  onStartDrag,
  onDrag,
  onEndDrag,
  colorMode,
  dimensions,
  fileSize,
  confirmCrop,
  attachmentType,
  fileName,
}: {
  imageSrc: string;
  zoom: number;
  pan: { x: number; y: number };
  isCropping: boolean;
  cropBox: { x: number; y: number; w: number; h: number };
  setCropBox: React.Dispatch<React.SetStateAction<{ x: number; y: number; w: number; h: number }>>;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  imgRef: React.RefObject<HTMLImageElement | null>;
  onStartDrag: (e: React.MouseEvent) => void;
  onDrag: (e: React.MouseEvent) => void;
  onEndDrag: () => void;
  colorMode: 'color' | 'grayscale';
  dimensions: { w: number; h: number };
  fileSize: number;
  confirmCrop: () => void;
  attachmentType: 'signature' | 'photo' | 'document';
  fileName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [interaction, setInteraction] = useState<{
    type: 'drag' | 'resize';
    handle?: string;
    startX: number;
    startY: number;
    initialBox: { x: number; y: number; w: number; h: number };
  } | null>(null);

  // Reset loaded state when image source changes
  useEffect(() => {
    setIsLoaded(false);
  }, [imageSrc]);

  // Re-calculate the display coordinates when cropping becomes active or display dimensions change
  useEffect(() => {
    if (imgRef.current && isCropping && isLoaded) {
      setDisplaySize({
        w: imgRef.current.clientWidth,
        h: imgRef.current.clientHeight,
      });
      // Initialize crop box to be centered and 80% size of container
      const w = imgRef.current.clientWidth;
      const h = imgRef.current.clientHeight;
      setCropBox({
        x: Math.round(w * 0.1),
        y: Math.round(h * 0.1),
        w: Math.round(w * 0.8),
        h: Math.round(h * 0.8),
      });
    }
  }, [isCropping, imgRef, setCropBox, isLoaded]);

  const handleCropBoxMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCropping) return;
    setInteraction({
      type: 'drag',
      startX: e.clientX,
      startY: e.clientY,
      initialBox: { ...cropBox },
    });
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setInteraction({
      type: 'resize',
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialBox: { ...cropBox },
    });
  };

  const handleOverlayMouseMove = (e: React.MouseEvent) => {
    if (!interaction) return;
    const dx = e.clientX - interaction.startX;
    const dy = e.clientY - interaction.startY;

    if (interaction.type === 'drag') {
      const newX = Math.max(0, Math.min(displaySize.w - interaction.initialBox.w, interaction.initialBox.x + dx));
      const newY = Math.max(0, Math.min(displaySize.h - interaction.initialBox.h, interaction.initialBox.y + dy));
      setCropBox(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    } else if (interaction.type === 'resize') {
      const { handle, initialBox } = interaction;
      let newX = initialBox.x;
      let newY = initialBox.y;
      let newW = initialBox.w;
      let newH = initialBox.h;

      const minSize = 25;

      if (handle?.includes('left')) {
        const maxX = initialBox.x + initialBox.w - minSize;
        newX = Math.max(0, Math.min(maxX, initialBox.x + dx));
        newW = initialBox.w - (newX - initialBox.x);
      }
      if (handle?.includes('right')) {
        newW = Math.max(minSize, Math.min(displaySize.w - initialBox.x, initialBox.w + dx));
      }
      if (handle?.includes('top')) {
        const maxY = initialBox.y + initialBox.h - minSize;
        newY = Math.max(0, Math.min(maxY, initialBox.y + dy));
        newH = initialBox.h - (newY - initialBox.y);
      }
      if (handle?.includes('bottom')) {
        newH = Math.max(minSize, Math.min(displaySize.h - initialBox.y, initialBox.h + dy));
      }

      setCropBox({
        x: newX,
        y: newY,
        w: newW,
        h: newH,
      });
    }
  };

  const handleOverlayMouseUp = () => {
    setInteraction(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(0)} KB`;
    }
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Container frame with checkerboard-like grid backing to visualize transparency and alignment */}
      <div
        ref={containerRef}
        className="relative border dark:border-gray-800 rounded-md h-[300px] w-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onStartDrag}
        onMouseMove={onDrag}
        onMouseUp={onEndDrag}
        onMouseLeave={onEndDrag}
        style={{
          backgroundImage: 'radial-gradient(var(--border) 1px, transparent 0)',
          backgroundSize: '16px 16px',
        }}
      >
        <div
          className="transition-transform duration-75 ease-out flex items-center justify-center w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {attachmentType === 'document' ? (
            <div className="flex flex-col items-center gap-3 text-muted-foreground p-6 bg-slate-50 dark:bg-zinc-900 border dark:border-gray-800 rounded-lg shadow-sm max-w-[80%] select-none">
              <FileText className="h-16 w-16 text-theme" />
              <div className="text-sm font-semibold text-center truncate max-w-[220px]">
                {fileName || "No Document Uploaded"}
              </div>
              <div className="text-xs text-muted-foreground">
                Document File
              </div>
            </div>
          ) : imageSrc ? (
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Attachment Preview"
              onLoad={(e) => {
                setIsLoaded(true);
                onImageLoad(e);
              }}
              className="max-w-full max-h-full object-contain pointer-events-none"
              style={{
                filter: colorMode === 'grayscale' ? 'grayscale(100%)' : 'none',
              }}
            />
          ) : null}
        </div>

        {/* Cropping bounding box overlay */}
        {isCropping && isLoaded && (
          <div
            className="absolute"
            onMouseMove={handleOverlayMouseMove}
            onMouseUp={handleOverlayMouseUp}
            onMouseLeave={handleOverlayMouseUp}
            style={{
              width: displaySize.w,
              height: displaySize.h,
              left: `calc(50% + ${pan.x}px - ${displaySize.w / 2}px)`,
              top: `calc(50% + ${pan.y}px - ${displaySize.h / 2}px)`,
            }}
          >
            {/* Dimmed background overlay */}
            <div className="absolute inset-0 bg-black/45 pointer-events-none" />

            {/* Draggable/Resizable Crop rectangle */}
            <div
              onMouseDown={handleCropBoxMouseDown}
              className="absolute border-2 border-dashed border-theme cursor-move"
              style={{
                left: cropBox.x,
                top: cropBox.y,
                width: cropBox.w,
                height: cropBox.h,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
              }}
            >
              {/* Corner resize handles */}
              <div
                className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-theme rounded-full cursor-nwse-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'top-left')}
              />
              <div
                className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-theme rounded-full cursor-nesw-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'top-right')}
              />
              <div
                className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-theme rounded-full cursor-nesw-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
              />
              <div
                className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-theme rounded-full cursor-nwse-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
              />

              {/* Confirm Crop Action Button floating inside the Crop rectangle */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                <Button
                  type="button"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmCrop();
                  }}
                  className="bg-theme hover:bg-theme/90 text-white cursor-pointer px-3 py-1 text-xs h-7 rounded shadow-md"
                >
                  Apply Crop
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info details under the image */}
      <div className="text-sm font-medium text-muted-foreground self-start" id="editor-meta">
        Dimension : {dimensions.w} x {dimensions.h} px | Size : {formatSize(fileSize)}
      </div>
    </div>
  );
}

/**
 * EditorControlsPanel component handles rendering controls:
 * Quality Slider, DPI selector, Color Mode Radios, Filetype Select, and Actions (Scan / Import).
 */
function EditorControlsPanel({
  quality,
  setQuality,
  dpi,
  setDpi,
  colorMode,
  setColorMode,
  fileType,
  setFileType,
  onImportClick,
  attachmentType,
  setAttachmentType,
}: {
  quality: number;
  setQuality: (value: number) => void;
  dpi: string;
  setDpi: (value: string) => void;
  colorMode: 'color' | 'grayscale';
  setColorMode: (value: 'color' | 'grayscale') => void;
  fileType: string;
  setFileType: (value: string) => void;
  onImportClick: () => void;
  attachmentType: 'signature' | 'photo' | 'document';
  setAttachmentType: (value: 'signature' | 'photo' | 'document') => void;
}) {
  const isDocument = attachmentType === 'document';
  return (
    <div className="flex flex-col gap-4 w-full" id="editor-controls-panel">
      {/* attachment type */}
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="attachment-type-select" className="text-sm font-medium">Attachment Type</Label>
        <Select value={attachmentType} onValueChange={(val) => setAttachmentType(val as 'signature' | 'photo' | 'document')}>
          <SelectTrigger id="attachment-type-select" className="w-[180px] cursor-pointer">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="signature">Signature</SelectItem>
            <SelectItem value="photo">Photo</SelectItem>
            <SelectItem value="document">Document</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quality Adjustment Slider */}
      <div className={`flex flex-col gap-2 ${isDocument ? 'opacity-40 pointer-events-none' : ''}`}>
        <div className="flex justify-between items-center text-sm font-medium">
          <Label htmlFor="quality-slider">Quality</Label>
          <div className="border dark:border-gray-800 rounded px-2.5 py-0.5 text-xs text-muted-foreground min-w-[32px] text-center">
            {quality}
          </div>
        </div>
        <Slider
          id="quality-slider"
          value={[quality]}
          onValueChange={(val) => setQuality(val[0])}
          min={10}
          max={100}
          step={1}
          className="cursor-pointer"
        />
      </div>

      {/* DPI Select Option */}
      <div className={`flex items-center justify-between gap-4 ${isDocument ? 'opacity-40 pointer-events-none' : ''}`}>
        <Label htmlFor="dpi-select" className="text-sm font-medium">DPI</Label>
        <Select value={dpi} onValueChange={setDpi}>
          <SelectTrigger id="dpi-select" className="w-[180px] cursor-pointer">
            <SelectValue placeholder="Select DPI" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="75">75</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="150">150</SelectItem>
            <SelectItem value="200">200</SelectItem>
            <SelectItem value="300">300</SelectItem>
            <SelectItem value="600">600</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Color Mode Radio Toggles */}
      <div className={`flex flex-col gap-2 ${isDocument ? 'opacity-40 pointer-events-none' : ''}`}>
        <Label className="text-sm font-medium">Color Mode</Label>
        <RadioGroup
          value={colorMode}
          onValueChange={(value) => setColorMode(value as 'color' | 'grayscale')}
          className="flex gap-4 mt-1"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="color" id="color-mode-color" className="cursor-pointer" />
            <Label htmlFor="color-mode-color" className="cursor-pointer text-sm font-normal">Color</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="grayscale" id="color-mode-gray" className="cursor-pointer" />
            <Label htmlFor="color-mode-gray" className="cursor-pointer text-sm font-normal">Grayscale</Label>
          </div>
        </RadioGroup>
      </div>

      {/* File Type Dropdown Select */}
      <div className={`flex items-center justify-between gap-4 ${isDocument ? 'opacity-40 pointer-events-none' : ''}`}>
        <Label htmlFor="filetype-select" className="text-sm font-medium">File Type</Label>
        <Select value={fileType} onValueChange={setFileType}>
          <SelectTrigger id="filetype-select" className="w-[180px] cursor-pointer">
            <SelectValue placeholder="Select File Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PNG">PNG</SelectItem>
            <SelectItem value="JPEG">JPEG</SelectItem>
            <SelectItem value="WEBP">WEBP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons: Scan and Import */}
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          className="w-full bg-theme text-white hover:bg-theme/90 gap-2 h-10 cursor-pointer"
        >
          <Scan className="h-4 w-4" />
          Scan
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onImportClick}
          className="w-full border-theme text-theme hover:bg-theme/5 hover:text-theme-secondary gap-2 h-10 cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          Import Attachment
        </Button>
      </div>
    </div>
  );
}

/**
 * Main AttachmentEditor component that coordinates layouts and states
 */
export default function AttachmentEditor({ onChange }: AttachmentEditorProps) {
  // Attachment type state
  type TTabValues = 'signature' | 'photo' | 'document';
  const [attachmentType, setAttachmentType] = useState<TTabValues>('signature');
  const [fileName, setFileName] = useState<string>('');

  // Original untouched image data URL
  const [originalImageSrc, setOriginalImageSrc] = useState<string>('');
  // Current edited image data URL
  const [currentImageSrc, setCurrentImageSrc] = useState<string>('');

  // Editor states
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({ x: 20, y: 20, w: 200, h: 100 });

  // Control options
  const [quality, setQuality] = useState<number>(20); // default matching the screenshot (20)
  const [dpi, setDpi] = useState<string>("50"); // default matching screenshot (50)
  const [colorMode, setColorMode] = useState<'color' | 'grayscale'>('color');
  const [fileType, setFileType] = useState<string>('PNG');

  // Computed states
  const [dimensions, setDimensions] = useState<{ w: number; h: number }>({ w: 600, h: 200 });
  const [fileSize, setFileSize] = useState<number>(204800); // 200 KB in bytes default

  // References
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag-to-pan states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load initial mock signature or reset when switching types
  useEffect(() => {
    if (attachmentType === 'signature') {
      const mockSig = generateMockSignature();
      setOriginalImageSrc(mockSig);
      setCurrentImageSrc(mockSig);
      setFileName('mock_signature.png');
    } else {
      setOriginalImageSrc('');
      setCurrentImageSrc('');
      setFileName('');
      setDimensions({ w: 0, h: 0 });
      setFileSize(0);
    }
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsCropping(false);
  }, [attachmentType]);

  // Recalculate estimated file size and dimensions when editor attributes change
  useEffect(() => {
    if (!currentImageSrc) return;

    const img = new Image();
    img.src = currentImageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        // Apply grayscale mapping to pixel channels if mode is active
        if (colorMode === 'grayscale') {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
          }
          ctx.putImageData(imgData, 0, 0);
        }

        setDimensions({ w: canvas.width, h: canvas.height });

        let mimeType = 'image/png';
        if (fileType === 'JPEG') mimeType = 'image/jpeg';
        else if (fileType === 'WEBP') mimeType = 'image/webp';

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setFileSize(blob.size);
              // Trigger parent updates if callback provided
              if (onChange) {
                const updatedDataUrl = canvas.toDataURL(mimeType, quality / 100);
                onChange(updatedDataUrl);
              }
            }
          },
          mimeType,
          quality / 100
        );
      }
    };
  }, [currentImageSrc, quality, colorMode, fileType, onChange]);

  // Toolbar Actions
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 4));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleResetChanges = () => {
    setCurrentImageSrc(originalImageSrc);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsCropping(false);
    setQuality(20);
    setDpi("50");
    setColorMode('color');
    setFileType('PNG');
  };

  const handleToggleCrop = () => {
    // Reset zoom and pan to fit container when entering crop mode to ensure coordinate accuracy
    if (!isCropping) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
    setIsCropping(!isCropping);
  };

  const handleConfirmCrop = () => {
    if (!imgRef.current) return;

    // Find the scale differences between actual natural dimension and DOM layout client sizes
    const clientW = imgRef.current.clientWidth;
    const clientH = imgRef.current.clientHeight;

    const scaleX = dimensions.w / clientW;
    const scaleY = dimensions.h / clientH;

    const cropX = cropBox.x * scaleX;
    const cropY = cropBox.y * scaleY;
    const cropW = cropBox.w * scaleX;
    const cropH = cropBox.h * scaleY;

    const canvas = document.createElement('canvas');
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const img = new Image();
      img.src = currentImageSrc;
      img.onload = () => {
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        const croppedDataUrl = canvas.toDataURL('image/png');
        setCurrentImageSrc(croppedDataUrl);
        setIsCropping(false);
        setZoom(1);
        setPan({ x: 0, y: 0 });
      };
    }
  };

  // Drag image panning events
  const handleStartDrag = (e: React.MouseEvent) => {
    if (isCropping) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  // Import local file handler
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setOriginalImageSrc(dataUrl);
        setCurrentImageSrc(dataUrl);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setIsCropping(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileAcceptType = (attachmentType === 'signature' || attachmentType === 'photo')
    ? 'image/*'
    : '.pdf,.doc,.docx,.xls,.xlsx,.txt';

  return (
    <div className="flex flex-col gap-4 w-full p-4 border dark:border-gray-800 rounded-md">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={fileAcceptType}
        className="hidden"
      />

      {/* Zoom / Crop Top Bar Options */}
      {attachmentType !== 'document' && (
        <ImageEditorToolbar
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetChanges={handleResetChanges}
          onToggleCrop={handleToggleCrop}
          onResetZoom={handleResetZoom}
          isCropping={isCropping}
        />
      )}

      {/* Grid split showing Preview on Left and Controls on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side: Live Preview Section */}
        <ImagePreviewSection
          imageSrc={currentImageSrc}
          zoom={zoom}
          pan={pan}
          isCropping={isCropping}
          cropBox={cropBox}
          setCropBox={setCropBox}
          onImageLoad={() => { }}
          imgRef={imgRef}
          onStartDrag={handleStartDrag}
          onDrag={handleDrag}
          onEndDrag={handleEndDrag}
          colorMode={colorMode}
          dimensions={dimensions}
          fileSize={fileSize}
          confirmCrop={handleConfirmCrop}
          attachmentType={attachmentType}
          fileName={fileName}
        />

        {/* Right Side: Custom Adjustments Controls Panel */}
        <EditorControlsPanel
          quality={quality}
          setQuality={setQuality}
          dpi={dpi}
          setDpi={setDpi}
          colorMode={colorMode}
          setColorMode={setColorMode}
          fileType={fileType}
          setFileType={setFileType}
          onImportClick={handleImportClick}
          attachmentType={attachmentType}
          setAttachmentType={setAttachmentType}
        />
      </div>
    </div>
  );
}
