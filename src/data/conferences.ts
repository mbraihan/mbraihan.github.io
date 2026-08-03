export type ConferenceCategory = 'Core HCI' | 'XR / 3D Interaction' | 'Design / UbiComp';
export type ConferenceStatus = 'Open' | 'In Review' | 'Closed' | 'TBA';
export type MilestoneKind = 'Abstract' | 'Paper' | 'Notification' | 'Conference';
export type ConferenceRank = 'A*' | 'A' | 'B' | 'Journal published' | 'Not ranked';

export interface ConferenceMilestone {
  kind: MilestoneKind;
  date: string;
  endDate?: string;
  label: string;
  cutoffTime?: string;
  timeZone?: 'AoE';
}

export interface ConferenceVenue {
  id: string;
  name: string;
  fullName: string;
  category: ConferenceCategory;
  status: ConferenceStatus;
  location: string;
  sourceUrl: string;
  verified: boolean;
  rank: ConferenceRank;
  rankUrl: string;
  logo: string;
  logoAlt: string;
  tags: string[];
  milestones: ConferenceMilestone[];
}

export const conferenceVenues: ConferenceVenue[] = [
  {
    id: 'chi-2027',
    name: 'CHI 2027',
    fullName: 'ACM Conference on Human Factors in Computing Systems',
    category: 'Core HCI',
    status: 'Open',
    location: 'Pittsburgh, USA',
    sourceUrl: 'https://chi2027.acm.org/authors/papers/',
    verified: true,
    rank: 'A*',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/1053/',
    logo: '/assets/conferences/chi-2027.png',
    logoAlt: 'ACM CHI logo',
    tags: ['HCI', 'Interaction Design'],
    milestones: [
      {
        kind: 'Paper',
        date: '2026-09-10',
        label: 'Full paper deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Notification', date: '2026-11-05', label: 'Reviews released' },
      {
        kind: 'Paper',
        date: '2026-12-03',
        label: 'Revised paper deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Notification', date: '2026-12-17', label: 'Final notification' },
      { kind: 'Conference', date: '2027-05-10', endDate: '2027-05-14', label: 'Conference' },
    ],
  },
  {
    id: 'iui-2027',
    name: 'IUI 2027',
    fullName: 'ACM Conference on Intelligent User Interfaces',
    category: 'Core HCI',
    status: 'Open',
    location: 'Helsinki, Finland',
    sourceUrl: 'https://iui.acm.org/2027/',
    verified: true,
    rank: 'A',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/1101/',
    logo: '/assets/conferences/iui-2027.png',
    logoAlt: 'IUI 2027 logo',
    tags: ['Human-AI Interaction', 'Intelligent Interfaces'],
    milestones: [
      {
        kind: 'Abstract',
        date: '2026-08-13',
        label: 'Paper abstract registration',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      {
        kind: 'Paper',
        date: '2026-08-20',
        label: 'Full paper deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Conference', date: '2027-02-08', endDate: '2027-02-11', label: 'Conference' },
    ],
  },
  {
    id: 'ieee-vr-2027',
    name: 'IEEE VR 2027',
    fullName: 'IEEE Conference on Virtual Reality and 3D User Interfaces',
    category: 'XR / 3D Interaction',
    status: 'Open',
    location: 'Melbourne, Australia',
    sourceUrl: 'https://ieeevr.org/2027/contribute/papers/',
    verified: true,
    rank: 'A*',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/?by=all&search=IEEE+VR&source=CORE2026',
    logo: '/assets/conferences/ieee-vr-2027.webp',
    logoAlt: 'IEEE VR 2027 logo',
    tags: ['VR', 'AR / MR', '3DUI'],
    milestones: [
      {
        kind: 'Abstract',
        date: '2026-08-24',
        label: 'Required abstract deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      {
        kind: 'Paper',
        date: '2026-08-31',
        label: 'Full paper deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Notification', date: '2026-11-30', label: 'Initial notification' },
      { kind: 'Notification', date: '2027-01-07', label: 'Final notification' },
      { kind: 'Conference', date: '2027-02-27', endDate: '2027-03-03', label: 'Conference' },
    ],
  },
  {
    id: 'tei-2027',
    name: 'TEI 2027',
    fullName: 'ACM Conference on Tangible, Embedded and Embodied Interaction',
    category: 'Design / UbiComp',
    status: 'Open',
    location: 'Lisbon, Portugal',
    sourceUrl: 'https://tei.acm.org/2027/call-for-papers.html',
    verified: true,
    rank: 'B',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/1798/',
    logo: '/assets/conferences/tei-2027.png',
    logoAlt: 'TEI 2027 Lisbon logo',
    tags: ['Tangible Interaction', 'Embodied Interaction'],
    milestones: [
      {
        kind: 'Paper',
        date: '2026-08-06',
        label: 'Paper and pictorial deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Notification', date: '2026-10-22', label: 'Conditional notification' },
      { kind: 'Conference', date: '2027-01-24', endDate: '2027-01-27', label: 'Conference' },
    ],
  },
  {
    id: 'vrst-2026',
    name: 'VRST 2026',
    fullName: 'ACM Symposium on Virtual Reality Software and Technology',
    category: 'XR / 3D Interaction',
    status: 'In Review',
    location: 'Sendai, Japan',
    sourceUrl: 'https://vrst.acm.org/vrst2026/cfp/',
    verified: true,
    rank: 'B',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/67/',
    logo: '/assets/conferences/vrst-2026.png',
    logoAlt: 'VRST 2026 logo',
    tags: ['VR / AR', 'XR Systems'],
    milestones: [
      {
        kind: 'Abstract',
        date: '2026-06-17',
        label: 'Paper abstract deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      {
        kind: 'Paper',
        date: '2026-06-24',
        label: 'Full paper deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Notification', date: '2026-08-28', label: 'Author notification' },
      { kind: 'Conference', date: '2026-11-16', endDate: '2026-11-18', label: 'Conference' },
    ],
  },
  {
    id: 'ismar-2026',
    name: 'ISMAR 2026',
    fullName: 'IEEE International Symposium on Mixed and Augmented Reality',
    category: 'XR / 3D Interaction',
    status: 'In Review',
    location: 'Bari, Italy',
    sourceUrl: 'https://www.ieeeismar.net/2026/',
    verified: true,
    rank: 'A*',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/?by=all&search=ISMAR&source=CORE2026',
    logo: '/assets/conferences/ismar-2026.png',
    logoAlt: 'ISMAR 2026 logo',
    tags: ['AR / MR', 'XR'],
    milestones: [
      {
        kind: 'Abstract',
        date: '2026-03-09',
        label: 'Paper abstract deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      {
        kind: 'Paper',
        date: '2026-03-16',
        label: 'Full paper deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Conference', date: '2026-10-05', endDate: '2026-10-09', label: 'Conference' },
    ],
  },
  {
    id: 'sui-2026',
    name: 'SUI 2026',
    fullName: 'ACM Symposium on Spatial User Interaction',
    category: 'XR / 3D Interaction',
    status: 'TBA',
    location: 'Bari, Italy',
    sourceUrl: 'https://sui.acm.org/2026/',
    verified: false,
    rank: 'Not ranked',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/',
    logo: '/assets/conferences/sui-2026.png',
    logoAlt: 'ACM SUI 2026 logo',
    tags: ['Spatial Interaction', 'XR'],
    milestones: [
      { kind: 'Conference', date: '2026-10-10', endDate: '2026-10-11', label: 'Conference' },
    ],
  },
  {
    id: 'dis-2027',
    name: 'DIS 2027',
    fullName: 'ACM Designing Interactive Systems Conference',
    category: 'Design / UbiComp',
    status: 'TBA',
    location: 'Stockholm, Sweden',
    sourceUrl: 'https://dis.acm.org/2027/',
    verified: false,
    rank: 'A',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/422/',
    logo: '/assets/conferences/dis-2027.png',
    logoAlt: 'DIS 2027 logo',
    tags: ['Interaction Design', 'Research through Design'],
    milestones: [
      { kind: 'Conference', date: '2027-06-28', endDate: '2027-07-02', label: 'Conference' },
    ],
  },
  {
    id: 'uist-2027',
    name: 'UIST 2027',
    fullName: 'ACM Symposium on User Interface Software and Technology',
    category: 'Core HCI',
    status: 'TBA',
    location: 'To be announced',
    sourceUrl: 'https://uist.acm.org/',
    verified: false,
    rank: 'A*',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/66/',
    logo: '/assets/conferences/uist.png',
    logoAlt: 'ACM UIST logo',
    tags: ['Interactive Systems', 'Interface Technology'],
    milestones: [],
  },
  {
    id: 'cscw-2027',
    name: 'CSCW 2027',
    fullName: 'ACM Conference on Computer-Supported Cooperative Work',
    category: 'Core HCI',
    status: 'TBA',
    location: 'To be announced',
    sourceUrl: 'https://cscw.acm.org/',
    verified: false,
    rank: 'A',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/13/',
    logo: '/assets/conferences/cscw.webp',
    logoAlt: 'ACM CSCW logo',
    tags: ['Collaboration', 'Social Computing'],
    milestones: [],
  },
  {
    id: 'mobilehci-2027',
    name: 'MobileHCI 2027',
    fullName: 'ACM International Conference on Mobile Human-Computer Interaction',
    category: 'Design / UbiComp',
    status: 'TBA',
    location: 'To be announced',
    sourceUrl: 'https://mobilehci.acm.org/',
    verified: false,
    rank: 'B',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/1054/',
    logo: '/assets/conferences/mobilehci-2026.png',
    logoAlt: 'MobileHCI logo',
    tags: ['Mobile HCI', 'Ubiquitous Computing'],
    milestones: [],
  },
  {
    id: 'ubicomp-2026',
    name: 'UbiComp / ISWC 2026',
    fullName: 'ACM International Joint Conference on Pervasive and Ubiquitous Computing',
    category: 'Design / UbiComp',
    status: 'TBA',
    location: 'To be announced',
    sourceUrl: 'https://www.ubicomp.org/',
    verified: false,
    rank: 'Journal published',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/1825/',
    logo: '/assets/conferences/ubicomp-2026.png',
    logoAlt: 'UbiComp ISWC logo',
    tags: ['Ubiquitous Computing', 'Wearables'],
    milestones: [],
  },
];
