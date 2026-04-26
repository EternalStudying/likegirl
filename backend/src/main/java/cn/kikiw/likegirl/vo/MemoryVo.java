package cn.kikiw.likegirl.vo;

import java.time.LocalDate;
import java.util.List;

public record MemoryVo(Long id, String title, LocalDate date, String content, List<String> tags) {
}
