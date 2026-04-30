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
  { value: togetherDays.value, unit: '天', label: '我们在一起的日子', icon: 'calendar' },
  { value: anniversary.value.days, unit: '天后', label: '下一个纪念日', icon: 'gift' },
  { value: messageCount.value, unit: '条', label: '留下的留言', icon: 'message' },
  { value: photoCount.value, unit: '张', label: '共同的照片', icon: 'photo' }
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
          <article class="daily-note-card" aria-labelledby="daily-note-title">
            <span class="daily-note-card__tape" aria-hidden="true"></span>
            <div class="dashboard-section-heading">
              <h2 id="daily-note-title">今日小纸条</h2>
              <span aria-hidden="true">♡</span>
            </div>
            <p class="daily-note-card__sentence">今天也要记得抱抱。</p>
            <p class="daily-note-card__meta">
              <span>雨天</span>
              <span>适合一起听歌</span>
            </p>
          </article>

          <section class="couple-status-panel" aria-labelledby="couple-status-title">
            <div class="dashboard-section-heading">
              <h2 id="couple-status-title">我们的今日状态</h2>
              <span aria-hidden="true">♧</span>
            </div>

            <div class="status-card-grid">
              <article v-for="person in coupleStatusCards" :key="person.name" class="status-person-card">
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

            <p class="distance-ribbon">相距 <strong>819</strong> 公里 · 一起看着同一片云 ☁</p>
          </section>
        </div>

        <section class="progress-ledger" aria-labelledby="progress-ledger-title">
          <div class="dashboard-section-heading">
            <h2 id="progress-ledger-title">恋爱进度仪表</h2>
            <span aria-hidden="true">♡</span>
          </div>
          <div class="progress-stat-grid">
            <article v-for="stat in progressStats" :key="stat.label" class="progress-stat-card">
              <span class="progress-stat-card__icon" :class="`progress-stat-card__icon--${stat.icon}`" aria-hidden="true"></span>
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
        </section>

        <section class="recent-moments" aria-labelledby="recent-moments-title">
          <div class="dashboard-section-heading dashboard-section-heading--wide">
            <h2 id="recent-moments-title">最近发生的小事</h2>
            <span aria-hidden="true">☆</span>
          </div>

          <div class="recent-grid">
            <RouterLink class="recent-paper-card recent-paper-card--memory" to="/story">
              <span class="recent-paper-card__label">最新点滴</span>
              <figure v-if="latestPhotos[0]" class="recent-paper-card__photo">
                <img :src="latestPhotos[0].url" :alt="latestPhotos[0].caption" />
              </figure>
              <h3>{{ latestMemory?.title ?? '一件很小但发光的事' }}</h3>
              <p>{{ latestMemory?.content ?? site.couple.slogan }}</p>
              <small>{{ formatDate(latestMemory?.date) }} · {{ latestMemory?.tags?.[0] ?? '日常' }}</small>
            </RouterLink>

            <RouterLink class="recent-paper-card recent-paper-card--message" to="/messages">
              <span class="recent-paper-card__label">最新留言</span>
              <h3>{{ latestMessage?.nickname ?? site.couple.personB }}</h3>
              <small>昨天 {{ formatMessageTime(latestMessage?.createdAt) }}</small>
              <p>{{ latestMessage?.content ?? '今天虽然有点累，但想到你就觉得一切都值得呀。' }}</p>
            </RouterLink>

            <RouterLink class="recent-paper-card recent-paper-card--album" to="/album">
              <span class="recent-paper-card__label">最新相册</span>
              <div class="album-preview-strip">
                <img
                  v-for="photo in latestPhotos"
                  :key="photo.id"
                  :src="photo.url"
                  :alt="photo.caption"
                />
              </div>
              <h3>春日 & 雪日 小记</h3>
              <small>共 {{ photoCount }} 张照片 ›</small>
            </RouterLink>
          </div>
        </section>

        <section class="next-plan-strip" aria-labelledby="next-plan-title">
          <span class="next-plan-strip__check" aria-hidden="true">✓</span>
          <div>
            <p id="next-plan-title">下一件想一起完成的事</p>
            <h2>{{ nextWish?.title ?? '一起去看海' }}</h2>
            <span>吹海风、踩沙滩、看日落 🌊</span>
          </div>
          <p class="next-plan-strip__date">
            目标时间
            <strong>{{ anniversary.date || '2026-05-20' }}</strong>
          </p>
          <RouterLink class="next-plan-strip__link" to="/wishes">
            去清单看看
            <span aria-hidden="true">→</span>
          </RouterLink>
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
