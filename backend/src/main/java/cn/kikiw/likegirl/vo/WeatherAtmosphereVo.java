package cn.kikiw.likegirl.vo;

import java.time.LocalDateTime;

public record WeatherAtmosphereVo(
        String city,
        String country,
        Double temperature,
        String weatherType,
        boolean isDay,
        LocalDateTime updatedAt
) {
}
