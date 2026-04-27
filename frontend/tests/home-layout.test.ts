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

function mockHomeFetch() {
  return vi.fn((input: RequestInfo | URL) => {
    const url = String(input);

    if (url === '/api/site') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(siteDataFixture) });
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
    vi.stubGlobal('fetch', mockHomeFetch());
    const router = createRouter({ history: createMemoryHistory(), routes });

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.find('.user-badge').exists()).toBe(false);
    expect(wrapper.find('.home-hero-carousel .user-badge').exists()).toBe(false);
  });

  it('全局顶栏使用 sticky 布局且移动端文本省略避免横向溢出', () => {
    expect(styles).toMatch(/\.app-topbar\s*{[\s\S]*position:\s*sticky;[\s\S]*top:\s*0;/);
    expect(styles).not.toMatch(/\.app-topbar__inner\s*{[\s\S]*width:\s*min\(1120px,\s*calc\(100%\s*-\s*32px\)\);/);
    expect(styles).toMatch(/\.app-topbar__inner\s*{[\s\S]*width:\s*auto;[\s\S]*margin-left:\s*max\(var\(--topbar-edge-gap\),\s*env\(safe-area-inset-left\)\);/);
    expect(styles).toMatch(/\.app-topbar__inner\s*{[\s\S]*margin-right:\s*max\(var\(--topbar-edge-gap\),\s*env\(safe-area-inset-right\)\);/);
    expect(styles).toMatch(/\.app-topbar__quote\s*{[\s\S]*overflow:\s*hidden;[\s\S]*text-overflow:\s*ellipsis;[\s\S]*white-space:\s*nowrap;/);
    expect(styles).not.toMatch(/@media\s*\(max-width:\s*760px\)[\s\S]*\.app-topbar__inner\s*{[\s\S]*width:\s*calc\(100%\s*-\s*24px\);/);
  });

  it('首页 Hero 横幅接近全宽但保留桌面和移动安全边距', () => {
    expect(styles).toMatch(/\.home-hero-carousel\s*{[\s\S]*width:\s*min\(1600px,\s*calc\(100%\s*-\s*32px\)\);/);
    expect(styles).toMatch(/@media\s*\(max-width:\s*760px\)[\s\S]*\.home-hero-carousel\s*{[\s\S]*width:\s*min\(100%\s*-\s*20px,\s*1480px\);/);
    expect(styles).toMatch(/@media\s*\(max-width:\s*420px\)[\s\S]*\.home-hero-carousel\s*{[\s\S]*width:\s*min\(100%\s*-\s*18px,\s*1480px\);/);
  });
});
