export interface GalleryPhoto {
  id: string;
  albumId: string;
  title: string;
  caption: string;
  storyText?: string;
  locationDate: string;
  category: 'Conference' | 'People' | 'City' | 'Food' | 'Travel' | 'Campus';
  src: string;
  aspect?: 'normal' | 'tall' | 'wide';
}

export interface TripAlbumRef {
  id: string;
  title: string;
  coverImage: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  location: string;
  coverImage: string;
  description: string;
  categories: string[];
  tags: string[];
  days: number;
  isPublic: boolean;
  createdAt: string;
  featured?: boolean;
  draft?: boolean;
  tripAlbums?: TripAlbumRef[];
  photos: GalleryPhoto[];
}

export const galleryCategories = [
  'All',
  'Conference Moments',
  'Travel',
  'City Walks',
  'Friends & Colleagues',
  'Behind the Scenes',
  'Campus Life'
];

export const galleryAlbums: GalleryAlbum[] = [
  {
    id: 'barcelona-chi-2026',
    title: 'Conference Week in Barcelona',
    subtitle: 'An inspiring week at CHI 2026—great talks, meaningful conversations, and beautiful moments exploring Barcelona.',
    dateRange: 'Apr 18 – Apr 23, 2026',
    location: 'Barcelona, Spain',
    coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    description: 'An inspiring week at CHI 2026—great talks, meaningful conversations, and beautiful moments exploring Barcelona with amazing people.',
    categories: ['Conference Moments', 'Travel', 'City Walks'],
    tags: ['Conference', 'Travel', 'Barcelona'],
    days: 6,
    isPublic: true,
    createdAt: 'Apr 24, 2026',
    featured: true,
    photos: [
      {
        id: 'bcn-1',
        albumId: 'barcelona-chi-2026',
        title: 'Sagrada Família Viewpoint',
        caption: 'Overlooking Antoni Gaudí\'s masterpiece during an afternoon city stroll in Barcelona.',
        storyText: 'After a full day of research presentations at CHI 2026, a group of us walked up to the rooftop terrace overlooking Sagrada Família. The golden hour lighting hit the spires perfectly.',
        locationDate: 'Barcelona, Spain — Apr 20, 2026',
        category: 'City',
        src: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'bcn-2',
        albumId: 'barcelona-chi-2026',
        title: 'Poster Session at CHI 2026',
        caption: 'Presenting our paper on spatial interactions in collaborative XR environments.',
        storyText: 'Engaging discussions with researchers and attendees during the poster session. Great feedback on our gaze-assisted object selection framework!',
        locationDate: 'Barcelona Convention Centre — Apr 19, 2026',
        category: 'Conference',
        src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'bcn-3',
        albumId: 'barcelona-chi-2026',
        title: 'Exploring the Gothic Quarter',
        caption: 'Wandering through the historic narrow alleyways of Barri Gòtic.',
        storyText: 'The architecture of Barcelona\'s Gothic Quarter is mesmerising. Ancient stone arches, hidden courtyards, and vibrant street life around every corner.',
        locationDate: 'Barri Gòtic, Barcelona — Apr 21, 2026',
        category: 'City',
        src: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  {
    id: 'chi-2025-yokohama',
    title: 'CHI 2025 – Yokohama, Japan',
    subtitle: 'Attending and presenting our work at CHI 2025, connecting with amazing people, and exploring the beautiful city of Yokohama.',
    dateRange: 'Apr 26 – May 1, 2025',
    location: 'Yokohama, Japan',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    description: 'Attending and presenting our work at CHI 2025, connecting with amazing people, and exploring the beautiful city of Yokohama.',
    categories: ['Conference Moments', 'Travel', 'Friends & Colleagues'],
    tags: ['CHI 2025', 'Conference', 'Yokohama', 'Japan', 'Networking', 'Travel'],
    days: 6,
    isPublic: true,
    createdAt: 'May 2, 2025',
    featured: false,
    tripAlbums: [
      {
        id: 'chi-2025-yokohama',
        title: 'CHI 2025 – Yokohama, Japan',
        coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'tokyo-exploration',
        title: 'Tokyo Exploration',
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'kamakura-day-trip',
        title: 'Kamakura Day Trip',
        coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
      }
    ],
    photos: [
      {
        id: 'yokohama-1',
        albumId: 'chi-2025-yokohama',
        title: 'PACIFICO Yokohama Convention Hall',
        caption: 'Main entrance of PACIFICO Yokohama on the opening day of CHI 2025.',
        storyText: 'Arriving at the conference venue in Minato Mirai. The seaside location provided a stunning backdrop for CHI 2025.',
        locationDate: 'PACIFICO Yokohama — Apr 26, 2025',
        category: 'Conference',
        src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'yokohama-2',
        albumId: 'chi-2025-yokohama',
        title: 'Yokohama Minato Mirai Skyline',
        caption: 'Panoramic view of Cosmo Clock 21 ferris wheel and Yokohama Landmark Tower at dusk.',
        storyText: 'Evening walk along the harbor after attending the keynote session. Yokohama\'s illuminated waterfront is breathtaking.',
        locationDate: 'Minato Mirai, Yokohama — Apr 27, 2025',
        category: 'City',
        src: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'yokohama-3',
        albumId: 'chi-2025-yokohama',
        title: 'Paper Presentation at CHI 2025',
        caption: 'Presenting our research on gaze-assisted selection in Cross-Reality environments.',
        storyText: 'Delivering our talk in Room 301. It was rewarding to share our findings and take questions from leading HCI researchers.',
        locationDate: 'PACIFICO Yokohama — Apr 28, 2025',
        category: 'Conference',
        src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'yokohama-4',
        albumId: 'chi-2025-yokohama',
        title: 'Lab Reunion & Coffee Break',
        caption: 'Catching up with colleagues and alumni over Japanese matcha iced tea.',
        storyText: 'One of the highlights of international conferences is reuniting with researchers and friends from different labs around the world.',
        locationDate: 'Yokohama Waterfront — Apr 29, 2025',
        category: 'People',
        src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'yokohama-5',
        albumId: 'chi-2025-yokohama',
        title: 'Dinner at Yokohama Chinatown',
        caption: 'Enjoying authentic dim sum and ramen at Japan\'s largest Chinatown.',
        storyText: 'We celebrated our presentation night at Yokohama Chinatown (Chukagai). The lively atmosphere and delicious food made for a memorable night.',
        locationDate: 'Chinatown, Yokohama — Apr 29, 2025',
        category: 'Food',
        src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'yokohama-6',
        albumId: 'chi-2025-yokohama',
        title: 'Cherry Blossoms at Yamashita Park',
        caption: 'Late season Sakura blooming along the Yokohama harbor promenade.',
        storyText: 'Walking through Yamashita Park under gentle cherry blossom petals. A serene moment before catching our flight back home.',
        locationDate: 'Yamashita Park — May 1, 2025',
        category: 'City',
        src: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'cambridge-bridge',
        albumId: 'chi-2025-yokohama',
        title: 'Mathematical Bridge at Queens\' College',
        caption: 'One of the first pictures I took coming into Cambridge as a fresh first year student.',
        storyText: 'The Mathematical Bridge is a wooden footbridge that spans the River Cam. It\'s an example of geometric engineering, assembled entirely without the use of bolts or screws, just wooden joints.',
        locationDate: 'Cambridge, Sep 2015',
        category: 'Travel',
        src: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  {
    id: 'poster-session-moment',
    title: 'Poster Session Moment',
    subtitle: 'Interactive discussions with HCI scholars during the main poster track.',
    dateRange: 'Apr 19, 2026',
    location: 'Barcelona, Spain',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: 'Interactive discussions with HCI scholars during the main poster track.',
    categories: ['Conference Moments'],
    tags: ['Conference', 'CHI 2026', 'Barcelona'],
    days: 1,
    isPublic: true,
    createdAt: 'Apr 20, 2026',
    photos: []
  },
  {
    id: 'talk-day-chi-2026',
    title: 'Talk Day at CHI 2026',
    subtitle: 'Presenting our paper on spatial interactions and gaze behavior.',
    dateRange: 'Apr 20, 2026',
    location: 'Barcelona, Spain',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    description: 'Presenting our paper on spatial interactions and gaze behavior.',
    categories: ['Conference Moments', 'Behind the Scenes'],
    tags: ['Talks', 'Conference', 'Barcelona'],
    days: 1,
    isPublic: true,
    createdAt: 'Apr 21, 2026',
    photos: []
  },
  {
    id: 'exploring-barcelona',
    title: 'Exploring Barcelona',
    subtitle: 'Walking through gothic architecture, seaside walks, and vibrant plazas.',
    dateRange: 'Apr 21, 2026',
    location: 'Barcelona, Spain',
    coverImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
    description: 'Walking through gothic architecture, seaside walks, and vibrant plazas.',
    categories: ['Travel', 'City Walks'],
    tags: ['Travel', 'City Walk', 'Barcelona'],
    days: 2,
    isPublic: true,
    createdAt: 'Apr 22, 2026',
    photos: []
  },
  {
    id: 'evening-walk-boston',
    title: 'Evening Walk in Boston',
    subtitle: 'A quiet sunset along the Charles River after lab meetings at MIT.',
    dateRange: 'Oct 14, 2025',
    location: 'Boston, USA',
    coverImage: 'https://images.unsplash.com/photo-1506551907304-60bb62ffc9b0?auto=format&fit=crop&w=1200&q=80',
    description: 'A quiet sunset along the Charles River after lab meetings at MIT.',
    categories: ['Travel', 'City Walks'],
    tags: ['Travel', 'Boston', 'City Walk'],
    days: 1,
    isPublic: true,
    createdAt: 'Oct 15, 2025',
    photos: []
  },
  {
    id: 'coffee-break-conversations',
    title: 'Coffee Break Conversations',
    subtitle: 'Valuable networking and spontaneous ideas over espresso.',
    dateRange: 'Apr 20, 2026',
    location: 'Barcelona, Spain',
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    description: 'Valuable networking and spontaneous ideas over espresso.',
    categories: ['Conference Moments', 'Friends & Colleagues'],
    tags: ['Conference', 'Friends', 'Networking'],
    days: 1,
    isPublic: true,
    createdAt: 'Apr 21, 2026',
    photos: []
  },
  {
    id: 'ismar-2024-tokyo',
    title: 'Group Photo at ISMAR 2024',
    subtitle: 'Memories with international AR/VR researchers in Tokyo.',
    dateRange: 'Oct 21 – Oct 25, 2024',
    location: 'Tokyo, Japan',
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    description: 'Memories with international AR/VR researchers in Tokyo.',
    categories: ['Conference Moments', 'Friends & Colleagues'],
    tags: ['Conference', 'ISMAR 2024', 'Tokyo'],
    days: 5,
    isPublic: true,
    createdAt: 'Oct 26, 2024',
    photos: []
  },
  {
    id: 'tokyo-city-stroll',
    title: 'Tokyo City Stroll',
    subtitle: 'Shibuya Crossing, Akihabara lights, and evening ramen.',
    dateRange: 'Oct 26, 2024',
    location: 'Tokyo, Japan',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    description: 'Shibuya Crossing, Akihabara lights, and evening ramen.',
    categories: ['Travel', 'City Walks'],
    tags: ['Travel', 'Tokyo', 'City Walk'],
    days: 2,
    isPublic: true,
    createdAt: 'Oct 27, 2024',
    photos: []
  },
  {
    id: 'dinner-with-colleagues',
    title: 'Dinner with Colleagues',
    subtitle: 'Celebrating our accepted papers at a traditional tapas bar.',
    dateRange: 'Apr 22, 2026',
    location: 'Barcelona, Spain',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    description: 'Celebrating our accepted papers at a traditional tapas bar.',
    categories: ['Friends & Colleagues', 'Conference Moments'],
    tags: ['Friends', 'Conference', 'Barcelona'],
    days: 1,
    isPublic: true,
    createdAt: 'Apr 23, 2026',
    photos: []
  },
  {
    id: 'campus-visit',
    title: 'Campus Visit',
    subtitle: 'Visiting the Computer Science and AI Lab at MIT.',
    dateRange: 'Oct 15, 2025',
    location: 'Cambridge / Boston, USA',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    description: 'Visiting the Computer Science and AI Lab at MIT.',
    categories: ['Campus Life', 'Behind the Scenes'],
    tags: ['Lab Life', 'MIT', 'Boston'],
    days: 1,
    isPublic: true,
    createdAt: 'Oct 16, 2025',
    photos: []
  }
];
