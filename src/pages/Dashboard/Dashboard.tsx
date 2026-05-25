import React from 'react'
import OverviewCards from './Cards/OverviewCards'

// Dashboard is the main page component rendering the overview analytics.
export default function Dashboard() {
    return (
        <div className="flex flex-col gap-4">
            <OverviewCards />
        </div>
    )
}
