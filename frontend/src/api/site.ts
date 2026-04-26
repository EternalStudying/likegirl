import { mockSiteData } from '../mock/siteData';
import type { MessagePayload, SiteData } from '../types/site';

type FetchLike = typeof fetch;

export async function fetchSiteData(fetcher: FetchLike = fetch): Promise<SiteData> {
  try {
    const response = await fetcher('/api/site');
    if (!response.ok) {
      return mockSiteData;
    }

    return (await response.json()) as SiteData;
  } catch {
    return mockSiteData;
  }
}

export async function postMessage(payload: MessagePayload, fetcher: FetchLike = fetch): Promise<void> {
  const response = await fetcher('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('留言提交失败');
  }
}
