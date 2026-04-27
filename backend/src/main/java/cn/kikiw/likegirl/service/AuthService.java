package cn.kikiw.likegirl.service;

import cn.kikiw.likegirl.dto.LoginDto;
import cn.kikiw.likegirl.dto.ProfileUpdateDto;
import cn.kikiw.likegirl.vo.CurrentUserVo;
import cn.kikiw.likegirl.vo.LoginVo;
import org.springframework.web.multipart.MultipartFile;

public interface AuthService {

    LoginVo login(LoginDto request);

    CurrentUserVo currentUser(String token);

    CurrentUserVo updateCurrentUser(String token, ProfileUpdateDto request);

    CurrentUserVo updateAvatar(String token, MultipartFile file);
}
