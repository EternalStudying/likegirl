package cn.kikiw.likegirl;

import cn.kikiw.likegirl.config.CorsConfig;
import cn.kikiw.likegirl.controller.AuthController;
import cn.kikiw.likegirl.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mock.web.MockServletContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CorsConfigTests {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.setServletContext(new MockServletContext());
        context.register(AuthController.class, CorsConfig.class, TestConfig.class);
        context.refresh();
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void allowsViteFromLocalhostAndLoopback() throws Exception {
        assertCorsAllowed("http://localhost:5173");
        assertCorsAllowed("http://127.0.0.1:5173");
    }

    private void assertCorsAllowed(String origin) throws Exception {
        mockMvc.perform(options("/api/auth/me/avatar")
                        .header("Origin", origin)
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", origin));
    }

    @Configuration
    @EnableWebMvc
    static class TestConfig {

        @Bean
        AuthService authService() {
            return mock(AuthService.class);
        }
    }
}
