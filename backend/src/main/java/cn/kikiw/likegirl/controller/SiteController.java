package cn.kikiw.likegirl.controller;

import cn.kikiw.likegirl.dto.MessageCreateDto;
import cn.kikiw.likegirl.service.SiteService;
import cn.kikiw.likegirl.vo.MessageVo;
import cn.kikiw.likegirl.vo.SiteVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SiteController {

    @Autowired
    private SiteService siteService;

    @GetMapping("/site")
    public SiteVo site() {
        return siteService.getSite();
    }

    @PostMapping("/messages")
    public MessageVo createMessage(@RequestBody MessageCreateDto request) {
        return siteService.addMessage(request);
    }
}
