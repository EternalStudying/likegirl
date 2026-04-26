package cn.kikiw.likegirl;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import cn.kikiw.likegirl.controller.SiteController;
import cn.kikiw.likegirl.dto.MessageCreateDto;
import cn.kikiw.likegirl.service.SiteService;
import cn.kikiw.likegirl.vo.CoupleProfileVo;
import cn.kikiw.likegirl.vo.HeroVo;
import cn.kikiw.likegirl.vo.MessageVo;
import cn.kikiw.likegirl.vo.SiteVo;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SiteControllerTests {

    private final SiteService siteService = mock(SiteService.class);
    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new SiteController(siteService))
            .setMessageConverters(new MappingJackson2HttpMessageConverter(
                    Jackson2ObjectMapperBuilder.json()
                            .modules(new JavaTimeModule())
                            .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                            .build()
            ))
            .build();

    @Test
    void getSiteReturnsHomepagePayload() throws Exception {
        when(siteService.getSite()).thenReturn(new SiteVo(
                new CoupleProfileVo(1L, "小栀", "阿然", LocalDate.of(2022, 5, 20), LocalDate.of(2022, 5, 20), "每天都喜欢你"),
                new HeroVo("小栀 & 阿然", "每天都喜欢你"),
                List.of(),
                List.of(),
                List.of(),
                List.of()
        ));

        mockMvc.perform(get("/api/site"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.couple.personA").value("小栀"))
                .andExpect(jsonPath("$.hero.slogan").value("每天都喜欢你"))
                .andExpect(jsonPath("$.memories").isArray())
                .andExpect(jsonPath("$.photos").isArray())
                .andExpect(jsonPath("$.wishes").isArray())
                .andExpect(jsonPath("$.messages").isArray());
    }

    @Test
    void postMessageReturnsSavedMessage() throws Exception {
        when(siteService.addMessage(any(MessageCreateDto.class))).thenReturn(
                new MessageVo(9L, "Alice", "hello", LocalDateTime.of(2026, 4, 26, 12, 0))
        );

        mockMvc.perform(post("/api/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nickname\":\"Alice\",\"content\":\"hello\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(9))
                .andExpect(jsonPath("$.nickname").value("Alice"))
                .andExpect(jsonPath("$.content").value("hello"))
                .andExpect(jsonPath("$.createdAt").value("2026-04-26T12:00:00"));
    }
}
