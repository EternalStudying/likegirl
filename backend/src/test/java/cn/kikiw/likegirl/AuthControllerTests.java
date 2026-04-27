package cn.kikiw.likegirl;

import cn.kikiw.likegirl.controller.AuthController;
import cn.kikiw.likegirl.config.ApiExceptionHandler;
import cn.kikiw.likegirl.dto.LoginDto;
import cn.kikiw.likegirl.dto.ProfileUpdateDto;
import cn.kikiw.likegirl.service.AuthService;
import cn.kikiw.likegirl.vo.CurrentUserVo;
import cn.kikiw.likegirl.vo.LoginVo;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTests {

    private final AuthService authService = mock(AuthService.class);
    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AuthController(authService))
            .setControllerAdvice(new ApiExceptionHandler())
            .build();

    @Test
    void loginReturnsTokenAndUser() throws Exception {
        when(authService.login(any(LoginDto.class))).thenReturn(
                new LoginVo("jwt-token", sampleUser())
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"demo\",\"password\":\"demo123456\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.id").value(1))
                .andExpect(jsonPath("$.user.username").value("demo"))
                .andExpect(jsonPath("$.user.displayName").value("Demo User"))
                .andExpect(jsonPath("$.user.avatarUrl").value("https://cdn.example.com/avatar.png"))
                .andExpect(jsonPath("$.user.bio").value("About me"))
                .andExpect(jsonPath("$.user.mood").value("Happy"))
                .andExpect(jsonPath("$.user.updatedAt").exists());
    }

    @Test
    void loginRejectsWrongPassword() throws Exception {
        when(authService.login(any(LoginDto.class))).thenThrow(
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid username or password")
        );

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"demo\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meReturnsCurrentUserFromBearerToken() throws Exception {
        when(authService.currentUser("jwt-token")).thenReturn(sampleUser());

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer jwt-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("demo"))
                .andExpect(jsonPath("$.displayName").value("Demo User"))
                .andExpect(jsonPath("$.avatarUrl").value("https://cdn.example.com/avatar.png"))
                .andExpect(jsonPath("$.bio").value("About me"))
                .andExpect(jsonPath("$.mood").value("Happy"))
                .andExpect(jsonPath("$.updatedAt").exists());
    }

    @Test
    void updateMeUpdatesCurrentUserFromBearerToken() throws Exception {
        when(authService.updateCurrentUser(eq("jwt-token"), any(ProfileUpdateDto.class))).thenReturn(sampleUser());

        mockMvc.perform(put("/api/auth/me")
                        .header("Authorization", "Bearer jwt-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"displayName\":\"Demo User\",\"bio\":\"About me\",\"mood\":\"Happy\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName").value("Demo User"))
                .andExpect(jsonPath("$.bio").value("About me"))
                .andExpect(jsonPath("$.mood").value("Happy"));
    }

    @Test
    void uploadAvatarUpdatesCurrentUserAvatarFromBearerToken() throws Exception {
        when(authService.updateAvatar(eq("jwt-token"), any())).thenReturn(sampleUser());
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "avatar.png",
                MediaType.IMAGE_PNG_VALUE,
                "png".getBytes()
        );

        mockMvc.perform(multipart("/api/auth/me/avatar")
                        .file(file)
                        .header("Authorization", "Bearer jwt-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.avatarUrl").value("https://cdn.example.com/avatar.png"));
    }

    @Test
    void uploadAvatarReturnsClearMessageWhenMinioIsNotConfigured() throws Exception {
        when(authService.updateAvatar(eq("jwt-token"), any())).thenThrow(
                new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "MinIO is not configured")
        );
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "avatar.png",
                MediaType.IMAGE_PNG_VALUE,
                "png".getBytes()
        );

        mockMvc.perform(multipart("/api/auth/me/avatar")
                        .file(file)
                        .header("Authorization", "Bearer jwt-token"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.message").value("MinIO is not configured"));
    }

    private CurrentUserVo sampleUser() {
        return new CurrentUserVo(
                1L,
                "demo",
                "Demo User",
                "https://cdn.example.com/avatar.png",
                "About me",
                "Happy",
                LocalDateTime.of(2026, 4, 27, 12, 0)
        );
    }
}
