package cn.kikiw.likegirl.service.impl;

import cn.kikiw.likegirl.dto.MessageCreateDto;
import cn.kikiw.likegirl.entity.CoupleProfile;
import cn.kikiw.likegirl.entity.Memory;
import cn.kikiw.likegirl.entity.Message;
import cn.kikiw.likegirl.entity.Photo;
import cn.kikiw.likegirl.entity.WishItem;
import cn.kikiw.likegirl.mapper.SiteMapper;
import cn.kikiw.likegirl.service.SiteService;
import cn.kikiw.likegirl.vo.CoupleProfileVo;
import cn.kikiw.likegirl.vo.HeroVo;
import cn.kikiw.likegirl.vo.MemoryVo;
import cn.kikiw.likegirl.vo.MessageVo;
import cn.kikiw.likegirl.vo.PhotoVo;
import cn.kikiw.likegirl.vo.SiteVo;
import cn.kikiw.likegirl.vo.WishItemVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SiteServiceImpl implements SiteService {

    private static final int MAX_NICKNAME_LENGTH = 40;
    private static final int MAX_CONTENT_LENGTH = 500;

    @Autowired
    private SiteMapper siteMapper;

    @Override
    public SiteVo getSite() {
        CoupleProfile couple = siteMapper.findCouple();
        if (couple == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "couple profile missing");
        }

        List<Memory> memories = siteMapper.findMemories();
        for (Memory memory : memories) {
            memory.setTags(siteMapper.findTagsByMemoryId(memory.getId()));
        }

        return new SiteVo(
                toCoupleVo(couple),
                new HeroVo(couple.getPersonA() + " & " + couple.getPersonB(), couple.getSlogan()),
                memories.stream().map(this::toMemoryVo).toList(),
                siteMapper.findPhotos().stream().map(this::toPhotoVo).toList(),
                siteMapper.findWishes().stream().map(this::toWishItemVo).toList(),
                siteMapper.findMessages().stream().map(this::toMessageVo).toList()
        );
    }

    @Override
    public MessageVo addMessage(MessageCreateDto request) {
        String rawContent = request == null ? "" : request.content();
        String trimmedContent = rawContent == null ? "" : rawContent.trim();
        if (trimmedContent.isBlank() || trimmedContent.length() > MAX_CONTENT_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "content length must be 1-500");
        }

        String nickname = request.nickname() == null || request.nickname().trim().isBlank()
                ? "匿名"
                : request.nickname().trim();
        if (nickname.length() > MAX_NICKNAME_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "nickname length must be 1-40");
        }

        Message message = new Message(
                null,
                escapeHtml(nickname),
                escapeHtml(removeScriptBlocks(trimmedContent)),
                LocalDateTime.now()
        );
        siteMapper.insertMessage(message);
        return toMessageVo(message);
    }

    private CoupleProfileVo toCoupleVo(CoupleProfile couple) {
        return new CoupleProfileVo(
                couple.getId(),
                couple.getPersonA(),
                couple.getPersonB(),
                couple.getStartDate(),
                couple.getAnniversaryDate(),
                couple.getSlogan()
        );
    }

    private MemoryVo toMemoryVo(Memory memory) {
        return new MemoryVo(memory.getId(), memory.getTitle(), memory.getDate(), memory.getContent(), memory.getTags());
    }

    private PhotoVo toPhotoVo(Photo photo) {
        return new PhotoVo(photo.getId(), photo.getUrl(), photo.getCaption(), photo.getDate());
    }

    private WishItemVo toWishItemVo(WishItem wishItem) {
        return new WishItemVo(wishItem.getId(), wishItem.getTitle(), wishItem.isDone());
    }

    private MessageVo toMessageVo(Message message) {
        return new MessageVo(message.getId(), message.getNickname(), message.getContent(), message.getCreatedAt());
    }

    private String removeScriptBlocks(String value) {
        return value.replaceAll("(?is)<script.*?>.*?</script>", "").trim();
    }

    private String escapeHtml(String value) {
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
