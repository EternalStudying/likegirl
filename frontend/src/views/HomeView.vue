<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import PageLoader from '../components/PageLoader.vue';
import WeatherAtmosphere from '../components/WeatherAtmosphere.vue';
import { homeHeroSlides } from '../config/homeHeroSlides';
import { useSiteData } from '../composables/useSiteData';
import heroStickerLeftBear from '../assets/home-hero/hero-sticker-left-bear.png';
import heroStickerRightReader from '../assets/home-hero/hero-sticker-right-reader.png';

const { site, loaded, togetherDays, anniversary } = useSiteData();
const activeSlideIndex = ref(0);
const heroPaused = ref(false);
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let heroAutoplayTimer: number | undefined;

const activeSlide = computed(() => homeHeroSlides[activeSlideIndex.value] ?? homeHeroSlides[0]);

function showHeroSlide(index: number) {
  activeSlideIndex.value = (index + homeHeroSlides.length) % homeHeroSlides.length;
}

function showNextHeroSlide() {
  showHeroSlide(activeSlideIndex.value + 1);
}

function startHeroAutoplay() {
  if (prefersReducedMotion || homeHeroSlides.length < 2) {
    return;
  }

  heroAutoplayTimer = window.setInterval(() => {
    if (!heroPaused.value) {
      showNextHeroSlide();
    }
  }, 5000);
}

function stopHeroAutoplay() {
  if (heroAutoplayTimer) {
    window.clearInterval(heroAutoplayTimer);
    heroAutoplayTimer = undefined;
  }
}

onMounted(startHeroAutoplay);
onBeforeUnmount(stopHeroAutoplay);

const directoryItems = [
  {
    to: '/story',
    number: '01',
    title: '故事卷轴',
    label: 'Story Scroll',
    description: '按时间翻看每一个被认真收好的瞬间。',
    accent: 'coral'
  },
  {
    to: '/album',
    number: '02',
    title: '照片相册',
    label: 'Photo Album',
    description: '把散步、旅行和日常光线装进相册。',
    accent: 'orange'
  },
  {
    to: '/messages',
    number: '03',
    title: '留言板',
    label: 'Message Board',
    description: '写下今天想留给彼此的一句话。',
    accent: 'green'
  },
  {
    to: '/wishes',
    number: '04',
    title: '恋爱清单',
    label: 'Wish List',
    description: '一起完成那些正在发光的小计划。',
    accent: 'gold'
  },
  {
    to: '/about',
    number: '05',
    title: '关于我们',
    label: 'About Us',
    description: '记录这本纪念册从哪里开始。',
    accent: 'coral'
  }
];
</script>

<template>
  <main>
    <template v-if="site">
      <WeatherAtmosphere />

      <section
        class="home-hero-carousel"
        :class="`home-hero-carousel--${activeSlide.tone}`"
        aria-label="情侣纪念册插画封面"
        @mouseenter="heroPaused = true"
        @mouseleave="heroPaused = false"
      >
        <div class="home-hero-slides" aria-hidden="true">
          <figure
            v-for="(slide, index) in homeHeroSlides"
            :key="slide.image"
            class="home-hero-slide"
            :class="[`home-hero-slide--${slide.tone}`, { 'is-active': index === activeSlideIndex }]"
          >
            <img :src="slide.image" alt="" />
          </figure>
        </div>

        <div class="home-hero-content">
          <div class="hero-sticker-cluster" :aria-label="`${site.couple.personA} 和 ${site.couple.personB}`">
            <div class="hero-person-sticker hero-person-sticker--left">
              <span class="hero-avatar-sticker hero-avatar-sticker--left" aria-hidden="true">
                <img class="hero-avatar-image" :src="heroStickerLeftBear" alt="" />
              </span>
              <span class="hero-avatar-name">{{ site.couple.personA }}</span>
            </div>

            <div class="hero-centerpiece">
              <span class="hero-center-heart" aria-hidden="true">
                <span class="hero-heart-spark hero-heart-spark--left">✦</span>
                <svg class="hero-heart-fabric" viewBox="0 0 100 96" focusable="false">
                  <path
                    class="hero-heart-fill"
                    d="M50 88C25 70 12 54 12 36C12 20 24 10 38 10C44 10 49 13 50 18C51 13 56 10 62 10C76 10 88 20 88 36C88 54 75 70 50 88Z"
                  />
                  <path
                    class="hero-heart-highlight"
                    d="M30 31C34 22 43 20 49 27"
                  />
                  <path
                    class="hero-heart-stitch"
                    d="M50 78C31 64 22 51 22 37C22 28 29 21 38 21C43 21 48 24 50 29C52 24 57 21 62 21C71 21 78 28 78 37C78 51 69 64 50 78Z"
                  />
                </svg>
                <span class="hero-heart-spark hero-heart-spark--right">✦</span>
              </span>

              <div class="hero-memory-stack" :class="{ ready: loaded }">
                <p class="hero-memory-note hero-memory-note--torn">在一起第 <strong>{{ togetherDays }}</strong> 天</p>
                <p class="hero-anniversary-capsule hero-anniversary-capsule--paper">
                  下一纪念日 <strong>{{ anniversary.days }}</strong> 天后
                </p>
              </div>
            </div>

            <div class="hero-person-sticker hero-person-sticker--right">
              <span class="hero-avatar-sticker hero-avatar-sticker--right" aria-hidden="true">
                <img class="hero-avatar-image" :src="heroStickerRightReader" alt="" />
              </span>
              <span class="hero-avatar-name">{{ site.couple.personB }}</span>
            </div>
          </div>
        </div>

        <div class="home-hero-dots" aria-label="首页封面轮播">
          <button
            v-for="(slide, index) in homeHeroSlides"
            :key="slide.title"
            type="button"
            class="home-hero-dot"
            :aria-label="`切换到${slide.title}`"
            :aria-current="index === activeSlideIndex ? 'true' : undefined"
            @click="showHeroSlide(index)"
          >
            <span></span>
          </button>
        </div>
      </section>

      <section class="section directory-section" aria-labelledby="directory-title">
        <div class="section-heading">
          <p>Memory Index</p>
          <h2 id="directory-title">纪念册目录</h2>
        </div>

        <div class="directory-grid">
          <RouterLink
            v-for="(item, index) in directoryItems"
            :key="item.to"
            class="directory-card index-tab"
            :class="`index-tab--${item.accent}`"
            :style="`--tab-order: ${index}`"
            :to="item.to"
          >
            <span class="index-number">{{ item.number }}</span>
            <span class="directory-label">{{ item.label }}</span>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
            <span class="directory-arrow">进入 →</span>
          </RouterLink>
        </div>
      </section>
    </template>

    <PageLoader v-else />
  </main>
</template>
