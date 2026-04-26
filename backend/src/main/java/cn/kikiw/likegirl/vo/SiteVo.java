package cn.kikiw.likegirl.vo;

import java.util.List;

public record SiteVo(
        CoupleProfileVo couple,
        HeroVo hero,
        List<MemoryVo> memories,
        List<PhotoVo> photos,
        List<WishItemVo> wishes,
        List<MessageVo> messages
) {
}
