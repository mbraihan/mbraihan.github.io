export type ConferenceCategory = 'Core HCI' | 'XR / 3D Interaction' | 'Design / UbiComp';
export type ConferenceStatus =
  | 'Submission'
  | 'Abstract'
  | 'Paper'
  | 'Review'
  | 'Rebuttal'
  | 'Notification'
  | 'Camera'
  | 'Registration'
  | 'In session'
  | 'TBA';

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
    status: 'Submission',
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
        kind: 'Abstract',
        date: '2026-08-13',
        label: 'Submission site opens',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
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
    status: 'Abstract',
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
        label: 'Abstract submission',
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
      { kind: 'Notification', date: '2026-10-29', label: 'Initial notification' },
      { kind: 'Notification', date: '2026-11-23', label: 'Final notification' },
      { kind: 'Conference', date: '2027-02-08', endDate: '2027-02-11', label: 'Conference' },
    ],
  },
  {
    id: 'ieee-vr-2027',
    name: 'IEEE VR 2027',
    fullName: 'IEEE Conference on Virtual Reality and 3D User Interfaces',
    category: 'XR / 3D Interaction',
    status: 'Abstract',
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
    id: 'sui-2026',
    name: 'SUI 2026',
    fullName: 'ACM Symposium on Spatial User Interaction',
    category: 'XR / 3D Interaction',
    status: 'Camera',
    location: 'Bari, Italy',
    sourceUrl: 'https://sui.acm.org/2026/',
    verified: true,
    rank: 'Not ranked',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/',
    logo: '/assets/conferences/sui-2026.png',
    logoAlt: 'ACM SUI 2026 logo',
    tags: ['Spatial Interaction', 'XR'],
    milestones: [
      {
        kind: 'Paper',
        date: '2026-08-18',
        label: 'Camera-ready paper deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Conference', date: '2026-10-10', endDate: '2026-10-11', label: 'Conference' },
    ],
  },
  {
    id: 'ismar-2026',
    name: 'ISMAR 2026',
    fullName: 'IEEE International Symposium on Mixed and Augmented Reality',
    category: 'XR / 3D Interaction',
    status: 'Registration',
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
        kind: 'Paper',
        date: '2026-09-04',
        label: 'Presentation video deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Conference', date: '2026-10-05', endDate: '2026-10-09', label: 'Conference' },
    ],
  },
  {
    id: 'uist-2026',
    name: 'UIST 2026',
    fullName: 'ACM Symposium on User Interface Software and Technology',
    category: 'Core HCI',
    status: 'Registration',
    location: 'Detroit, USA',
    sourceUrl: 'https://uist.acm.org/uist2026/',
    verified: true,
    rank: 'A*',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/66/',
    logo: '/assets/conferences/uist.png',
    logoAlt: 'ACM UIST 2026 logo',
    tags: ['Interactive Systems', 'Interface Technology'],
    milestones: [
      {
        kind: 'Paper',
        date: '2026-09-04',
        label: 'Early bird registration deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Conference', date: '2026-11-02', endDate: '2026-11-05', label: 'Conference' },
    ],
  },
  {
    id: 'tei-2027',
    name: 'TEI 2027',
    fullName: 'ACM Conference on Tangible, Embedded and Embodied Interaction',
    category: 'Design / UbiComp',
    status: 'Review',
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
      { kind: 'Notification', date: '2026-10-22', label: 'Author notification' },
      { kind: 'Conference', date: '2027-01-24', endDate: '2027-01-27', label: 'Conference' },
    ],
  },
  {
    id: 'iss-2026',
    name: 'ISS 2026',
    fullName: 'ACM International Conference on Interactive Surfaces and Spaces',
    category: 'Design / UbiComp',
    status: 'Review',
    location: 'Turin, Italy',
    sourceUrl: 'https://iss.acm.org/2026/',
    verified: true,
    rank: 'A',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/1100/',
    logo: '/assets/conferences/iss-2026.png',
    logoAlt: 'ACM ISS 2026 logo',
    tags: ['Interactive Surfaces', 'Spatial Interfaces'],
    milestones: [
      {
        kind: 'Paper',
        date: '2026-07-22',
        label: 'Summer round paper deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Notification', date: '2026-09-15', label: 'Second phase notification' },
      { kind: 'Conference', date: '2026-11-23', endDate: '2026-11-26', label: 'Conference' },
    ],
  },
  {
    id: 'vrst-2026',
    name: 'VRST 2026',
    fullName: 'ACM Symposium on Virtual Reality Software and Technology',
    category: 'XR / 3D Interaction',
    status: 'Review',
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
    id: 'icmi-2026',
    name: 'ICMI 2026',
    fullName: 'ACM International Conference on Multimodal Interaction',
    category: 'XR / 3D Interaction',
    status: 'Review',
    location: 'Naples, Italy',
    sourceUrl: 'https://icmi.acm.org/2026/',
    verified: true,
    rank: 'A',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/1098/',
    logo: '/assets/conferences/icmi-2026.png',
    logoAlt: 'ACM ICMI 2026 logo',
    tags: ['Multimodal Interaction', 'Affective Computing'],
    milestones: [
      {
        kind: 'Paper',
        date: '2026-04-23',
        label: 'Full paper deadline',
        cutoffTime: '23:59',
        timeZone: 'AoE',
      },
      { kind: 'Notification', date: '2026-07-09', label: 'Author notification' },
      { kind: 'Conference', date: '2026-10-05', endDate: '2026-10-09', label: 'Conference' },
    ],
  },
  {
    id: 'etra-2027',
    name: 'ETRA 2027',
    fullName: 'ACM Symposium on Eye Tracking Research & Applications',
    category: 'XR / 3D Interaction',
    status: 'TBA',
    location: 'Pamplona, Spain',
    sourceUrl: 'https://etra.acm.org/2027/',
    verified: true,
    rank: 'B',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/1042/',
    logo: '/assets/conferences/etra-2027.png',
    logoAlt: 'ACM ETRA 2027 logo',
    tags: ['Eye Tracking', 'Gaze Interaction', 'XR'],
    milestones: [
      { kind: 'Conference', date: '2027-06-07', endDate: '2027-06-10', label: 'Conference' },
    ],
  },
  {
    id: 'gi-2027',
    name: 'GI 2027',
    fullName: 'Graphics Interface Conference 2027',
    category: 'Core HCI',
    status: 'TBA',
    location: 'Winnipeg, Canada',
    sourceUrl: 'https://graphicsinterface.org/conference/2027/',
    verified: true,
    rank: 'B',
    rankUrl: 'https://portal.core.edu.au/conf-ranks/1040/',
    logo: '/assets/conferences/gi-2027.png',
    logoAlt: 'Graphics Interface 2027 logo',
    tags: ['Computer Graphics', 'Human-Computer Interaction'],
    milestones: [
      { kind: 'Conference', date: '2027-06-15', endDate: '2027-06-18', label: 'Conference' },
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
