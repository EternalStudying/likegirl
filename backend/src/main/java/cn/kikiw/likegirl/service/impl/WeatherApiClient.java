package cn.kikiw.likegirl.service.impl;

import java.util.Optional;

public interface WeatherApiClient {

    Optional<Location> reverseGeocode(double latitude, double longitude);

    Optional<LiveWeather> weather(String adcode);

    record Location(String city, String province, String district, String adcode) {
    }

    record LiveWeather(String weather, Double temperature, String windDirection, String humidity, String reportTime) {
    }
}
