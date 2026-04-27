import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from './views/HomeView.vue';
import StoryView from './views/StoryView.vue';
import AlbumView from './views/AlbumView.vue';
import MessagesView from './views/MessagesView.vue';
import WishesView from './views/WishesView.vue';
import AboutView from './views/AboutView.vue';
import UserView from './views/UserView.vue';

export const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  { path: '/story', component: StoryView },
  { path: '/album', component: AlbumView },
  { path: '/messages', component: MessagesView },
  { path: '/wishes', component: WishesView },
  { path: '/about', component: AboutView },
  { path: '/user', component: UserView }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
