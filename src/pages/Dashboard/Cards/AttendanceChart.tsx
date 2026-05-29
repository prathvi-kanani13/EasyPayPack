import { useEffect, useRef } from 'react'
import ApexCharts from 'apexcharts'
import { useTheme } from '@/providers/ThemeProvider'

interface AttendanceItem {
    name: string
    value: number
    color: string
    label: string
}

interface AttendanceChartProps {
    data: AttendanceItem[]
}

/**
 * AttendanceChart renders the donut chart for attendance statistics.
 * It is positioned at the 12 o'clock start position, with custom segment colors,
 * clean background-matching slice separators, and a responsive center label
 * showing the dynamic Average Attendance percentage.
 */
export default function AttendanceChart({ data }: AttendanceChartProps) {
    const chartRef = useRef<HTMLDivElement>(null)
    const chartInstance = useRef<ApexCharts | null>(null)

    const { theme } = useTheme()

    // Calculate total count
    const totalCount = data.reduce((sum, item) => sum + item.value, 0)
    // Find Present, Half Day, and Late counts for attendance calculation
    const presentCount = data.find(item => item.name === "Present")?.value || 0
    const halfDayCount = data.find(item => item.name === "Half Day")?.value || 0
    const lateCount = data.find(item => item.name === "Late")?.value || 0

    // Average attendance percentage calculation:
    // Present counts as 1.0, Late counts as 0.5 (representing partial attendance/late policy),
    // and Half Day counts as 0.5.
    const averageAttendance = totalCount > 0
        ? ((presentCount + (lateCount * 0.5) + (halfDayCount * 0.5)) / totalCount * 100).toFixed(2)
        : "0.00"

    const dataString = JSON.stringify(data)

    useEffect(() => {
        if (!chartRef.current || data.length === 0) return

        const series = data.map(item => item.value)
        const labels = data.map(item => item.label)
        const colors = data.map(item => item.color)

        const options = {
            series: series,
            labels: labels,
            colors: colors,
            chart: {
                type: 'donut' as const,
                height: 180,
                width: 180,
                sparkline: {
                    enabled: true
                },
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
                }
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['var(--background)'] // Gaps between slices inherit the theme background
            },
            plotOptions: {
                pie: {
                    startAngle: 0,
                    endAngle: 360,
                    expandOnClick: false,
                    donut: {
                        size: '60%', // Large inner cutout to match design mockup
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '24px',
                                fontFamily: 'Geist Variable, sans-serif',
                                fontWeight: '700',
                                color: theme === 'light' ? '#2b2b2b' : '#ddd',
                                offsetY: -6
                            },
                            value: {
                                show: true,
                                fontSize: '11px',
                                fontFamily: 'Geist Variable, sans-serif',
                                fontWeight: '500',
                                color: theme === 'light' ? '#2b2b2b' : '#ddd',
                                offsetY: 0,
                                formatter: function () {
                                    return 'Average Attendance'
                                }
                            },
                            total: {
                                show: true,
                                showAlways: true,
                                label: `${averageAttendance}%`,
                                fontWeight: "700",
                                fontSize: "20px",
                                color: theme === 'light' ? '#2b2b2b' : '#ddd',
                                formatter: function () {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    return ['Average', 'Attendance'] as any
                                }
                            }
                        }
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            tooltip: {
                enabled: true,
                y: {
                    formatter: function (val: number) {
                        return `${val} employees`
                    }
                }
            }
        }

        chartInstance.current = new ApexCharts(chartRef.current, options)
        chartInstance.current.render()

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy()
                chartInstance.current = null
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataString, averageAttendance, theme])

    return (
        <div className="relative flex items-center justify-center w-[180px] h-[180px]">
            <div ref={chartRef} />
        </div>
    )
}
