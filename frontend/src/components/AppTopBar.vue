<script setup lang="ts">
import { computed } from 'vue';
import UserAvatar from './UserAvatar.vue';
import { useCurrentUser } from '../composables/useCurrentUser';

const { user, hasUser } = useCurrentUser();

const displayName = computed(() => user.value?.displayName || user.value?.username || 'LikeGirl');
const userAriaLabel = computed(() => `打开个人资料页：${displayName.value}`);
</script>

<template>
  <header class="app-topbar" aria-label="登录后导航">
    <div class="app-topbar__inner">
      <p class="app-topbar__quote">收好我们的日常与心动</p>

      <RouterLink v-if="hasUser && user" class="app-topbar__user" to="/user" :aria-label="userAriaLabel">
        <UserAvatar :avatar-url="user.avatarUrl" :name="displayName" :username="user.username" />
        <span class="app-topbar__user-text">
          <strong class="app-topbar__user-name">{{ displayName }}</strong>
          <small class="app-topbar__user-handle">@{{ user.username }}</small>
        </span>
      </RouterLink>
    </div>
  </header>
</template>
