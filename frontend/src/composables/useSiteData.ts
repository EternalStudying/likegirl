import { computed, onMounted, ref } from 'vue';
import { fetchSiteData } from '../api/site';
import type { SiteData } from '../types/site';
import { daysTogether, nextAnniversaryCountdown } from '../utils/date';

export function useSiteData() {
  const site = ref<SiteData | null>(null);
  const loading = ref(false);
  const loaded = ref(false);
  const error = ref('');

  const togetherDays = computed(() => (site.value ? daysTogether(site.value.couple.startDate) : 0));
  const anniversary = computed(() =>
    site.value ? nextAnniversaryCountdown(site.value.couple.anniversaryDate) : { days: 0, date: '' }
  );

  async function loadSite() {
    loading.value = true;
    error.value = '';

    try {
      site.value = await fetchSiteData();
      loaded.value = true;
      return site.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '站点数据加载失败';
      return null;
    } finally {
      loading.value = false;
    }
  }

  onMounted(loadSite);

  return {
    site,
    loading,
    loaded,
    error,
    togetherDays,
    anniversary,
    loadSite
  };
}
