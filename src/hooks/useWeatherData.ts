import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { MINUTE_IN_MILLISECONDS } from "../utils/constants";

export type Coord = {
    lat: number
    lon: number
  }

export type WeatherData = {
    current: {
        cloud: number
        condition: {
            code: number
            icon: string
            text: string
        }
        feelslike_c: number
        feelslike_f: number
        gust_kph: number
        gust_mph: number
        humidity: number
        is_day: number
        precip_in: number
        precip_mm: number
        pressure_in: number
        pressure_mb: number
        temp_c: number
        temp_f: number
        uv: number
        vis_km: number
        vis_miles: number
        wind_degree: number
        wind_dir: string
        wind_kph: number
        wind_mph: number
        last_updated: string
        last_updated_epoch: number
    }, 
    location: {
        lat: Coord['lat']
        lon: Coord['lon']
        name: string
        region: string
        country: string
        localtime: string
        localtime_epoch: number
        tz_id: string
    }
}

export const useWeatherData = (coord?: Coord) => 
    useQuery({
        queryKey: ['weatherQuery', coord],
        queryFn: async () => {
            if (!coord)
                return;

            const { data } = await api.get<WeatherData>(
                `/v1/current.json?q=${coord.lat},${coord.lon}`
            );

            return data
        },
        staleTime: MINUTE_IN_MILLISECONDS * 5,
        enabled: !!coord,
    })