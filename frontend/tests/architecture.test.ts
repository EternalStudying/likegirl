import { describe, expect, it } from 'vitest';
import HomeView from '../src/views/HomeView.vue';
import router from '../src/router';
import { daysTogether } from '../src/utils/date';

describe('frontend architecture', () => {
  it('使用 views、utils、types 分层组织首页代码', () => {
    expect(HomeView).toBeTruthy();
    expect(daysTogether('2024-02-14', new Date('2024-02-14T10:00:00'))).toBe(1);
  });

  it('配置首页入口和五个独立模块路由', () => {
    expect(router.getRoutes().map((route) => route.path).sort()).toEqual([
      '/',
      '/about',
      '/album',
      '/messages',
      '/story',
      '/user',
      '/wishes'
    ]);
  });
});
