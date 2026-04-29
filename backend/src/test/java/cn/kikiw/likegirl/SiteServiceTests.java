package cn.kikiw.likegirl;

import cn.kikiw.likegirl.mapper.SiteMapper;
import cn.kikiw.likegirl.dto.MessageCreateDto;
import cn.kikiw.likegirl.entity.CoupleProfile;
import cn.kikiw.likegirl.entity.Message;
import cn.kikiw.likegirl.service.SiteService;
import cn.kikiw.likegirl.service.impl.SiteServiceImpl;
import cn.kikiw.likegirl.vo.MessageVo;
import cn.kikiw.likegirl.vo.SiteVo;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SiteServiceTests {

    private final SiteMapper siteMapper = mock(SiteMapper.class);
    private final SiteService siteService = siteService();

    @Test
    void getSiteReturnsHomepageDataFromMapper() {
        CoupleProfile couple = new CoupleProfile(1L, "小栀", "阿然",
                LocalDate.of(2022, 5, 20), LocalDate.of(2022, 5, 20), "每天都喜欢你");
        when(siteMapper.findCouple()).thenReturn(couple);
        when(siteMapper.findMemories()).thenReturn(List.of());
        when(siteMapper.findPhotos()).thenReturn(List.of());
        when(siteMapper.findWishes()).thenReturn(List.of());
        when(siteMapper.findMessages()).thenReturn(List.of());

        SiteVo response = siteService.getSite();

        assertThat(response.couple().personA()).isEqualTo("小栀");
        assertThat(response.hero().slogan()).isEqualTo("每天都喜欢你");
        assertThat(response.memories()).isEmpty();
        verify(siteMapper).findMemories();
        verify(siteMapper).findMessages();
    }

    @Test
    void addMessageCleansHtmlAndPersistsMessage() {
        when(siteMapper.insertMessage(any())).thenAnswer(invocation -> {
            Message message = invocation.getArgument(0);
            message.setId(8L);
            return 1;
        });

        MessageVo saved = siteService.addMessage(new MessageCreateDto(
                " <b>Alice</b> ",
                "hello <script>alert(1)</script> <b>world</b>"
        ));

        assertThat(saved.id()).isEqualTo(8L);
        assertThat(saved.nickname()).isEqualTo("&lt;b&gt;Alice&lt;/b&gt;");
        assertThat(saved.content()).doesNotContain("<script>");
        assertThat(saved.content()).contains("&lt;b&gt;world&lt;/b&gt;");
        assertThat(saved.createdAt()).isBeforeOrEqualTo(LocalDateTime.now());
        verify(siteMapper).insertMessage(any(Message.class));
    }

    @Test
    void addMessageRejectsBlankOrTooLongContent() {
        assertThatThrownBy(() -> siteService.addMessage(new MessageCreateDto("Bob", "   ")))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400");

        assertThatThrownBy(() -> siteService.addMessage(new MessageCreateDto("Bob", "x".repeat(501))))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400");
    }

    private SiteService siteService() {
        SiteServiceImpl service = new SiteServiceImpl();
        ReflectionTestUtils.setField(service, "siteMapper", siteMapper);
        return service;
    }
}
