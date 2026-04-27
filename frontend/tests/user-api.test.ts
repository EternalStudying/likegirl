import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentUser, updateCurrentUser, uploadAvatar } from '../src/api/user';
import { getAuthToken, setAuthToken } from '../src/auth';

const userProfile = {
  id: 1,
  username: 'lover',
  displayName: '小夏',
  avatarUrl: '/avatar.jpg',
  bio: '喜欢收集日落',
  mood: '今天也想见你',
  updatedAt: '2026-04-27T10:00:00Z'
};

describe('current user api', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('获取当前用户时附带 Bearer token', async () => {
    setAuthToken('jwt-token');
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(userProfile)
    });

    await expect(getCurrentUser(fetcher)).resolves.toEqual(userProfile);

    expect(fetcher).toHaveBeenCalledWith('/api/auth/me', {
      headers: { Authorization: 'Bearer jwt-token' }
    });
  });

  it('更新资料时按契约提交 displayName、bio、mood', async () => {
    setAuthToken('jwt-token');
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...userProfile, mood: '刚刚保存好' })
    });

    await updateCurrentUser({ displayName: '小夏', bio: '新的简介', mood: '刚刚保存好' }, fetcher);

    expect(fetcher).toHaveBeenCalledWith('/api/auth/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer jwt-token'
      },
      body: JSON.stringify({ displayName: '小夏', bio: '新的简介', mood: '刚刚保存好' })
    });
  });

  it('上传头像时使用 multipart form-data 且不手动设置 Content-Type', async () => {
    setAuthToken('jwt-token');
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(userProfile)
    });

    await uploadAvatar(file, fetcher);

    const [, options] = fetcher.mock.calls[0];
    expect(fetcher).toHaveBeenCalledWith(
      '/api/auth/me/avatar',
      expect.objectContaining({
        method: 'POST',
        headers: { Authorization: 'Bearer jwt-token' }
      })
    );
    expect(options.body).toBeInstanceOf(FormData);
    expect(options.body.get('file')).toBe(file);
  });

  it('上传头像失败时优先抛出后端 message 或 error', async () => {
    setAuthToken('jwt-token');
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ status: 503, message: 'MinIO is not configured' })
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: '对象存储服务不可用' })
      });

    await expect(uploadAvatar(file, fetcher)).rejects.toThrow('MinIO is not configured');
    await expect(uploadAvatar(file, fetcher)).rejects.toThrow('对象存储服务不可用');
  });

  it('当前用户接口收到 401 时清除 token 并通知退出', async () => {
    setAuthToken('jwt-token');
    const listener = vi.fn();
    window.addEventListener('likegirl:logout', listener);
    const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 401 });

    await expect(getCurrentUser(fetcher)).rejects.toThrow('登录已过期，请重新登录');

    expect(getAuthToken()).toBe('');
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('likegirl:logout', listener);
  });
});
