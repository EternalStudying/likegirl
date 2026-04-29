package cn.kikiw.likegirl.service;

import cn.kikiw.likegirl.vo.WeatherAtmosphereVo;
import jakarta.servlet.http.HttpServletRequest;

public interface WeatherService {

    WeatherAtmosphereVo getAtmosphere(HttpServletRequest request);

    WeatherAtmosphereVo getBrowserAtmosphere(String latitude, String longitude);
}
