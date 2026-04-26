package cn.kikiw.likegirl.service;

import cn.kikiw.likegirl.dto.MessageCreateDto;
import cn.kikiw.likegirl.vo.MessageVo;
import cn.kikiw.likegirl.vo.SiteVo;

public interface SiteService {

    SiteVo getSite();

    MessageVo addMessage(MessageCreateDto request);
}
