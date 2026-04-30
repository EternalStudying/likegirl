<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import PageLoader from '../components/PageLoader.vue';
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

const navIcons = {
  messages:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="currentColor" d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092a10 10 0 1 0-4.777-4.719"/><path fill="currentColor" d="M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224a3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z"/></g></svg>',
  moments:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="currentColor" d="M7 16.3c2.2 0 4-1.83 4-4.05c0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05"/><path fill="currentColor" d="M12.56 6.6A11 11 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></g></svg>',
  diary:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v14m4-9h2m-2-4h2M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4a4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3a3 3 0 0 0-3-3zm3-6h2M6 8h2"/></svg>',
  home:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="currentColor" d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path fill="currentColor" d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></g></svg>',
  album:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path fill="currentColor" d="m22 11l-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path fill="currentColor" d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect fill="currentColor" width="14" height="14" x="8" y="2" rx="2"/></g></svg>',
  list:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5h8m-8 7h8m-8 7h8M3 17l2 2l4-4M3 7l2 2l4-4"/></svg>',
  about:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle fill="currentColor" cx="12" cy="12" r="10"/><path fill="currentColor" d="M12 16v-4m0-4h.01"/></g></svg>'
};

const cozyNavItems = [
  { to: '/messages', icon: navIcons.messages, label: '留言' },
  { to: '/story', icon: navIcons.moments, label: '点滴' },
  { to: '/story', icon: navIcons.diary, label: '日记' },
  { to: '/', icon: navIcons.home, label: '首页', home: true },
  { to: '/album', icon: navIcons.album, label: '相册' },
  { to: '/wishes', icon: navIcons.list, label: '清单' },
  { to: '/about', icon: navIcons.about, label: '关于' }
];
</script>

<template>
  <main>
    <template v-if="site">
      <section class="home-cozy-stage" aria-label="我们的日常封面">
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

        <nav class="home-cozy-nav" aria-label="首页章节导航">
          <RouterLink
            v-for="item in cozyNavItems"
            :key="item.label"
            class="home-cozy-nav__link"
            :class="{ 'home-cozy-nav__link--home': item.home }"
            :to="item.to"
          >
            <span class="home-cozy-nav__icon" aria-hidden="true" v-html="item.icon"></span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <section class="home-cozy-intro" aria-labelledby="home-cozy-title">
          <p class="home-cozy-eyebrow">* Our Cozy Place *</p>
          <h1 id="home-cozy-title" class="home-cozy-title">
            收好我们的日常与心动 <span aria-hidden="true">♡</span>
          </h1>

          <article class="home-memory-card" aria-label="纪念日信息">
            <div class="home-memory-card__copy">
              <p class="home-memory-card__line">
                朝暮与年岁并往，<br />
                与你行至天光。
              </p>
              <p class="home-memory-card__anniversary">
                下一纪念日 <strong>{{ anniversary.days }} 天后</strong> · {{ anniversary.date }}
              </p>
            </div>

            <div class="home-memory-card__stats">
              <strong class="home-memory-card__days">{{ togetherDays }}</strong>
              <span>DAYS</span>
            </div>
          </article>
        </section>
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
