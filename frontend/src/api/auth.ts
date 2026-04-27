export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    displayName: string;
  };
}

type FetchLike = typeof fetch;

export async function login(payload: LoginPayload, fetcher: FetchLike = fetch): Promise<LoginResponse> {
  const response = await fetcher('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('账号或密码错误');
  }

  return (await response.json()) as LoginResponse;
}
