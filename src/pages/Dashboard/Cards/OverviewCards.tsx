import { Calendar, Users, Wallet, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useRef } from "react"
import ApexCharts from "apexcharts"

const TOTAL_EMPLOYEES = 450;

// getValues generates random mock data points for the sparkline.
const getValues = (maxVal: number) => {
    const arr = []
    for (let i = 0; i < 30; i++) {
        arr.push(Math.floor(Math.random() * maxVal))
    }
    return arr
}

const cardData = [
    {
        title: 'Total Employees',
        value: 512,
        difference: 12,
        timePeriod: 'this month',
        icon: Users,
        graphData: getValues(500),
        color: '--theme-secondary'
    },
    {
        title: 'Total Payroll ' + new Date().toLocaleString("en-US", { month: "long" }),
        value: 2458320,
        difference: 8.5,
        timePeriod: 'from last month',
        icon: Wallet,
        graphData: getValues(2458320),
        color: 'green'
    },
    {
        title: 'Present Today',
        value: 398,
        difference: ((398 * 100) / TOTAL_EMPLOYEES).toFixed(2),
        timePeriod: 'of total',
        icon: Calendar,
        graphData: getValues(500),
        color: '--theme'
    },
    {
        title: 'On Leave today',
        value: 28,
        difference: ((28 * 100) / TOTAL_EMPLOYEES).toFixed(2),
        timePeriod: 'of total',
        icon: Calendar,
        graphData: getValues(500),
        color: 'orange'
    }
];

// SparkLine renders a sparkline graph at the bottom of the card using ApexCharts.
function SparkLine({ data, seriesName, color }: { data: number[], seriesName: string, color: string }) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<ApexCharts | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const options = {
            series: [
                {
                    name: seriesName,
                    data: data,
                },
            ],
            chart: {
                type: 'area' as const,
                sparkline: {
                    enabled: true,
                },
                height: 20,
                parentHeightOffset: 0,
                animations: {
                    enabled: true,
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                background: 'transparent',
                toolbar: {
                    show: false
                }
            },
            stroke: {
                curve: 'smooth' as const,
                width: 1.5,
                colors: [color],
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.25,
                    opacityTo: 0,
                    stops: [0, 100],
                },
            },
            colors: [color],
            tooltip: {
                enabled: false,
            },
            xaxis: {
                labels: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
            yaxis: {
                show: false,
            },
            grid: {
                show: false,
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
        };

        chartInstance.current = new ApexCharts(chartRef.current, options);
        chartInstance.current.render();

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [data, seriesName, color]);

    return <div ref={chartRef} className="w-full h-full" />;
}

// getCardStyles maps custom color properties to statically compile-able Tailwind CSS classes.
const getCardStyles = (color: string) => {
    switch (color) {
        case '--theme-secondary':
            return {
                text: "text-theme-secondary",
                bg: "bg-theme-secondary/10 dark:bg-theme-secondary/20",
                chartColor: "#7350e7"
            };
        case 'green':
            return {
                text: "text-[#0a0]",
                bg: "bg-[#0a0]/10 dark:bg-[#0a0]/20",
                chartColor: "#00aa00"
            };
        case '--theme':
            return {
                text: "text-theme",
                bg: "bg-theme/10 dark:bg-theme/20",
                chartColor: "#5c33f6"
            };
        case 'orange':
            return {
                text: "text-[#f60]",
                bg: "bg-[#f60]/10 dark:bg-[#f60]/20",
                chartColor: "#ff6600"
            };
        default:
            return {
                text: "text-theme",
                bg: "bg-theme/10 dark:bg-theme/20",
                chartColor: "#5c33f6"
            };
    }
};

// OverviewCards renders the dashboard statistics cards grid.
// Each card displays a key HR metric, its change trend, and a custom SVG sparkline showing historical data.
export default function OverviewCards() {
    const formatValue = (value: number, title: string) => {
        if (title.toLowerCase().includes("payroll")) {
            return "₹" + value.toLocaleString("en-IN");
        }
        return value.toLocaleString();
    };

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {cardData.map((item, idx) => {
                const Icon = item.icon;
                const isCount = item.title.toLowerCase().includes("employees");
                const diffFormatted = isCount ? `${item.difference}` : `${item.difference}%`;
                const styles = getCardStyles(item.color);

                return (
                    <Card key={idx} className="relative overflow-hidden pb-12 hover:shadow-md transition-all duration-300 border border-gray-200/50">
                        <CardContent className="px-4 flex items-center gap-4">
                            {/* Left Side: Styled Icon Container */}
                            <div className={`flex items-center justify-center h-14 w-14 rounded-2xl ${styles.bg} ${styles.text} shrink-0`}>
                                <Icon className="h-6 w-6" />
                            </div>

                            {/* Right Side: Title, Value and Trend */}
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8f94ac] dark:text-gray-400">
                                    {item.title}
                                </span>
                                <span className="text-2xl font-bold tracking-tight text-[#242664] dark:text-white mt-0.5">
                                    {formatValue(item.value, item.title)}
                                </span>
                                <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-500 dark:text-emerald-400">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{diffFormatted} {item.timePeriod}</span>
                                </div>
                            </div>
                        </CardContent>

                        {/* SparkLine flush at the bottom of the card */}
                        <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none">
                            <SparkLine data={item.graphData} seriesName={item.title} color={styles.chartColor} />
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
