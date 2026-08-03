export const authorLinks: Record<string, string> = {
  'Mohammad Raihanul Bashar': 'https://mbraihan.github.io/',
  'Raihan': 'https://mbraihan.github.io/',
  'Mohammadreza Amini': 'https://scholar.google.com/citations?user=m_p4X6IAAAAJ',
  'Aunnoy K. Mutasim': 'https://scholar.google.com/citations?user=1Nt5UowAAAAJ&hl=en',
  'Aunnoy K Mutasim': 'https://scholar.google.com/citations?user=1Nt5UowAAAAJ&hl=en',
  'Mayra Donaji Barrera Machuca': 'https://scholar.google.com/citations?user=z0eIn9IAAAAJ',
  'Wolfgang Stuerzlinger': 'https://vvise.iat.sfu.ca/people/wolfgang-stuerzlinger',
  'Anil Ufuk Batmaz': 'https://users.encs.concordia.ca/~abatmaz/',
  'Mine Sarac': 'https://scholar.google.com/citations?user=0J1AIrkAAAAJ&hl=en',
  'Ken Pfeuffer': 'https://kenpfeuffer.com/',
  'Christof Lutteroth': 'https://scholar.google.com/citations?user=unjdcoYAAAAJ&hl=en',
  'Mucahit Gemici': 'https://mucahitgemici.github.io/',
  'Vrushank Phadnis': 'https://www.linkedin.com/in/vrushankphadnis/',
  // Add profile URLs for these authors when available. Keeping the names here
  // makes missing links easy to find without changing publication frontmatter.
  'Abul Al Arabi': '',
  'Ahsan-Ul Kabir Shawon': '',
  'Amal Hatira': '',
  'Amir Jalilifard': '',
  'Binoy Barman': '',
  'Dehua Chen': '',
  'Faiyaz Alvi Ahmed': '',
  'Injamamul Haque Sourov': '',
  'Laurent Voisard': '',
  'M. Ashraful Amin': '',
  'M. Tanvir Alam Sifat': '',
  'M. Zobair Ibn Alam': '',
  'Marta Kereten-Oertel': '',
  'Md Ashraful Amin': '',
  'Md Kafiul Islam': '',
  'Md Tawhid Islam Opu': '',
  'Nazmus Sakib': '',
  'Rayhan Sardar Tipu': '',
  'Shama Ali Monicay': '',
};

export const authorAffiliations: Record<string, string> = {
  'Mohammad Raihanul Bashar': 'Concordia University',
  'Mohammadreza Amini': 'Concordia University',
  'Aunnoy K. Mutasim': 'University of Calgary',
  'Aunnoy K Mutasim': 'University of Calgary',
  'Mayra Donaji Barrera Machuca': 'University of Calgary',
  'Wolfgang Stuerzlinger': 'Simon Fraser University',
  'Anil Ufuk Batmaz': 'Concordia University',
  'Mine Sarac': 'Kadir Has University',
  'Ken Pfeuffer': 'Aarhus University',
  'Christof Lutteroth': 'University of Bath',
  'Mucahit Gemici': 'Concordia University',
  'Vrushank Phadnis': 'Google Inc.',
};

export function getAuthorLink(name: string): string | null {
  const trimmed = name.trim();
  return authorLinks[trimmed] || null;
}

export function getAuthorAffiliation(name: string): string | null {
  const trimmed = name.trim();
  return authorAffiliations[trimmed] || null;
}
