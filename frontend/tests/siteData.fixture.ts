import type { SiteData } from '../src/types/site';

export const siteDataFixture: SiteData = {
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
  },
  memories: [
    {
      id: 1,
      title: '第一次看海',
      date: '2022-08-06',
      content: '傍晚的海风很温柔，我们走了很久。',
      tags: ['旅行', '海边']
    }
  ],
  photos: [
    {
      id: 1,
      url: 'https://example.com/photo.jpg',
      caption: '牵手散步',
      date: '2023-06-01'
    }
  ],
  wishes: [{ id: 1, title: '一起去看一次日出', done: false }],
  messages: [{ id: 1, nickname: '小栀', content: '今天也很好。', createdAt: '2026-04-27' }]
};
