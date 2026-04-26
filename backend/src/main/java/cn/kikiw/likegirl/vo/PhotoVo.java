package cn.kikiw.likegirl.vo;

import java.time.LocalDate;

public record PhotoVo(Long id, String url, String caption, LocalDate date) {
}
