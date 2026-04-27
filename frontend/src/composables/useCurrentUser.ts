import { computed, onMounted, ref } from 'vue';
import { getCurrentUser, updateCurrentUser, uploadAvatar } from '../api/user';
import type { CurrentUser, UpdateCurrentUserPayload } from '../types/user';

const user = ref<CurrentUser | null>(null);
const loading = ref(false);
const error = ref('');

export function useCurrentUser(loadOnMount = true) {
  const hasUser = computed(() => Boolean(user.value?.username));

  async function loadCurrentUser() {
    loading.value = true;
    error.value = '';

    try {
      const profile = await getCurrentUser();
      user.value = profile.username ? profile : null;
      return user.value;
    } catch (err) {
      user.value = null;
      error.value = err instanceof Error ? err.message : '用户资料加载失败';
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function saveCurrentUser(payload: UpdateCurrentUserPayload) {
    const profile = await updateCurrentUser(payload);
    user.value = profile;
    return profile;
  }

  async function changeAvatar(file: File) {
    const profile = await uploadAvatar(file);
    user.value = profile;
    return profile;
  }

  if (loadOnMount) {
    onMounted(loadCurrentUser);
  }

  return {
    user,
    hasUser,
    loading,
    error,
    loadCurrentUser,
    saveCurrentUser,
    changeAvatar
  };
}
