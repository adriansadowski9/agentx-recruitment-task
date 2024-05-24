import * as React from 'react';
import { scale } from '../../utils/scale';
import { CHART_MAX_VALUE, CHART_MIN_VALUE } from '../../utils/constants';
import Loader from '../Base/Loader';
import WeatherInfo from '../WeatherInfo';
import { RadarChartData } from '../RadarChart';
import { WeatherData } from '../../hooks/useWeatherData';

interface CityWeatherDetailsProps {
    isWeatherDataLoading: boolean
    weatherError: Error | null
    weatherData?: WeatherData
}

const CityWeatherDetails: React.FC<CityWeatherDetailsProps> = ({
    isWeatherDataLoading,
    weatherError,
    weatherData
}) => {
    const chartData: RadarChartData = {
        labels: ['Temperature', 'Wind speed', 'Humidity'],
        datasets: !isWeatherDataLoading && weatherData ? [{
          data: [
            scale(weatherData.current.temp_c, [-10, 40], [CHART_MIN_VALUE, CHART_MAX_VALUE]),
            scale(weatherData.current.wind_kph, [0, 20], [CHART_MIN_VALUE, CHART_MAX_VALUE]),
            scale(weatherData.current.humidity, [0, 100], [CHART_MIN_VALUE, CHART_MAX_VALUE])
          ]
        }] : [],
    };

    return (
        <div className="w-full flex justify-center pt-16 pb-8 px-8">
            {weatherError ? (
                <p className="text-xl font-bold">
                    Error. Weather data not found. ({weatherError.message})
                </p>
            ) : ''}
            {isWeatherDataLoading ? (
                <div className="w-16 h-16">
                    <Loader />
                </div>
            ) : ''}
            {!isWeatherDataLoading && !weatherError ? 
                (weatherData && chartData.datasets.length ? (
                <WeatherInfo 
                    name={`
                    ${weatherData.location.name}${weatherData.location.country ? `, ${weatherData.location.country}` : ''}
                    `}
                    temperature={weatherData.current.temp_c}
                    windSpeed={weatherData.current.wind_kph}
                    humidity={weatherData.current.humidity}
                    chartData={chartData}
                />
                ) : (
                    <h2 className="text-3xl font-bold">
                        Use the search bar to find weather information for any city.
                    </h2>
                )) 
            : ''}
        </div>
    )
}

export default CityWeatherDetails