package cn.kikiw.likegirl.service;

import org.springframework.web.multipart.MultipartFile;

public interface AvatarStorageService {

    String upload(MultipartFile file, Long userId);
}
