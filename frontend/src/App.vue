<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, type LoginPayload } from './api/auth';
import { clearAuthToken, getAuthToken, onLogout, setAuthToken } from './auth';
import AppTopBar from './components/AppTopBar.vue';
import PointerEffects from './components/PointerEffects.vue';
import LoginView from './views/LoginView.vue';

const router = useRouter();
const isLoggedIn = ref(Boolean(getAuthToken()));
let stopLogout: (() => void) | undefined;

async function handleLogin(payload: LoginPayload) {
  const response = await login(payload);
  setAuthToken(response.token);
  await router.replace('/');
  isLoggedIn.value = true;
}

function handleLogout() {
  clearAuthToken();
  isLoggedIn.value = false;
}

onMounted(() => {
  stopLogout = onLogout(handleLogout);
});

onUnmounted(() => {
  stopLogout?.();
});
</script>

<template>
  <PointerEffects />
  <template v-if="isLoggedIn">
    <AppTopBar />
    <RouterView />
  </template>
  <LoginView v-else :on-login="handleLogin" />
</template>
