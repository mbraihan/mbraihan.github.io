import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'News dates must use YYYY-MM-DD'),
    title: z.string(),
    description: z.string(),
    icon: z.enum(['document', 'plane', 'graduation-cap', 'trophy', 'star', 'award', 'news', 'users']).default('news'),
    iconColor: z.string().optional().default('blue'),
    category: z.enum(['Milestone', 'Publication', 'Grant', 'Service', 'Travel', 'Other']).default('Other'),
    link: z.string().optional(),
    relatedPublicationId: z.string().optional(),
  }),
});

const publicationsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    correspondingAuthor: z.string().optional(),
    institution: z.string().optional(),
    venue: z.string(),
    venueShort: z.string().optional(),
    year: z.number(),
    type: z.enum(['Journal', 'Conference', 'Workshop', 'Book Chapter', 'Poster']).default('Conference'),
    tags: z.array(z.string()).default([]),
    selected: z.boolean().default(false),
    image: z.string().optional(),
    bannerCaption: z.string().optional(),
    pdf: z.string().optional(),
    arxiv: z.string().optional(),
    github: z.string().optional(),
    poster: z.string().optional(),
    website: z.string().optional(),
    video: z.string().optional(),
    presentationVideo: z.string().optional(),
    presentation: z.string().optional(),
    code: z.string().optional(),
    data: z.string().optional(),
    doi: z.string().optional(),
    bibtex: z.string().optional(),
    abstract: z.string().optional(),
    tldr: z.string().optional(),
    methodologyText: z.string().optional(),
    methodologyImages: z.array(z.string()).optional(),
    methodologyCaptions: z.array(z.string()).optional(),
    methodologyVideos: z.array(z.object({
      title: z.string(),
      embedSrc: z.string(),
      description: z.string().optional(),
    })).optional(),
    resultsText: z.string().optional(),
    resultsImages: z.array(z.string()).optional(),
    resultsCaptions: z.array(z.string()).optional(),
    applicationText: z.string().optional(),
    applicationVideo: z.string().optional(),
    designGuidelines: z.array(z.string()).optional(),
    relatedPaperIds: z.array(z.string()).optional(),
    acceptanceNewsId: z.string().optional(),
    order: z.number().default(0),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    link: z.string().optional(),
    github: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.enum(['Research', 'Updates', 'Thoughts', 'Technical', 'Journey', 'Other']).default('Other'),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    caption: z.string().optional(),
    readingTime: z.string().optional().default('5 min read'),
    pinned: z.boolean().default(false),
    draft: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = {
  news: newsCollection,
  publications: publicationsCollection,
  projects: projectsCollection,
  posts: postsCollection,
};
