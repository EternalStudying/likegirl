package cn.kikiw.likegirl;

import cn.kikiw.likegirl.config.JwtAuthInterceptor;
import cn.kikiw.likegirl.controller.WeatherController;
import cn.kikiw.likegirl.service.JwtService;
import cn.kikiw.likegirl.service.WeatherService;
import cn.kikiw.likegirl.vo.WeatherAtmosphereVo;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class WeatherControllerTests {

    private final WeatherService weatherService = mock(WeatherService.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(weatherController())
            .addInterceptors(jwtAuthInterceptor())
            .setMessageConverters(new MappingJackson2HttpMessageConverter(
                    Jackson2ObjectMapperBuilder.json()
                            .modules(new JavaTimeModule())
                            .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                            .build()
            ))
            .build();

    @Test
    void atmosphereReturnsFallbackPayloadWithValidToken() throws Exception {
        when(jwtService.isValid("jwt-token")).thenReturn(true);
        when(weatherService.getAtmosphere(any())).thenReturn(new WeatherAtmosphereVo(
                "unknown",
                "unknown",
                null,
                "cloudy",
                true,
                LocalDateTime.of(2026, 4, 28, 12, 0)
        ));

        mockMvc.perform(get("/api/weather/atmosphere")
                        .header("Authorization", "Bearer jwt-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("unknown"))
                .andExpect(jsonPath("$.country").value("unknown"))
                .andExpect(jsonPath("$.temperature").doesNotExist())
                .andExpect(jsonPath("$.weatherType").value("cloudy"))
                .andExpect(jsonPath("$.isDay").value(true))
                .andExpect(jsonPath("$.updatedAt").value("2026-04-28T12:00:00"));
    }

    @Test
    void browserAtmosphereReturnsWeatherPayloadWithValidTokenAndCoordinates() throws Exception {
        when(jwtService.isValid("jwt-token")).thenReturn(true);
        when(weatherService.getBrowserAtmosphere("30.25", "120.16")).thenReturn(new WeatherAtmosphereVo(
                "\u676d\u5dde\u5e02",
                "\u897f\u6e56\u533a",
                22.3,
                "rain",
                true,
                LocalDateTime.of(2026, 4, 28, 13, 0)
        ));

        mockMvc.perform(get("/api/weather/atmosphere/browser")
                        .param("latitude", "30.25")
                        .param("longitude", "120.16")
                        .header("Authorization", "Bearer jwt-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("\u676d\u5dde\u5e02"))
                .andExpect(jsonPath("$.country").value("\u897f\u6e56\u533a"))
                .andExpect(jsonPath("$.temperature").value(22.3))
                .andExpect(jsonPath("$.weatherType").value("rain"))
                .andExpect(jsonPath("$.isDay").value(true))
                .andExpect(jsonPath("$.updatedAt").value("2026-04-28T13:00:00"));
    }

    @Test
    void atmosphereRejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(get("/api/weather/atmosphere"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void browserAtmosphereRejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(get("/api/weather/atmosphere/browser")
                        .param("latitude", "30.25")
                        .param("longitude", "120.16"))
                .andExpect(status().isUnauthorized());
    }

    private WeatherController weatherController() {
        WeatherController controller = new WeatherController();
        ReflectionTestUtils.setField(controller, "weatherService", weatherService);
        return controller;
    }

    private JwtAuthInterceptor jwtAuthInterceptor() {
        JwtAuthInterceptor interceptor = new JwtAuthInterceptor();
        ReflectionTestUtils.setField(interceptor, "jwtService", jwtService);
        return interceptor;
    }
}
