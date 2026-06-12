import EmployeeDetailCard from "../EmployeeDetailCard";
import PreviousScans from "../Components/PreviousScans";
import AttachmentEditor from "../Components/AttachmentEditor";
import { useLayoutWidth } from "@/layout/Layout";

export default function LoanDetailTab() {


    const width = useLayoutWidth();

    const breakpoints = {
        lg: 1024
    }

    const isLg = width >= breakpoints.lg;

    return (
        <div className="flex flex-col gap-4">
            {/* employee details card */}
            <EmployeeDetailCard />

            <div className={`flex gap-4 ${isLg ? 'flex-row' : 'flex-col'}`}>
                {/* left  */}
                <div className="flex-1 flex flex-col gap-4">
                    <AttachmentEditor />
                </div>

                {/* right  */}
                <div className="flex-1">
                    <PreviousScans />
                </div>

            </div>
        </div>
    );
}