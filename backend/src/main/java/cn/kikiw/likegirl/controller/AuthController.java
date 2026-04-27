package cn.kikiw.likegirl.controller;

import cn.kikiw.likegirl.dto.LoginDto;
import cn.kikiw.likegirl.dto.ProfileUpdateDto;
import cn.kikiw.likegirl.service.AuthService;
import cn.kikiw.likegirl.vo.CurrentUserVo;
import cn.kikiw.likegirl.vo.LoginVo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginVo login(@RequestBody LoginDto request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public CurrentUserVo me(@RequestHeader("Authorization") String authorization) {
        return authService.currentUser(extractToken(authorization));
    }

    @PutMapping("/me")
    public CurrentUserVo updateMe(@RequestHeader("Authorization") String authorization,
                                  @RequestBody ProfileUpdateDto request) {
        return authService.updateCurrentUser(extractToken(authorization), request);
    }

    @PostMapping("/me/avatar")
    public CurrentUserVo updateAvatar(@RequestHeader("Authorization") String authorization,
                                      @RequestParam("file") MultipartFile file) {
        return authService.updateAvatar(extractToken(authorization), file);
    }

    private String extractToken(String authorization) {
        return authorization != null && authorization.startsWith("Bearer ")
                ? authorization.substring(7)
                : "";
    }
}
