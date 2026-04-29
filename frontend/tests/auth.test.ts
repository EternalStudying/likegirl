import { describe, expect, it, vi, beforeEach } from 'vitest';
import { login } from '../src/api/auth';
import { clearAuthToken, getAuthToken, setAuthToken } from '../src/auth';
import { fetchSiteData, postMessage } from '../src/api/site';
import { fetchBrowserWeatherAtmosphere, fetchWeatherAtmosphere } from '../src/api/weather';

describe('auth api', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('登录接口按契约提交账号密码并返回 token 与用户', async () => {
    const response = {
      token: 'jwt-token',
      user: { id: 1, username: 'lover', displayName: '小夏' }
    };
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(response)
    });

    await expect(login({ username: 'lover', password: 'secret' }, fetcher)).resolves.toEqual(response);

    expect(fetcher).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'lover', password: 'secret' })
    });
  });

  it('保存、读取和清除本地 token', () => {
    setAuthToken('jwt-token');
    expect(getAuthToken()).toBe('jwt-token');
    expect(localStorage.getItem('likegirl_token')).toBe('jwt-token');

    clearAuthToken();
    expect(getAuthToken()).toBe('');
    expect(localStorage.getItem('likegirl_token')).toBeNull();
  });
});

describe('authenticated site api', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('请求站点数据时附带 Bearer token', async () => {
    setAuthToken('jwt-token');
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ couple: {}, hero: {}, memories: [], photos: [], wishes: [], messages: [] })
    });

    await fetchSiteData(fetcher);

    expect(fetcher).toHaveBeenCalledWith('/api/site', {
      headers: { Authorization: 'Bearer jwt-token' }
    });
  });

  it('提交留言时附带 Bearer token', async () => {
    setAuthToken('jwt-token');
    const fetcher = vi.fn().mockResolvedValue({ ok: true });

    await postMessage({ nickname: '小夏', content: '今天很好' }, fetcher);

    expect(fetcher).toHaveBeenCalledWith('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer jwt-token'
      },
      body: JSON.stringify({ nickname: '小夏', content: '今天很好' })
    });
  });

  it('收到 401 时清除 token 并通知退出', async () => {
    setAuthToken('jwt-token');
    const listener = vi.fn();
    window.addEventListener('likegirl:logout', listener);
    const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 401 });

    await expect(fetchSiteData(fetcher)).rejects.toThrow('登录已过期，请重新登录');

    expect(getAuthToken()).toBe('');
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('likegirl:logout', listener);
  });

  it('请求天气氛围时附带 Bearer token，收到 401 时复用退出逻辑', async () => {
    setAuthToken('jwt-token');
    const listener = vi.fn();
    window.addEventListener('likegirl:logout', listener);
    const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 401 });

    await expect(fetchWeatherAtmosphere(fetcher)).rejects.toThrow('登录已过期，请重新登录');

    expect(fetcher).toHaveBeenCalledWith('/api/weather/atmosphere', {
      headers: { Authorization: 'Bearer jwt-token' }
    });
    expect(getAuthToken()).toBe('');
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('likegirl:logout', listener);
  });

  it('请求浏览器坐标天气时附带 Bearer token', async () => {
    setAuthToken('jwt-token');
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          city: '当前位置',
          country: 'browser',
          temperature: 22,
          weatherType: 'cloudy',
          isDay: true,
          updatedAt: '2026-04-28T10:00:00'
        })
    });

    await fetchBrowserWeatherAtmosphere(30.2741, 120.1551, fetcher);

    expect(fetcher).toHaveBeenCalledWith('/api/weather/atmosphere/browser?latitude=30.2741&longitude=120.1551', {
      headers: { Authorization: 'Bearer jwt-token' }
    });
  });
});
