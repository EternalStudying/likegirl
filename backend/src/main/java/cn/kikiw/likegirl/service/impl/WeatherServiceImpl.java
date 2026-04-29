package cn.kikiw.likegirl.service.impl;

import cn.kikiw.likegirl.service.WeatherService;
import cn.kikiw.likegirl.vo.WeatherAtmosphereVo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class WeatherServiceImpl implements WeatherService {

    private static final Duration CACHE_TTL = Duration.ofMinutes(20);
    private static final DateTimeFormatter AMAP_TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final WeatherApiClient weatherApiClient;
    private final ConcurrentMap<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public WeatherServiceImpl(WeatherApiClient weatherApiClient) {
        this.weatherApiClient = weatherApiClient;
    }

    @Override
    public WeatherAtmosphereVo getAtmosphere(HttpServletRequest request) {
        return fallback();
    }

    @Override
    public WeatherAtmosphereVo getBrowserAtmosphere(String latitude, String longitude) {
        Optional<Double> lat = parseCoordinate(latitude, -90, 90);
        Optional<Double> lon = parseCoordinate(longitude, -180, 180);
        if (lat.isEmpty() || lon.isEmpty()) {
            return fallback();
        }

        String cacheKey = "geo:%s:%s".formatted(lat.get(), lon.get());
        CacheEntry cached = cache.get(cacheKey);
        if (cached != null && cached.expiresAt().isAfter(LocalDateTime.now())) {
            return cached.value();
        }

        WeatherAtmosphereVo value = loadBrowserAtmosphere(lat.get(), lon.get()).orElseGet(this::fallback);
        cache.put(cacheKey, new CacheEntry(value, LocalDateTime.now().plus(CACHE_TTL)));
        return value;
    }

    private Optional<WeatherAtmosphereVo> loadBrowserAtmosphere(double latitude, double longitude) {
        Optional<WeatherApiClient.Location> location = weatherApiClient.reverseGeocode(latitude, longitude);
        if (location.isEmpty()) {
            return Optional.empty();
        }

        WeatherApiClient.Location loc = location.get();
        Optional<WeatherApiClient.LiveWeather> weather = weatherApiClient.weather(loc.adcode());
        if (weather.isEmpty()) {
            return Optional.empty();
        }

        WeatherApiClient.LiveWeather live = weather.get();
        return Optional.of(new WeatherAtmosphereVo(
                displayCity(loc),
                displayCountry(loc),
                live.temperature(),
//                mapWeatherType(live.weather()),
                mapWeatherType("雪"),
                true,
                parseReportTime(live.reportTime())
        ));
    }

    private String displayCity(WeatherApiClient.Location location) {
        if (!isBlank(location.city())) {
            return location.city();
        }
        if (!isBlank(location.province())) {
            return location.province();
        }
        if (!isBlank(location.district())) {
            return location.district();
        }
        return "unknown";
    }

    private String displayCountry(WeatherApiClient.Location location) {
        return isBlank(location.district()) ? "中国" : location.district();
    }

    private String mapWeatherType(String weather) {
        if (isBlank(weather)) {
            return "cloudy";
        }
        if (weather.contains("雷")) {
            return "thunder";
        }
        if (weather.contains("雪") || weather.contains("冰雹")) {
            return "snow";
        }
        if (weather.contains("雨")) {
            return "rain";
        }
        if (weather.contains("雾") || weather.contains("霾") || weather.contains("尘") || weather.contains("沙")) {
            return "fog";
        }
        if (weather.contains("风")) {
            return "windy";
        }
        if (weather.contains("晴")) {
            return "sunny";
        }
        return "cloudy";
    }

    private LocalDateTime parseReportTime(String reportTime) {
        if (isBlank(reportTime)) {
            return LocalDateTime.now();
        }
        try {
            return LocalDateTime.parse(reportTime, AMAP_TIME_FORMAT);
        } catch (DateTimeParseException ex) {
            return LocalDateTime.now();
        }
    }

    private Optional<Double> parseCoordinate(String value, double min, double max) {
        if (value == null || value.isBlank()) {
            return Optional.empty();
        }
        try {
            double coordinate = Double.parseDouble(value.trim());
            if (!Double.isFinite(coordinate) || coordinate < min || coordinate > max) {
                return Optional.empty();
            }
            return Optional.of(coordinate);
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private WeatherAtmosphereVo fallback() {
        return new WeatherAtmosphereVo(
                "unknown",
                "unknown",
                null,
                "cloudy",
                true,
                LocalDateTime.now()
        );
    }

    private record CacheEntry(WeatherAtmosphereVo value, LocalDateTime expiresAt) {
    }
}
