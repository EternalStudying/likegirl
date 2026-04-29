import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
// @ts-ignore - Vitest 运行在 Node 环境，项目当前未显式声明 @types/node。
import { readFileSync } from 'node:fs';
// @ts-ignore - 同上。
import { dirname, resolve } from 'node:path';
// @ts-ignore - 同上。
import { fileURLToPath } from 'node:url';
import WeatherAtmosphere from '../src/components/WeatherAtmosphere.vue';

const weatherAtmosphereSource = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '../src/components/WeatherAtmosphere.vue'),
  'utf8'
);
const appSource = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../src/App.vue'), 'utf8');
const homeViewSource = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../src/views/HomeView.vue'), 'utf8');

const layerSelectors = {
  sunny: '.weather-atmosphere__layer--sunny',
  cloudy: '.weather-atmosphere__cloud-layer',
  rain: '.weather-atmosphere__layer--rain',
  snow: '.weather-atmosphere__layer--snow',
  fog: '.weather-atmosphere__layer--fog',
  thunder: '.weather-atmosphere__layer--thunder',
  windy: '.weather-atmosphere__layer--windy',
  night: '.weather-atmosphere__layer--night'
} as const;

let originalGeolocation: Geolocation | undefined;

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  );
}

function stubGeolocationSuccess(latitude: number, longitude: number) {
  const getCurrentPosition = vi.fn((success: PositionCallback) => {
    success({
      coords: {
        latitude,
        longitude,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: Date.now()
    } as GeolocationPosition);
  });

  Object.defineProperty(globalThis.navigator, 'geolocation', {
    configurable: true,
    value: {
      getCurrentPosition,
      clearWatch: vi.fn(),
      watchPosition: vi.fn()
    }
  });

  return getCurrentPosition;
}

function stubGeolocationFailure(errorCode = 1) {
  const getCurrentPosition = vi.fn((_: PositionCallback, reject: PositionErrorCallback) => {
    reject?.({
      code: errorCode,
      message: 'denied',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    } as GeolocationPositionError);
  });

  Object.defineProperty(globalThis.navigator, 'geolocation', {
    configurable: true,
    value: {
      getCurrentPosition,
      clearWatch: vi.fn(),
      watchPosition: vi.fn()
    }
  });

  return getCurrentPosition;
}

function stubWeatherFetch(
  weatherType: string,
  city = 'Hangzhou',
  country = 'browser',
  temperature: number | null = 24
) {
  return vi.fn((input: RequestInfo | URL) => {
    if (String(input) !== '/api/weather/atmosphere/browser?latitude=30.2741&longitude=120.1551') {
      return Promise.reject(new Error(`Unexpected request: ${String(input)}`));
    }

    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          city,
          country,
          temperature,
          weatherType,
          isDay: weatherType !== 'night',
          updatedAt: '2026-04-28T10:00:00'
        })
    });
  }) as unknown as typeof fetch;
}

describe('WeatherAtmosphere', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('likegirl_token', 'jwt-token');
    originalGeolocation = navigator.geolocation;
  });

  afterEach(() => {
    Object.defineProperty(globalThis.navigator, 'geolocation', {
      configurable: true,
      value: originalGeolocation
    });
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each([
    ['sunny', '晴朗'],
    ['cloudy', '多云'],
    ['rain', '雨天'],
    ['snow', '飘雪'],
    ['fog', '薄雾'],
    ['thunder', '远雷'],
    ['windy', '有风'],
    ['night', '夜色']
  ] as const)('根据 weatherType=%s 渲染对应 DOM 原生层', async (weatherType, label) => {
    stubReducedMotion(false);
    stubGeolocationSuccess(30.2741, 120.1551);
    vi.stubGlobal('fetch', stubWeatherFetch(weatherType));

    const wrapper = mount(WeatherAtmosphere);
    await flushPromises();

    expect(wrapper.find('.weather-atmosphere').attributes('data-weather-type')).toBe(weatherType);
    expect(wrapper.find('.weather-atmosphere__stamp').text()).toContain(label);
    expect(wrapper.find(layerSelectors[weatherType]).exists()).toBe(true);
    expect(wrapper.find('.weather-atmosphere__stamp').text()).not.toContain('browser');
  });

  it('cloudy 会渲染至少 5 朵 DOM 云，并且不再使用 canvas 主绘制', async () => {
    stubReducedMotion(false);
    stubGeolocationSuccess(30.2741, 120.1551);
    vi.stubGlobal('fetch', stubWeatherFetch('cloudy'));

    const wrapper = mount(WeatherAtmosphere);
    await flushPromises();

    expect(wrapper.find('.weather-atmosphere__cloud-layer').exists()).toBe(true);
    expect(wrapper.findAll('.weather-cloud').length).toBeGreaterThanOrEqual(5);
    expect(wrapper.find('canvas').exists()).toBe(false);
  });

  it('sunny 光源集中在左上角并显示轻彩虹', async () => {
    stubReducedMotion(false);
    stubGeolocationSuccess(30.2741, 120.1551);
    vi.stubGlobal('fetch', stubWeatherFetch('sunny'));

    const wrapper = mount(WeatherAtmosphere);
    await flushPromises();

    expect(wrapper.find('.weather-light-source').exists()).toBe(true);
    expect(wrapper.find('.weather-light-streak').exists()).toBe(true);
    expect(wrapper.find('.weather-rainbow').exists()).toBe(true);
    expect(wrapper.findAll('.weather-sunbeam').length).toBeGreaterThanOrEqual(5);
    expect(weatherAtmosphereSource).toContain("transform-origin: left top;");
    expect(weatherAtmosphereSource).toContain("linear-gradient(118deg");
    expect(weatherAtmosphereSource).toContain("radial-gradient(ellipse at 50% 100%");
    expect(weatherAtmosphereSource).toContain("mask-image: radial-gradient(ellipse");
    expect(weatherAtmosphereSource).toContain(".weather-rainbow::after");
  });

  it('cloudy/thunder/windy/night 复用同一套云层 class', async () => {
    stubReducedMotion(false);
    stubGeolocationSuccess(30.2741, 120.1551);
    vi.stubGlobal('fetch', stubWeatherFetch('thunder'));

    const wrapper = mount(WeatherAtmosphere);
    await flushPromises();

    expect(wrapper.find('.weather-atmosphere__cloud-layer').exists()).toBe(true);
    expect(wrapper.findAll('.weather-cloud').length).toBeGreaterThan(0);
  });

  it('thunder 在 reduced-motion 下仍保留清晰静态闪电', async () => {
    stubReducedMotion(true);
    stubGeolocationSuccess(30.2741, 120.1551);
    vi.stubGlobal('fetch', stubWeatherFetch('thunder'));

    const wrapper = mount(WeatherAtmosphere);
    await flushPromises();
    const thunderLayer = wrapper.find('.weather-atmosphere__layer--thunder');

    expect(wrapper.find('.weather-atmosphere').classes()).toContain('is-static');
    expect(thunderLayer.exists()).toBe(true);
    expect(thunderLayer.find('.weather-thunder-strike').exists()).toBe(true);
    expect(thunderLayer.find('.weather-thunder-trunk').exists()).toBe(true);
    expect(thunderLayer.findAll('.weather-thunder-branch').length).toBeGreaterThanOrEqual(5);
    expect(thunderLayer.find('.weather-thunder-cloud-mask').exists()).toBe(true);
    expect(weatherAtmosphereSource).toContain('.weather-thunder-cloud-mask::before');
    expect(weatherAtmosphereSource).toContain('.weather-thunder-cloud-mask::after');
    expect(weatherAtmosphereSource).toContain(
      '.weather-atmosphere.is-static .weather-atmosphere__layer--thunder .weather-thunder-strike'
    );
  });

  it('prefers-reduced-motion 下关闭主要动画并保留静态氛围', async () => {
    stubReducedMotion(true);
    stubGeolocationSuccess(30.2741, 120.1551);
    vi.stubGlobal('fetch', stubWeatherFetch('fog'));

    const wrapper = mount(WeatherAtmosphere);
    await flushPromises();

    expect(wrapper.find('.weather-atmosphere').classes()).toContain('is-static');
    expect(wrapper.find('.weather-atmosphere__layer--fog').exists()).toBe(true);
  });

  it('fallback 温度为空时不显示 null°', async () => {
    stubReducedMotion(true);
    stubGeolocationSuccess(30.2741, 120.1551);
    vi.stubGlobal('fetch', stubWeatherFetch('cloudy', 'Hangzhou', 'browser', null));

    const wrapper = mount(WeatherAtmosphere);
    await flushPromises();

    expect(wrapper.find('.weather-atmosphere__temp').text()).toBe('--°');
    expect(wrapper.find('.weather-atmosphere__stamp').text()).not.toContain('null°');
    expect(wrapper.find('.weather-atmosphere__stamp').attributes('title')).not.toContain('null°');
  });

  it('组件加载即调用 geolocation', async () => {
    stubReducedMotion(true);
    const getCurrentPosition = stubGeolocationSuccess(30.2741, 120.1551);
    vi.stubGlobal('fetch', stubWeatherFetch('cloudy'));

    mount(WeatherAtmosphere);
    await flushPromises();

    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(getCurrentPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), { timeout: 6000 });
  });

  it('定位成功后请求坐标接口并展示城市天气', async () => {
    stubReducedMotion(true);
    const getCurrentPosition = stubGeolocationSuccess(30.2741, 120.1551);
    const fetcher = vi.fn((input: RequestInfo | URL) => {
      const url = String(input);

      if (url === '/api/weather/atmosphere/browser?latitude=30.2741&longitude=120.1551') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              city: '杭州市',
              country: 'browser',
              temperature: 21,
              weatherType: 'rain',
              isDay: true,
              updatedAt: '2026-04-28T10:10:00'
            })
        });
      }

      return Promise.reject(new Error(`Unexpected request: ${url}`));
    }) as unknown as typeof fetch;
    vi.stubGlobal('fetch', fetcher);

    const wrapper = mount(WeatherAtmosphere);
    await flushPromises();

    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith('/api/weather/atmosphere/browser?latitude=30.2741&longitude=120.1551', {
      headers: { Authorization: 'Bearer jwt-token' }
    });
    expect(wrapper.find('.weather-atmosphere__stamp').text()).toContain('杭州市');
    expect(wrapper.find('.weather-atmosphere__stamp').text()).toContain('雨天');
    expect(wrapper.find('.weather-atmosphere__stamp').text()).toContain('21°');
  });

  it('定位失败时显示本地 fallback，不请求坐标接口', async () => {
    stubReducedMotion(true);
    const getCurrentPosition = stubGeolocationFailure();
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);

    const wrapper = mount(WeatherAtmosphere);
    await flushPromises();

    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(fetcher).not.toHaveBeenCalled();
    expect(wrapper.find('.weather-atmosphere__stamp').text()).toContain('当前位置');
    expect(wrapper.find('.weather-atmosphere__stamp').text()).toContain('定位未开启');
    expect(wrapper.find('.weather-atmosphere__stamp').text()).toContain('多云');
    expect(wrapper.find('.weather-atmosphere__temp').text()).toBe('--°');
  });

  it('不显示 browser/unknown 技术词', async () => {
    stubReducedMotion(true);
    stubGeolocationSuccess(30.2741, 120.1551);
    vi.stubGlobal('fetch', stubWeatherFetch('cloudy', 'unknown', 'browser', 20));

    const wrapper = mount(WeatherAtmosphere);
    await flushPromises();

    const stampText = wrapper.find('.weather-atmosphere__stamp').text();
    const stampTitle = wrapper.find('.weather-atmosphere__stamp').attributes('title');

    expect(stampText).not.toContain('browser');
    expect(stampText).not.toContain('unknown');
    expect(stampTitle).not.toContain('browser');
    expect(stampTitle).not.toContain('unknown');
    expect(stampText).toContain('当前位置');
    expect(stampText).toContain('多云');
  });

  it('源码使用 DOM 云层与参数化配置，不再以 canvas drawRain/drawSnow/drawFog 为主', () => {
    const cloudyConfigBlock =
      weatherAtmosphereSource.match(/const CLOUDY_CLOUDS: CloudConfig\[] = \[([\s\S]*?)\];/)?.[1] ?? '';

    expect((cloudyConfigBlock.match(/speed:/g) ?? []).length).toBeGreaterThanOrEqual(5);
    expect((cloudyConfigBlock.match(/phase:/g) ?? []).length).toBeGreaterThanOrEqual(5);
    expect(weatherAtmosphereSource).toContain('weather-atmosphere__cloud-layer');
    expect(weatherAtmosphereSource).toContain('weather-rain-line');
    expect(weatherAtmosphereSource).toContain('weather-snowflake');
    expect(weatherAtmosphereSource).toContain('weather-fog-band');
    expect(weatherAtmosphereSource).not.toContain('<canvas');
    expect(weatherAtmosphereSource).not.toContain('function drawRain(');
    expect(weatherAtmosphereSource).not.toContain('function drawSnow(');
    expect(weatherAtmosphereSource).not.toContain('function drawFog(');
  });

  it('登录后全站环境层由 App 挂载，首页不重复挂载', () => {
    expect(appSource).toContain("import WeatherAtmosphere from './components/WeatherAtmosphere.vue';");
    expect(appSource).toMatch(
      /<template v-if="isLoggedIn">\s*<WeatherAtmosphere\s*\/>\s*<AppTopBar\s*\/>\s*<RouterView\s*\/>\s*<\/template>/
    );
    expect(homeViewSource).not.toContain('WeatherAtmosphere');
    expect(homeViewSource).not.toContain('<WeatherAtmosphere');
  });

  it('天气根层固定全屏在最顶层且不拦截交互', () => {
    const rootBlock = weatherAtmosphereSource.match(/\.weather-atmosphere\s*{([\s\S]*?)\n}/)?.[1] ?? '';

    expect(rootBlock).toContain('position: fixed;');
    expect(rootBlock).toContain('inset: 0;');
    expect(rootBlock).toContain('z-index: 2147483647;');
    expect(rootBlock).toContain('pointer-events: none;');
  });
});
