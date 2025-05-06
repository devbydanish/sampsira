/**
 * @name TotalTracks
 * @file total-tracks.tsx
 * @description total tracks analytics component
 */
"use client"


// Modules
import React from 'react'
import { 
    Chart as ChartJS, 
    CategoryScale,
    BarElement, 
    LinearScale,
    Tooltip,
    ChartConfiguration,
    ChartType,
    ChartOptions, 
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useTranslations } from 'next-intl'
import { RiMusicFill } from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Hooks
import useCSSVar from '@/core/hooks/useCSSVar'

// Utilities
import { CHART_TOOLTIP } from '@/core/constants/constant'

ChartJS.register(
    CategoryScale, 
    BarElement, 
    LinearScale,
    Tooltip
)


const TotalTracks: React.FC = () => {

    const {rtl, replaceClassName} = useTheme()
    const locale = useTranslations()
    
    const data: ChartConfiguration<ChartType>['data'] = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Tracks',
            data: [65, 59, 42, 73, 56, 55, 40],
            backgroundColor: useCSSVar('success'),
            hoverBackgroundColor: useCSSVar('success'),
            borderWidth: 0,
            borderColor: 'rgba(0,0,0, 0)',
            barThickness: 12,
            pointRadius: 0
        }]
    }

    const options: ChartOptions<ChartType> = {
        responsive: true,
        maintainAspectRatio: false,
        font: {
            family: useCSSVar('body-font-family'),
            size: 13
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
                <h5>{locale('total_tracks')}</h5>
                <div className='d-flex align-items-center text-dark'>
                    <RiMusicFill size={20} />
                    <p className={replaceClassName('fw-medium ps-2')}>58,415</p>
                </div>
            </div>
            <div style={{height: 160}}>
                <Bar options={options as any} data={data as any} />
            </div>
        </div>
    )
}


TotalTracks.displayName = 'TotalTracks'
export default TotalTracks