<script setup lang="ts">
import BackHomeLink from '../components/BackHomeLink.vue';
import PageLoader from '../components/PageLoader.vue';
import { useSiteData } from '../composables/useSiteData';

const { site, togetherDays } = useSiteData();
</script>

<template>
  <main>
    <section class="section page-head">
      <BackHomeLink />
      <div class="section-heading">
        <p>About Us</p>
        <h1>关于我们</h1>
      </div>
    </section>

    <section v-if="site" class="section about-section">
      <p>
        {{ site.couple.personA }} 和 {{ site.couple.personB }} 从 {{ site.couple.startDate }}
        开始，把普通日子慢慢收进这本纪念册。今天是第 {{ togetherDays }} 天。
      </p>
      <p>{{ site.couple.slogan }}</p>
    </section>

    <PageLoader v-else />
  </main>
</template>
