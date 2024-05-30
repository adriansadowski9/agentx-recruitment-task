import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { radarChartOptions, radarChartPlugins } from './config';
  
ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export type RadarChartDataValues = { name: string, values: { chart: number, tooltip: string }}

export type RadarChartData = ChartData<"radar", RadarChartDataValues[], unknown>

interface RadarChartProps {
    data: RadarChartData
}

const RadarChart = ({ data }: RadarChartProps) => {
    return (
        <Radar 
            options={radarChartOptions} 
            plugins={radarChartPlugins}
            data={data}
            width="100%"
            height="100%"
            style={{
                position: 'absolute',
            }}
        />
    )
}

export default RadarChart