import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CalendarIcon, RotateCcw, Trash2, X } from 'lucide-react';
import type { Dispatch, SetStateAction, RefObject } from 'react';
import type { Signature } from '../TypeSignature';

interface SignatureCardProps {
  selectedSignature: Signature;
  signatureImage: string | null;
  isRemoved: boolean;
  localStatus: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  setSignatureImage: Dispatch<SetStateAction<string | null>>;
  setLocalStatus: Dispatch<SetStateAction<string>>;
  handleSignatureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSignature: () => void;
  isMobile?: boolean;
}

const SignatureCard = ({
  selectedSignature,
  signatureImage,
  isRemoved,
  localStatus,
  fileInputRef,
  setIsSidebarOpen,
  setSignatureImage,
  setLocalStatus,
  handleSignatureUpload,
  handleClearSignature,
  isMobile = false,
}: SignatureCardProps) => {
  return (
    <>
      <div className="p-4 border-b dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white">Signature Details</h3>
        {!isMobile && <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
          <X size={18} />
        </Button>}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div key={selectedSignature.id} className="space-y-6">
          {/* Preview */}
          <div className="space-y-3">
            <div className="w-full h-30 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center overflow-hidden">
              {isRemoved ? (
                <div className="flex flex-col items-center gap-2 opacity-50">
                  <h1 className="text-sm font-semibold dark:text-white">Not Uploaded any Signature</h1>
                </div>
              ) : signatureImage ? (
                <img
                  src={signatureImage}
                  alt="Signature"
                  className="max-h-[90%] max-w-[90%] object-contain"
                  onError={() => setSignatureImage(null)}
                />
              ) : (
                <>
                  <div className="text-4xl font-serif text-slate-900 dark:text-white italic opacity-80 select-none">
                    {selectedSignature.authorityName}
                  </div>
                  <div className="w-4/5 h-px bg-slate-900 dark:bg-white/50 mt-1"></div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="flex-1 bg-theme text-white text-xs font-bold gap-2 h-9 rounded-md"

                onClick={() => fileInputRef.current?.click()}
              >
                <RotateCcw size={14} />
                Change Signature
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleSignatureUpload}
              />
              <Button
                variant="outline"
                className="flex-1 text-red-700 hover:text-red-700 text-xs font-bold gap-2 h-9 rounded-md"

                onClick={handleClearSignature}
              >
                <Trash2 size={14} />
                Remove
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Authority Name</Label>
              <Input defaultValue={selectedSignature.authorityName} className="h-10 border-slate-200 dark:border-slate-800" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Designation</Label>
              <Input defaultValue={selectedSignature.designation} className="h-10 border-slate-200 dark:border-slate-800" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Department</Label>
              <Select defaultValue={selectedSignature.department.toLowerCase()} >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="payroll">Payroll</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Effective From</Label>
                <Popover>
                  <PopoverTrigger asChild >
                    <Button variant="outline" className="w-full justify-between h-10 border-slate-200 dark:border-slate-800 font-normal text-slate-400" >
                      Select Date
                      <CalendarIcon size={14} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Effective To</Label>
                <Popover>
                  <PopoverTrigger asChild >
                    <Button variant="outline" className="w-full justify-between h-10 border-slate-200 dark:border-slate-800 font-normal text-slate-400" >
                      Select date
                      <CalendarIcon size={14} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Status</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={localStatus === 'Active'}

                  onCheckedChange={(checked) => setLocalStatus(checked ? 'Active' : 'Inactive')}
                />
                <span className={`text-xs font-bold`}>
                  {localStatus}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Description</Label>
              <Textarea
                placeholder="Authorized signature for..."
                className="min-h-20 border-slate-200 dark:border-slate-800 resize-none text-xs"
                defaultValue={selectedSignature.description}

              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Created By</p>
                <p className="text-xs font-bold text-slate-700 mt-1">Admin User</p>
                <p className="text-[10px] text-slate-400 mt-0.5">01 Jan 2025 10:30 AM</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Updated By</p>
                <p className="text-xs font-bold text-slate-700 mt-1">Admin User</p>
                <p className="text-[10px] text-slate-400 mt-0.5">05 May 2025 04:15 PM</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-5 border-t dark:border-slate-800 grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-10 font-bold text-slate-600 border-slate-200 dark:border-slate-800" onClick={() => setIsSidebarOpen(false)}>Cancel</Button>
        <Button className="h-10 bg-theme text-white font-bold" >Update</Button>
      </div>
    </>
  );
}

export default SignatureCard;
