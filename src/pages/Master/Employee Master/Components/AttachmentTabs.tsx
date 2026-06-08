import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TTabValues = 'signature' | 'photo' | 'document';

export default function AttachmentTabs({ type, setType }: { type: TTabValues, setType: (value: TTabValues) => void }) {
  return (
    <Tabs defaultValue="card" value={type} onValueChange={(value) => setType(value as TTabValues)} className="gap-4">
      <TabsList className="flex w-full flex-wrap h-9! p-0" variant='line'>
        <TabsTrigger value="signature" className="data-[state=active]:text-theme-secondary! group-data-[variant=line]/tabs-list:data-active:after:bg-theme-secondary cursor-pointer">
          Signature
        </TabsTrigger>
        <TabsTrigger value="photo" className="data-[state=active]:text-theme-secondary! group-data-[variant=line]/tabs-list:data-active:after:bg-theme-secondary cursor-pointer">
          Photo
        </TabsTrigger>
        <TabsTrigger value="document" className="data-[state=active]:text-theme-secondary! group-data-[variant=line]/tabs-list:data-active:after:bg-theme-secondary cursor-pointer">
          Document
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
