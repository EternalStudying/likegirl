package cn.kikiw.likegirl;

import cn.kikiw.likegirl.service.impl.AmapWeatherApiClient;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;

class AmapWeatherApiClientTests {

    @Test
    void reverseGeocodeReturnsEmptyWhenKeyIsMissing() {
        AmapWeatherApiClient client = amapWeatherApiClient("");

        assertThat(client.reverseGeocode(30.25, 120.16)).isEmpty();
    }

    @Test
    void weatherReturnsEmptyWhenKeyIsMissing() {
        AmapWeatherApiClient client = amapWeatherApiClient("");

        assertThat(client.weather("330106")).isEmpty();
    }

    private AmapWeatherApiClient amapWeatherApiClient(String amapKey) {
        AmapWeatherApiClient client = new AmapWeatherApiClient();
        ReflectionTestUtils.setField(client, "restClientBuilder", RestClient.builder());
        ReflectionTestUtils.setField(client, "amapKey", amapKey);
        client.init();
        return client;
    }
}
