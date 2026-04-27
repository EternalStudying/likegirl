package cn.kikiw.likegirl;

import cn.kikiw.likegirl.dto.LoginDto;
import cn.kikiw.likegirl.dto.ProfileUpdateDto;
import cn.kikiw.likegirl.entity.AuthUser;
import cn.kikiw.likegirl.mapper.AuthUserMapper;
import cn.kikiw.likegirl.service.AuthService;
import cn.kikiw.likegirl.service.AvatarStorageService;
import cn.kikiw.likegirl.service.JwtService;
import cn.kikiw.likegirl.service.impl.AuthServiceImpl;
import cn.kikiw.likegirl.vo.CurrentUserVo;
import cn.kikiw.likegirl.vo.LoginVo;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTests {

    private final AuthUserMapper authUserMapper = mock(AuthUserMapper.class);
    private final AvatarStorageService avatarStorageService = mock(AvatarStorageService.class);
    private final JwtService jwtService = new JwtService("test-secret-key-that-is-long-enough-for-hs256-tests");
    private final AuthService authService = new AuthServiceImpl(
            authUserMapper,
            jwtService,
            new BCryptPasswordEncoder(),
            avatarStorageService
    );

    @Test
    void loginChecksBCryptPasswordAndReturnsTokenWithUser() {
        String hash = new BCryptPasswordEncoder().encode("demo123456");
        when(authUserMapper.findByUsername("demo")).thenReturn(sampleUser(hash));

        LoginVo response = authService.login(new LoginDto("demo", "demo123456"));

        assertThat(response.token()).isNotBlank();
        assertThat(response.user()).isEqualTo(sampleVo());
        assertThat(jwtService.isValid(response.token())).isTrue();
    }

    @Test
    void loginRejectsWrongPassword() {
        String hash = new BCryptPasswordEncoder().encode("demo123456");
        when(authUserMapper.findByUsername("demo")).thenReturn(sampleUser(hash));

        assertThatThrownBy(() -> authService.login(new LoginDto("demo", "wrong")))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("401");
    }

    @Test
    void currentUserReadsUserFromValidToken() {
        when(authUserMapper.findById(1L)).thenReturn(sampleUser("hash"));
        String token = jwtService.generateToken(1L, "demo");

        CurrentUserVo user = authService.currentUser(token);

        assertThat(user).isEqualTo(sampleVo());
    }

    @Test
    void updateCurrentUserValidatesAndSavesProfile() {
        when(authUserMapper.findById(1L)).thenReturn(
                sampleUser("hash"),
                sampleUser("hash", "New Name", "New bio", "Calm", "https://cdn.example.com/avatar.png")
        );
        String token = jwtService.generateToken(1L, "demo");

        CurrentUserVo user = authService.updateCurrentUser(token, new ProfileUpdateDto(" New Name ", " New bio ", " Calm "));

        verify(authUserMapper).updateProfile(1L, "New Name", "New bio", "Calm");
        assertThat(user.displayName()).isEqualTo("New Name");
        assertThat(user.bio()).isEqualTo("New bio");
        assertThat(user.mood()).isEqualTo("Calm");
    }

    @Test
    void updateAvatarUploadsToMockStorageAndSavesUrl() {
        when(authUserMapper.findById(1L)).thenReturn(sampleUser("hash"));
        when(avatarStorageService.upload(any(), eq(1L))).thenReturn("https://cdn.example.com/avatar.png");
        String token = jwtService.generateToken(1L, "demo");
        MockMultipartFile file = new MockMultipartFile("file", "avatar.png", MediaType.IMAGE_PNG_VALUE, "png".getBytes());

        CurrentUserVo user = authService.updateAvatar(token, file);

        verify(authUserMapper).updateAvatar(1L, "https://cdn.example.com/avatar.png");
        assertThat(user.avatarUrl()).isEqualTo("https://cdn.example.com/avatar.png");
    }

    private AuthUser sampleUser(String hash) {
        return sampleUser(hash, "Demo User", "About me", "Happy", "https://cdn.example.com/avatar.png");
    }

    private AuthUser sampleUser(String hash, String displayName, String bio, String mood, String avatarUrl) {
        return new AuthUser(
                1L,
                "demo",
                displayName,
                hash,
                avatarUrl,
                bio,
                mood,
                LocalDateTime.of(2026, 4, 27, 12, 0)
        );
    }

    private CurrentUserVo sampleVo() {
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
