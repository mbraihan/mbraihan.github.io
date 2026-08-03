export function optimizeCloudinaryVideoUrl(url: string) {
  return url.replace(
    '/video/upload/',
    '/video/upload/c_limit,w_1280,q_auto:good/',
  );
}
