const newsDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatNewsDate(date: string) {
  return newsDateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export function compareNewsDatesNewestFirst(a: string, b: string) {
  return b.localeCompare(a);
}
