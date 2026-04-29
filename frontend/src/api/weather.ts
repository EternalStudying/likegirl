import { authHeaders, notifyLogout } from '../auth';
import type { WeatherAtmosphereData } from '../types/weather';

type FetchLike = typeof fetch;

async function requestWeather(url: string, fetcher: FetchLike): Promise<WeatherAtmosphereData> {
  let response: Response;

  try {
    const headers = authHeaders();
    response = await fetcher(url, headers ? { headers } : undefined);
  } catch {
    throw new Error('天气氛围加载失败');
  }

  if (response.status === 401) {
    notifyLogout();
    throw new Error('登录已过期，请重新登录');
  }

  if (!response.ok) {
    throw new Error('天气氛围加载失败');
  }

  return (await response.json()) as WeatherAtmosphereData;
}

export async function fetchWeatherAtmosphere(fetcher: FetchLike = fetch): Promise<WeatherAtmosphereData> {
  return requestWeather('/api/weather/atmosphere', fetcher);
}

export async function fetchBrowserWeatherAtmosphere(
  latitude: number,
  longitude: number,
  fetcher: FetchLike = fetch
): Promise<WeatherAtmosphereData> {
  const query = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude)
  });

  return requestWeather(`/api/weather/atmosphere/browser?${query.toString()}`, fetcher);
}
