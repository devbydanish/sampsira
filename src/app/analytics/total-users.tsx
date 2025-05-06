/**
 * @name TotalUsers
 * @file total-users.tsx
 * @description total users analytics component
 */
"use client"


// Modules
import React from 'react'
import { 
    Chart as ChartJS, 
    CategoryScale,
    LineElement, 
    LinearScale,
    PointElement,
    Tooltip,
    ChartOptions,
    ChartType,
    ChartConfiguration, 
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useTranslations } from 'next-intl'
import { RiUser3Fill } from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Hooks
import useCSSVar from '@/core/hooks/useCSSVar'

// Utilities
import { CHART_TOOLTIP } from '@/core/constants/constant'

ChartJS.register(
    CategoryScale, 
    LineElement, 
    LinearScale, 
    PointElement, 
    Tooltip
)


const TotalUsers: React.FC = () => {

    const {rtl, replaceClassName} = useTheme()
    const locale = useTranslations()
    
    const data: ChartConfiguration<ChartType>['data'] = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Users',
            data: [65, 59, 42, 73, 56, 55, 40],
            backgroundColor: useCSSVar('danger'),
            borderColor: useCSSVar('danger'),
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 12,
            pointBackgroundColor: 'rgba(' + useCSSVar('danger-rgb') + ', 0)',
            pointBorderColor: 'rgba(' + useCSSVar('danger-rgb') + ', 0)',
            pointHoverBackgroundColor: useCSSVar('danger'),
            pointHoverBorderColor: 'rgba(' + useCSSVar('danger-rgb') + ', 0.1)'
        }]
    }

    const options: ChartOptions<ChartType> = {
        responsive: true,
        maintainAspectRatio: false,
        font: {
            family: useCSSVar('body-font-family'),
            size: 13
        },
        hover: {
            intersect: false,
            mode: 'index'
        },
        elements: {
            line: { tension: 0.4 }
        },
        scales: {
            x: { display: false },
            y: {
                display: false,
                min: 0,
                max: 85
            }
        },
        layout: {
            padding: 0
        },
        interaction: {
            mode: 'index'
        },
        plugins: {
            legend: { display: false },
            tooltip: { 
                ...CHART_TOOLTIP,
                rtl: rtl 
            }
        }
    }


    return (
        <div className='card h-100'>
            <div className='card-body'>
                <h5>{locale('total_users')}</h5>
                <div className='d-flex align-items-center text-dark'>
                    <RiUser3Fill size={20} />
                    <p className={replaceClassName('fw-medium ps-2')}>10,245</p>
                </div>
            </div>
            <div style={{height: 160}}>
                <Line options={options as any} data={data as any} />
            </div>
        </div>
    )
}


TotalUsers.displayName = 'TotalUsers'
export default TotalUsers