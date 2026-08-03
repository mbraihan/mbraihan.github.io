type Institution = {
  name: string;
  logo: string;
};

const institutions: Record<string, Institution> = {
  'Concordia University': { name: 'Concordia University', logo: '/assets/institutions/concordia-university.png' },
  'University of Calgary': { name: 'University of Calgary', logo: '/assets/institutions/university-of-calgary.png' },
  'Dalhousie University': { name: 'Dalhousie University', logo: 'https://www.dal.ca/favicon.ico' },
  'Simon Fraser University': { name: 'Simon Fraser University', logo: 'https://www.sfu.ca/favicon.ico' },
  'Kadir Has University': { name: 'Kadir Has University', logo: 'https://www.khas.edu.tr/favicon.ico' },
  'Aarhus University': { name: 'Aarhus University', logo: '/assets/institutions/aarhus-university.webp' },
  'University of Bath': { name: 'University of Bath', logo: 'https://www.bath.ac.uk/favicon.ico' },
  'Google Inc.': { name: 'Google', logo: 'https://www.google.com/favicon.ico' },
};

export function getInstitutionLogo(name: string): string | null {
  const institution = institutions[name];
  return institution?.logo || null;
}
