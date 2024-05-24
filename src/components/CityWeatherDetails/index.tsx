import * as React from 'react';
import { scale } from '../../utils/scale';
import Loader from '../Base/Loader';
import WeatherInfo from '../WeatherInfo';
import { RadarChartData } from '../RadarChart';
import { WeatherData } from '../../hooks/useWeatherData';
import { 
    CHART_MAX_HUMIDITY_VALUE, 
    CHART_MAX_TEMP_VALUE,
    CHART_MAX_WIND_SPEED_VALUE, 
    CHART_MIN_HUMIDITY_VALUE, 
    CHART_MIN_TEMP_VALUE,
    CHART_MIN_WIND_SPEED_VALUE,
    CHART_MIN_VALUE, 
    CHART_MAX_VALUE
} from '../../utils/constants';


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
        datasets: weatherData ? [{
          data: [
            scale(
                weatherData.current.temp_c, 
                [CHART_MIN_TEMP_VALUE, CHART_MAX_TEMP_VALUE], 
                [CHART_MIN_VALUE, CHART_MAX_VALUE]
            ),
            scale(
                weatherData.current.wind_kph, 
                [CHART_MIN_WIND_SPEED_VALUE, CHART_MAX_WIND_SPEED_VALUE], 
                [CHART_MIN_VALUE, CHART_MAX_VALUE]
            ),
            scale(
                weatherData.current.humidity, 
                [CHART_MIN_HUMIDITY_VALUE, CHART_MAX_HUMIDITY_VALUE], 
                [CHART_MIN_VALUE, CHART_MAX_VALUE]
            )
          ]
        }] : [],
    };

    const renderWeatherInfo = () => {
        if (isWeatherDataLoading || !!weatherError) return null;
        if (!weatherData || !chartData.datasets.length)
            return (
                <h2 className="text-3xl font-bold">
                Use the search bar to find weather information for any city.
                </h2>
            );
    
        return (
          <WeatherInfo
            name={`${weatherData.location.name}${weatherData.location.country ? `, ${weatherData.location.country}` : ''}`}
            temperature={weatherData.current.temp_c}
            windSpeed={weatherData.current.wind_kph}
            humidity={weatherData.current.humidity}
            chartData={chartData}
          />
        );
    };
      
    return (
        <div className="w-full flex justify-center pt-16 pb-8 px-8">
            {!!weatherError && (
                <p className="text-xl font-bold">
                    Error. Weather data not found. ({weatherError.message})
                </p>
            )}
            {isWeatherDataLoading && (
                <div className="w-16 h-16">
                    <Loader />
                </div>
            )}
            {renderWeatherInfo()}
        </div>
    );
};

export default CityWeatherDetails;