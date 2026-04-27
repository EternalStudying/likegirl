export interface CurrentUser {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  mood: string;
  updatedAt: string;
}

export interface UpdateCurrentUserPayload {
  displayName: string;
  bio: string;
  mood: string;
}
