const publicationPreviewVideos: Record<string, string> = {
  'eyes-on-many': 'https://res.cloudinary.com/dqkxtivbq/video/upload/v1785367912/Eyes_On_many_Clip_cw5yd2.mp4',
  'vergence-accommodation-gaze-selection': 'https://res.cloudinary.com/dqkxtivbq/video/upload/v1785698287/Gaze_jynxym.mp4',
  'crossing-realities-sui': 'https://res.cloudinary.com/dqkxtivbq/video/upload/v1785699889/Cross_Reality_uic6pr.mp4',
  'effects-visual-depth-vac': 'https://res.cloudinary.com/dqkxtivbq/video/upload/v1785701714/LBW_tk5ucn.mp4',
};

const publicationTeaserImages: Record<string, string> = {
  'early-warning-hand-tracking': 'https://res.cloudinary.com/dqkxtivbq/image/upload/v1785371462/EWS_kgd5hx.png',
  'eyes-on-many': 'https://res.cloudinary.com/dqkxtivbq/image/upload/v1785691412/TeaserV6_RR_rfnrdd.png',
  'vergence-accommodation-gaze-selection': 'https://res.cloudinary.com/dqkxtivbq/image/upload/v1785698492/Teaser_RV_1_zpbk4i.jpg',
  'crossing-realities-sui': 'https://res.cloudinary.com/dqkxtivbq/image/upload/v1785700111/CR_Teaser_jkwdqe.jpg',
  'depth3dsketch': 'https://res.cloudinary.com/dqkxtivbq/image/upload/v1785703711/updatedTeaser_ki4uci.png',
  'multi-threshold-dwell': 'https://res.cloudinary.com/dqkxtivbq/image/upload/v1785712773/Screenshot_2026-08-02_at_7.14.50_PM_ppjnhc.png',
};

const publicationPresentationVideos: Record<string, {
  url: string;
  embedUrl: string;
}> = {
  'early-warning-hand-tracking': {
    url: 'https://youtu.be/Cn9KP3o8EV0?si=ohef2UsvxZBh79sg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Cn9KP3o8EV0?rel=0',
  },
  'depth3dsketch': {
    url: 'https://www.youtube.com/watch?v=Y_sm5XVLLDk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Y_sm5XVLLDk?rel=0',
  },
  'multi-threshold-dwell': {
    url: 'https://youtu.be/M4VHwHoJNjc',
    embedUrl: 'https://www.youtube-nocookie.com/embed/M4VHwHoJNjc?rel=0',
  },
};

const containedPublicationMedia = new Set([
  'depth3dsketch',
  'visual-depth-vac-model',
]);

const publicationsWithoutRelatedWork = new Set([
  'early-warning-hand-tracking',
  'depth3dsketch',
  'multi-threshold-dwell', // add ID here to hide Related Work
]);

export function getPublicationPreviewVideo(publicationId: string) {
  return publicationPreviewVideos[publicationId];
}

export function getPublicationTeaserImage(publicationId: string) {
  return publicationTeaserImages[publicationId];
}

export function getPublicationPresentationVideo(publicationId: string) {
  return publicationPresentationVideos[publicationId];
}

export function shouldContainPublicationMedia(publicationId: string) {
  return containedPublicationMedia.has(publicationId);
}

export function shouldShowRelatedWork(publicationId: string) {
  return !publicationsWithoutRelatedWork.has(publicationId);
}
