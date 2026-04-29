import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
// @ts-ignore - Vitest 运行在 Node 环境，项目当前未显式声明 @types/node。
import { readFileSync } from 'node:fs';
// @ts-ignore - 同上。
import { dirname, resolve } from 'node:path';
// @ts-ignore - 同上。
import { fileURLToPath } from 'node:url';
import HomeView from '../src/views/HomeView.vue';
import { routes } from '../src/router';
import { homeHeroSlides } from '../src/config/homeHeroSlides';
import { siteDataFixture } from './siteData.fixture';

const styles = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../src/styles.css'), 'utf8');

function stubHomeGeolocation() {
  Object.defineProperty(globalThis.navigator, 'geolocation', {
    configurable: true,
    value: {
      getCurrentPosition: vi.fn((success: PositionCallback) => {
        success({
          coords: {
            latitude: 30.2741,
            longitude: 120.1551,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        } as GeolocationPosition);
      }),
      clearWatch: vi.fn(),
      watchPosition: vi.fn()
    }
  });
}

function mockHomeFetch() {
  return vi.fn((input: RequestInfo | URL) => {
    const url = String(input);

    if (url === '/api/site') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(siteDataFixture) });
    }

    if (url === '/api/weather/atmosphere/browser?latitude=30.2741&longitude=120.1551') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            city: 'Hangzhou',
            country: 'browser',
            temperature: 24,
            weatherType: 'sunny',
            isDay: true,
            updatedAt: '2026-04-28T10:00:00'
          })
      });
    }

    return Promise.reject(new Error(`Unexpected request: ${url}`));
  }) as unknown as typeof fetch;
}

describe('首页用户入口布局', () => {
  it('首页轮播配置至少提供两张本地插画背景', () => {
    expect(homeHeroSlides.length).toBeGreaterThanOrEqual(2);
    expect(homeHeroSlides.every((slide) => slide.image && slide.title && slide.subtitle && slide.tone)).toBe(true);
    expect(homeHeroSlides[0].image).toContain('hero-storybook-onsen');
    expect(homeHeroSlides[1].image).toContain('hero-storybook-evening');
    expect(homeHeroSlides.map((slide) => slide.tone)).toEqual(['spring-snow', 'warm-diary']);
  });

  it('首页轮播背景资源使用干净插画位图且不包含 UI mock 文案资源名', () => {
    const assetDir = resolve(dirname(fileURLToPath(import.meta.url)), '../src/assets/home-hero');
    const backgrounds = ['hero-storybook-onsen.png', 'hero-storybook-evening.png'];

    for (const name of backgrounds) {
      expect(readFileSync(resolve(assetDir, name)).byteLength).toBeGreaterThan(100_000);
      expect(name).not.toMatch(/默认状态|可点击状态|文本输入状态|加载状态|按钮|输入框|mock/i);
    }
  });

  it('全局字体使用中文衬线字体栈并让表单控件继承', () => {
    expect(styles).toMatch(/font-family:\s*"Noto Serif SC",\s*"Source Han Serif SC"[\s\S]*"SimSun"[\s\S]*serif;/);
    expect(styles).toMatch(/button,\s*input,\s*textarea\s*{[\s\S]*font:\s*inherit;/);
  });

  it('首页不再渲染旧的孤立 UserBadge 入口', async () => {
    localStorage.setItem('likegirl_token', 'jwt-token');
    stubHomeGeolocation();
    vi.stubGlobal('fetch', mockHomeFetch());
    const router = createRouter({ history: createMemoryHistory(), routes });

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.find('.user-badge').exists()).toBe(false);
    expect(wrapper.find('.home-hero-carousel .user-badge').exists()).toBe(false);
  });

  it('首页红框首屏使用整幅插画、悬浮导航和纸质纪念卡构图', async () => {
    stubHomeGeolocation();
    vi.stubGlobal('fetch', mockHomeFetch());
    const router = createRouter({ history: createMemoryHistory(), routes });

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.find('.home-cozy-stage').exists()).toBe(true);
    expect(wrapper.findAll('.home-hero-carousel .hero-avatar-image')).toHaveLength(2);
    expect(wrapper.find('.home-hero-carousel .hero-center-heart').exists()).toBe(true);
    expect(wrapper.find('.home-hero-carousel .hero-memory-note').text()).toContain('在一起第');
    expect(wrapper.find('.home-hero-carousel .hero-anniversary-capsule').text()).toContain('下一纪念日');
    expect(wrapper.find('.home-cozy-nav').exists()).toBe(true);
    expect(wrapper.findAll('.home-cozy-nav__link')).toHaveLength(7);
    expect(wrapper.find('.home-cozy-nav__link--home').text()).toContain('首页');
    expect(wrapper.find('.home-cozy-title').text()).toContain('收好我们的日常与心动');
    expect(wrapper.find('.home-memory-card').exists()).toBe(true);
    expect(wrapper.find('.home-memory-card__days').text()).toContain(String(togetherDaysFromFixture()));
    expect(wrapper.find('.home-memory-card__anniversary').text()).toContain('下一纪念日');
    expect(wrapper.find('.directory-section').exists()).toBe(true);
    expect(wrapper.find('.weather-atmosphere').exists()).toBe(false);
  });

  it('红框区域样式包含底部雪坡、悬浮胶囊导航和纸质纪念卡', () => {
    expect(styles).toMatch(/\.home-cozy-stage\s*{/);
    expect(styles).toMatch(/--cozy-boundary-top:\s*calc\(var\(--cozy-hero-height\) \+ var\(--cozy-nav-offset\) \+ var\(--cozy-nav-half\)\);/);
    expect(styles).toMatch(/\.home-cozy-stage::before\s*{[\s\S]*background:\s*#fff8ee;/);
    expect(styles).toMatch(/\.home-cozy-stage::after\s*{[\s\S]*linear-gradient\(180deg,\s*transparent calc\(100% - 1px\)/);
    expect(styles).toMatch(/\.home-cozy-stage \.home-hero-carousel::after\s*{[\s\S]*radial-gradient/);
    expect(styles).toMatch(/\.home-cozy-stage \.home-hero-carousel::after\s*{[\s\S]*mask-image:\s*url\("data:image\/svg\+xml/);
    expect(styles).toContain("M0%2042Q960%20318%201920%2042V220H0Z");
    expect(styles).toMatch(/\.home-cozy-stage \.home-hero-carousel::after\s*{[\s\S]*drop-shadow/);
    expect(styles).toMatch(/\.home-cozy-stage \.home-hero-dots\s*{[\s\S]*bottom:\s*-17px;/);
    expect(styles).toMatch(/\.home-cozy-nav\s*{[\s\S]*margin:\s*var\(--cozy-nav-offset\) auto 0;[\s\S]*border-radius:\s*999px;/);
    expect(styles).toMatch(/\.home-memory-card\s*{[\s\S]*repeating-linear-gradient/);
    expect(styles).toMatch(/\.home-memory-card__days\s*{[\s\S]*font-size:\s*clamp/);
  });

  it('全局顶栏使用红框图中的居中 LG Demo 小栏', () => {
    expect(styles).toMatch(/\.app-topbar\s*{[\s\S]*position:\s*sticky;[\s\S]*top:\s*0;/);
    expect(styles).not.toMatch(/\.app-topbar__inner\s*{[\s\S]*width:\s*min\(1120px,\s*calc\(100%\s*-\s*32px\)\);/);
    expect(styles).toMatch(/\.app-topbar__inner\s*{[\s\S]*width:\s*auto;[\s\S]*margin-left:\s*max\(var\(--topbar-edge-gap\),\s*env\(safe-area-inset-left\)\);/);
    expect(styles).toMatch(/\.app-topbar__inner\s*{[\s\S]*margin-right:\s*max\(var\(--topbar-edge-gap\),\s*env\(safe-area-inset-right\)\);/);
    expect(styles).toMatch(/\.app-topbar__quote\s*{[\s\S]*left:\s*50%;[\s\S]*transform:\s*translateX\(-50%\);/);
    expect(styles).not.toMatch(/@media\s*\(max-width:\s*760px\)[\s\S]*\.app-topbar__inner\s*{[\s\S]*width:\s*calc\(100%\s*-\s*24px\);/);
  });

  it('红框 Hero 横幅贴齐红框宽度且目录顺延到纪念卡之后', () => {
    expect(styles).toMatch(/\.home-cozy-stage \.home-hero-carousel\s*{[\s\S]*width:\s*100%;[\s\S]*margin:\s*0;/);
    expect(styles).toMatch(/\.home-cozy-stage \+ \.directory-section\s*{[\s\S]*padding-top:[\s\S]*background:\s*#fff8ee;/);
  });
});

function togetherDaysFromFixture() {
  const start = new Date(`${siteDataFixture.couple.startDate}T00:00:00`);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;
}
