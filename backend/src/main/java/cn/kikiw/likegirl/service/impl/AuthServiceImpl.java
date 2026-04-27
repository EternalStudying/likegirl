package cn.kikiw.likegirl.service.impl;

import cn.kikiw.likegirl.dto.LoginDto;
import cn.kikiw.likegirl.dto.ProfileUpdateDto;
import cn.kikiw.likegirl.entity.AuthUser;
import cn.kikiw.likegirl.mapper.AuthUserMapper;
import cn.kikiw.likegirl.service.AuthService;
import cn.kikiw.likegirl.service.AvatarStorageService;
import cn.kikiw.likegirl.service.JwtService;
import cn.kikiw.likegirl.vo.CurrentUserVo;
import cn.kikiw.likegirl.vo.LoginVo;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private static final long MAX_AVATAR_SIZE = 2L * 1024L * 1024L;
    private static final Set<String> ALLOWED_AVATAR_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final AuthUserMapper authUserMapper;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AvatarStorageService avatarStorageService;

    public AuthServiceImpl(AuthUserMapper authUserMapper, JwtService jwtService, PasswordEncoder passwordEncoder,
                           AvatarStorageService avatarStorageService) {
        this.authUserMapper = authUserMapper;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.avatarStorageService = avatarStorageService;
    }

    @Override
    public LoginVo login(LoginDto request) {
        String username = request == null ? "" : clean(request.username());
        String password = request == null ? "" : clean(request.password());
        AuthUser user = authUserMapper.findByUsername(username);
        if (user == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid username or password");
        }
        return new LoginVo(jwtService.generateToken(user.getId(), user.getUsername()), toVo(user));
    }

    @Override
    public CurrentUserVo currentUser(String token) {
        return toVo(requireUser(token));
    }

    @Override
    public CurrentUserVo updateCurrentUser(String token, ProfileUpdateDto request) {
        AuthUser user = requireUser(token);
        String displayName = clean(request == null ? "" : request.displayName());
        String bio = cleanNullable(request == null ? null : request.bio());
        String mood = cleanNullable(request == null ? null : request.mood());
        validateProfile(displayName, bio, mood);

        authUserMapper.updateProfile(user.getId(), displayName, bio, mood);
        return toVo(authUserMapper.findById(user.getId()));
    }

    @Override
    public CurrentUserVo updateAvatar(String token, MultipartFile file) {
        AuthUser user = requireUser(token);
        validateAvatar(file);
        String avatarUrl = avatarStorageService.upload(file, user.getId());
        authUserMapper.updateAvatar(user.getId(), avatarUrl);
        return toVo(authUserMapper.findById(user.getId()));
    }

    private AuthUser requireUser(String token) {
        if (!jwtService.isValid(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid token");
        }
        AuthUser user = authUserMapper.findById(jwtService.getUserId(token));
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid token");
        }
        return user;
    }

    private CurrentUserVo toVo(AuthUser user) {
        return new CurrentUserVo(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getBio(),
                user.getMood(),
                user.getUpdatedAt()
        );
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private String cleanNullable(String value) {
        String cleaned = clean(value);
        return cleaned.isEmpty() ? null : cleaned;
    }

    private void validateProfile(String displayName, String bio, String mood) {
        if (displayName.isBlank() || displayName.length() > 80) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "displayName length must be 1-80");
        }
        if (bio != null && bio.length() > 200) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "bio length must be <= 200");
        }
        if (mood != null && mood.length() > 80) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "mood length must be <= 80");
        }
    }

    private void validateAvatar(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "avatar file is required");
        }
        if (file.getSize() > MAX_AVATAR_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "avatar file must be <= 2MB");
        }
        String contentType = clean(file.getContentType()).toLowerCase();
        String filename = clean(file.getOriginalFilename()).toLowerCase();
        boolean allowedType = ALLOWED_AVATAR_TYPES.contains(contentType);
        boolean allowedExtension = filename.endsWith(".jpg")
                || filename.endsWith(".jpeg")
                || filename.endsWith(".png")
                || filename.endsWith(".webp");
        if (!allowedType || !allowedExtension) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "avatar file must be jpg, jpeg, png, or webp");
        }
    }
}
