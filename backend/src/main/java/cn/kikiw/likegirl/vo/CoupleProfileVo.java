package cn.kikiw.likegirl.vo;

import java.time.LocalDate;

public record CoupleProfileVo(
        Long id,
        String personA,
        String personB,
        LocalDate startDate,
        LocalDate anniversaryDate,
        String slogan
) {
}
