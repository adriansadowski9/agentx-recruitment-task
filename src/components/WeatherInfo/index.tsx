import RadarChart, { RadarChartData } from "../RadarChart"

interface WeatherInfoProps {
    name: string
    temperature: number
    humidity: number
    windSpeed: number
    chartData: RadarChartData
}

const WeatherInfo = ({ name, temperature, humidity, windSpeed, chartData }: WeatherInfoProps) => {
    return (
        <div className="w-full flex items-top justify-center self-center">
            <div className="w-full flex flex-col items-start lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col">
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
                <div className="flex w-full pb-[100%] mt-[16px] lg:max-w-[640px] lg:pb-[600px] lg:mt-0 relative">
                    <RadarChart data={chartData} />
                </div>
            </div>
        </div>
    )
}

export default WeatherInfo