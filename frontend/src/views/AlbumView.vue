<script setup lang="ts">
import { computed } from 'vue';
import PageLoader from '../components/PageLoader.vue';
import { useSiteData } from '../composables/useSiteData';
import dryFlowerTaped from '../assets/album-scrapbook/dry-flower-taped.png';
import flowerStickerSmall from '../assets/album-scrapbook/flower-sticker-small.png';
import heartSketchRed from '../assets/album-scrapbook/heart-sketch-red.png';
import heroRedUnderline from '../assets/album-scrapbook/hero-red-underline.png';
import leafBranch from '../assets/album-scrapbook/leaf-branch.png';
import leafSticker from '../assets/album-scrapbook/leaf-sticker.png';
import lovePostmarkLarge from '../assets/album-scrapbook/love-postmark-large.png';
import smallDaisy from '../assets/album-scrapbook/small-daisy.png';
import stampLovePostmark from '../assets/album-scrapbook/stamp-love-postmark.png';
import tapeBeigeLong from '../assets/album-scrapbook/tape-beige-long.png';
import tapeGreenLong from '../assets/album-scrapbook/tape-green-long.png';
import tapeGridWhite from '../assets/album-scrapbook/tape-grid-white.png';
import tapeRedLong from '../assets/album-scrapbook/tape-red-long.png';
import ticketDateGreen from '../assets/album-scrapbook/ticket-date-green.png';
import ticketDateRed from '../assets/album-scrapbook/ticket-date-red.png';
import type { Photo } from '../types/site';

type AlbumPhoto = Photo & {
  cardId: string;
};

const { site } = useSiteData();

const fallbackPhotos: AlbumPhoto[] = [
  {
    id: 101,
    cardId: 'fallback-weekend-date',
    url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80',
    caption: '周末约会',
    date: '2023-09-09'
  },
  {
    id: 102,
    cardId: 'fallback-coffee',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    caption: '午后咖啡',
    date: '2023-04-18'
  },
  {
    id: 103,
    cardId: 'fallback-spring-garden',
    url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
    caption: '春日花园',
    date: '2023-03-27'
  },
  {
    id: 104,
    cardId: 'fallback-sunset',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: '海边日落',
    date: '2023-02-14'
  },
  {
    id: 105,
    cardId: 'fallback-evening-diary',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    caption: '晚风日记',
    date: '2023-01-11'
  },
  {
    id: 106,
    cardId: 'fallback-first-snow',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    caption: '初雪之夜',
    date: '2022-12-24'
  },
  {
    id: 107,
    cardId: 'fallback-spring-trip',
    url: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80',
    caption: '春日旅行',
    date: '2022-04-05'
  }
];

const tapeAssets = [tapeBeigeLong, tapeGreenLong, tapeGridWhite, tapeRedLong];
const stickerAssets = [flowerStickerSmall, stampLovePostmark, smallDaisy, leafSticker, leafBranch];
const tapeAssetPattern = [0, 2, 1, 3, 3, 0, 2, 1];
const rotatePattern = [-0.7, 0.45, -0.35, 0.65, 0.4, -0.55, 0.3, -0.45];
const tapeRotatePattern = [-5.5, 3.5, -2.2, 5.8, 4.6, -3.8, 2.2, -5];
const tapeLeftPattern = [32, 58, 44, 72, 48, 36, 66, 52];

const albumPhotos = computed<AlbumPhoto[]>(() => {
  const realPhotos =
    site.value?.photos.map((photo) => ({
      ...photo,
      cardId: `photo-${photo.id}`
    })) ?? [];
  const realCaptions = new Set(realPhotos.map((photo) => photo.caption));
  const fillers = fallbackPhotos.filter((photo) => !realCaptions.has(photo.caption));

  return [...realPhotos, ...fillers].slice(0, 8);
});

function albumMotionStyle(index: number) {
  return {
    '--delay': `${Math.min(index * 55, 360)}ms`,
    '--rotate': `${rotatePattern[index % rotatePattern.length]}deg`,
    '--tape-rotate': `${tapeRotatePattern[index % tapeRotatePattern.length]}deg`,
    '--tape-left': `${tapeLeftPattern[index % tapeLeftPattern.length]}px`,
    '--sticker-rotate': `${[-8, 10, -5, 7][index % 4]}deg`
  };
}

function tapeFor(index: number) {
  return tapeAssets[tapeAssetPattern[index % tapeAssetPattern.length]];
}

function stickerFor(index: number) {
  return stickerAssets[index % stickerAssets.length];
}

function ticketFor(index: number) {
  return index % 3 === 1 ? ticketDateGreen : ticketDateRed;
}
</script>

<template>
  <main class="album-page">
    <section v-if="site" class="album-page__inner" aria-label="照片相册">
      <img class="album-asset album-dry-flower" :src="dryFlowerTaped" alt="" draggable="false" />
      <img class="album-asset album-postmark" :src="lovePostmarkLarge" alt="" draggable="false" />

      <header class="album-hero">
        <p>PHOTO&nbsp;&nbsp;ALBUM</p>
        <h1>
          照片相册
          <img class="album-title-heart" :src="heartSketchRed" alt="" draggable="false" />
        </h1>
        <span class="album-hero__copy">每一张照片，都是我们故事里最温柔的片段。</span>
        <img class="album-hero__underline" :src="heroRedUnderline" alt="" draggable="false" />
      </header>

      <section class="album-grid" aria-label="相册照片列表">
        <article
          v-for="(photo, index) in albumPhotos"
          :key="photo.cardId"
          class="album-card"
          :style="albumMotionStyle(index)"
        >
          <img class="album-card__tape" :src="tapeFor(index)" alt="" draggable="false" />
          <figure class="album-card__figure">
            <img class="album-card__image" :src="photo.url" :alt="photo.caption" loading="lazy" />
            <figcaption class="album-card__footer">
              <span class="album-card__title">{{ photo.caption }}</span>
              <time class="album-card__date" :datetime="photo.date">
                <img :src="ticketFor(index)" alt="" draggable="false" />
                <span>{{ photo.date }}</span>
              </time>
            </figcaption>
          </figure>
          <img
            v-if="index !== 3"
            class="album-card__sticker"
            :src="stickerFor(index)"
            alt=""
            draggable="false"
          />
        </article>
      </section>
    </section>

    <PageLoader v-else />
  </main>
</template>
