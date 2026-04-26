package cn.kikiw.likegirl.vo;

import java.time.LocalDateTime;

public record MessageVo(Long id, String nickname, String content, LocalDateTime createdAt) {
}
