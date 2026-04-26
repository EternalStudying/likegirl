<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Message, MessagePayload } from '../types/site';

const props = defineProps<{
  messages: Message[];
  submitMessage: (payload: MessagePayload) => Promise<void>;
  refreshMessages: () => Promise<Message[]>;
}>();

const localMessages = ref<Message[]>([...props.messages]);
const nickname = ref('');
const content = ref('');
const sending = ref(false);
const error = ref('');

watch(
  () => props.messages,
  (messages) => {
    localMessages.value = [...messages];
  }
);

async function onSubmit() {
  const payload = {
    nickname: nickname.value.trim(),
    content: content.value.trim()
  };

  if (!payload.nickname || !payload.content) {
    error.value = '请写下昵称和留言';
    return;
  }

  sending.value = true;
  error.value = '';

  try {
    await props.submitMessage(payload);
    localMessages.value = await props.refreshMessages();
    nickname.value = '';
    content.value = '';
  } catch {
    error.value = '留言暂时没有送达，请稍后再试';
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <section class="section message-section" id="messages">
    <div class="section-heading">
      <p>Message</p>
      <h2>留言板</h2>
    </div>

    <div class="message-layout">
      <form class="message-form" @submit.prevent="onSubmit">
        <label>
          昵称
          <input v-model="nickname" name="nickname" maxlength="18" autocomplete="name" />
        </label>
        <label>
          留言
          <textarea v-model="content" name="content" maxlength="160" rows="5" />
        </label>
        <p v-if="error" class="form-error">{{ error }}</p>
        <button type="submit" :disabled="sending">{{ sending ? '送达中' : '写下留言' }}</button>
      </form>

      <div class="message-list" aria-live="polite">
        <article v-for="message in localMessages" :key="message.id" class="message-item">
          <div>
            <strong>{{ message.nickname }}</strong>
            <time>{{ message.createdAt }}</time>
          </div>
          <p>{{ message.content }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
