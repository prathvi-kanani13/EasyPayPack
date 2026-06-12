import { useState, useMemo, useEffect } from 'react';
import { Eye, Pencil, Download, Trash2, Search, Filter } from 'lucide-react';
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';
import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Define the scan record attributes
export interface ScanRecord {
  id: string;
  previewType: 'signature' | 'photo' | 'document';
  previewData?: string; // base64 or URL
  type: 'Signature' | 'Photo' | 'Document';
  date: string; // formatted: Date + Time
  size: string;
}

// Generate a mock signature data URL
const generateThumbnailSignature = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 60;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#6D28D9';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(20, 35);
    ctx.bezierCurveTo(25, 20, 35, 15, 35, 25);
    ctx.bezierCurveTo(35, 35, 25, 40, 30, 45);
    ctx.lineTo(40, 35);
    ctx.moveTo(50, 45);
    ctx.lineTo(55, 25);
    ctx.quadraticCurveTo(60, 35, 75, 30);
    ctx.stroke();
  }
  return canvas.toDataURL('image/png');
};

// Generate a mock photo avatar data URL
const generateThumbnailAvatar = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 100, 100);
    grad.addColorStop(0, '#F3F4F6');
    grad.addColorStop(1, '#D1D5DB');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = '#6D28D9';
    ctx.beginPath();
    ctx.arc(50, 40, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(50, 100, 35, 0, Math.PI, true);
    ctx.fill();
  }
  return canvas.toDataURL('image/png');
};

/**
 * PreviousScans component renders a tabular view of scanned signatures, photos, and documents.
 * It features local search queries, pagination pages, and interactive document previews.
 */
export default function PreviousScans() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // States to hold the dynamically generated mock assets
  const [sigThumb, setSigThumb] = useState('');
  const [avatarThumb, setAvatarThumb] = useState('');

  useEffect(() => {
    setSigThumb(generateThumbnailSignature());
    setAvatarThumb(generateThumbnailAvatar());
  }, []);

  // Mock scan database matching the user's screenshot
  const mockScans = useMemo<ScanRecord[]>(() => {
    return [
      {
        id: '1',
        previewType: 'signature',
        previewData: sigThumb,
        type: 'Signature',
        date: '13/05/2026 10:30 AM',
        size: '200 KB',
      },
      {
        id: '2',
        previewType: 'signature',
        previewData: sigThumb,
        type: 'Signature',
        date: '12/05/2026 04:15 PM',
        size: '180 KB',
      },
      {
        id: '3',
        previewType: 'photo',
        previewData: avatarThumb,
        type: 'Photo',
        date: '10/05/2026 11:20 AM',
        size: '450 KB',
      },
      {
        id: '4',
        previewType: 'document',
        type: 'Document',
        date: '08/05/2026 02:40 PM',
        size: '1.2 MB',
      },
      {
        id: '5',
        previewType: 'signature',
        previewData: sigThumb,
        type: 'Signature',
        date: '05/05/2026 09:10 AM',
        size: '195 KB',
      },
    ];
  }, [sigThumb, avatarThumb]);

  // Handle client-side search query logic
  const filteredScans = useMemo(() => {
    return mockScans.filter((scan) => {
      const query = searchQuery.toLowerCase();
      return (
        scan.type.toLowerCase().includes(query) ||
        scan.date.toLowerCase().includes(query) ||
        scan.size.toLowerCase().includes(query)
      );
    });
  }, [mockScans, searchQuery]);

  // Paginate current matching rows
  const paginatedScans = useMemo(() => {
    const start = pageIndex * 4;
    const end = start + 4;
    return filteredScans.slice(start, end);
  }, [filteredScans, pageIndex]);

  const isNextDisabled = pageIndex * 4 + 4 >= filteredScans.length;

  const handlePreview = (scan: ScanRecord) => {
    setSelectedScan(scan);
    setIsPreviewOpen(true);
  };

  // Define columns structure for TanStack Table
  const columns = useMemo<ColumnDef<ScanRecord>[]>(
    () => [
      {
        id: 'preview',
        header: 'Preview',
        cell: ({ row }) => {
          const type = row.original.previewType;
          const src = row.original.previewData;

          if (type === 'signature' && src) {
            return (
              <div className="w-20 h-12 border dark:border-gray-800 rounded bg-white dark:bg-zinc-900 flex items-center justify-center p-1 overflow-hidden">
                <img src={src} alt="Signature preview" className="max-w-full max-h-full object-contain" />
              </div>
            );
          }
          if (type === 'photo' && src) {
            return (
              <div className="w-12 h-12 border dark:border-gray-800 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                <img src={src} alt="Photo preview" className="w-full h-full object-cover" />
              </div>
            );
          }
          // Document PDF block representation
          return (
            <div className="w-12 h-13 border dark:border-gray-800 rounded bg-gray-50 dark:bg-zinc-900 flex items-center justify-center relative shadow-xs">
              <div className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                PDF
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ getValue }) => (
          <span className="font-semibold text-theme-secondary text-sm">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ getValue }) => {
          const val = getValue() as string;
          const [dateStr, timeStr] = val.split(' ');
          return (
            <div className="flex flex-col text-[#202C4B] dark:text-gray-300 font-medium">
              <span>{dateStr}</span>
              <span className="text-xs text-muted-foreground">{timeStr}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'size',
        header: 'Size',
        cell: ({ getValue }) => (
          <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm">
            {getValue() as string}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePreview(row.original)}
              className="h-8 w-8 text-theme border-[#EAE6F3] dark:border-zinc-800 hover:bg-theme/5 cursor-pointer"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled
              className="h-8 w-8 text-yellow-600 hover:text-yellow-600 cursor-not-allowed"
              title="Edit (Disabled)"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled
              className="h-8 w-8 text-green-500 border-green-100 dark:border-green-950 opacity-50 cursor-not-allowed"
              title="Download (Disabled)"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled
              className="h-8 w-8 text-red-700 hover:text-red-700 opacity-50 cursor-not-allowed"
              title="Delete (Disabled)"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sigThumb, avatarThumb]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: paginatedScans,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 w-full" id="previous-scans-panel">
      {/* Search Bar header element */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-[#202C4B] dark:text-white font-bold text-lg">Previous Scans</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scans..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPageIndex(0);
              }}
              className="pl-9 h-9 w-full rounded-md border-input"
            />
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* TanStack Table rendering */}
      <div className="border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-950">
        <DataTable
          table={table}
          isLoading={false}
          isError={false}
          columnCount={columns.length}
          errorMessage="No Scans Found"
          className="w-full"
        />
      </div>

      {/* Pagination control bar */}
      <Pagination
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        isNextDisabled={isNextDisabled}
      />

      {/* Interactive Scan Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-md w-full p-4">
          <DialogHeader>
            <DialogTitle className="text-[#202C4B] dark:text-white font-bold text-lg mb-2">
              Preview Scan - {selectedScan?.type}
            </DialogTitle>
          </DialogHeader>

          {/* Dialog attachment content view */}
          <div className="flex flex-col items-center justify-center p-4 border dark:border-gray-800 rounded bg-muted/20 min-h-50">
            {selectedScan?.previewType === 'signature' && selectedScan.previewData && (
              <div className="bg-white dark:bg-zinc-900 border dark:border-gray-800 rounded p-4 flex items-center justify-center max-w-full shadow-xs">
                <img src={selectedScan.previewData} alt="Signature full-view" className="max-h-40 object-contain" />
              </div>
            )}
            {selectedScan?.previewType === 'photo' && selectedScan.previewData && (
              <div className="rounded-full overflow-hidden border dark:border-gray-800 w-32 h-32 flex items-center justify-center bg-white dark:bg-zinc-900 shadow-md">
                <img src={selectedScan.previewData} alt="Photo full-view" className="object-cover w-full h-full" />
              </div>
            )}
            {selectedScan?.previewType === 'document' && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-20 border dark:border-gray-800 rounded bg-white dark:bg-zinc-900 flex items-center justify-center shadow-md">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">PDF</span>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">document_scan_08052026.pdf</span>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
              className="cursor-pointer"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
