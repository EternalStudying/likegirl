import { describe, expect, it, vi } from 'vitest';
import { fetchSiteData } from '../src/api/site';
import { mockSiteData } from '../src/mock/siteData';

describe('fetchSiteData', () => {
  it('后端不可用时返回本地 mock 数据', async () => {
    const failingFetch = vi.fn().mockRejectedValue(new Error('network down'));

    await expect(fetchSiteData(failingFetch)).resolves.toEqual(mockSiteData);
  });

  it('后端返回非 2xx 时返回本地 mock 数据', async () => {
    const failingFetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(fetchSiteData(failingFetch)).resolves.toEqual(mockSiteData);
  });

  it('按后端契约读取 personA/personB 和 hero.slogan', async () => {
    const backendPayload = {
      ...mockSiteData,
      couple: {
        personA: '小栀',
        personB: '阿然',
        startDate: '2022-05-20',
        anniversaryDate: '2022-05-20',
        slogan: '把普通日子过成喜欢的样子'
      },
      hero: {
        title: '小栀 & 阿然',
        slogan: '把普通日子过成喜欢的样子'
      }
    };
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(backendPayload)
    });

    await expect(fetchSiteData(fetcher)).resolves.toEqual(backendPayload);
  });
});
