import { mount, flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import HomeView from '../src/views/HomeView.vue';
import StoryView from '../src/views/StoryView.vue';
import MessagesView from '../src/views/MessagesView.vue';
import { routes } from '../src/router';
import { siteDataFixture } from './siteData.fixture';

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  );
}

function freezeHomeDate() {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-04-27T12:00:00'));
}

describe('首页入口和独立路由', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('站点数据未返回时只显示全页转圈，不显示提示语', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => undefined)));
    const router = createRouter({ history: createMemoryHistory(), routes });

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.find('.page-loader').exists()).toBe(true);
    expect(wrapper.find('.page-loader').text()).toBe('');
    expect(wrapper.text()).not.toContain('正在读取');
    expect(wrapper.text()).not.toContain('数据暂时不可用');
    expect(wrapper.find('.directory-grid').exists()).toBe(false);
  });

  it('首页不再展示目录卡片，也不直接展示留言表单和完整故事卷轴', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(siteDataFixture) }));
    const router = createRouter({ history: createMemoryHistory(), routes });

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.find('.directory-grid').exists()).toBe(false);
    expect(wrapper.findAll('.index-tab')).toHaveLength(0);
    expect(wrapper.text()).not.toContain('纪念册目录');
    expect(wrapper.find('form.message-form').exists()).toBe(false);
    expect(wrapper.find('.story-scroll').exists()).toBe(false);
  });

  it('首页展示插画横幅轮播、顶部导航和手账内容区', async () => {
    freezeHomeDate();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(siteDataFixture) }));
    const router = createRouter({ history: createMemoryHistory(), routes });

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.find('.home-hero-carousel').exists()).toBe(true);
    expect(wrapper.find('.home-cozy-stage').exists()).toBe(true);
    expect(wrapper.find('.memoir-stage').exists()).toBe(false);
    expect(wrapper.find('.home-hero-title').exists()).toBe(false);
    expect(wrapper.findAll('.home-hero-slide')).toHaveLength(2);
    expect(wrapper.findAll('.hero-avatar-sticker')).toHaveLength(2);
    expect(wrapper.find('.hero-center-heart').exists()).toBe(true);
    expect(wrapper.get('.hero-memory-note').text()).toContain('在一起第 1439 天');
    expect(wrapper.get('.hero-anniversary-capsule').text()).toContain('下一纪念日 23 天后');
    expect(wrapper.find('.home-memory-card__days').text()).toContain('1439');
    expect(wrapper.get('.home-memory-card__anniversary').text()).toContain('23 天后');
    expect(wrapper.find('.home-hero-wave').exists()).toBe(false);
    expect(wrapper.findAll('.home-cozy-nav__link')).toHaveLength(7);
    expect(wrapper.find('.daily-dashboard').exists()).toBe(true);
    expect(wrapper.find('.recent-moments').exists()).toBe(true);
    expect(wrapper.findAll('.index-tab')).toHaveLength(0);
    expect(wrapper.text()).not.toContain('Memory Index');
    expect(wrapper.text()).not.toContain('纪念册目录');
  });

  it('首页在 Hero 和纪念卡中保留在一起天数和下一纪念日', async () => {
    freezeHomeDate();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(siteDataFixture) }));
    const router = createRouter({ history: createMemoryHistory(), routes });

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.get('.home-hero-carousel').text()).toContain('第 1439 天');
    expect(wrapper.get('.home-hero-carousel').text()).toContain('下一纪念日');
    expect(wrapper.get('.home-memory-card').text()).toContain('1439');
    expect(wrapper.get('.home-memory-card').text()).toContain('下一纪念日');
    expect(wrapper.get('.home-memory-card').text()).toContain('23 天后');
    expect(wrapper.get('.home-hero-carousel').text()).not.toContain('小栀 和 阿然');
  });

  it('圆点点击能切换当前轮播图', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(siteDataFixture) }));
    const router = createRouter({ history: createMemoryHistory(), routes });

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    const dots = wrapper.findAll('.home-hero-dot');

    expect(dots).toHaveLength(2);
    expect(dots[0].attributes('aria-current')).toBe('true');

    await dots[1].trigger('click');

    expect(wrapper.findAll('.home-hero-dot')[0].attributes('aria-current')).toBeUndefined();
    expect(wrapper.findAll('.home-hero-dot')[1].attributes('aria-current')).toBe('true');
  });

  it('reduced motion 下不启动自动轮播', async () => {
    vi.useFakeTimers();
    stubReducedMotion(true);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(siteDataFixture) }));
    const router = createRouter({ history: createMemoryHistory(), routes });

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.findAll('.home-hero-dot')[0].attributes('aria-current')).toBe('true');

    vi.advanceTimersByTime(5000);
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.home-hero-dot')[0].attributes('aria-current')).toBe('true');
    expect(wrapper.findAll('.home-hero-dot')[1].attributes('aria-current')).toBeUndefined();
  });

  it('子页面顶部提供返回首页入口', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes });
    router.push('/story');
    await router.isReady();

    const story = mount(StoryView, { global: { plugins: [router] } });
    expect(story.get('.back-home-link').text()).toContain('返回首页');

    const messages = mount(MessagesView, { global: { plugins: [router] } });
    expect(messages.get('.back-home-link').text()).toContain('返回首页');
  });
});
