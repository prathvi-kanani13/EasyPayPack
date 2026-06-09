import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

// Import modular tab components
import GeneralTab from "./tabs/GeneralTab";
import PaySlipTab from "./tabs/PaySlipTab";
import NomineesTab from "./tabs/NomineesTab";
import LoanDetailTab from "./tabs/LoanDetailTab";
import PFDetailsTab from "./tabs/PFDetailsTab";
import PhotoScanTab from "./tabs/PhotoScanTab";
import { useLayoutWidth } from "@/layout/Layout";

export default function AddEmployee() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("general");

    const width = useLayoutWidth();

    const breakpoints = {
        md: 768,
    }

    const isMd = width >= breakpoints.md;

    const tabsConfig = [
        { id: "general", label: "General", component: <GeneralTab /> },
        { id: "payslip", label: "Pay Slip", component: <PaySlipTab /> },
        { id: "nominees", label: "Nominees", component: <NomineesTab /> },
        { id: "loandetail", label: "Loan Detail", component: <LoanDetailTab /> },
        { id: "pfdetails", label: "PF Details", component: <PFDetailsTab /> },
        { id: "photoscan", label: "Photo Scan", component: <PhotoScanTab /> },
    ];

    const handleSave = () => {
        console.log("Saving Employee configurations...");
    };

    return (
        <div className="flex flex-col gap-4">

            <div className="flex items-center flex-wrap gap-4">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-6 h-6 text-[#202C4B] dark:text-white mt-0.5" />
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-[#202C4B] dark:text-white leading-tight">Add Employee</h1>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Master Data {'>'} Employee Master {'>'} Add Employee
                        </span>
                    </div>
                </div>

                <div className="flex flex-1 justify-end gap-2">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                    <Button className="text-white rounded-sm" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-4">

                <TabsList className="w-full bg-transparent p-0 h-auto border-none shadow-none rounded-none flex items-center">
                    <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                        <div className="flex items-center gap-2 border-b border-border pb-px w-full">
                            <CarouselPrevious className={`static translate-y-0 h-8 w-8 ${isMd ? 'hidden' : 'flex'}`} variant="ghost" />

                            <CarouselContent className="flex-1 -ml-2">
                                {tabsConfig.map((tab) => (
                                    <CarouselItem key={tab.id} className="pl-2 basis-auto flex-none">
                                        <TabsTrigger
                                            value={tab.id}
                                            className="px-5 py-2 text-xs font-bold rounded-t-lg rounded-b-none bg-gray-50 border border-gray-100 data-[state=active]:bg-theme data-[state=active]:text-white text-gray-600 dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-400 dark:data-[state=active]:bg-theme dark:data-[state=active]:text-white dark:data-[state=active]:border-theme transition-all shadow-none cursor-pointer flex-none hover:dark:bg-background hover:bg-gray-200 border-b-0"
                                        >
                                            {tab.label}
                                        </TabsTrigger>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselNext className={`static translate-y-0 h-8 w-8 ${isMd ? 'hidden' : 'flex'}`} variant="ghost" />
                        </div>
                    </Carousel>
                </TabsList>

                {/* Tab Content Areas */}
                {tabsConfig.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        {tab.component}
                    </TabsContent>
                ))}

            </Tabs>
        </div>
    );
}
