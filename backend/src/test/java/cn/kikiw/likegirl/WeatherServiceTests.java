package cn.kikiw.likegirl;

import cn.kikiw.likegirl.service.impl.WeatherApiClient;
import cn.kikiw.likegirl.service.impl.WeatherServiceImpl;
import cn.kikiw.likegirl.vo.WeatherAtmosphereVo;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class WeatherServiceTests {

    private final WeatherApiClient weatherApiClient = mock(WeatherApiClient.class);
    private final WeatherServiceImpl weatherService = weatherService();

    @Test
    void getAtmosphereReturnsFallbackWithoutIpWeatherCall() {
        WeatherAtmosphereVo response = weatherService.getAtmosphere(new MockHttpServletRequest());

        assertFallback(response);
        verifyNoInteractions(weatherApiClient);
    }

    @Test
    void getBrowserAtmosphereUsesCoordinatesAndAmapWeather() {
        when(weatherApiClient.reverseGeocode(30.25, 120.16)).thenReturn(Optional.of(
                new WeatherApiClient.Location("\u676d\u5dde\u5e02", "\u6d59\u6c5f\u7701", "\u897f\u6e56\u533a", "330106")
        ));
        when(weatherApiClient.weather("330106")).thenReturn(Optional.of(
                new WeatherApiClient.LiveWeather("\u5c0f\u96e8", 22.3, "\u4e1c\u98ce", "80", "2026-04-28 13:00:00")
        ));

        WeatherAtmosphereVo response = weatherService.getBrowserAtmosphere("30.25", "120.16");

        assertThat(response.city()).isEqualTo("\u676d\u5dde\u5e02");
        assertThat(response.country()).isEqualTo("\u897f\u6e56\u533a");
        assertThat(response.temperature()).isEqualTo(22.3);
        assertThat(response.weatherType()).isEqualTo("rain");
        assertThat(response.isDay()).isTrue();
        assertThat(response.updatedAt()).isNotNull();
        verify(weatherApiClient).reverseGeocode(30.25, 120.16);
        verify(weatherApiClient).weather("330106");
    }

    @Test
    void getBrowserAtmosphereReturnsFallbackWhenReverseGeocodeFails() {
        when(weatherApiClient.reverseGeocode(30.25, 120.16)).thenReturn(Optional.empty());

        WeatherAtmosphereVo response = weatherService.getBrowserAtmosphere("30.25", "120.16");

        assertFallback(response);
    }

    @Test
    void getBrowserAtmosphereReturnsFallbackWhenWeatherFails() {
        when(weatherApiClient.reverseGeocode(30.25, 120.16)).thenReturn(Optional.of(
                new WeatherApiClient.Location("\u676d\u5dde\u5e02", "\u6d59\u6c5f\u7701", "\u897f\u6e56\u533a", "330106")
        ));
        when(weatherApiClient.weather("330106")).thenReturn(Optional.empty());

        WeatherAtmosphereVo response = weatherService.getBrowserAtmosphere("30.25", "120.16");

        assertFallback(response);
    }

    @Test
    void getBrowserAtmosphereReturnsFallbackWhenCoordinatesAreInvalid() {
        WeatherAtmosphereVo response = weatherService.getBrowserAtmosphere("91", "120.16");

        assertFallback(response);
    }

    private void assertFallback(WeatherAtmosphereVo response) {
        assertThat(response.city()).isEqualTo("unknown");
        assertThat(response.country()).isEqualTo("unknown");
        assertThat(response.temperature()).isNull();
        assertThat(response.weatherType()).isEqualTo("cloudy");
        assertThat(response.isDay()).isTrue();
        assertThat(response.updatedAt()).isNotNull();
    }

    private WeatherServiceImpl weatherService() {
        WeatherServiceImpl service = new WeatherServiceImpl();
        ReflectionTestUtils.setField(service, "weatherApiClient", weatherApiClient);
        return service;
    }
}
