import { describe, expect, it, vi } from 'vitest';
import { fetchSiteData } from '../src/api/site';
import { siteDataFixture } from './siteData.fixture';

describe('fetchSiteData', () => {
  it('后端不可用时不再返回本地数据', async () => {
    const failingFetch = vi.fn().mockRejectedValue(new Error('network down'));

    await expect(fetchSiteData(failingFetch)).rejects.toThrow('站点数据加载失败');
  });

  it('后端返回非 2xx 时不再返回本地数据', async () => {
    const failingFetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    await expect(fetchSiteData(failingFetch)).rejects.toThrow('站点数据加载失败');
  });

  it('按后端契约读取 personA/personB 和 hero.slogan', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(siteDataFixture)
    });

    await expect(fetchSiteData(fetcher)).resolves.toEqual(siteDataFixture);
  });
});
