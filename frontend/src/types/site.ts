export interface Couple {
  personA: string;
  personB: string;
  startDate: string;
  anniversaryDate: string;
  slogan: string;
}

export interface Hero {
  title: string;
  slogan: string;
}

export interface Memory {
  id: number;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

export interface Photo {
  id: number;
  url: string;
  caption: string;
  date: string;
}

export interface WishItem {
  id: number;
  title: string;
  done: boolean;
}

export interface Message {
  id: number;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface SiteData {
  couple: Couple;
  hero: Hero;
  memories: Memory[];
  photos: Photo[];
  wishes: WishItem[];
  messages: Message[];
}

export interface MessagePayload {
  nickname: string;
  content: string;
}
