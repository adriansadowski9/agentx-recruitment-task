import * as React from 'react';

interface SearchInputProps {
    searchValue: string
    setSearchValue: (value: string) => void
}

const SearchInput: React.FC<SearchInputProps> = ({ searchValue, setSearchValue }) => {
    return (
        <input 
            type="text" 
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
            placeholder="Type the city name here to check the weather"
            className="block w-full flex-1 py-3 px-10 rounded-full focus:outline-none"
        />
    )
}

export default SearchInput