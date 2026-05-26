import React, { useRef, useState, useEffect } from 'react'
import OverviewCards from './Cards/OverviewCards'
import AttendanceOverview from './Cards/AttendanceOverview'

// Dashboard is the main page component rendering the overview analytics.
export default function Dashboard() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState<number>(0);

    const breakpoints = {
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
    }

    useEffect(() => {
        if (!containerRef.current) return

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // get the bounding width of the content area
                setWidth(entry.contentRect.width)
            }
        })

        observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
        }
    }, [])

    const isMd = width >= breakpoints.md
    const isLg = width >= breakpoints.lg

    return (
        // dashboard container
        <div ref={containerRef} className="flex flex-col gap-4">
            <OverviewCards />

            <div className='grid grid-cols-12 gap-4'>
                <div className={`flex flex-col gap-4 ${isLg ? 'col-span-9' : isMd ? 'col-span-8' : 'col-span-12'}`}>
                    <div className='grid grid-cols-12 gap-4'>
                        <div className={isLg ? 'col-span-6' : 'col-span-12'}>
                            <AttendanceOverview />
                        </div>
                        <div className={isLg ? 'col-span-6' : 'col-span-12'}></div>
                    </div>
                    <div className='grid grid-cols-12 gap-4'>
                        <div className={isLg ? 'col-span-5' : 'col-span-12'}></div>
                        <div className={isLg ? 'col-span-7' : 'col-span-12'}></div>
                    </div>
                </div>
                <div className={isLg ? 'col-span-3' : isMd ? 'col-span-4' : 'col-span-12'}>
                    <div className='flex flex-col gap-4'>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
