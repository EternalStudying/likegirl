<script setup lang="ts">
import UserAvatar from './UserAvatar.vue';
import { useCurrentUser } from '../composables/useCurrentUser';

const { user, hasUser } = useCurrentUser();
</script>

<template>
  <RouterLink v-if="hasUser && user" class="user-badge" to="/user" aria-label="打开个人资料页">
    <UserAvatar :avatar-url="user.avatarUrl" :name="user.displayName" :username="user.username" />
    <span>
      <strong>{{ user.displayName || user.username }}</strong>
      <small>@{{ user.username }}</small>
    </span>
  </RouterLink>
</template>
