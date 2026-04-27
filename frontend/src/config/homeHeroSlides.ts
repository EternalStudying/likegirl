import heroStorybookOnsen from '../assets/home-hero/hero-storybook-onsen.png';
import heroStorybookEvening from '../assets/home-hero/hero-storybook-evening.png';

export type HomeHeroSlide = {
  image: string;
  title: string;
  subtitle: string;
  tone: 'spring-snow' | 'warm-diary';
};

export const homeHeroSlides: HomeHeroSlide[] = [
  {
    image: heroStorybookOnsen,
    title: '樱花温泉边',
    subtitle: '把雾气、花瓣和靠近的瞬间，都收进同一页。',
    tone: 'spring-snow'
  },
  {
    image: heroStorybookEvening,
    title: '冬夜暖灯下',
    subtitle: '雪落得很轻，晚灯把两个人的影子照得很长。',
    tone: 'warm-diary'
  }
];
