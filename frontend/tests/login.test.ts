import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import App from '../src/App.vue';
import LoginView from '../src/views/LoginView.vue';
import { routes } from '../src/router';
import { siteDataFixture } from './siteData.fixture';

const userProfile = {
  id: 1,
  username: 'lover',
  displayName: '小夏',
  avatarUrl: '',
  bio: '喜欢收集日落',
  mood: '今天也想见你',
  updatedAt: '2026-04-27T10:00:00Z'
};

function mockAppFetch() {
  return vi.fn((input: RequestInfo | URL) => {
    const url = String(input);

    if (url === '/api/auth/login') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            token: 'jwt-token',
            user: { id: 1, username: 'lover', displayName: '小夏' }
          })
      });
    }

    if (url === '/api/auth/me') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(userProfile) });
    }

    if (url === '/api/site') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(siteDataFixture) });
    }

    return Promise.reject(new Error(`Unexpected request: ${url}`));
  }) as unknown as typeof fetch;
}

async function mountApp(path = '/') {
  const router = createRouter({ history: createMemoryHistory(), routes });
  router.push(path);
  await router.isReady();
  return {
    router,
    wrapper: mount(App, { global: { plugins: [router] } })
  };
}

describe('LoginView', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('账号或密码为空时提示校验错误且不提交', async () => {
    const onLogin = vi.fn();
    const wrapper = mount(LoginView, {
      props: { onLogin }
    });

    await wrapper.get('form').trigger('submit.prevent');

    expect(wrapper.text()).toContain('请输入账号和密码');
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('提交时显示 loading，失败后显示错误', async () => {
    let rejectLogin!: (error: Error) => void;
    const onLogin = vi.fn(
      () =>
        new Promise<void>((_resolve, reject) => {
          rejectLogin = reject;
        })
    );
    const wrapper = mount(LoginView, {
      props: { onLogin }
    });

    await wrapper.get('input[name="username"]').setValue('lover');
    await wrapper.get('input[name="password"]').setValue('wrong');
    await wrapper.get('form').trigger('submit.prevent');

    expect(wrapper.get('button[type="submit"]').text()).toBe('进入中...');
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined();

    rejectLogin(new Error('账号或密码错误'));
    await flushPromises();

    expect(wrapper.text()).toContain('账号或密码错误');
    expect(wrapper.get('button[type="submit"]').text()).toBe('进入时间线');
  });
});

describe('App auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('未登录时只显示登录页', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createRouter({ history: createMemoryHistory(), routes })]
      }
    });

    expect(wrapper.find('form.login-form').exists()).toBe(true);
    expect(wrapper.find('.hero').exists()).toBe(false);
    expect(wrapper.find('.app-topbar').exists()).toBe(false);
  });

  it('登录成功后写入 localStorage 并进入首页', async () => {
    vi.stubGlobal('fetch', mockAppFetch());

    const { wrapper } = await mountApp();
    await wrapper.get('input[name="username"]').setValue('lover');
    await wrapper.get('input[name="password"]').setValue('secret');
    await wrapper.get('form').trigger('submit.prevent');
    await flushPromises();

    expect(localStorage.getItem('likegirl_token')).toBe('jwt-token');
    expect(wrapper.find('.home-hero-carousel').exists()).toBe(true);
    expect(wrapper.find('form.login-form').exists()).toBe(false);
  });

  it('从子页面登录后回到首页入口', async () => {
    vi.stubGlobal('fetch', mockAppFetch());

    const { router, wrapper } = await mountApp('/messages');
    await wrapper.get('input[name="username"]').setValue('lover');
    await wrapper.get('input[name="password"]').setValue('secret');
    await wrapper.get('form').trigger('submit.prevent');
    await flushPromises();
    await flushPromises();

    expect(router.currentRoute.value.path).toBe('/');
    expect(wrapper.find('.daily-dashboard').exists()).toBe(true);
    expect(wrapper.find('.directory-grid').exists()).toBe(false);
  });

  it('登录后渲染全局顶栏且不再显示用户入口', async () => {
    localStorage.setItem('likegirl_token', 'jwt-token');
    vi.stubGlobal('fetch', mockAppFetch());

    const { wrapper } = await mountApp();
    await flushPromises();

    const topbar = wrapper.get('.app-topbar');

    expect(topbar.text()).toContain('LG Demo');
    expect(topbar.find('.app-topbar__user').exists()).toBe(false);
    expect(topbar.find('a[href="/user"]').exists()).toBe(false);
  });

  it('401 退出事件会清除 token 并回到登录页', async () => {
    localStorage.setItem('likegirl_token', 'expired-token');
    vi.stubGlobal('fetch', mockAppFetch());
    const { wrapper } = await mountApp();

    window.dispatchEvent(new CustomEvent('likegirl:logout'));
    await wrapper.vm.$nextTick();

    expect(localStorage.getItem('likegirl_token')).toBeNull();
    expect(wrapper.find('form.login-form').exists()).toBe(true);
  });
});
