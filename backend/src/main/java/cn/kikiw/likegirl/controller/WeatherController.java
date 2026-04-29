package cn.kikiw.likegirl.controller;

import cn.kikiw.likegirl.service.WeatherService;
import cn.kikiw.likegirl.vo.WeatherAtmosphereVo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/atmosphere")
    public WeatherAtmosphereVo atmosphere(HttpServletRequest request) {
        return weatherService.getAtmosphere(request);
    }

    @GetMapping("/atmosphere/browser")
    public WeatherAtmosphereVo browserAtmosphere(
            @RequestParam(required = false) String latitude,
            @RequestParam(required = false) String longitude) {
        return weatherService.getBrowserAtmosphere(latitude, longitude);
    }
}
