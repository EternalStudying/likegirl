<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  avatarUrl?: string;
  name?: string;
  username?: string;
}>();

const palette = [
  ['#df5145', '#fff4e6'],
  ['#f28a2e', '#fffdf9'],
  ['#214f3f', '#fff4e6'],
  ['#c78a19', '#fffdf9']
];

const fallbackName = computed(() => props.name || props.username || 'L');
const initial = computed(() => fallbackName.value.trim().slice(0, 1).toUpperCase() || 'L');

const avatarStyle = computed(() => {
  const seed = Array.from(fallbackName.value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const [main, paper] = palette[seed % palette.length];
  return {
    '--avatar-main': main,
    '--avatar-paper': paper
  };
});
</script>

<template>
  <span class="avatar-shell" :style="avatarStyle">
    <img v-if="avatarUrl" :src="avatarUrl" :alt="`${fallbackName} 的头像`" />
    <span v-else class="generated-avatar" aria-hidden="true">{{ initial }}</span>
  </span>
</template>
