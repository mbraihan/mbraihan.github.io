import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { galleryAlbums } from '../data/galleryData';

const siteUrl = 'https://mbraihan.github.io';

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  }[character] || character));
}

export const GET: APIRoute = async () => {
  const publications = await getCollection('publications');
  const posts = await getCollection('posts');
  const urls = [
    '/',
    '/news',
    '/publications',
    '/tools',
    ...publications.map(({ id }) => `/publications/${id}`),
    ...posts.map(({ id }) => `/posts/${id}`),
    ...galleryAlbums.filter((album) => album.isPublic && !album.draft).map(({ id }) => `/gallery/${id}`),
  ];

  const body = urls.map((url) => `  <url><loc>${escapeXml(`${siteUrl}${url}`)}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
