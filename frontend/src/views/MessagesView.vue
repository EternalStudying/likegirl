<script setup lang="ts">
import { postMessage } from '../api/site';
import BackHomeLink from '../components/BackHomeLink.vue';
import MessageBoard from '../components/MessageBoard.vue';
import PageLoader from '../components/PageLoader.vue';
import { useSiteData } from '../composables/useSiteData';
import type { Message, MessagePayload } from '../types/site';

const { site, loadSite } = useSiteData();

async function submitMessage(payload: MessagePayload) {
  await postMessage(payload);
}

async function refreshMessages(): Promise<Message[]> {
  const nextSite = await loadSite();
  return nextSite?.messages ?? site.value?.messages ?? [];
}
</script>

<template>
  <main>
    <section class="section page-head">
      <BackHomeLink />
    </section>

    <MessageBoard
      v-if="site"
      :messages="site.messages"
      :submit-message="submitMessage"
      :refresh-messages="refreshMessages"
    />

    <PageLoader v-else />
  </main>
</template>
