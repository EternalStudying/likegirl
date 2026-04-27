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
        <p>Wish List</p>
        <h1>恋爱清单</h1>
      </div>
    </section>

    <section v-if="site" class="section wish-section" aria-labelledby="wish-title">
      <div class="section-heading">
        <p>List</p>
        <h2 id="wish-title">一起完成的小计划</h2>
      </div>
      <ul class="wish-list">
        <li v-for="wish in site.wishes" :key="wish.id" :class="{ done: wish.done }">
          <span>{{ wish.done ? '完成' : '待完成' }}</span>
          {{ wish.title }}
        </li>
      </ul>
    </section>

    <PageLoader v-else />
  </main>
</template>
