import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import UserView from '../src/views/UserView.vue';
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
let mountedWrapper: { unmount: () => void } | null = null;

function createTestRouter(path = '/') {
  const router = createRouter({ history: createMemoryHistory(), routes });
  router.push(path);
  return router;
}

function mockUserAndSiteFetch(options: { failUpdate?: boolean } = {}) {
  return vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url === '/api/auth/me' && init?.method === 'PUT') {
      if (options.failUpdate) {
        return Promise.resolve({ ok: false, status: 500 });
      }

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            ...userProfile,
            displayName: JSON.parse(String(init.body)).displayName,
            bio: JSON.parse(String(init.body)).bio,
            mood: JSON.parse(String(init.body)).mood
          })
      });
    }

    if (url === '/api/auth/me/avatar') {
      return Promise.resolve({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ status: 503, message: 'MinIO is not configured' })
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

async function mountUserView(fetcher = mockUserAndSiteFetch()) {
  vi.stubGlobal('fetch', fetcher);
  const router = createTestRouter('/user');
  await router.isReady();
  const host = document.createElement('div');
  document.body.appendChild(host);

  const wrapper = mount(UserView, { attachTo: host, global: { plugins: [router] } });
  mountedWrapper = wrapper;
  await flushPromises();

  return { wrapper, fetcher };
}

async function openProfileModal(wrapper: { get: (selector: string) => { trigger: (event: string) => Promise<void> } }) {
  await wrapper.get('.profile-edit-toggle').trigger('click');
  await flushPromises();

  const dialog = document.body.querySelector('.profile-edit-dialog') as HTMLElement | null;
  expect(dialog).toBeTruthy();
  return dialog as HTMLElement;
}

describe('用户资料页面', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    localStorage.setItem('likegirl_token', 'jwt-token');
    vi.restoreAllMocks();
  });

  afterEach(() => {
    mountedWrapper?.unmount();
    mountedWrapper = null;
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('路由包含 /user', async () => {
    const router = createTestRouter('/user');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/user');
    expect(routes.some((route) => route.path === '/user')).toBe(true);
  });

  it('用户页默认只渲染顶部个人封面，不常驻下方卡片', async () => {
    const { wrapper } = await mountUserView();

    expect(wrapper.get('.user-profile-page').text()).toContain('小夏');
    expect(wrapper.get('.user-profile-page').text()).toContain('@lover');
    expect(wrapper.get('.user-profile-page').text()).toContain('今天也想见你');
    expect(wrapper.get('.user-profile-page').text()).toContain('喜欢收集日落');
    expect(wrapper.find('.generated-avatar').exists()).toBe(true);
    expect(wrapper.find('form.user-edit-form').exists()).toBe(false);
    expect(document.body.querySelector('.profile-edit-modal')).toBeNull();
    expect(wrapper.find('.user-memory-card').exists()).toBe(false);
    expect(wrapper.findAll('.user-quick-link')).toHaveLength(0);
  });

  it('点击编辑资料后打开居中 modal 并提供可访问性语义', async () => {
    const { wrapper } = await mountUserView();

    const dialog = await openProfileModal(wrapper);

    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('profile-edit-title');
    expect(dialog.querySelector('input[name="displayName"]')?.getAttribute('autocomplete')).toBe('name');
    expect(document.activeElement).toBe(dialog.querySelector('input[name="displayName"]'));
    expect(wrapper.find('.user-cover__copy .user-edit-panel').exists()).toBe(false);
  });

  it('modal 保存资料后调用更新接口、更新顶部展示并关闭', async () => {
    const { wrapper, fetcher } = await mountUserView();
    const dialog = await openProfileModal(wrapper);

    (dialog.querySelector('input[name="displayName"]') as HTMLInputElement).value = '小夏同学';
    dialog.querySelector('input[name="displayName"]')?.dispatchEvent(new Event('input', { bubbles: true }));
    (dialog.querySelector('textarea[name="bio"]') as HTMLTextAreaElement).value = '新的手账简介';
    dialog.querySelector('textarea[name="bio"]')?.dispatchEvent(new Event('input', { bubbles: true }));
    (dialog.querySelector('input[name="mood"]') as HTMLInputElement).value = '保存完成';
    dialog.querySelector('input[name="mood"]')?.dispatchEvent(new Event('input', { bubbles: true }));
    dialog.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await flushPromises();

    expect(fetcher).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ displayName: '小夏同学', bio: '新的手账简介', mood: '保存完成' })
      })
    );
    expect(wrapper.get('.user-cover').text()).toContain('小夏同学');
    expect(wrapper.get('.user-cover').text()).toContain('保存完成');
    expect(wrapper.get('.user-cover').text()).toContain('新的手账简介');
    expect(document.body.querySelector('.profile-edit-modal')).toBeNull();
  });

  it('取消按钮可以关闭 modal', async () => {
    const { wrapper } = await mountUserView();

    const dialog = await openProfileModal(wrapper);
    dialog.querySelector('.profile-edit-cancel')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushPromises();
    expect(document.body.querySelector('.profile-edit-modal')).toBeNull();
  });

  it('点击遮罩可以关闭 modal', async () => {
    const { wrapper } = await mountUserView();

    await openProfileModal(wrapper);
    document.body.querySelector('.profile-edit-modal')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushPromises();
    expect(document.body.querySelector('.profile-edit-modal')).toBeNull();
  });

  it('关闭按钮可以关闭 modal', async () => {
    const { wrapper } = await mountUserView();

    const dialog = await openProfileModal(wrapper);
    dialog.querySelector('.profile-edit-close')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushPromises();
    expect(document.body.querySelector('.profile-edit-modal')).toBeNull();
  });

  it('Esc 可以关闭 modal 并把焦点还给编辑资料按钮', async () => {
    const { wrapper } = await mountUserView();

    await openProfileModal(wrapper);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await flushPromises();
    expect(document.body.querySelector('.profile-edit-modal')).toBeNull();
    expect(document.activeElement).toBe(wrapper.get('.profile-edit-toggle').element);
  });

  it('保存失败时在 modal 内显示 alert 错误且不影响页面主体', async () => {
    const { wrapper } = await mountUserView(mockUserAndSiteFetch({ failUpdate: true }));
    const dialog = await openProfileModal(wrapper);

    dialog.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await flushPromises();

    const alert = document.body.querySelector('.profile-edit-dialog .form-error');
    expect(alert?.getAttribute('role')).toBe('alert');
    expect(alert?.textContent).toContain('资料保存失败');
    expect(document.body.querySelector('.profile-edit-modal')).toBeTruthy();
    expect(wrapper.find('.user-cover').exists()).toBe(true);
  });

  it('头像上传失败时显示后端错误且不影响资料弹窗', async () => {
    const { wrapper } = await mountUserView();

    const input = wrapper.get('input[type="file"]');
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
    await input.trigger('change');
    await flushPromises();

    expect(wrapper.text()).toContain('MinIO is not configured');
    expect(wrapper.get('.form-error').attributes('role')).toBe('alert');
    expect(document.body.querySelector('.profile-edit-modal')).toBeNull();
    expect(wrapper.find('.user-cover').exists()).toBe(true);
  });
});
