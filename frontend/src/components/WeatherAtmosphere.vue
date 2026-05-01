<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchBrowserWeatherAtmosphere } from '../api/weather';
import type { WeatherAtmosphereData, WeatherType } from '../types/weather';

type CloudConfig = {
  x: number;
  y: number;
  w: number;
  h: number;
  alpha: number;
  speed: number;
  phase: number;
  drift: number;
};

const CLOUDY_CLOUDS: CloudConfig[] = [
  { x: 0.1, y: 0.08, w: 340, h: 144, alpha: 0.62, speed: 16, phase: 0.2, drift: 1.2 },
  { x: 0.28, y: 0.06, w: 372, h: 156, alpha: 0.7, speed: 19, phase: 1.1, drift: 0.8 },
  { x: 0.52, y: 0.15, w: 334, h: 142, alpha: 0.64, speed: 17, phase: 2.2, drift: 1.1 },
  { x: 0.76, y: 0.11, w: 306, h: 132, alpha: 0.58, speed: 14, phase: 3.1, drift: 0.9 },
  { x: 0.04, y: 0.36, w: 404, h: 164, alpha: 0.56, speed: 12, phase: 4.4, drift: 1.3 },
  { x: 0.34, y: 0.32, w: 382, h: 154, alpha: 0.61, speed: 15, phase: 5.2, drift: 1 },
  { x: 0.7, y: 0.42, w: 352, h: 146, alpha: 0.57, speed: 13, phase: 6.3, drift: 1.15 }
];

const SUNBEAMS = [
  { left: '-21%', top: '-24%', width: '7vw', height: '132vh', rotate: '-54deg', duration: 17, delay: '-1.2s', opacity: 0.5 },
  { left: '-16%', top: '-25%', width: '9vw', height: '144vh', rotate: '-48deg', duration: 19, delay: '-4.4s', opacity: 0.44 },
  { left: '-10%', top: '-24%', width: '10vw', height: '150vh', rotate: '-42deg', duration: 15, delay: '-6.2s', opacity: 0.36 },
  { left: '-4%', top: '-22%', width: '8vw', height: '140vh', rotate: '-36deg', duration: 20, delay: '-2.6s', opacity: 0.3 },
  { left: '2%', top: '-21%', width: '7vw', height: '130vh', rotate: '-31deg', duration: 16, delay: '-8.1s', opacity: 0.24 }
];

const MOTES = Array.from({ length: 24 }, (_, index) => ({
  left: `${5 + (index * 4.7) % 72}%`,
  top: `${8 + (index * 6.4) % 58}%`,
  size: 2 + (index % 5) * 1.4,
  duration: 6.4 + (index % 5) * 1.2,
  delay: `-${index * 0.58}s`,
  opacity: 0.24 + (index % 4) * 0.07
}));

const RAIN_LINES = Array.from({ length: 72 }, (_, index) => ({
  left: `${(index * 2.35) % 108 - 4}%`,
  height: `${86 + (index % 6) * 16}px`,
  duration: 0.72 + (index % 7) * 0.08,
  delay: `-${index * 0.14}s`,
  opacity: 0.18 + (index % 6) * 0.055,
  slant: `${index % 4}deg`,
  scale: index % 3 === 0 ? 'far' : index % 3 === 1 ? 'mid' : 'near'
}));

const RAIN_TRAILS = Array.from({ length: 12 }, (_, index) => ({
  left: `${4 + index * 8.6}%`,
  duration: 3.8 + index * 0.18,
  delay: `-${index * 0.36}s`
}));

const SNOW_FLAKES = Array.from({ length: 32 }, (_, index) => ({
  left: `${(index * 7.1) % 104 - 2}%`,
  size: 10 + (index % 5) * 3,
  duration: 7 + (index % 6) * 1.25,
  spinDuration: 10 + (index % 7) * 1.4,
  spinTurn: index % 2 === 0 ? '1turn' : '-1turn',
  delay: `-${index * 0.52}s`,
  depth: index % 3 === 0 ? 'far' : index % 3 === 1 ? 'mid' : 'near'
}));

const FOG_BANDS = Array.from({ length: 10 }, (_, index) => ({
  left: `${-18 + (index % 4) * 8}vw`,
  top: `${8 + (index * 8.4) % 78}%`,
  width: `${76 + (index % 5) * 10}vw`,
  height: `${56 + (index % 4) * 14}px`,
  duration: 14 + (index % 6) * 1.8,
  delay: `-${index * 1.35}s`,
  opacity: 0.15 + (index % 4) * 0.035,
  blur: `${10 + (index % 5) * 2}px`,
  depth: index % 3 === 0 ? 'far' : index % 3 === 1 ? 'mid' : 'near'
}));

const THUNDER_FLASHES = [
  { delay: '-1.1s', duration: 7.2 },
  { delay: '-4.8s', duration: 8.6 }
];

const WIND_LINES = Array.from({ length: 14 }, (_, index) => ({
  top: `${14 + (index % 7) * 8}%`,
  left: `${(index * 9) % 86}%`,
  width: `${72 + (index % 4) * 20}px`,
  duration: 4.6 + (index % 5) * 0.45,
  delay: `-${index * 0.38}s`
}));

const WIND_GUSTS = Array.from({ length: 9 }, (_, index) => ({
  top: `${10 + (index * 9.2) % 72}%`,
  left: `${-42 + (index % 3) * 4}vw`,
  width: `${380 + (index % 4) * 92}px`,
  height: `${54 + (index % 3) * 16}px`,
  duration: 7.6 + (index % 5) * 0.72,
  delay: `-${index * 0.82}s`,
  opacity: 0.23 + (index % 3) * 0.08,
  depth: index % 3 === 0 ? 'far' : index % 3 === 1 ? 'mid' : 'near',
  bend: `${-4 + (index % 5) * 2}deg`
}));

const WIND_SCRAPS = Array.from({ length: 12 }, (_, index) => ({
  top: `${18 + (index % 6) * 11}%`,
  left: `${(index * 8.2) % 92}%`,
  size: 8 + (index % 3) * 5,
  rotate: `${-18 + (index % 5) * 9}deg`,
  duration: 4.2 + (index % 4) * 0.4,
  delay: `-${index * 0.44}s`
}));

const FIREFLIES = Array.from({ length: 18 }, (_, index) => ({
  left: `${8 + (index * 4.9) % 86}%`,
  top: `${16 + (index * 6.8) % 52}%`,
  size: 4 + (index % 3) * 2,
  duration: 3.6 + (index % 5) * 0.6,
  delay: `-${index * 0.52}s`
}));

const LANTERN_GLOWS = [
  { left: '14%', top: '18%', size: '180px', duration: '5.6s', delay: '-1.2s' },
  { left: '78%', top: '28%', size: '164px', duration: '6.4s', delay: '-3.8s' }
];

const weather = ref<WeatherAtmosphereData | null>(null);
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const weatherNames: Record<WeatherType, string> = {
  sunny: '晴朗',
  cloudy: '多云',
  rain: '雨天',
  snow: '飘雪',
  fog: '薄雾',
  thunder: '远雷',
  windy: '有风',
  night: '夜色'
};

const normalizedWeatherType = computed<WeatherType>(() => normalizeWeatherType(weather.value?.weatherType));
const showCloudLayer = computed(() =>
  ['cloudy', 'thunder', 'windy', 'night'].includes(normalizedWeatherType.value)
);

const cloudVariant = computed(() => {
  switch (normalizedWeatherType.value) {
    case 'thunder':
      return 'storm';
    case 'windy':
      return 'windy';
    case 'night':
      return 'night';
    default:
      return 'cloudy';
  }
});

const cloudConfigs = computed(() => {
  switch (normalizedWeatherType.value) {
    case 'thunder':
      return CLOUDY_CLOUDS.slice(0, 5).map((cloud) => ({
        ...cloud,
        alpha: cloud.alpha * 0.86,
        speed: cloud.speed * 0.88
      }));
    case 'windy':
      return CLOUDY_CLOUDS.slice(0, 4).map((cloud) => ({
        ...cloud,
        alpha: cloud.alpha * 0.72,
        speed: cloud.speed * 1.18
      }));
    case 'night':
      return CLOUDY_CLOUDS.slice(0, 3).map((cloud) => ({
        ...cloud,
        alpha: cloud.alpha * 0.46,
        speed: cloud.speed * 0.78
      }));
    case 'cloudy':
    default:
      return CLOUDY_CLOUDS;
  }
});

function normalizeWeatherType(type: string | undefined): WeatherType {
  if (!type) {
    return 'cloudy';
  }

  return type in weatherNames ? (type as WeatherType) : 'cloudy';
}

function getCloudStyle(cloud: CloudConfig, index: number) {
  const duration = Math.max(10, Math.round(cloud.speed * 0.8));

  return {
    '--cloud-left': `${-cloud.w - 80 - index * 44}px`,
    '--cloud-top': `${cloud.y * 100}vh`,
    '--cloud-width': `${cloud.w}px`,
    '--cloud-height': `${cloud.h}px`,
    '--cloud-opacity': `${cloud.alpha}`,
    '--cloud-speed': `${duration}s`,
    '--cloud-delay': `${-cloud.phase * 2.8}s`,
    '--cloud-distance': `calc(100vw + ${cloud.w + 220 + index * 18}px)`,
    '--cloud-drift-y': `${cloud.drift}vh`
  };
}

async function loadWeather() {
  const coords = await getBrowserCoordinates();

  if (!coords) {
    weather.value = createLocalFallbackWeather();
    return;
  }

  try {
    weather.value = await fetchBrowserWeatherAtmosphere(coords.latitude, coords.longitude);
  } catch {
    weather.value = createLocalFallbackWeather();
  }
}

function getBrowserCoordinates(): Promise<{ latitude: number; longitude: number } | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation?.getCurrentPosition) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => resolve(null),
      { timeout: 6000 }
    );
  });
}

function createLocalFallbackWeather(): WeatherAtmosphereData {
  return {
    city: '当前位置',
    country: '定位未开启',
    temperature: null,
    weatherType: 'cloudy',
    isDay: true,
    updatedAt: new Date().toISOString()
  };
}

onMounted(loadWeather);
</script>

<template>
  <div v-if="weather" class="weather-atmosphere" :class="{ 'is-static': prefersReducedMotion }"
    :data-weather-type="normalizedWeatherType" :data-daytime="weather.isDay ? 'day' : 'night'">
    <div v-if="normalizedWeatherType === 'sunny'" class="weather-atmosphere__layer weather-atmosphere__layer--sunny"
      aria-hidden="true">
      <span class="weather-sunwarmth"></span>
      <span class="weather-light-source"></span>
      <span class="weather-light-streak"></span>
      <span class="weather-rainbow"></span>
      <span v-for="(beam, index) in SUNBEAMS" :key="`sunbeam-${index}`" class="weather-sunbeam" :style="{
        '--beam-left': beam.left,
        '--beam-top': beam.top,
        '--beam-width': beam.width,
        '--beam-height': beam.height,
        '--beam-rotate': beam.rotate,
        '--beam-duration': `${beam.duration}s`,
        '--beam-delay': beam.delay,
        '--beam-opacity': `${beam.opacity}`
      }"></span>
      <span class="weather-sunwash"></span>
      <span v-for="(mote, index) in MOTES" :key="`mote-${index}`" class="weather-mote" :style="{
        '--mote-left': mote.left,
        '--mote-top': mote.top,
        '--mote-size': `${mote.size}px`,
        '--mote-duration': `${mote.duration}s`,
        '--mote-delay': mote.delay,
        '--mote-opacity': `${mote.opacity}`
      }"></span>
    </div>

    <div v-if="showCloudLayer" class="weather-atmosphere__layer weather-atmosphere__cloud-layer" aria-hidden="true">
      <span v-for="(cloud, index) in cloudConfigs" :key="`${cloud.phase}-${cloud.speed}-${index}`" class="weather-cloud"
        :class="`weather-cloud--${cloudVariant}`" :style="getCloudStyle(cloud, index)">
        <span class="weather-cloud__body"></span>
        <span class="weather-cloud__puff weather-cloud__puff--a"></span>
        <span class="weather-cloud__puff weather-cloud__puff--b"></span>
        <span class="weather-cloud__puff weather-cloud__puff--c"></span>
        <span class="weather-cloud__puff weather-cloud__puff--d"></span>
      </span>
    </div>

    <div v-if="normalizedWeatherType === 'rain'" class="weather-atmosphere__layer weather-atmosphere__layer--rain"
      aria-hidden="true">
      <span v-for="(line, index) in RAIN_LINES" :key="`rain-line-${index}`" class="weather-rain-line"
        :class="`weather-rain-line--${line.scale}`" :style="{
          '--rain-left': line.left,
          '--rain-height': line.height,
          '--rain-duration': `${line.duration}s`,
          '--rain-delay': line.delay,
          '--rain-opacity': `${line.opacity}`,
          '--rain-slant': line.slant
        }"></span>
      <span v-for="(trail, index) in RAIN_TRAILS" :key="`rain-trail-${index}`" class="weather-rain-trail" :style="{
        '--trail-left': trail.left,
        '--trail-duration': `${trail.duration}s`,
        '--trail-delay': trail.delay
      }"></span>
    </div>

    <div v-if="normalizedWeatherType === 'snow'" class="weather-atmosphere__layer weather-atmosphere__layer--snow"
      aria-hidden="true">
      <span class="weather-frost"></span>
      <span v-for="(flake, index) in SNOW_FLAKES" :key="`flake-${index}`" class="weather-snowflake"
        :class="`weather-snowflake--${flake.depth}`" :style="{
          '--flake-left': flake.left,
          '--flake-size': `${flake.size}px`,
          '--flake-duration': `${flake.duration}s`,
          '--flake-spin-duration': `${flake.spinDuration}s`,
          '--flake-spin-turn': flake.spinTurn,
          '--flake-delay': flake.delay
        }">
        <span class="weather-snowflake__shape"></span>
      </span>
    </div>

    <div v-if="normalizedWeatherType === 'fog'" class="weather-atmosphere__layer weather-atmosphere__layer--fog"
      aria-hidden="true">
      <span class="weather-fog-wash"></span>
      <span class="weather-fog-depth"></span>
      <span class="weather-fog-side-veil weather-fog-side-veil--left"></span>
      <span class="weather-fog-side-veil weather-fog-side-veil--right"></span>
      <span v-for="(band, index) in FOG_BANDS" :key="`fog-${index}`" class="weather-fog-band"
        :class="`weather-fog-band--${band.depth}`" :style="{
        '--fog-left': band.left,
        '--fog-top': band.top,
        '--fog-width': band.width,
        '--fog-height': band.height,
        '--fog-duration': `${band.duration}s`,
        '--fog-delay': band.delay,
        '--fog-opacity': `${band.opacity}`,
        '--fog-blur': band.blur
      }"></span>
      <span class="weather-fog-near-veil"></span>
    </div>

    <div v-if="normalizedWeatherType === 'thunder'" class="weather-atmosphere__layer weather-atmosphere__layer--thunder"
      aria-hidden="true">
      <span v-for="(flash, index) in THUNDER_FLASHES" :key="`flash-${index}`" class="weather-thunder-flash" :style="{
        '--flash-delay': flash.delay,
        '--flash-duration': `${flash.duration}s`
      }"></span>
      <span class="weather-thunder-mist"></span>
      <span class="weather-thunder-strike">
        <span class="weather-thunder-trunk"></span>
        <span class="weather-thunder-branch weather-thunder-branch--left-a"></span>
        <span class="weather-thunder-branch weather-thunder-branch--right-a"></span>
        <span class="weather-thunder-branch weather-thunder-branch--left-b"></span>
        <span class="weather-thunder-branch weather-thunder-branch--right-b"></span>
        <span class="weather-thunder-branch weather-thunder-branch--left-c"></span>
        <span class="weather-thunder-branch weather-thunder-branch--right-c"></span>
      </span>
      <span class="weather-thunder-cloud-mask"></span>
    </div>

    <div v-if="normalizedWeatherType === 'windy'" class="weather-atmosphere__layer weather-atmosphere__layer--windy"
      aria-hidden="true">
      <span v-for="(gust, index) in WIND_GUSTS" :key="`wind-gust-${index}`" class="weather-wind-gust"
        :class="`weather-wind-gust--${gust.depth}`" :style="{
          '--gust-left': gust.left,
          '--gust-top': gust.top,
          '--gust-width': gust.width,
          '--gust-height': gust.height,
          '--gust-duration': `${gust.duration}s`,
          '--gust-delay': gust.delay,
          '--gust-opacity': `${gust.opacity}`,
          '--gust-bend': gust.bend
        }"></span>
      <span v-for="(line, index) in WIND_LINES" :key="`wind-line-${index}`" class="weather-wind-line" :style="{
        '--wind-left': line.left,
        '--wind-top': line.top,
        '--wind-width': line.width,
        '--wind-duration': `${line.duration}s`,
        '--wind-delay': line.delay
      }"></span>
      <span v-for="(scrap, index) in WIND_SCRAPS" :key="`scrap-${index}`" class="weather-wind-scrap" :style="{
        '--scrap-left': scrap.left,
        '--scrap-top': scrap.top,
        '--scrap-size': `${scrap.size}px`,
        '--scrap-rotate': scrap.rotate,
        '--scrap-duration': `${scrap.duration}s`,
        '--scrap-delay': scrap.delay
      }"></span>
    </div>

    <div v-if="normalizedWeatherType === 'night'" class="weather-atmosphere__layer weather-atmosphere__layer--night"
      aria-hidden="true">
      <span class="weather-night-veil"></span>
      <span v-for="(glow, index) in LANTERN_GLOWS" :key="`lantern-${index}`" class="weather-lantern-glow" :style="{
        '--lantern-left': glow.left,
        '--lantern-top': glow.top,
        '--lantern-size': glow.size,
        '--lantern-duration': glow.duration,
        '--lantern-delay': glow.delay
      }"></span>
      <span v-for="(bug, index) in FIREFLIES" :key="`firefly-${index}`" class="weather-firefly" :style="{
        '--bug-left': bug.left,
        '--bug-top': bug.top,
        '--bug-size': `${bug.size}px`,
        '--bug-duration': `${bug.duration}s`,
        '--bug-delay': bug.delay
      }"></span>
    </div>
  </div>
</template>

<style scoped>
.weather-atmosphere {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  pointer-events: none;
}

.weather-atmosphere__layer {
  position: fixed;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
}

.weather-atmosphere.is-static .weather-atmosphere__layer * {
  animation: none !important;
}

.weather-atmosphere__cloud-layer {
  z-index: 2;
}

.weather-cloud {
  position: absolute;
  left: var(--cloud-left);
  top: var(--cloud-top);
  width: var(--cloud-width);
  height: var(--cloud-height);
  opacity: var(--cloud-opacity);
  pointer-events: none;
  filter: drop-shadow(0 18px 24px rgba(108, 120, 138, 0.16));
  animation: weather-cloud-drift calc(var(--cloud-speed) * 1.8) linear infinite;
  animation-delay: var(--cloud-delay);
}

.weather-cloud__body,
.weather-cloud__puff {
  position: absolute;
  border-radius: 999px;
  background:
    radial-gradient(circle at 40% 34%, rgba(255, 255, 255, 0.78), rgba(247, 250, 255, 0.56) 38%, rgba(224, 232, 242, 0.3) 70%, transparent 100%);
  box-shadow:
    inset 0 -16px 24px rgba(122, 136, 154, 0.22),
    inset 0 10px 18px rgba(255, 255, 255, 0.28);
  filter: blur(6px);
}

.weather-cloud__body {
  inset: 30% 10% 8% 12%;
}

.weather-cloud__puff--a {
  left: 8%;
  top: 28%;
  width: 34%;
  height: 38%;
}

.weather-cloud__puff--b {
  left: 26%;
  top: 12%;
  width: 36%;
  height: 46%;
}

.weather-cloud__puff--c {
  left: 48%;
  top: 18%;
  width: 30%;
  height: 40%;
}

.weather-cloud__puff--d {
  left: 62%;
  top: 30%;
  width: 24%;
  height: 30%;
}

.weather-cloud--storm {
  filter: drop-shadow(0 22px 34px rgba(50, 62, 86, 0.34));
}

.weather-cloud--storm .weather-cloud__body,
.weather-cloud--storm .weather-cloud__puff {
  background:
    radial-gradient(circle at 38% 30%, rgba(220, 230, 244, 0.72), rgba(158, 172, 194, 0.58) 42%, rgba(62, 76, 104, 0.52) 78%, transparent 100%);
  box-shadow:
    inset 0 -20px 28px rgba(42, 54, 82, 0.32),
    inset 0 10px 16px rgba(242, 247, 255, 0.18);
}

.weather-cloud--windy {
  filter: drop-shadow(0 14px 18px rgba(110, 126, 144, 0.12));
}

.weather-cloud--windy .weather-cloud__body,
.weather-cloud--windy .weather-cloud__puff {
  background:
    radial-gradient(circle at 40% 34%, rgba(248, 250, 255, 0.62), rgba(231, 238, 245, 0.42) 38%, rgba(214, 223, 235, 0.22) 74%, transparent 100%);
}

.weather-cloud--night {
  filter: drop-shadow(0 12px 18px rgba(32, 28, 42, 0.18));
}

.weather-cloud--night .weather-cloud__body,
.weather-cloud--night .weather-cloud__puff {
  background:
    radial-gradient(circle at 40% 34%, rgba(190, 201, 226, 0.42), rgba(118, 128, 154, 0.32) 42%, rgba(58, 64, 90, 0.26) 78%, transparent 100%);
}

.weather-atmosphere__layer--sunny {
  z-index: 2;
  overflow: hidden;
}

.weather-sunwarmth {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(circle at 0% 0%, rgba(255, 245, 182, 0.6), rgba(255, 210, 76, 0.24) 10%, rgba(255, 221, 126, 0.06) 22%, transparent 38%),
    radial-gradient(ellipse at 10% 13%, rgba(255, 252, 220, 0.2), transparent 28%),
    linear-gradient(118deg, rgba(255, 214, 104, 0.13), rgba(255, 244, 202, 0.05) 22%, transparent 50%),
    linear-gradient(180deg, rgba(255, 248, 229, 0.05), transparent 50%);
  opacity: 0.48;
  mix-blend-mode: screen;
}

.weather-light-source {
  position: absolute;
  left: clamp(-220px, -11vw, -96px);
  top: clamp(-190px, -12vh, -92px);
  z-index: 5;
  width: clamp(300px, 24vw, 460px);
  height: clamp(300px, 24vw, 460px);
  border-radius: 50%;
  background:
    radial-gradient(circle at 58% 58%, rgba(255, 255, 232, 0.98) 0 4%, rgba(255, 230, 118, 0.68) 12%, rgba(255, 184, 45, 0.34) 28%, rgba(255, 215, 112, 0.14) 48%, transparent 70%);
  filter: blur(2px);
  mix-blend-mode: screen;
  opacity: 0.58;
  transform-origin: left top;
  animation: weather-light-source-breathe 18s ease-in-out infinite;
}

.weather-light-source::before,
.weather-light-source::after {
  content: '';
  position: absolute;
  pointer-events: none;
}

.weather-light-source::before {
  left: 30%;
  top: 40%;
  width: 58%;
  height: 8%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 255, 230, 0.72), rgba(255, 213, 92, 0.28), transparent);
  filter: blur(5px);
  transform: rotate(-18deg);
}

.weather-light-source::after {
  left: 34%;
  top: 34%;
  width: 9%;
  height: 62%;
  border-radius: 999px;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 232, 0.58), transparent);
  filter: blur(7px);
  transform: rotate(36deg);
}

.weather-light-streak {
  position: absolute;
  left: -8vw;
  top: clamp(72px, 10vh, 132px);
  z-index: 4;
  width: clamp(620px, 64vw, 1080px);
  height: clamp(118px, 15vh, 210px);
  background:
    linear-gradient(118deg, transparent 0 5%, rgba(255, 253, 220, 0.78) 10%, rgba(255, 219, 104, 0.2) 25%, transparent 58%),
    linear-gradient(118deg, transparent 0 28%, rgba(255, 255, 232, 0.32) 35%, rgba(255, 230, 150, 0.12) 46%, transparent 70%),
    linear-gradient(128deg, transparent 0 15%, rgba(255, 250, 215, 0.28) 23%, transparent 50%);
  filter: blur(3px);
  mix-blend-mode: screen;
  opacity: 0.86;
  transform: rotate(12deg);
  transform-origin: left top;
  animation: weather-light-streak-breathe 20s ease-in-out infinite;
}

.weather-light-streak::before,
.weather-light-streak::after {
  content: '';
  position: absolute;
  left: 4%;
  width: 76%;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 234, 0.74) 18%, rgba(255, 222, 126, 0.22) 46%, transparent 82%);
  filter: blur(1.5px);
  pointer-events: none;
}

.weather-light-streak::before {
  top: 31%;
}

.weather-light-streak::after {
  top: 53%;
  left: 10%;
  width: 58%;
  opacity: 0.68;
}

.weather-rainbow {
  position: absolute;
  left: clamp(920px, 61vw, 1250px);
  top: clamp(86px, 12vh, 136px);
  z-index: 2;
  width: min(500px, 29vw);
  height: clamp(180px, 13vw, 260px);
  background:
    radial-gradient(ellipse at 50% 100%,
      transparent 0 48%,
      rgba(255, 94, 110, 0.54) 48.4% 49.8%,
      rgba(255, 156, 72, 0.5) 49.8% 51.2%,
      rgba(255, 226, 88, 0.46) 51.2% 52.6%,
      rgba(116, 210, 126, 0.42) 52.6% 54%,
      rgba(76, 176, 230, 0.4) 54% 55.5%,
      rgba(127, 112, 218, 0.36) 55.5% 57%,
      rgba(218, 126, 204, 0.32) 57% 58.5%,
      transparent 59.2%
    );
  opacity: 0.58;
  filter: blur(4px) saturate(1.12);
  mix-blend-mode: screen;
  transform: rotate(-11deg) scaleY(0.58);
  transform-origin: 40% 100%;
  mask-image: radial-gradient(ellipse at 50% 100%, transparent 0 47%, #000 49% 60%, transparent 62%);
}

.weather-rainbow::after {
  content: '';
  position: absolute;
  inset: 42% 2% 17%;
  background:
    radial-gradient(ellipse at 50% 62%, rgba(255, 250, 220, 0.2), rgba(255, 250, 220, 0.08) 42%, transparent 72%);
  filter: blur(18px);
  opacity: 0.7;
  pointer-events: none;
}

.weather-sunbeam {
  position: absolute;
  top: var(--beam-top);
  left: var(--beam-left);
  z-index: 3;
  width: var(--beam-width);
  height: var(--beam-height);
  clip-path: polygon(42% 0, 60% 0, 84% 100%, 10% 100%);
  background:
    linear-gradient(180deg, rgba(255, 255, 234, 0), rgba(255, 244, 190, var(--beam-opacity)) 12%, rgba(255, 210, 86, 0.24) 46%, rgba(255, 255, 255, 0.02) 80%, transparent 100%);
  opacity: var(--beam-opacity);
  transform: rotate(var(--beam-rotate));
  transform-origin: left top;
  filter: blur(10px);
  mix-blend-mode: screen;
  animation: weather-sunbeam-sweep var(--beam-duration) ease-in-out infinite;
  animation-delay: var(--beam-delay);
}

.weather-sunbeam::before {
  content: '';
  position: absolute;
  inset: 0;
  left: 36%;
  width: 22%;
  background: linear-gradient(180deg, rgba(255, 255, 232, 0), rgba(255, 255, 232, 0.48) 18%, rgba(255, 229, 134, 0.16) 54%, transparent 84%);
  filter: blur(2px);
}

.weather-sunwash {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at 5% 8%, rgba(255, 255, 228, 0.26), transparent 21%),
    radial-gradient(ellipse at 22% 15%, rgba(255, 224, 132, 0.08), transparent 30%),
    linear-gradient(112deg, rgba(255, 223, 146, 0.07), rgba(255, 250, 230, 0.03) 34%, transparent 70%);
  opacity: 0.42;
  mix-blend-mode: screen;
}

.weather-mote {
  position: absolute;
  left: var(--mote-left);
  top: var(--mote-top);
  z-index: 6;
  width: var(--mote-size);
  height: var(--mote-size);
  border-radius: 50%;
  background: rgba(255, 250, 222, var(--mote-opacity));
  box-shadow: 0 0 10px rgba(255, 232, 156, 0.38);
  animation: weather-mote-float var(--mote-duration) ease-in-out infinite;
  animation-delay: var(--mote-delay);
}

.weather-atmosphere__layer--rain {
  z-index: 2;
}

.weather-rain-line {
  position: absolute;
  left: var(--rain-left);
  top: -22vh;
  width: 1px;
  height: var(--rain-height);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(232, 244, 250, var(--rain-opacity)) 24%, rgba(232, 244, 250, var(--rain-opacity)) 76%, rgba(255, 255, 255, 0));
  transform: translate3d(0, 0, 0) rotate(var(--rain-slant));
  transform-origin: top center;
  filter: blur(0.18px);
  animation: weather-rain-fall var(--rain-duration) linear infinite;
  animation-delay: var(--rain-delay);
}

.weather-rain-line--mid {
  width: 1.2px;
}

.weather-rain-line--near {
  width: 1.45px;
}

.weather-rain-trail {
  position: absolute;
  left: var(--trail-left);
  top: -8vh;
  width: 18px;
  height: 116vh;
  background: linear-gradient(180deg, rgba(232, 244, 250, 0), rgba(232, 244, 250, 0.06), rgba(232, 244, 250, 0));
  filter: blur(8px);
  opacity: 0.28;
  animation: weather-rain-trail-glide var(--trail-duration) ease-in-out infinite;
  animation-delay: var(--trail-delay);
}

.weather-atmosphere__layer--snow {
  z-index: 2;
}

.weather-frost {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.22), transparent 16%),
    linear-gradient(90deg, rgba(255, 255, 255, 0.12), transparent 6%, transparent 94%, rgba(255, 255, 255, 0.12));
  pointer-events: none;
}

.weather-snowflake {
  position: absolute;
  left: var(--flake-left);
  top: -12%;
  width: var(--flake-size);
  height: var(--flake-size);
  --flake-stroke: max(1px, calc(var(--flake-size) * 0.1));
  color: rgba(255, 255, 255, 0.86);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.24));
  animation: weather-snow-fall var(--flake-duration) linear infinite;
  animation-delay: var(--flake-delay);
}

.weather-snowflake__shape {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(currentColor, currentColor) center / 100% var(--flake-stroke) no-repeat,
    radial-gradient(circle, rgba(255, 255, 255, 0.95) 0 16%, transparent 18%);
  animation: weather-snow-spin var(--flake-spin-duration) linear infinite;
  animation-delay: var(--flake-delay);
}

.weather-snowflake__shape::before,
.weather-snowflake__shape::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: var(--flake-stroke);
  border-radius: 999px;
  background: currentColor;
  transform-origin: center;
}

.weather-snowflake__shape::before {
  transform: translateY(-50%) rotate(60deg);
}

.weather-snowflake__shape::after {
  transform: translateY(-50%) rotate(-60deg);
}

.weather-snowflake--far {
  opacity: 0.4;
  filter: blur(1px);
}

.weather-snowflake--mid {
  opacity: 0.62;
}

.weather-snowflake--near {
  opacity: 0.82;
  filter: drop-shadow(0 0 6px rgba(255, 239, 210, 0.28));
}

.weather-atmosphere__layer--fog {
  z-index: 2;
}

.weather-fog-wash {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 30%, rgba(246, 248, 248, 0.2), transparent 34%),
    radial-gradient(circle at 76% 26%, rgba(220, 228, 230, 0.18), transparent 38%),
    linear-gradient(180deg, rgba(236, 241, 242, 0.28), rgba(238, 242, 242, 0.18) 48%, rgba(225, 232, 232, 0.26)),
    linear-gradient(90deg, rgba(228, 234, 235, 0.24), transparent 28%, transparent 72%, rgba(228, 234, 235, 0.22));
}

.weather-fog-depth {
  position: absolute;
  inset: -6vh -8vw;
  z-index: 0;
  --fog-opacity: 0.32;
  background:
    linear-gradient(180deg, rgba(232, 238, 239, 0.28), rgba(244, 247, 247, 0.16) 34%, rgba(218, 226, 226, 0.24)),
    radial-gradient(ellipse at 50% 52%, rgba(245, 247, 247, 0.2), transparent 58%);
  opacity: var(--fog-opacity);
  animation: weather-fog-breathe 19s ease-in-out infinite;
}

.weather-fog-side-veil {
  position: absolute;
  top: -8vh;
  bottom: -8vh;
  width: 58vw;
  z-index: 2;
  --fog-gather-from: -18vw;
  --fog-gather-to: 6vw;
  --fog-gather-low: 0.12;
  --fog-gather-high: 0.34;
  background:
    radial-gradient(ellipse at 42% 46%, rgba(246, 249, 249, 0.42), transparent 58%),
    radial-gradient(ellipse at 22% 76%, rgba(224, 232, 232, 0.3), transparent 54%),
    linear-gradient(90deg, rgba(240, 245, 245, 0.48), rgba(234, 241, 241, 0.26) 58%, transparent);
  filter: blur(16px);
  opacity: var(--fog-gather-low);
  transform: translate3d(var(--fog-gather-from), 0, 0);
  animation: weather-fog-gather 22s ease-in-out infinite alternate;
}

.weather-fog-side-veil--left {
  left: -24vw;
}

.weather-fog-side-veil--right {
  right: -24vw;
  --fog-gather-from: 18vw;
  --fog-gather-to: -6vw;
  --fog-gather-low: 0.1;
  --fog-gather-high: 0.3;
  background:
    radial-gradient(ellipse at 58% 46%, rgba(246, 249, 249, 0.42), transparent 58%),
    radial-gradient(ellipse at 78% 76%, rgba(224, 232, 232, 0.3), transparent 54%),
    linear-gradient(270deg, rgba(240, 245, 245, 0.48), rgba(234, 241, 241, 0.26) 58%, transparent);
  animation-duration: 24s;
  animation-delay: -5s;
}

.weather-fog-near-veil {
  position: absolute;
  left: -10vw;
  right: -10vw;
  bottom: -8vh;
  height: 38vh;
  z-index: 4;
  --fog-opacity: 0.46;
  background:
    radial-gradient(ellipse at 18% 78%, rgba(245, 248, 248, 0.42), transparent 42%),
    radial-gradient(ellipse at 72% 86%, rgba(226, 234, 234, 0.42), transparent 46%),
    linear-gradient(180deg, transparent, rgba(238, 243, 243, 0.36) 38%, rgba(226, 234, 234, 0.5));
  opacity: var(--fog-opacity);
  animation: weather-fog-breathe 16s ease-in-out infinite;
}

.weather-fog-band {
  position: absolute;
  left: var(--fog-left);
  top: var(--fog-top);
  width: var(--fog-width);
  height: var(--fog-height);
  border-radius: 999px;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(250, 252, 252, var(--fog-opacity)), rgba(232, 238, 238, var(--fog-opacity)) 48%, transparent 74%),
    linear-gradient(90deg, transparent, rgba(245, 248, 248, var(--fog-opacity)) 24%, rgba(230, 236, 236, var(--fog-opacity)) 68%, transparent);
  filter: blur(var(--fog-blur));
  opacity: var(--fog-opacity);
  animation:
    weather-fog-drift var(--fog-duration) ease-in-out infinite,
    weather-fog-breathe var(--fog-duration) ease-in-out infinite;
  animation-delay: var(--fog-delay);
}

.weather-fog-band--far {
  z-index: 1;
}

.weather-fog-band--mid {
  z-index: 2;
}

.weather-fog-band--near {
  z-index: 3;
}

.weather-atmosphere__layer--thunder {
  z-index: 3;
}

.weather-thunder-flash {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 69% 24%, rgba(255, 239, 180, 0.26), transparent 22%),
    radial-gradient(circle at 72% 30%, rgba(133, 188, 255, 0.22), transparent 30%),
    linear-gradient(180deg, rgba(255, 231, 164, 0.1), transparent 62%);
  opacity: 0;
  animation: weather-thunder-flash var(--flash-duration) ease-in-out infinite;
  animation-delay: var(--flash-delay);
}

.weather-thunder-mist {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 68% 34%, rgba(255, 216, 118, 0.12), transparent 28%),
    linear-gradient(112deg, transparent 48%, rgba(126, 172, 218, 0.12) 49%, transparent 56%),
    linear-gradient(106deg, transparent 57%, rgba(126, 172, 218, 0.1) 58%, transparent 64%);
  opacity: 0.72;
}

.weather-thunder-strike {
  position: absolute;
  left: 62%;
  top: 15vh;
  z-index: 3;
  width: 220px;
  height: min(58vh, 430px);
  min-height: 320px;
  opacity: 0;
  transform: rotate(2deg) scale(0.96);
  transform-origin: 48% 12%;
  filter:
    drop-shadow(0 0 8px rgba(255, 244, 202, 0.88))
    drop-shadow(0 0 24px rgba(246, 198, 72, 0.46))
    drop-shadow(0 0 34px rgba(114, 179, 255, 0.34));
  animation: weather-thunder-strike 7.2s ease-in-out infinite;
  animation-delay: -1.1s;
}

.weather-thunder-trunk,
.weather-thunder-trunk::before,
.weather-thunder-trunk::after,
.weather-thunder-branch,
.weather-thunder-branch::before,
.weather-thunder-branch::after {
  content: "";
  position: absolute;
}

.weather-thunder-trunk {
  left: 68px;
  top: 0;
  width: 84px;
  height: 100%;
}

.weather-thunder-trunk::before,
.weather-thunder-trunk::after {
  inset: 0;
  clip-path: polygon(46% 0, 72% 0, 58% 24%, 79% 24%, 52% 52%, 69% 52%, 24% 100%, 38% 60%, 17% 60%, 42% 34%, 28% 34%);
}

.weather-thunder-trunk::before {
  z-index: 2;
  background: linear-gradient(180deg, #fffdf0 0%, #ffe28d 44%, #fff7cc 58%, #f0bd34 100%);
}

.weather-thunder-trunk::after {
  z-index: 1;
  background: rgba(120, 189, 255, 0.46);
  filter: blur(10px);
  transform: scale(1.5);
}

.weather-thunder-branch {
  width: var(--branch-width);
  height: var(--branch-height, 34px);
  left: var(--branch-left);
  top: var(--branch-top);
  transform: rotate(var(--branch-rotate));
  transform-origin: var(--branch-origin, 12% 46%);
}

.weather-thunder-branch::before,
.weather-thunder-branch::after {
  inset: 0;
  clip-path: polygon(0 38%, 58% 34%, 48% 0, 100% 54%, 44% 55%, 56% 100%);
}

.weather-thunder-branch::before {
  z-index: 2;
  background: linear-gradient(90deg, rgba(255, 253, 231, 0.95), rgba(246, 205, 87, 0.9));
}

.weather-thunder-branch::after {
  z-index: 1;
  background: rgba(128, 194, 255, 0.34);
  filter: blur(6px);
  transform: scale(1.4);
}

.weather-thunder-branch--left-a {
  --branch-left: 38px;
  --branch-top: 24%;
  --branch-width: 76px;
  --branch-height: 38px;
  --branch-rotate: 202deg;
}

.weather-thunder-branch--right-a {
  --branch-left: 118px;
  --branch-top: 31%;
  --branch-width: 64px;
  --branch-height: 32px;
  --branch-rotate: -8deg;
}

.weather-thunder-branch--left-b {
  --branch-left: 28px;
  --branch-top: 42%;
  --branch-width: 48px;
  --branch-height: 28px;
  --branch-rotate: 218deg;
}

.weather-thunder-branch--right-b {
  --branch-left: 116px;
  --branch-top: 52%;
  --branch-width: 90px;
  --branch-height: 40px;
  --branch-rotate: 18deg;
}

.weather-thunder-branch--left-c {
  --branch-left: 44px;
  --branch-top: 64%;
  --branch-width: 58px;
  --branch-height: 30px;
  --branch-rotate: 196deg;
}

.weather-thunder-branch--right-c {
  --branch-left: 110px;
  --branch-top: 76%;
  --branch-width: 42px;
  --branch-height: 26px;
  --branch-rotate: 32deg;
}

.weather-thunder-cloud-mask {
  position: absolute;
  left: 53%;
  top: 6vh;
  z-index: 4;
  width: min(430px, 40vw);
  height: 168px;
  border-radius: 46% 54% 44% 50%;
  background:
    radial-gradient(ellipse at 18% 56%, rgba(82, 96, 124, 0.72), transparent 42%),
    radial-gradient(ellipse at 44% 42%, rgba(96, 110, 136, 0.72), transparent 42%),
    radial-gradient(ellipse at 75% 58%, rgba(65, 78, 106, 0.68), transparent 44%),
    linear-gradient(180deg, rgba(138, 151, 172, 0.18), rgba(48, 60, 88, 0.54) 58%, rgba(38, 49, 76, 0.46) 100%);
  box-shadow:
    inset 0 -26px 34px rgba(28, 38, 64, 0.32),
    0 20px 32px rgba(52, 64, 92, 0.2);
  filter: blur(5px);
}

.weather-thunder-cloud-mask::before,
.weather-thunder-cloud-mask::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.weather-thunder-cloud-mask::before {
  left: -12%;
  right: -8%;
  bottom: 24px;
  height: 98px;
  border-radius: 999px;
  background:
    radial-gradient(ellipse at 10% 58%, rgba(66, 78, 108, 0.58), transparent 34%),
    radial-gradient(ellipse at 32% 44%, rgba(92, 106, 132, 0.62), transparent 38%),
    radial-gradient(ellipse at 58% 56%, rgba(58, 70, 100, 0.6), transparent 36%),
    radial-gradient(ellipse at 86% 48%, rgba(78, 90, 116, 0.5), transparent 36%);
  filter: blur(9px);
}

.weather-thunder-cloud-mask::after {
  left: -4%;
  right: 2%;
  bottom: -10px;
  height: 78px;
  border-radius: 48%;
  background:
    radial-gradient(ellipse at 18% 28%, rgba(92, 106, 132, 0.34), transparent 42%),
    radial-gradient(ellipse at 46% 24%, rgba(48, 60, 88, 0.46), transparent 42%),
    radial-gradient(ellipse at 72% 32%, rgba(42, 54, 82, 0.42), transparent 44%),
    linear-gradient(180deg, rgba(62, 74, 102, 0.18), rgba(32, 42, 68, 0));
  filter: blur(13px);
}

.weather-atmosphere.is-static .weather-atmosphere__layer--thunder .weather-thunder-flash {
  opacity: 0.16;
}

.weather-atmosphere.is-static .weather-atmosphere__layer--thunder .weather-thunder-strike {
  opacity: 0.86;
  transform: rotate(2deg) scale(1);
}

.weather-atmosphere__layer--windy {
  z-index: 3;
}

.weather-wind-gust {
  position: absolute;
  left: var(--gust-left);
  top: var(--gust-top);
  width: var(--gust-width);
  height: var(--gust-height);
  --gust-line-width: 2.6px;
  border-top: var(--gust-line-width) solid rgba(235, 247, 252, var(--gust-opacity));
  border-radius: 58% 42% 0 0;
  background: linear-gradient(90deg, transparent, rgba(242, 250, 255, 0.14) 28%, transparent 72%) 16% 42% / 64% 2px no-repeat;
  filter: drop-shadow(0 0 3px rgba(220, 240, 248, 0.16));
  opacity: 0;
  transform: translate3d(-18vw, 0, 0) rotate(var(--gust-bend));
  animation: weather-wind-gust-flow var(--gust-duration) cubic-bezier(0.32, 0.04, 0.22, 1) infinite;
  animation-delay: var(--gust-delay);
}

.weather-wind-gust::before,
.weather-wind-gust::after {
  content: '';
  position: absolute;
  height: 58%;
  border-top: var(--gust-line-width) solid rgba(235, 247, 252, var(--gust-opacity));
  border-radius: 58% 42% 0 0;
  pointer-events: none;
}

.weather-wind-gust::before {
  left: 12%;
  top: 18%;
  width: 64%;
}

.weather-wind-gust::after {
  right: 10%;
  top: 50%;
  width: 42%;
}

.weather-wind-gust--far {
  --gust-line-width: 1.6px;
  filter: blur(0.55px);
}

.weather-wind-gust--near {
  --gust-line-width: 3.2px;
  filter:
    drop-shadow(0 0 7px rgba(220, 240, 248, 0.34))
    drop-shadow(0 0 2px rgba(255, 255, 255, 0.18));
}

.weather-wind-line {
  position: absolute;
  left: var(--wind-left);
  top: var(--wind-top);
  width: var(--wind-width);
  height: 28px;
  border-top: 2px solid rgba(210, 225, 238, 0.34);
  border-radius: 50%;
  filter: blur(0.2px);
  animation: weather-wind-sweep var(--wind-duration) linear infinite;
  animation-delay: var(--wind-delay);
}

.weather-wind-scrap {
  position: absolute;
  left: var(--scrap-left);
  top: var(--scrap-top);
  width: var(--scrap-size);
  height: calc(var(--scrap-size) * 0.62);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(233, 221, 198, 0.42), rgba(145, 176, 122, 0.28));
  transform: rotate(var(--scrap-rotate));
  filter: blur(0.3px);
  animation: weather-wind-scrap-fly var(--scrap-duration) linear infinite;
  animation-delay: var(--scrap-delay);
}

.weather-atmosphere__layer--night {
  z-index: 2;
}

.weather-night-veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(14, 22, 40, 0.24), rgba(32, 24, 44, 0.28)),
    radial-gradient(circle at 50% 42%, rgba(72, 64, 98, 0.08), transparent 42%);
}

.weather-lantern-glow {
  position: absolute;
  left: var(--lantern-left);
  top: var(--lantern-top);
  width: var(--lantern-size);
  height: var(--lantern-size);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 188, 120, 0.24), rgba(255, 188, 120, 0.08) 46%, transparent 76%);
  filter: blur(12px);
  animation: weather-lantern-breathe var(--lantern-duration) ease-in-out infinite;
  animation-delay: var(--lantern-delay);
}

.weather-firefly {
  position: absolute;
  left: var(--bug-left);
  top: var(--bug-top);
  width: var(--bug-size);
  height: var(--bug-size);
  border-radius: 50%;
  background: rgba(247, 228, 150, 0.68);
  box-shadow: 0 0 14px rgba(247, 228, 150, 0.48);
  animation: weather-firefly-float var(--bug-duration) ease-in-out infinite;
  animation-delay: var(--bug-delay);
}

@keyframes weather-cloud-drift {
  0% {
    transform: translate3d(0, 0.1vh, 0);
    opacity: calc(var(--cloud-opacity) * 0.82);
  }

  12% {
    opacity: var(--cloud-opacity);
  }

  50% {
    transform: translate3d(calc(var(--cloud-distance) * 0.52), calc(var(--cloud-drift-y) * -1), 0);
    opacity: var(--cloud-opacity);
  }

  88% {
    opacity: var(--cloud-opacity);
  }

  100% {
    transform: translate3d(var(--cloud-distance), calc(var(--cloud-drift-y) * 0.5), 0);
    opacity: calc(var(--cloud-opacity) * 0.8);
  }
}

@keyframes weather-sunbeam-sweep {

  0%,
  100% {
    transform: translate3d(-0.4vw, -0.2vh, 0) rotate(var(--beam-rotate));
    opacity: 0.18;
  }

  50% {
    transform: translate3d(0.8vw, 0.5vh, 0) rotate(var(--beam-rotate));
    opacity: var(--beam-opacity);
  }
}

@keyframes weather-light-source-breathe {

  0%,
  100% {
    transform: translate3d(-0.4vw, -0.2vh, 0) scale(0.98);
    opacity: 0.82;
  }

  50% {
    transform: translate3d(0.5vw, 0.3vh, 0) scale(1.03);
    opacity: 1;
  }
}

@keyframes weather-light-streak-breathe {

  0%,
  100% {
    transform: translate3d(-0.5vw, -0.2vh, 0) rotate(12deg);
    opacity: 0.48;
  }

  50% {
    transform: translate3d(0.8vw, 0.4vh, 0) rotate(12deg);
    opacity: 0.78;
  }
}

@keyframes weather-mote-float {

  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(0.92);
    opacity: 0.38;
  }

  50% {
    transform: translate3d(0.7vw, -0.8vh, 0) scale(1.08);
    opacity: 0.86;
  }
}

@keyframes weather-rain-fall {
  0% {
    transform: translate3d(0, -14vh, 0) rotate(var(--rain-slant));
    opacity: 0;
  }

  8%,
  92% {
    opacity: 0.95;
  }

  100% {
    transform: translate3d(0.12vw, 136vh, 0) rotate(var(--rain-slant));
    opacity: 0;
  }
}

@keyframes weather-rain-trail-glide {

  0%,
  100% {
    transform: translateY(-2vh);
    opacity: 0.14;
  }

  50% {
    transform: translateY(2vh);
    opacity: 0.28;
  }
}

@keyframes weather-snow-fall {
  0% {
    transform: translate3d(0, -10vh, 0);
  }

  100% {
    transform: translate3d(5vw, 108vh, 0);
  }
}

@keyframes weather-snow-spin {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(var(--flake-spin-turn));
  }
}

@keyframes weather-fog-drift {

  0%,
  100% {
    transform: translate3d(-8vw, 0, 0);
  }

  50% {
    transform: translate3d(16vw, 0, 0);
  }
}

@keyframes weather-fog-breathe {

  0%,
  100% {
    opacity: var(--fog-opacity);
  }

  50% {
    opacity: calc(var(--fog-opacity) + 0.08);
  }
}

@keyframes weather-fog-gather {
  0% {
    transform: translate3d(var(--fog-gather-from), 0, 0);
    opacity: var(--fog-gather-low);
  }

  100% {
    transform: translate3d(var(--fog-gather-to), 0, 0);
    opacity: var(--fog-gather-high);
  }
}

@keyframes weather-thunder-flash {

  0%,
  5%,
  15%,
  42%,
  100% {
    opacity: 0;
  }

  7% {
    opacity: 0.2;
  }

  8% {
    opacity: 0.5;
  }

  10% {
    opacity: 0.14;
  }

  12% {
    opacity: 0.42;
  }
}

@keyframes weather-thunder-strike {

  0%,
  5%,
  15%,
  42%,
  100% {
    opacity: 0;
    transform: rotate(2deg) scale(0.96);
  }

  7% {
    opacity: 0.24;
    transform: rotate(2deg) scale(0.98);
  }

  8% {
    opacity: 1;
    transform: rotate(2deg) scale(1);
  }

  10% {
    opacity: 0.34;
  }

  12% {
    opacity: 0.88;
    transform: rotate(2deg) scale(1.01);
  }

  16% {
    opacity: 0.18;
    transform: rotate(2deg) scale(0.99);
  }
}

@keyframes weather-wind-sweep {
  0% {
    transform: translateX(-12vw) rotate(0deg);
    opacity: 0;
  }

  20%,
  80% {
    opacity: 0.34;
  }

  100% {
    transform: translateX(24vw) rotate(-8deg);
    opacity: 0;
  }
}

@keyframes weather-wind-gust-flow {
  0% {
    transform: translate3d(-18vw, 0, 0) rotate(var(--gust-bend));
    opacity: 0;
  }

  16%,
  78% {
    opacity: var(--gust-opacity);
  }

  100% {
    transform: translate3d(150vw, -1.8vh, 0) rotate(calc(var(--gust-bend) - 4deg));
    opacity: 0;
  }
}

@keyframes weather-wind-scrap-fly {
  0% {
    transform: translate3d(-14vw, 0, 0) rotate(var(--scrap-rotate));
    opacity: 0;
  }

  20%,
  82% {
    opacity: 0.8;
  }

  100% {
    transform: translate3d(22vw, -1.2vh, 0) rotate(calc(var(--scrap-rotate) + 18deg));
    opacity: 0;
  }
}

@keyframes weather-firefly-float {

  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(0.92);
    opacity: 0.28;
  }

  50% {
    transform: translate3d(1.6vw, -1vh, 0) scale(1.12);
    opacity: 0.9;
  }
}

@keyframes weather-lantern-breathe {

  0%,
  100% {
    opacity: 0.42;
    transform: scale(0.96);
  }

  50% {
    opacity: 0.74;
    transform: scale(1.06);
  }
}

@media (prefers-reduced-motion: reduce) {
  .weather-atmosphere__layer * {
    animation: none !important;
  }
}
</style>
