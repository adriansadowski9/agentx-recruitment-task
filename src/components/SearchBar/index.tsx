import * as React from 'react';
import { useGeoData } from '../../hooks/useGeoData';
import HistoryButton from '../Base/HistoryButton';
import Loader from '../Base/Loader';
import { Coord } from '../../hooks/useWeatherData';
import SearchInput from '../Base/SearchInput';
import useDebounce from '../../hooks/useDebounce';

export type Search = {
    name: string
    coord: Coord
  }

interface SearchBarProps {
    historicalSearches: Search[]
    onHintClick: (coord: Coord) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    historicalSearches, 
    onHintClick 
}) => {
    const [searchValue, setSearchValue] = React.useState('');
    const debouncedSearchValue = useDebounce(searchValue, 500);
    const { data: geoData, isLoading: isGeoDataLoading, error: geoError } = useGeoData(debouncedSearchValue);

    const onCityPick = (coord: Coord) => {
        onHintClick(coord);
        setSearchValue('');
    }

    return (
        <div className="w-full">
                <div className="flex-column justify-between overflow-hidden bg-violet-400 px-8 pb-2 relative">
                    <SearchInput 
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                    />
                    {historicalSearches && historicalSearches.length ? (
                        <div className="w-full flex flex-wrap items-center pt-2">
                            {historicalSearches.map(({ name, coord }, index) => (
                                <HistoryButton
                                    key={`${index}-${name}-${coord.lon}-${coord.lat}`} 
                                    onClick={() => onCityPick(coord)}
                                >
                                    {name}
                                </HistoryButton>
                            ))}
                        </div>
                    ) : ''}
                    {isGeoDataLoading ? (
                        <div className='w-8 h-8 absolute top-2 right-10'>
                            <Loader />
                        </div>
                    ) : ''}
                </div>
                {searchValue && !isGeoDataLoading ? (
                    <div className="absolute w-full overflow-hidden rounded-bl-md rounded-br-md bg-white">
                        {geoError ? (
                            <p className="w-full text-left py-4 px-8 bg-gray-100 text-xs uppercase">
                                Error. City not found. Please check the spelling and try again. ({geoError.message})
                            </p>
                        ) : ''}
                        {!geoData?.length ? (
                            <p className="w-full text-left py-4 px-8 bg-gray-100 text-xs uppercase">
                                No results
                            </p>
                        ) : (
                            <>
                                <p className="w-full text-left pt-2 pb-1 px-8 bg-gray-100 text-xs uppercase">
                                    Select a city from the list below
                                </p>
                                {geoData.map(({ id, name, lat, lon, region, country }) => {
                                    return (
                                        <button 
                                            key={`${name}-${id}`} 
                                            type="button"
                                            onClick={() => onCityPick({ lat, lon })}
                                            className="w-full cursor-pointer text-left py-3 px-8 bg-gray-100 hover:bg-violet-200"
                                        >
                                            <p className="text-l font-medium text-black">{name}</p>
                                            <p className="text-sm text-gray-600">{region ? `${region}, ` : ''} {country}</p>
                                        </button>
                                    )
                                })}
                            </>
                        )}
                    </div>
                ) : ''}
        </div>
    )
}

export default SearchBar