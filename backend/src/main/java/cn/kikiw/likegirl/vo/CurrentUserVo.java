package cn.kikiw.likegirl.vo;

import java.time.LocalDateTime;

public record CurrentUserVo(
        Long id,
        String username,
        String displayName,
        String avatarUrl,
        String bio,
        String mood,
        LocalDateTime updatedAt
) {
}
