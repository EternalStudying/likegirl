package cn.kikiw.likegirl;

import cn.kikiw.likegirl.service.SiteService;
import cn.kikiw.likegirl.config.JwtAuthInterceptor;
import cn.kikiw.likegirl.config.WebConfig;
import cn.kikiw.likegirl.controller.AuthController;
import cn.kikiw.likegirl.controller.SiteController;
import cn.kikiw.likegirl.controller.WeatherController;
import cn.kikiw.likegirl.service.JwtService;
import cn.kikiw.likegirl.service.impl.AmapWeatherApiClient;
import cn.kikiw.likegirl.service.impl.AuthServiceImpl;
import cn.kikiw.likegirl.service.impl.MinioAvatarStorageService;
import cn.kikiw.likegirl.service.impl.SiteServiceImpl;
import cn.kikiw.likegirl.service.impl.WeatherServiceImpl;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ArchitectureTests {

    @Test
    void backendUsesControllerServiceImplDtoVoEntityLayers() throws Exception {
        assertThat(Class.forName("cn.kikiw.likegirl.controller.SiteController")).isNotNull();
        assertThat(Class.forName("cn.kikiw.likegirl.dto.MessageCreateDto")).isNotNull();
        assertThat(Class.forName("cn.kikiw.likegirl.vo.SiteVo")).isNotNull();
        assertThat(Class.forName("cn.kikiw.likegirl.entity.CoupleProfile")).isNotNull();

        assertThat(SiteService.class.isInterface()).isTrue();
        assertThat(SiteService.class).isAssignableFrom(SiteServiceImpl.class);
    }

    @Test
    void springManagedClassesDoNotUseConstructorInjection() {
        List<Class<?>> managedClasses = List.of(
                JwtAuthInterceptor.class,
                WebConfig.class,
                AuthController.class,
                SiteController.class,
                WeatherController.class,
                JwtService.class,
                AmapWeatherApiClient.class,
                AuthServiceImpl.class,
                MinioAvatarStorageService.class,
                SiteServiceImpl.class,
                WeatherServiceImpl.class
        );

        for (Class<?> managedClass : managedClasses) {
            assertThat(managedClass.getDeclaredConstructors())
                    .describedAs("%s should use automatic field injection", managedClass.getName())
                    .noneMatch(constructor -> constructor.getParameterCount() > 0);
        }
    }
}
