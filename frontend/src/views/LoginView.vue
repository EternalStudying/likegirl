<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  onLogin: (payload: { username: string; password: string }) => Promise<void>;
}>();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function submitLogin() {
  const payload = {
    username: username.value.trim(),
    password: password.value
  };

  if (!payload.username || !payload.password) {
    error.value = '请输入账号和密码';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await props.onLogin(payload);
  } catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败，请稍后再试';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-shell" aria-labelledby="login-title">
      <div class="login-timeline">
        <p class="eyebrow">Timeline</p>
        <h1 id="login-title">
          <span>进入我们的</span>
          <span>时间线</span>
        </h1>
        <p class="login-lead">把纪念日、照片、留言和愿望清单放在同一个入口，只留给知道账号的人。</p>

        <ol>
          <li>
            <time>Day 1</time>
            <span>第一次把普通日子记成纪念日</span>
          </li>
          <li>
            <time>Today</time>
            <span>继续写下新的留言和小事</span>
          </li>
          <li>
            <time>Next</time>
            <span>下一次纪念日前再一起回来看看</span>
          </li>
        </ol>
      </div>

      <form class="login-form" @submit.prevent="submitLogin">
        <div>
          <p class="eyebrow">Private</p>
          <h2>账号登录</h2>
        </div>

        <label>
          账号
          <input v-model="username" name="username" autocomplete="username" />
        </label>

        <label>
          密码
          <input v-model="password" name="password" type="password" autocomplete="current-password" />
        </label>

        <p v-if="error" class="form-error">{{ error }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? '进入中...' : '进入时间线' }}
        </button>
      </form>
    </section>
  </main>
</template>
