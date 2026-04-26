import { describe, expect, it } from 'vitest';
import HomeView from '../src/views/HomeView.vue';
import { daysTogether } from '../src/utils/date';
import { mockSiteData } from '../src/mock/siteData';
import type { SiteData } from '../src/types/site';

describe('frontend architecture', () => {
  it('使用 views、utils、types 分层组织首页代码', () => {
    const data: SiteData = mockSiteData;

    expect(HomeView).toBeTruthy();
    expect(daysTogether(data.couple.startDate, new Date('2024-02-14T10:00:00'))).toBe(1);
  });
});
