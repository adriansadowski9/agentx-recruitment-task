import {
    Chart as ChartJS,
    ChartOptions,
} from 'chart.js';
import { CHART_MAX_VALUE, CHART_MIN_VALUE, CHART_STEP_SIZE, CHART_TICKS_LIMIT } from '../../utils/constants';

export const radarChartPlugins = [
    {
        id: 'shadow',
        beforeDraw: (chart: ChartJS<'radar', number[], unknown>) => {
        const { ctx } = chart;
        const _fill = ctx.fill;
        ctx.fill = function (...args) {
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 100;
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
                _fill.apply(this, args as [path: Path2D, fillRule?: CanvasFillRule]);
            ctx.restore();
        };  
        },
    }
];

export const radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
    },
    scales: {
        r: {
            angleLines: {
                color: 'darkgray',
                lineWidth: 1.5,
            },
            pointLabels: {
                font: {
                    size: 14,
                    weight: 'bold'
                },
            },
            
            ticks: {
                display: false,
                stepSize: CHART_STEP_SIZE,
                maxTicksLimit: CHART_TICKS_LIMIT
            },
            grid: {
                lineWidth: 1.5,
                color: [...Array(CHART_TICKS_LIMIT).keys()]
                .map(i => `rgba(0, 0, 0, ${0.15 + (i * 0.025)})`)
                .reverse(),
            },
            min: CHART_MIN_VALUE,
            max: CHART_MAX_VALUE,
            suggestedMin: CHART_MIN_VALUE,
            suggestedMax: CHART_MAX_VALUE
        }
    },
    elements: {
        line: {
            backgroundColor: 'rgba(135, 157, 240, 0.9)',
            borderWidth: 0
        },
        point: {
            radius: 0
        }
    }
}