import type { SiteData } from '../types/site';

export const mockSiteData: SiteData = {
  couple: {
    personA: '林也',
    personB: '苏晚',
    startDate: '2024-02-14',
    anniversaryDate: '2024-02-14',
    slogan: '把普通日子收进同一本时间相册。'
  },
  hero: {
    title: '慢慢喜欢你',
    slogan: '把普通日子收进同一本时间相册。'
  },
  memories: [
    {
      id: 1,
      title: '第一次一起看日落',
      date: '2024-03-02',
      content: '海边风很轻，回家的路也变得很短。',
      tags: ['日落', '海边']
    },
    {
      id: 2,
      title: '搬进第一束花',
      date: '2024-08-18',
      content: '餐桌多了一点颜色，晚饭也多了一点期待。',
      tags: ['生活', '花']
    },
    {
      id: 3,
      title: '冬天的热可可',
      date: '2025-12-24',
      content: '在窗边等雪，没有等到雪，但等到了很暖的拥抱。',
      tags: ['冬天', '拥抱']
    }
  ],
  photos: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
      caption: '街角花店',
      date: '2024-05-01'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80',
      caption: '散步到傍晚',
      date: '2024-09-12'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      caption: '周末远行',
      date: '2025-04-06'
    }
  ],
  wishes: [
    { id: 1, title: '一起做一顿完整的晚餐', done: true },
    { id: 2, title: '去看一场海边烟火', done: false },
    { id: 3, title: '每年拍一张同姿势合照', done: false }
  ],
  messages: [
    {
      id: 1,
      nickname: '林也',
      content: '今天也想认真记录你。',
      createdAt: '2026-04-20'
    }
  ]
};
