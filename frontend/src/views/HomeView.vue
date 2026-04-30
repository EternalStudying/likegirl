<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import PageLoader from '../components/PageLoader.vue';
import { homeHeroSlides } from '../config/homeHeroSlides';
import { useSiteData } from '../composables/useSiteData';
import heroStickerLeftBear from '../assets/home-hero/hero-sticker-left-bear.png';
import heroStickerRightReader from '../assets/home-hero/hero-sticker-right-reader.png';
import bowRed from '../assets/paper/bow-red.png';
import clipGold from '../assets/paper/clip-gold.png';
import flowerSprig from '../assets/paper/flower-sprig.png';
import paperCardSmall from '../assets/paper/paper-card-small.png';
import paperLedgerWide from '../assets/paper/paper-ledger-wide.png';
import paperMessageNote from '../assets/paper/paper-message-note.png';
import paperNoteWide from '../assets/paper/paper-note-wide.png';
import paperStripSage from '../assets/paper/paper-strip-sage.png';
import paperTicketStrip from '../assets/paper/paper-ticket-strip.png';
import tapeBeige from '../assets/paper/tape-beige.png';
import tapeCoral from '../assets/paper/tape-coral.png';
import tapeSage from '../assets/paper/tape-sage.png';
import statIconCalendar from '../assets/paper/stat-icon-calendar.png';
import statIconGift from '../assets/paper/stat-icon-gift.png';
import statIconMessage from '../assets/paper/stat-icon-message.png';
import statIconPhoto from '../assets/paper/stat-icon-photo.png';

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

const paperAssets = {
  bowRed,
  clipGold,
  flowerSprig,
  paperCardSmall,
  paperLedgerWide,
  paperMessageNote,
  paperNoteWide,
  paperStripSage,
  paperTicketStrip,
  tapeBeige,
  tapeCoral,
  tapeSage
} as const;

const progressStatIcons = {
  calendar: statIconCalendar,
  gift: statIconGift,
  message: statIconMessage,
  photo: statIconPhoto
} as const;

const progressIcons = {
  calendar:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" d="M208 34h-26V24a6 6 0 0 0-12 0v10H86V24a6 6 0 0 0-12 0v10H48a14 14 0 0 0-14 14v160a14 14 0 0 0 14 14h160a14 14 0 0 0 14-14V48a14 14 0 0 0-14-14m2 174a2 2 0 0 1-2 2H48a2 2 0 0 1-2-2V48a2 2 0 0 1 2-2h26v10a6 6 0 0 0 12 0V46h84v10a6 6 0 0 0 12 0V46h26a2 2 0 0 1 2 2ZM152 90a30 30 0 0 0-24 12a30 30 0 0 0-54 18c0 35.3 49.22 60.32 51.32 61.37a6 6 0 0 0 5.36 0C132.78 180.32 182 155.3 182 120a30 30 0 0 0-30-30m-3.67 65.25A138 138 0 0 1 128 169.19a139 139 0 0 1-20.33-13.94C97.78 147 86 134.15 86 120a18 18 0 0 1 36 0a6 6 0 0 0 12 0a18 18 0 0 1 36 0c0 14.15-11.78 27-21.67 35.25"/></svg>',
  gift:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" d="M216 74h-41.26a46.4 46.4 0 0 0 6-4.48a27.56 27.56 0 0 0 9.22-20A30.63 30.63 0 0 0 158.5 18a27.56 27.56 0 0 0-20 9.22A57.1 57.1 0 0 0 128 45.76a57.1 57.1 0 0 0-10.48-18.53A27.56 27.56 0 0 0 97.5 18A30.63 30.63 0 0 0 66 49.51a27.56 27.56 0 0 0 9.22 20a46 46 0 0 0 6 4.48H40A14 14 0 0 0 26 88v32a14 14 0 0 0 14 14h2v66a14 14 0 0 0 14 14h144a14 14 0 0 0 14-14v-66h2a14 14 0 0 0 14-14V88a14 14 0 0 0-14-14m-80.23-11c2.25-12.12 6.29-21.75 11.69-27.85a15.68 15.68 0 0 1 11.4-5.15h.55A18.6 18.6 0 0 1 178 49.14a15.68 15.68 0 0 1-5.18 11.4c-10.72 9.46-28.9 12.29-38.48 13.11c.25-2.89.66-6.57 1.43-10.65M83.45 35.45A18.7 18.7 0 0 1 96.59 30h.55a15.68 15.68 0 0 1 11.4 5.18c9.46 10.72 12.29 28.9 13.11 38.48c-2.89-.25-6.57-.68-10.61-1.43c-12.12-2.23-21.75-6.29-27.85-11.7A15.64 15.64 0 0 1 78 49.14a18.65 18.65 0 0 1 5.45-13.69M38 120V88a2 2 0 0 1 2-2h82v36H40a2 2 0 0 1-2-2m16 80v-66h68v68H56a2 2 0 0 1-2-2m148 0a2 2 0 0 1-2 2h-66v-68h68Zm16-80a2 2 0 0 1-2 2h-82V86h82a2 2 0 0 1 2 2Z"/></svg>',
  message:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" d="M166 112a6 6 0 0 1-6 6H96a6 6 0 0 1 0-12h64a6 6 0 0 1 6 6m-6 26H96a6 6 0 0 0 0 12h64a6 6 0 0 0 0-12m70-10a102 102 0 0 1-150.69 89.65l-34.87 11.62a14 14 0 0 1-17.71-17.71l11.62-34.87A102 102 0 1 1 230 128m-12 0a90 90 0 1 0-167.92 45.06a6 6 0 0 1 .5 4.91l-12.46 37.38a2 2 0 0 0 2.53 2.53L78 205.42a6.2 6.2 0 0 1 1.9-.31a6.1 6.1 0 0 1 3 .81A90 90 0 0 0 218 128"/></svg>',
  photo:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="currentColor" d="M208 34H80a14 14 0 0 0-14 14v18H48a14 14 0 0 0-14 14v128a14 14 0 0 0 14 14h128a14 14 0 0 0 14-14v-18h18a14 14 0 0 0 14-14V48a14 14 0 0 0-14-14M78 48a2 2 0 0 1 2-2h128a2 2 0 0 1 2 2v74.2l-20.1-20.1a14 14 0 0 0-19.8 0L94.2 178H80a2 2 0 0 1-2-2Zm100 160a2 2 0 0 1-2 2H48a2 2 0 0 1-2-2V80a2 2 0 0 1 2-2h18v98a14 14 0 0 0 14 14h98Zm30-30h-96.83l67.41-67.41a2 2 0 0 1 2.83 0L210 139.17V176a2 2 0 0 1-2 2m-88-68a22 22 0 1 0-22-22a22 22 0 0 0 22 22m0-32a10 10 0 1 1-10 10a10 10 0 0 1 10-10"/></svg>'
} as const;

const latestMemory = computed(() => {
  const memories = [...(site.value?.memories ?? [])];
  return memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
});

const latestMessage = computed(() => {
  const messages = [...(site.value?.messages ?? [])];
  return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
});

const latestPhotos = computed(() => {
  const photos = [...(site.value?.photos ?? [])];
  return photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
});

const nextWish = computed(() => site.value?.wishes.find((wish) => !wish.done) ?? site.value?.wishes[0]);
const completedWishCount = computed(() => site.value?.wishes.filter((wish) => wish.done).length ?? 0);
const messageCount = computed(() => site.value?.messages.length ?? 0);
const photoCount = computed(() => site.value?.photos.length ?? 0);

const coupleStatusCards = computed(() => [
  {
    name: site.value?.couple.personA ?? '小栀',
    avatar: heroStickerLeftBear,
    city: '泉州市',
    weather: '16°C',
    mood: '心情很好',
    note: '正在处理一些小事',
    gender: '♀'
  },
  {
    name: site.value?.couple.personB ?? '阿然',
    avatar: heroStickerRightReader,
    city: '杭州市',
    weather: '15°C',
    mood: '专注模式',
    note: '写代码中...',
    gender: '♂'
  }
]);

const progressStats = computed(() => [
  { value: togetherDays.value, unit: '天', label: '我们在一起的日子', icon: 'calendar', iconSrc: progressStatIcons.calendar },
  { value: anniversary.value.days, unit: '天后', label: '下一个纪念日', icon: 'gift', iconSrc: progressStatIcons.gift },
  { value: messageCount.value, unit: '条', label: '留下的留言', icon: 'message', iconSrc: progressStatIcons.message },
  { value: photoCount.value, unit: '张', label: '共同的照片', icon: 'photo', iconSrc: progressStatIcons.photo }
]);

function formatDate(value?: string) {
  if (!value) {
    return '今天';
  }

  return value.split('T')[0].replaceAll('-', '.');
}

function formatMessageTime(value?: string) {
  if (!value) {
    return '刚刚';
  }

  const time = value.split('T')[1]?.slice(0, 5);
  return time || formatDate(value);
}
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

      <section class="daily-dashboard" aria-labelledby="daily-dashboard-title">
        <div class="daily-dashboard__top">
          <section class="daily-note-block" aria-labelledby="daily-note-title">
            <div class="dashboard-section-heading">
              <h2 id="daily-note-title">今日小纸条</h2>
              <span aria-hidden="true">♡</span>
            </div>
            <article class="daily-note-card paper-asset paper-asset--note">
              <img class="paper-asset__texture" :src="paperAssets.paperNoteWide" alt="" aria-hidden="true" draggable="false" />
              <img class="paper-tape paper-tape--coral daily-note-card__tape" :src="paperAssets.tapeCoral" alt="" aria-hidden="true" draggable="false" />
              <img class="paper-flower daily-note-card__flower" :src="paperAssets.flowerSprig" alt="" aria-hidden="true" draggable="false" />
              <div class="paper-asset__content">
              <p class="daily-note-card__sentence">今天也要记得抱抱。</p>
              <p class="daily-note-card__meta">
                <span>雨天</span>
                <span>适合一起听歌</span>
              </p>
            </div>
            </article>
          </section>

          <section class="couple-status-panel" aria-labelledby="couple-status-title">
            <div class="dashboard-section-heading">
              <h2 id="couple-status-title">我们的今日状态</h2>
              <span aria-hidden="true">♧</span>
            </div>

            <div class="status-card-grid">
              <article
                v-for="person in coupleStatusCards"
                :key="person.name"
                class="status-person-card paper-piece paper-piece--card"
              >
                <img class="status-person-card__avatar" :src="person.avatar" :alt="`${person.name} 的头像`" />
                <div class="status-person-card__body">
                  <h3>
                    {{ person.name }}
                    <span>{{ person.gender }}</span>
                  </h3>
                  <p class="status-person-card__chips">
                    <span>{{ person.city }}</span>
                    <span>☁ {{ person.weather }}</span>
                  </p>
                  <p class="status-person-card__mood">☺ {{ person.mood }}</p>
                  <p class="status-person-card__note">{{ person.note }}</p>
                </div>
              </article>
            </div>

            <p class="distance-ribbon paper-asset paper-asset--ticket">
              <img class="paper-asset__texture" :src="paperAssets.paperTicketStrip" alt="" aria-hidden="true" draggable="false" />
              <img class="paper-bow distance-ribbon__bow" :src="paperAssets.bowRed" alt="" aria-hidden="true" draggable="false" />
              <span class="paper-asset__content">
                相距 <strong>819</strong> 公里 · 一起看着同一片云 ☁
              </span>
            </p>
          </section>
        </div>

        <section class="progress-ledger-section" aria-labelledby="progress-ledger-title">
          <div class="dashboard-section-heading">
            <h2 id="progress-ledger-title">恋爱进度仪表</h2>
            <span aria-hidden="true">♡</span>
          </div>
          <div class="progress-ledger paper-asset paper-asset--ledger">
            <span class="visually-hidden">恋爱进度仪表</span>
            <img class="paper-asset__texture" :src="paperAssets.paperLedgerWide" alt="" aria-hidden="true" draggable="false" />
            <div class="paper-asset__content">
            <div class="progress-stat-grid">
              <article v-for="stat in progressStats" :key="stat.label" class="progress-stat-card">
                <span
                  class="progress-stat-card__icon"
                  :class="`progress-stat-card__icon--${stat.icon}`"
                  aria-hidden="true"
                >
                  <img :src="stat.iconSrc" alt="" draggable="false" />
                </span>
                <p>
                  <strong>{{ stat.value }}</strong>
                  <span>{{ stat.unit }}</span>
                </p>
                <small>{{ stat.label }}</small>
              </article>
            </div>
            <div class="progress-thread" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="progress-ledger__labels">
              <span>第一次相遇<br />{{ formatDate(site.couple.startDate) }}</span>
              <span>未来的每一天</span>
            </div>
            </div>
          </div>
        </section>

        <section class="recent-moments" aria-labelledby="recent-moments-title">
          <div class="dashboard-section-heading dashboard-section-heading--wide">
            <h2 id="recent-moments-title">最近发生的小事</h2>
            <span aria-hidden="true">☆</span>
          </div>

          <div class="recent-grid">
            <article class="recent-paper-item recent-paper-item--memory">
              <span class="recent-paper-card__label">最新点滴</span>
              <RouterLink
                class="recent-paper-card recent-paper-card--memory paper-asset paper-asset--card"
                to="/story"
              >
                <img class="paper-asset__texture" :src="paperAssets.paperCardSmall" alt="" aria-hidden="true" draggable="false" />
                <img class="paper-tape paper-tape--beige recent-paper-card__tape recent-paper-card__tape--left" :src="paperAssets.tapeBeige" alt="" aria-hidden="true" draggable="false" />
                <div class="paper-asset__content">
                <figure v-if="latestPhotos[0]" class="recent-paper-card__photo">
                  <img :src="latestPhotos[0].url" :alt="latestPhotos[0].caption" />
                </figure>
                <div class="recent-paper-card__copy">
                  <h3>{{ latestMemory?.title ?? '一件很小但发光的事' }}</h3>
                  <p>{{ latestMemory?.content ?? site.couple.slogan }}</p>
                  <small>{{ formatDate(latestMemory?.date) }} · {{ latestMemory?.tags?.[0] ?? '日常' }}</small>
                </div>
              </div>
              </RouterLink>
            </article>

            <article class="recent-paper-item recent-paper-item--message">
              <span class="recent-paper-card__label">最新留言</span>
              <RouterLink
                class="recent-paper-card recent-paper-card--message paper-asset paper-asset--message"
                to="/messages"
              >
                <img class="paper-asset__texture" :src="paperAssets.paperMessageNote" alt="" aria-hidden="true" draggable="false" />
                <div class="paper-asset__content">
                <div class="recent-message-author">
                  <img
                    class="recent-message-author__avatar"
                    :src="heroStickerRightReader"
                    :alt="`${latestMessage?.nickname ?? site.couple.personB} 的头像`"
                  />
                  <div>
                    <h3>{{ latestMessage?.nickname ?? site.couple.personB }}</h3>
                    <small>昨天 {{ formatMessageTime(latestMessage?.createdAt) }}</small>
                  </div>
                </div>
                <p>{{ latestMessage?.content ?? '今天虽然有点累，但想到你就觉得一切都值得呀。' }}</p>
              </div>
              </RouterLink>
            </article>

            <article class="recent-paper-item recent-paper-item--album">
              <span class="recent-paper-card__label">最新相册</span>
              <RouterLink
                class="recent-paper-card recent-paper-card--album paper-asset paper-asset--card"
                to="/album"
              >
                <img class="paper-asset__texture" :src="paperAssets.paperCardSmall" alt="" aria-hidden="true" draggable="false" />
                <img class="paper-tape paper-tape--coral recent-paper-card__tape recent-paper-card__tape--right" :src="paperAssets.tapeCoral" alt="" aria-hidden="true" draggable="false" />
                <div class="paper-asset__content">
                <div class="album-preview-strip">
                  <img
                    v-for="photo in latestPhotos"
                    :key="photo.id"
                    :src="photo.url"
                    :alt="photo.caption"
                  />
                </div>
                <div class="album-preview-footer">
                  <h3>春日 & 雪日 小记</h3>
                  <small>共 {{ photoCount }} 张照片 ›</small>
                </div>
              </div>
              </RouterLink>
            </article>
          </div>
        </section>

        <section class="next-plan-section" aria-labelledby="next-plan-title">
          <div class="dashboard-section-heading dashboard-section-heading--wide">
            <h2 id="next-plan-title">下一件想一起完成的事</h2>
            <span aria-hidden="true">♡</span>
          </div>
          <div class="next-plan-strip paper-asset paper-asset--strip">
            <span class="visually-hidden">下一件想一起完成的事</span>
            <img class="paper-asset__texture" :src="paperAssets.paperStripSage" alt="" aria-hidden="true" draggable="false" />
            <img class="paper-tape next-plan-strip__tape" :src="paperAssets.tapeSage" alt="" aria-hidden="true" draggable="false" />
            <div class="paper-asset__content next-plan-strip__content">
            <span class="next-plan-strip__check" aria-hidden="true">✓</span>
            <div>
              <h2>{{ nextWish?.title ?? '一起去看海' }}</h2>
              <span>吹海风、踩沙滩、看日落 🌊</span>
            </div>
            <p class="next-plan-strip__date">
              目标时间
              <strong>{{ anniversary.date || '2026-05-20' }}</strong>
            </p>
            <img class="paper-flower next-plan-strip__flower" :src="paperAssets.flowerSprig" alt="" aria-hidden="true" draggable="false" />
            <RouterLink class="next-plan-strip__link" to="/wishes">
              去清单看看
              <span aria-hidden="true">→</span>
            </RouterLink>
            </div>
          </div>
        </section>
      </section>

    </template>

    <PageLoader v-else />
  </main>
</template>
