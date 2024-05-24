import { useEffect, useState } from 'react';
import { Coord, useWeatherData } from './hooks/useWeatherData';
import Layout from './components/Layout';
import SearchBar, { Search } from './components/SearchBar';
import CityWeatherDetails from './components/CityWeatherDetails';
import { HISTORICAL_SEARCHES_LOCAL_STORAGE_KEY } from './utils/constants';
import { getLocalStorageHistoricalSearches } from './utils/getLocalStorageHistoricalSearches';

const App = () => {
  const [geoCoords, setGeoCoords] = useState<Coord | undefined>();
  const { data: weatherData, isLoading: isWeatherDataLoading, error: weatherError } = useWeatherData(geoCoords);
  const [historicalSearches, setHistoricalSearches] = useState<Search[]>(
    getLocalStorageHistoricalSearches()
  );

  useEffect(() => {
    if (!weatherData)
      return;

    const latestSearch = {
      name: weatherData.location.name,
      coord: {
        lat: weatherData.location.lat,
        lon: weatherData.location.lon
      }
    }

    setHistoricalSearches((prevValue: Search[]) => {
      const newValue = [...prevValue.filter((item) => 
        item.coord.lat !== latestSearch.coord.lat ||
        item.coord.lon !== latestSearch.coord.lon 
      )];

      newValue.unshift(latestSearch);
      const slicedValue = newValue.slice(0, 4);

      localStorage.setItem(
        HISTORICAL_SEARCHES_LOCAL_STORAGE_KEY, 
        JSON.stringify(slicedValue)
      );

      return slicedValue;
    })
  }, [weatherData])

  return (
    <Layout>
      <SearchBar 
        historicalSearches={historicalSearches}
        onHintClick={setGeoCoords}
      />
      <CityWeatherDetails
        isWeatherDataLoading={isWeatherDataLoading}
        weatherError={weatherError}
        weatherData={weatherData}
      />
    </Layout>
  )
}

export default App
