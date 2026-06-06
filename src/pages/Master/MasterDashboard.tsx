import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { UserCog, ArrowRight, LayoutGrid, List, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeScreenProps {
    id: number;
    title: string;
    path: string;
    icon: React.ComponentType<any>;
}

const employeeScreens: EmployeeScreenProps[] = [
    { id: 1, title: "Employee Master", path: "/employee/master", icon: UserCog },
    { id: 2, title: "Grade & Desigation Master", path: "/grade-designation/master", icon: Building },
];

export default function MasterDashboard() {
    const navigate = useNavigate();

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#202C4B] dark:text-white">
                    Employee Management
                </h1>

                <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-white dark:bg-background">
                    <Button
                        onClick={() => setViewMode("grid")}
                        className={`
                            h-8 w-8 p-0 rounded-md transition
                            ${viewMode === "grid"
                                ? "bg-theme text-white hover:bg-theme"
                                : "bg-white text-gray-500 hover:bg-white hover:text-gray-700"
                            }
        `}
                    >
                        <LayoutGrid size={16} />
                    </Button>

                    <Button
                        onClick={() => setViewMode("list")}
                        className={`
                            h-8 w-8 p-0 rounded-md transition
                            ${viewMode === "list"
                                ? "bg-theme text-white hover:bg-theme"
                                : "bg-white text-gray-500 hover:bg-white hover:text-gray-700"
                            }
                        `}
                    >
                        <List size={16} />
                    </Button>
                </div>
            </div>

            {
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                            employeeScreens.map((screen) => {
                                const Icon = screen.icon;

                                return (
                                    <div
                                        key={screen.id}
                                        onClick={() => navigate(screen.path)}
                                        className="group bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2"
                                    >
                                        <div className="rounded-md w-fit bg-theme text-white p-2">
                                            <Icon size={16} />
                                        </div>

                                        <h2 className="text-base font-semibold text-gray-800 dark:text-white group-hover:text-theme transition">
                                            {screen.title}
                                        </h2>

                                        <div className="flex flex-col gap-2">
                                            <Separator />
                                            <div className="flex gap-1 items-center text-sm text-theme font-medium opacity-0 group-hover:opacity-100 transition">
                                                View
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {
                            employeeScreens.map((screen) => {
                                const Icon = screen.icon;

                                return (
                                    <div
                                        key={screen.id}
                                        onClick={() => navigate(screen.path)}
                                        className="group bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-md bg-theme text-white p-2">
                                                <Icon size={16} />
                                            </div>

                                            <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                                                {screen.title}
                                            </h2>
                                        </div>

                                        <ArrowRight size={16} className="text-theme" />
                                    </div>
                                );
                            })
                        }
                    </div>
                )
            }
        </div>
    );
}
