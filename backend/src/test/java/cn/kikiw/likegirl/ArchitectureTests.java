package cn.kikiw.likegirl;

import cn.kikiw.likegirl.service.SiteService;
import cn.kikiw.likegirl.service.impl.SiteServiceImpl;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ArchitectureTests {

    @Test
    void backendUsesControllerServiceImplDtoVoEntityLayers() throws Exception {
        assertThat(Class.forName("cn.kikiw.likegirl.controller.SiteController")).isNotNull();
        assertThat(Class.forName("cn.kikiw.likegirl.dto.MessageCreateDto")).isNotNull();
        assertThat(Class.forName("cn.kikiw.likegirl.vo.SiteVo")).isNotNull();
        assertThat(Class.forName("cn.kikiw.likegirl.entity.CoupleProfile")).isNotNull();

        assertThat(SiteService.class.isInterface()).isTrue();
        assertThat(SiteService.class).isAssignableFrom(SiteServiceImpl.class);
    }
}
