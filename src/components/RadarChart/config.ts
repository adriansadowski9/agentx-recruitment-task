import {
    Chart as ChartJS,
    ChartOptions,
    CoreScaleOptions,
    Plugin,
    PointElement,
    Scale,
    TooltipItem
} from 'chart.js';
import { CHART_BACKGROUND_COLOR, CHART_MAX_VALUE, CHART_MIN_VALUE, CHART_STEP_SIZE, CHART_TICKS_LIMIT } from '../../utils/constants';
import { RadarChartDataValues } from '.';

interface RadialScale extends Scale<CoreScaleOptions> {
    _pointLabels: string[];
    getIndexAngle(index: number): number;
    drawingArea: number;
}

export const radarChartPlugins: Plugin<'radar'>[] = [
    {
        id: 'addShadowToDatasets',
        beforeDatasetDraw: (chart: ChartJS<'radar'>, { index }) => {
            const { ctx } = chart;

            const shadowCanvas = document.createElement('canvas');
            const shadowCtx = shadowCanvas.getContext('2d');
    
            if (!shadowCtx) return;
    
            shadowCanvas.width = ctx.canvas.width;
            shadowCanvas.height = ctx.canvas.height;

            const datasetMeta = chart.getDatasetMeta(index);
            
            if (!datasetMeta.hidden) {
                shadowCtx.save();
    
                shadowCtx.beginPath();
                datasetMeta.data.forEach((point, index) => {
                    if (index === 0) {
                        shadowCtx.moveTo(point.x, point.y);
                    } else {
                        shadowCtx.lineTo(point.x, point.y);
                    }
                });
                shadowCtx.closePath();

                shadowCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                shadowCtx.shadowBlur = 75;
                shadowCtx.fillStyle = CHART_BACKGROUND_COLOR;
                shadowCtx.globalAlpha = 0.75;

                shadowCtx.fill();
                shadowCtx.restore();
            }

            ctx.drawImage(shadowCanvas, 0, 0);
        },
    },
    {
        id: 'renderRotatedPointLabels',
        beforeDraw: (chart: ChartJS<'radar'>) => {
            const { ctx, scales: { r } } = chart;
            const radialScale = r as RadialScale;
            const pointLabels = radialScale._pointLabels;
            const maxRadius = radialScale.drawingArea;
            const fontSize = 18;
            const fontWeight = 'normal';
            const fontColor = '#4D5656';

            ctx.save();

            ctx.font = `${fontWeight} ${fontSize}px Lato`;
            ctx.fillStyle = fontColor;

            pointLabels.forEach((label, i) => {
                const angle = radialScale.getIndexAngle(i) - Math.PI / 2;
                const x = chart.width / 2 + Math.cos(angle) * (maxRadius + 16);
                const y = chart.height / 2 + Math.sin(angle) * (maxRadius + 16);

                ctx.save();
                ctx.translate(x, y);

                if (
                    angle >= 0 && 
                    (angle <= (Math.PI / 2) || (angle >= (Math.PI / 2) && angle < Math.PI))
                ) {
                    ctx.rotate(angle - Math.PI / 2)
                } else {
                    ctx.rotate(angle + Math.PI / 2);
                }

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, 0, 0);
                ctx.restore();
            });

            ctx.restore();
        },
    },
    {
        id: 'movePointsWithTooltipsToLabels',
        afterDatasetsDraw: (chart) => {
            const { ctx, data, scales: { r } } = chart;
            const { datasets } = data;
            const radialScale = r as RadialScale;
            const maxRadius = radialScale.drawingArea;
    
            datasets.forEach((_dataset, datasetIndex) => {
                const datasetMeta = chart.getDatasetMeta(datasetIndex);    
                for (let i = 0; i < datasetMeta.data.length; i++) {
                    const point = datasetMeta.data[i] as PointElement;
                    const pointBackgroundColor = 'lightgray';
                    const pointBorderColor = 'rgba(0, 0, 0, 0.35)';
                    const pointRadius = 6;
                    const angle = radialScale.getIndexAngle(i);
    
                    const x = chart.width / 2 + Math.sin(angle) * maxRadius;
                    const y = chart.height / 2 - Math.cos(angle) * maxRadius;

                    point.tooltipPosition = () => {
                        return { x, y };
                    };

                    point.getCenterPoint = () => {
                        return { x, y };
                    };

                    point.inRange = (mouseX: number, mouseY: number) => {
                        return Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) < Math.pow(pointRadius, 2);
                    };

                    const drawPoint = (radius: number) => {
                        ctx.beginPath();
                        ctx.arc(x, y, radius, 0, 2 * Math.PI);
                        ctx.fillStyle = pointBackgroundColor;
                        ctx.strokeStyle = pointBorderColor;
                        ctx.fill();
                        ctx.stroke();
                    };

                    drawPoint(pointRadius);
                
                }
            });
        },
    }
];

interface CustomRadarTooltipItem extends TooltipItem<'radar'> {
    raw: RadarChartDataValues
  }

export const radarChartOptions: ChartOptions<'radar'> = {
    parsing: {
        key: 'values.chart'
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: 32
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            displayColors: false,
            bodyFont: {
                size: 16
            },
            callbacks: {
                title: () => '',
                label: (context: CustomRadarTooltipItem) => {
                    const value = context.raw.values.tooltip || context.formattedValue;
                    return `${context.raw.name}: ${value}`;
                }
            }
        },
    },
    scales: {
        r: {
            angleLines: {
                color: 'darkgray',
                lineWidth: 1.5,
            },
            pointLabels: {
                display: false,
            },
            ticks: {
                display: false,
                stepSize: CHART_STEP_SIZE,
                maxTicksLimit: CHART_TICKS_LIMIT,
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
            borderWidth: 0,
            backgroundColor: CHART_BACKGROUND_COLOR,
        },
        point: {
            radius: 0,
            hoverRadius: 0
        },
    },
}