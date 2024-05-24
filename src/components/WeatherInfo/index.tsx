import RadarChart, { RadarChartData } from "../RadarChart"

interface WeatherInfoProps {
    name: string
    temperature: number
    humidity: number
    windSpeed: number
    chartData: RadarChartData
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ name, temperature, humidity, windSpeed, chartData }) => {
    return (
        <div className="w-full max-w-7xl flex items-top justify-center self-center">
            <div className="w-full flex-col">
                <div className="flex flex-col md:items-center md:justify-center">
                    <h2 className="text-5xl font-bold">
                        {name}
                    </h2>
                    <div className="flex-col items-center mt-1">
                        <p className="text-xl font-light">
                            Humidity: {humidity}%
                        </p>
                        <p className="text-xl font-light">
                            Wind speed: {windSpeed} kph
                        </p>
                    </div>
                    <p className="mt-4 text-8xl font-semibold">
                        {temperature}°
                    </p>
                </div>
                <div className="flex min-h-[320px] md:min-h-[440px]">
                    <RadarChart data={chartData} />
                </div>
            </div>
        </div>
    )
}

export default WeatherInfo