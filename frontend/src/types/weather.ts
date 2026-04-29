export type WeatherType = 'sunny' | 'cloudy' | 'rain' | 'snow' | 'fog' | 'thunder' | 'windy' | 'night';

export interface WeatherAtmosphereData {
  city: string;
  country: string;
  temperature: number | null;
  weatherType: WeatherType;
  isDay: boolean;
  updatedAt: string;
}
