import {
    ChartDataset,
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

type RadarPluginDataType = (RadarChartDataValues | (number | null))[]

export const radarChartPlugins: Plugin<'radar', RadarPluginDataType>[] = [
    {
        id: 'addShadowToDatasets',
        beforeDatasetDraw: (chart: ChartJS<'radar', RadarPluginDataType>, { index }) => {
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
        beforeDraw: (chart: ChartJS<'radar', RadarPluginDataType>) => {
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
                const x = chart.width / 2 + Math.cos(angle) * (maxRadius + 32);
                const y = chart.height / 2 + Math.sin(angle) * (maxRadius + 32);

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
        afterDatasetsDraw: (chart: ChartJS<'radar', RadarPluginDataType>) => {
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
    },
    {
        id: 'backgroundColorPlugin',
        beforeDraw: (chart: ChartJS<'radar', RadarPluginDataType>) => {
            const { ctx, data, chartArea, scales: { r } } = chart;
            const radialScale = r as RadialScale;
            console.log('data', data);
            const datasets = chart.data.datasets as ChartDataset<"radar", RadarChartDataValues[]>[];
            const numLabels = data.labels?.length || 0;
            const allChartValues: number[] = [];
            const availableColors = [
                '#FFFFFF',
                '#F9F9F9',
                '#FDF2E9',
                '#FAE0CB'
            ]

            datasets.forEach((dataset) => {
                dataset.data.forEach((dataElement) => {
                    if (dataElement?.values?.chart) {
                        allChartValues.push(dataElement.values.chart);
                    }
                });
            })

            const { top, left, right, bottom } = chartArea;
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            const radius = radialScale.drawingArea;

            const levels = CHART_MAX_VALUE - CHART_MIN_VALUE;
            const radiusStep = radius / levels;

            const colors = [...Array(levels).keys()]
            .map(index => {
                const min = index + 1;
                const matchedElements = allChartValues.filter((val) => val >= min).length;
                return availableColors[matchedElements] ? availableColors[matchedElements] : availableColors[availableColors.length - 1];
            }).reverse();

            ctx.save();

            const getPointCoordinates = (level: number, angle: number) => {
                const radian = (Math.PI / 180) * angle;
                return {
                    x: centerX + radiusStep * level * Math.cos(radian),
                    y: centerY + radiusStep * level * Math.sin(radian)
                };
            }

            for (let level = levels; level > 0; level--) {
                ctx.beginPath();
                for (let i = 0; i < numLabels; i++) {
                    const angle = (360 / numLabels) * i - 90;
                    const { x, y } = getPointCoordinates(level, angle);
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fillStyle = colors[levels - level];
                ctx.fill();
            }

            ctx.restore();
        }
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
    layout: {
        padding: 48
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