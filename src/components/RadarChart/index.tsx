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

export type RadarChartData = ChartData<"radar", (number | null)[], unknown>

interface RadarChartProps {
    data: RadarChartData
}

const RadarChart = ({ data }: RadarChartProps) => {
    return (
        <Radar 
            options={radarChartOptions} 
            plugins={radarChartPlugins}
            data={data}
        />
    )
}

export default RadarChart