import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { MINUTE_IN_MILLISECONDS } from "../utils/constants";
import { Coord } from "./useWeatherData";

export type Geo = {
    id: string
    lat: Coord['lat']
    lon: Coord['lon']
    name: string
    region: string
    country: string
    url: string
}

export type GeoData = Geo[]

export const useGeoData = (q: string) => 
    useQuery({
        queryKey: ['geoQuery', q],
        queryFn: async () => {
            if (!q)
                return [];

            const { data } = await api.get<GeoData>(
                `/v1/search.json?q=${q}`,
            );

            return data
        },
        staleTime: MINUTE_IN_MILLISECONDS * 5,
        enabled: !!q,
    })