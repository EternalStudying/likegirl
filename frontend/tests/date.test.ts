import { describe, expect, it } from 'vitest';
import { daysTogether, nextAnniversaryCountdown } from '../src/utils/date';

describe('dates', () => {
  it('计算在一起第 N 天，开始当天为第 1 天', () => {
    expect(daysTogether('2024-02-14', new Date('2024-02-14T10:00:00'))).toBe(1);
    expect(daysTogether('2024-02-14', new Date('2024-02-16T08:00:00'))).toBe(3);
  });

  it('计算下一次纪念日倒计时', () => {
    expect(nextAnniversaryCountdown('2024-02-14', new Date('2026-02-10T00:00:00'))).toEqual({
      date: '2026-02-14',
      days: 4
    });

    expect(nextAnniversaryCountdown('2024-02-14', new Date('2026-02-15T00:00:00'))).toEqual({
      date: '2027-02-14',
      days: 364
    });
  });
});
