package cn.kikiw.likegirl;

import cn.kikiw.likegirl.service.impl.AmapWeatherApiClient;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;

class AmapWeatherApiClientTests {

    @Test
    void reverseGeocodeReturnsEmptyWhenKeyIsMissing() {
        AmapWeatherApiClient client = new AmapWeatherApiClient(RestClient.builder(), "");

        assertThat(client.reverseGeocode(30.25, 120.16)).isEmpty();
    }

    @Test
    void weatherReturnsEmptyWhenKeyIsMissing() {
        AmapWeatherApiClient client = new AmapWeatherApiClient(RestClient.builder(), "");

        assertThat(client.weather("330106")).isEmpty();
    }
}
