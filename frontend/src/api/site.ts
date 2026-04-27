import type { MessagePayload, SiteData } from '../types/site';
import { authHeaders, notifyLogout } from '../auth';

type FetchLike = typeof fetch;

export async function fetchSiteData(fetcher: FetchLike = fetch): Promise<SiteData> {
  let response: Response;

  try {
    const headers = authHeaders();
    response = await fetcher('/api/site', headers ? { headers } : undefined);
  } catch {
    throw new Error('站点数据加载失败');
  }

  if (response.status === 401) {
    notifyLogout();
    throw new Error('登录已过期，请重新登录');
  }

  if (!response.ok) {
    throw new Error('站点数据加载失败');
  }

  return (await response.json()) as SiteData;
}

export async function postMessage(payload: MessagePayload, fetcher: FetchLike = fetch): Promise<void> {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders()
  };

  const response = await fetcher('/api/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    notifyLogout();
    throw new Error('登录已过期，请重新登录');
  }

  if (!response.ok) {
    throw new Error('留言提交失败');
  }
}
