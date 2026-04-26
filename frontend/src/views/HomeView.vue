<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchSiteData, postMessage } from '../api/site';
import MessageBoard from '../components/MessageBoard.vue';
import { daysTogether, nextAnniversaryCountdown } from '../utils/date';
import { mockSiteData } from '../mock/siteData';
import type { Message, MessagePayload, SiteData } from '../types/site';

const site = ref<SiteData>(mockSiteData);
const loaded = ref(false);

const togetherDays = computed(() => daysTogether(site.value.couple.startDate));
const anniversary = computed(() => nextAnniversaryCountdown(site.value.couple.anniversaryDate));

async function loadSite() {
  site.value = await fetchSiteData();
  loaded.value = true;
}

async function submitMessage(payload: MessagePayload) {
  await postMessage(payload);
}

async function refreshMessages(): Promise<Message[]> {
  const nextSite = await fetchSiteData();
  site.value = nextSite;
  return nextSite.messages;
}

onMounted(loadSite);
</script>

<template>
  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">{{ site.hero.title }}</p>
        <h1 id="hero-title">{{ site.couple.personA }} 和 {{ site.couple.personB }}</h1>
        <p>{{ site.hero.slogan }}</p>
      </div>
      <div class="hero-stats" :class="{ ready: loaded }">
        <div>
          <span>在一起</span>
          <strong>第 {{ togetherDays }} 天</strong>
        </div>
        <div>
          <span>开始日期</span>
          <strong>{{ site.couple.startDate }}</strong>
        </div>
        <div>
          <span>下一纪念日</span>
          <strong>{{ anniversary.days }} 天后</strong>
          <small>{{ anniversary.date }}</small>
        </div>
      </div>
    </section>

    <section class="section timeline-section">
      <div class="section-heading">
        <p>Moments</p>
        <h2>点点滴滴时间线</h2>
      </div>
      <div class="timeline">
        <article v-for="memory in site.memories" :key="memory.id" class="timeline-item">
          <time>{{ memory.date }}</time>
          <div>
            <h3>{{ memory.title }}</h3>
            <p>{{ memory.content }}</p>
            <span v-for="tag in memory.tags" :key="tag">#{{ tag }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="section photo-section">
      <div class="section-heading">
        <p>Album</p>
        <h2>照片墙</h2>
      </div>
      <div class="photo-grid">
        <figure v-for="photo in site.photos" :key="photo.id">
          <img :src="photo.url" :alt="photo.caption" loading="lazy" />
          <figcaption>
            <span>{{ photo.caption }}</span>
            <time>{{ photo.date }}</time>
          </figcaption>
        </figure>
      </div>
    </section>

    <MessageBoard
      :messages="site.messages"
      :submit-message="submitMessage"
      :refresh-messages="refreshMessages"
    />

    <section class="section wish-section">
      <div class="section-heading">
        <p>List</p>
        <h2>恋爱清单</h2>
      </div>
      <ul class="wish-list">
        <li v-for="wish in site.wishes" :key="wish.id" :class="{ done: wish.done }">
          <span>{{ wish.done ? '完成' : '待完成' }}</span>
          {{ wish.title }}
        </li>
      </ul>
    </section>

    <section class="section about-section">
      <div class="section-heading">
        <p>About</p>
        <h2>关于我们</h2>
      </div>
      <p>
        这里不做复杂的后台，也不追求热闹。只是把两个人的时间、照片、愿望和留言按顺序放好，
        等以后回头看的时候，还能准确想起那一天的光。
      </p>
    </section>
  </main>
</template>
