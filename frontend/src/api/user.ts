import { authHeaders, notifyLogout } from '../auth';
import type { CurrentUser, UpdateCurrentUserPayload } from '../types/user';

type FetchLike = typeof fetch;
type ApiErrorBody = {
  message?: unknown;
  error?: unknown;
};

const avatarUploadFallbackMessage = '头像上传失败，请稍后再试';

function getErrorMessageFromBody(errorBody: ApiErrorBody | undefined): string {
  const message = [errorBody?.message, errorBody?.error].find(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  );

  return message || avatarUploadFallbackMessage;
}

function handleUnauthorized(response: Response) {
  if (response.status === 401) {
    notifyLogout();
    throw new Error('登录已过期，请重新登录');
  }
}

export async function getCurrentUser(fetcher: FetchLike = fetch): Promise<CurrentUser> {
  const headers = authHeaders();
  const response = await fetcher('/api/auth/me', headers ? { headers } : undefined);

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error('用户资料加载失败');
  }

  return (await response.json()) as CurrentUser;
}

export async function updateCurrentUser(
  payload: UpdateCurrentUserPayload,
  fetcher: FetchLike = fetch
): Promise<CurrentUser> {
  const response = await fetcher('/api/auth/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify(payload)
  });

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error('资料保存失败');
  }

  return (await response.json()) as CurrentUser;
}

export async function uploadAvatar(file: File, fetcher: FetchLike = fetch): Promise<CurrentUser> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetcher('/api/auth/me/avatar', {
    method: 'POST',
    headers: authHeaders(),
    body: formData
  });

  handleUnauthorized(response);

  if (!response.ok) {
    let errorBody: ApiErrorBody | undefined;
    try {
      errorBody = (await response.json()) as ApiErrorBody;
    } catch {
      errorBody = undefined;
    }

    throw new Error(getErrorMessageFromBody(errorBody));
  }

  return (await response.json()) as CurrentUser;
}
