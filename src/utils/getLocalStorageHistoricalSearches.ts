import { HISTORICAL_SEARCHES_LOCAL_STORAGE_KEY } from "./constants";

export const getLocalStorageHistoricalSearches = () => {
    const savedHistoricalSearches = localStorage.getItem(HISTORICAL_SEARCHES_LOCAL_STORAGE_KEY);
    return savedHistoricalSearches ? JSON.parse(savedHistoricalSearches) : [];
}