import { TabsContent } from '@/components/ui/tabs'
import AvailableFields from './availableFields'

export default function DynamicPlaceholders() {
    return (
        <TabsContent value="fields" className="gap-2 text-xs">
            <AvailableFields />
        </TabsContent>
    )
}
