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

const SearchBar = ({ 
    historicalSearches, 
    onHintClick 
}: SearchBarProps) => {
    const [searchValue, setSearchValue] = React.useState('');
    const debouncedSearchValue = useDebounce(searchValue, 500);
    const { data: geoData, isLoading: isGeoDataLoading, error: geoError } = useGeoData(debouncedSearchValue);

    const onCityPick = (coord: Coord) => {
        onHintClick(coord);
        setSearchValue('');
    }

    const renderCityList = () => {
        if (isGeoDataLoading || !!geoError) return null;
        if (!geoData?.length)
            return (
                <p className="w-full max-w-[1440px] px-8 text-left py-4 bg-gray-100 text-xs uppercase">
                    No results
                </p>
            );
    
        return (
            <>
                <p className="w-full max-w-[1440px] px-8 text-left pt-2 pb-1 bg-gray-100 text-xs uppercase">
                    Select a city from the list below
                </p>
                {geoData.map(({ id, name, lat, lon, region, country }) => {
                    const onGeoDataButtonClick = () => onCityPick({ lat, lon });
                    return (
                        <button 
                            key={`${name}-${id}`} 
                            type="button"
                            onClick={onGeoDataButtonClick}
                            className="w-full flex flex-col items-center cursor-pointer text-left py-3 bg-gray-100 hover:bg-violet-200"
                        >
                            <div className="w-full max-w-[1440px] px-8">
                                <p className="text-l font-medium text-black">{name}</p>
                                <p className="text-sm text-gray-600">{region ? `${region}, ` : ''} {country}</p>
                            </div>
                        </button>
                    )
                })}
            </>
        )
    }

    return (
        <div className="w-full">
                <div className="flex flex-col w-full items-center overflow-hidden bg-violet-400 pb-2">
                    <div className="w-full max-w-[1440px] px-8 relative">
                        <SearchInput 
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                        />
                        {!!historicalSearches && !!historicalSearches.length && (
                            <div className="w-full flex flex-wrap items-center pt-2">
                                {historicalSearches.map(({ name, coord }, index) => {
                                    const onHistoryButtonClick = () => onCityPick(coord);
                                    return (
                                        <HistoryButton
                                            key={`${index}-${name}-${coord.lon}-${coord.lat}`} 
                                            onClick={onHistoryButtonClick}
                                        >
                                            {name}
                                        </HistoryButton>
                                )})}
                            </div>
                        )}
                        {isGeoDataLoading && (
                            <div className='w-8 h-8 absolute top-2 right-10'>
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>
                {!!searchValue && (
                    <div className="absolute flex flex-col w-full items-center overflow-hidden rounded-bl-md rounded-br-md bg-gray-100">
                            {!!geoError && (
                                <p className="w-full max-w-[1440px] px-8 text-left py-4 bg-gray-100 text-xs uppercase">
                                    Error. City not found. Please check the spelling and try again. ({geoError.message})
                                </p>
                            )}
                            {renderCityList()}
                    </div>
                )}
        </div>
    )
}

export default SearchBar