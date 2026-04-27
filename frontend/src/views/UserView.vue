<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import BackHomeLink from '../components/BackHomeLink.vue';
import UserAvatar from '../components/UserAvatar.vue';
import { useCurrentUser } from '../composables/useCurrentUser';

const { user, hasUser, loading, error, saveCurrentUser, changeAvatar } = useCurrentUser();

const form = reactive({
  displayName: '',
  bio: '',
  mood: ''
});

const saving = ref(false);
const uploading = ref(false);
const editing = ref(false);
const saveMessage = ref('');
const profileError = ref('');
const uploadError = ref('');
const editButtonRef = ref<HTMLButtonElement | null>(null);
const displayNameInputRef = ref<HTMLInputElement | null>(null);

const displayName = computed(() => user.value?.displayName || user.value?.username || 'LikeGirl');

function syncProfileForm() {
  if (!user.value) return;
  form.displayName = user.value.displayName || '';
  form.bio = user.value.bio || '';
  form.mood = user.value.mood || '';
}

watch(
  user,
  (profile) => {
    if (!profile) return;
    syncProfileForm();
  },
  { immediate: true }
);

function handleProfileEsc(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeProfileModal();
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleProfileEsc);
});

async function openProfileModal() {
  syncProfileForm();
  saveMessage.value = '';
  profileError.value = '';
  document.addEventListener('keydown', handleProfileEsc);
  editing.value = true;
  await nextTick();
  displayNameInputRef.value?.focus();
}

function closeProfileModal() {
  if (!editing.value) return;
  editing.value = false;
  document.removeEventListener('keydown', handleProfileEsc);
  nextTick(() => {
    editButtonRef.value?.focus();
  });
}

async function submitProfile() {
  saving.value = true;
  saveMessage.value = '';
  profileError.value = '';

  try {
    await saveCurrentUser({
      displayName: form.displayName,
      bio: form.bio,
      mood: form.mood
    });
    saveMessage.value = '资料已保存';
    closeProfileModal();
  } catch (err) {
    profileError.value = err instanceof Error ? err.message : '资料保存失败';
  } finally {
    saving.value = false;
  }
}

async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  uploading.value = true;
  uploadError.value = '';

  try {
    await changeAvatar(file);
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : '头像上传失败，请稍后再试';
  } finally {
    uploading.value = false;
    input.value = '';
  }
}
</script>

<template>
  <main class="user-profile-page">
    <section class="section page-head user-page-head" aria-labelledby="user-title">
      <BackHomeLink />
      <p class="eyebrow">Profile Journal</p>
      <h1 id="user-title">我的手账页</h1>
    </section>

    <section v-if="hasUser && user" class="section user-profile-shell">
      <div class="user-cover" :class="{ 'is-editing': editing }">
        <span class="user-cover__spark user-cover__spark--one" aria-hidden="true">✦</span>
        <span class="user-cover__spark user-cover__spark--two" aria-hidden="true">✧</span>

        <div class="user-avatar-panel" :class="{ uploading }">
          <UserAvatar :avatar-url="user.avatarUrl" :name="displayName" :username="user.username" />
          <label class="avatar-upload">
            <input type="file" accept="image/*" @change="handleAvatarChange" />
            <span>{{ uploading ? '上传中...' : '更换头像' }}</span>
          </label>
        </div>

        <div class="user-cover__copy">
          <span class="user-sticker">TODAY</span>
          <h2>{{ displayName }}</h2>
          <p>@{{ user.username }}</p>
          <strong>{{ user.mood || '今天也想认真记录' }}</strong>
          <small>{{ user.bio || '还没有写简介，留一页给新的心情。' }}</small>
          <button
            class="profile-edit-toggle"
            type="button"
            aria-controls="profile-edit-panel"
            :aria-expanded="editing ? 'true' : 'false'"
            ref="editButtonRef"
            @click="openProfileModal"
          >
            编辑资料
          </button>
        </div>

        <p v-if="uploadError" class="form-error user-cover-alert" role="alert">{{ uploadError }}</p>
      </div>
    </section>

    <section v-else class="section user-profile-shell">
      <p class="form-error">{{ loading ? '正在读取个人资料...' : error || '用户资料加载失败' }}</p>
    </section>
  </main>

  <Teleport to="body">
    <div v-if="editing" class="profile-edit-modal" @click.self="closeProfileModal">
      <section
        id="profile-edit-panel"
        class="profile-edit-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
      >
        <span class="profile-edit-tape profile-edit-tape--left" aria-hidden="true"></span>
        <span class="profile-edit-tape profile-edit-tape--right" aria-hidden="true"></span>

        <div class="profile-edit-head">
          <h2 id="profile-edit-title">编辑资料</h2>
          <button class="profile-edit-close" type="button" aria-label="关闭编辑资料弹窗" @click="closeProfileModal">×</button>
        </div>

        <form class="user-edit-form profile-edit-form" @submit.prevent="submitProfile">
          <label>
            昵称
            <input
              ref="displayNameInputRef"
              v-model="form.displayName"
              name="displayName"
              maxlength="32"
              autocomplete="name"
            />
          </label>
          <label>
            简介
            <textarea v-model="form.bio" name="bio" rows="4" maxlength="180"></textarea>
          </label>
          <label>
            今日心情
            <input v-model="form.mood" name="mood" maxlength="60" />
          </label>
          <p v-if="profileError" class="form-error" role="alert">{{ profileError }}</p>
          <div class="profile-edit-actions">
            <button class="profile-edit-cancel" type="button" @click="closeProfileModal">取消</button>
            <button class="profile-edit-save" type="submit" :disabled="saving">{{ saving ? '保存中...' : '保存资料' }}</button>
          </div>
        </form>
      </section>
    </div>
  </Teleport>
</template>
