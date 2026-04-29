package cn.kikiw.likegirl;

import cn.kikiw.likegirl.config.JwtAuthInterceptor;
import cn.kikiw.likegirl.controller.AuthController;
import cn.kikiw.likegirl.controller.SiteController;
import cn.kikiw.likegirl.service.AuthService;
import cn.kikiw.likegirl.service.JwtService;
import cn.kikiw.likegirl.service.SiteService;
import cn.kikiw.likegirl.vo.CoupleProfileVo;
import cn.kikiw.likegirl.vo.HeroVo;
import cn.kikiw.likegirl.vo.SiteVo;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class JwtAuthInterceptorTests {

    private final JwtService jwtService = mock(JwtService.class);
    private final SiteService siteService = mock(SiteService.class);
    private final AuthService authService = mock(AuthService.class);
    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(siteController())
            .addInterceptors(jwtAuthInterceptor())
            .build();

    @Test
    void siteRejectsRequestWithoutToken() throws Exception {
        mockMvc.perform(get("/api/site"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void siteAllowsRequestWithValidToken() throws Exception {
        when(jwtService.isValid("jwt-token")).thenReturn(true);
        when(siteService.getSite()).thenReturn(new SiteVo(
                new CoupleProfileVo(1L, "A", "B", LocalDate.of(2022, 5, 20), LocalDate.of(2022, 5, 20), "love"),
                new HeroVo("A & B", "love"),
                List.of(),
                List.of(),
                List.of(),
                List.of()
        ));

        mockMvc.perform(get("/api/site")
                        .header("Authorization", "Bearer jwt-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.couple.personA").value("A"))
                .andExpect(jsonPath("$.hero.slogan").value("love"));
    }

    @Test
    void meRejectsRequestWithoutToken() throws Exception {
        MockMvc authMockMvc = MockMvcBuilders.standaloneSetup(authController())
                .addInterceptors(jwtAuthInterceptor())
                .build();

        authMockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    private SiteController siteController() {
        SiteController controller = new SiteController();
        ReflectionTestUtils.setField(controller, "siteService", siteService);
        return controller;
    }

    private AuthController authController() {
        AuthController controller = new AuthController();
        ReflectionTestUtils.setField(controller, "authService", authService);
        return controller;
    }

    private JwtAuthInterceptor jwtAuthInterceptor() {
        JwtAuthInterceptor interceptor = new JwtAuthInterceptor();
        ReflectionTestUtils.setField(interceptor, "jwtService", jwtService);
        return interceptor;
    }
}
