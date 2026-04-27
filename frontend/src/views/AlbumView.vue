<script setup lang="ts">
import BackHomeLink from '../components/BackHomeLink.vue';
import PageLoader from '../components/PageLoader.vue';
import { useSiteData } from '../composables/useSiteData';

const { site } = useSiteData();
</script>

<template>
  <main>
    <section class="section page-head">
      <BackHomeLink />
      <div class="section-heading">
        <p>Photo Album</p>
        <h1>照片相册</h1>
      </div>
    </section>

    <section v-if="site" class="section album-grid" aria-label="照片相册">
      <figure v-for="photo in site.photos" :key="photo.id" class="album-photo">
        <img :src="photo.url" :alt="photo.caption" loading="lazy" />
        <figcaption>
          <span>{{ photo.caption }}</span>
          <time>{{ photo.date }}</time>
        </figcaption>
      </figure>
    </section>

    <PageLoader v-else />
  </main>
</template>
