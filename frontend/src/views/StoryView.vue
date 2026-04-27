<script setup lang="ts">
import { computed } from 'vue';
import BackHomeLink from '../components/BackHomeLink.vue';
import PageLoader from '../components/PageLoader.vue';
import { useSiteData } from '../composables/useSiteData';
import type { SiteData } from '../types/site';

const { site } = useSiteData();

const storyItems = computed(() => {
  type StoryItem =
    | { type: 'memory'; id: string; date: string; memory: SiteData['memories'][number]; moment: number }
    | { type: 'photo'; id: string; date: string; photo: SiteData['photos'][number] };

  let moment = 0;
  if (!site.value) {
    return [];
  }

  return [
    ...site.value.memories.map((memory) => ({
      type: 'memory' as const,
      id: `memory-${memory.id}`,
      date: memory.date,
      memory,
      moment: 0
    })),
    ...site.value.photos.map((photo) => ({
      type: 'photo' as const,
      id: `photo-${photo.id}`,
      date: photo.date,
      photo
    }))
  ]
    .sort((left, right) => left.date.localeCompare(right.date))
    .map((item): StoryItem => {
      if (item.type === 'memory') {
        moment += 1;
        return { ...item, moment };
      }

      return item;
    });
});
</script>

<template>
  <main>
    <section class="section page-head">
      <BackHomeLink />
      <div class="section-heading">
        <p>Story Scroll</p>
        <h1>故事卷轴</h1>
      </div>
    </section>

    <section v-if="site" class="section story-section">
      <div class="story-scroll">
        <article
          v-for="(item, index) in storyItems"
          :key="item.id"
          class="story-item"
          :class="[`story-item--${item.type}`, { 'story-item--right': index % 2 === 1 }]"
        >
          <template v-if="item.type === 'memory'">
            <time>{{ item.memory.date }}</time>
            <div class="story-card">
              <p class="story-kicker">Moment {{ String(item.moment).padStart(2, '0') }}</p>
              <h3>{{ item.memory.title }}</h3>
              <p>{{ item.memory.content }}</p>
              <div class="story-tags">
                <span v-for="tag in item.memory.tags" :key="tag">#{{ tag }}</span>
              </div>
            </div>
          </template>

          <template v-else>
            <time>{{ item.photo.date }}</time>
            <figure class="story-photo">
              <img :src="item.photo.url" :alt="item.photo.caption" loading="lazy" />
              <figcaption>
                <span>{{ item.photo.caption }}</span>
                <time>{{ item.photo.date }}</time>
              </figcaption>
            </figure>
          </template>
        </article>
      </div>
    </section>

    <PageLoader v-else />
  </main>
</template>
