package cn.kikiw.likegirl.service.impl;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Optional;

@Component
public class AmapWeatherApiClient implements WeatherApiClient {

    private final RestClient restClient;
    private final String amapKey;

    public AmapWeatherApiClient(
            RestClient.Builder restClientBuilder,
            @Value("${amap.key:}") String amapKey) {
        this.restClient = restClientBuilder.build();
        this.amapKey = amapKey == null ? "" : amapKey.trim();
    }

    @Override
    public Optional<Location> reverseGeocode(double latitude, double longitude) {
        if (amapKey.isBlank()) {
            return Optional.empty();
        }
        try {
            RegeoResponse response = restClient.get()
                    .uri("https://restapi.amap.com/v3/geocode/regeo?key={key}&location={location}",
                            amapKey, longitude + "," + latitude)
                    .retrieve()
                    .body(RegeoResponse.class);
            if (response == null || !"1".equals(response.status()) || response.regeocode() == null
                    || response.regeocode().addressComponent() == null) {
                return Optional.empty();
            }

            AddressComponent address = response.regeocode().addressComponent();
            if (isBlank(address.adcode())) {
                return Optional.empty();
            }
            return Optional.of(new Location(
                    nodeText(address.city()),
                    blankToEmpty(address.province()),
                    blankToEmpty(address.district()),
                    address.adcode()
            ));
        } catch (RuntimeException ex) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<LiveWeather> weather(String adcode) {
        if (amapKey.isBlank() || isBlank(adcode)) {
            return Optional.empty();
        }
        try {
            WeatherResponse response = restClient.get()
                    .uri("https://restapi.amap.com/v3/weather/weatherInfo?key={key}&city={city}&extensions=base",
                            amapKey, adcode)
                    .retrieve()
                    .body(WeatherResponse.class);
            if (response == null || !"1".equals(response.status()) || response.lives() == null || response.lives().isEmpty()) {
                return Optional.empty();
            }

            Live live = response.lives().get(0);
            return Optional.of(new LiveWeather(
                    blankToEmpty(live.weather()),
                    parseTemperature(live.temperature()),
                    blankToEmpty(live.winddirection()),
                    blankToEmpty(live.humidity()),
                    blankToEmpty(live.reporttime())
            ));
        } catch (RuntimeException ex) {
            return Optional.empty();
        }
    }

    private Double parseTemperature(String value) {
        if (isBlank(value)) {
            return null;
        }
        try {
            return Double.valueOf(value.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String nodeText(JsonNode node) {
        return node != null && node.isTextual() ? node.asText() : "";
    }

    private String blankToEmpty(String value) {
        return value == null ? "" : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record RegeoResponse(String status, Regeocode regeocode) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Regeocode(AddressComponent addressComponent) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record AddressComponent(JsonNode city, String province, String district, String adcode) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record WeatherResponse(String status, List<Live> lives) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Live(String weather, String temperature, String winddirection, String humidity, String reporttime) {
    }
}
