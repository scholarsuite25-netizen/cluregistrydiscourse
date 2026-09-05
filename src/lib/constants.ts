export const EVENT = {
  name: "CLU REGISTRY DISCOURSE",
  fullTitle: "Governance, Innovation and Service: Changing Higher Education Management",
  type: "Chrisland University Maiden Registry Discourse",
  date: "Thursday, 15 October 2026",
  dateISO: "2026-10-15T09:00:00+01:00",
  venue: "University Auditorium, Chrisland University, Abeokuta",
  startTime: "9:00 a.m. WAT (Africa/Lagos, UTC+1)",
  participation: ["Physical", "Online via Zoom"] as const,
  phone: "+234 703 834 7947",
  phoneHref: "tel:+2347038347947",
  whatsappHref: "https://wa.me/2347038347947",
  whatsappPrefill: "Hello, I need assistance with the CLU Registry Discourse.",
  email: "registrydisourse@gmail.com",
  zoomTopic: "Governance, Innovation and Service: Changing Higher Education Management",
  zoomUrl: "https://us06web.zoom.us/j/84733111732?pwd=a5FHnBUprDgddIbP0bIAzzpBRnvWlx.1",
  zoomTime: "15 October 2026, 9:00 a.m. West Central Africa",
} as const;

export const BRAND = {
  purple: "#4C1769",
  purpleDark: "#3A1150",
  gold: "#C9B676",
  goldLight: "#E8D9A8",
  orange: "#B25900",
  green: "#0E7C3E",
} as const;

export const PEOPLE = [
  {
    slug: "mojisola-ladipo",
    name: "Chief (Mrs.) Mojisola Olusola Ladipo, FNIM, mni",
    altName: "Dr. (Mrs.) Moji Ladipo",
    role: "Lecturer of the Day",
    badge: "Keynote Lecturer",
    excerpt: "Distinguished university administrator and the first female Registrar of the University of Ibadan. Served as Registrar for ten years and contributed extensively to professional university administration, leadership development, and mentoring in Nigeria.",
    bio: "Chief (Mrs.) Mojisola Olusola Ladipo, FNIM, mni, is a distinguished university administrator and the first female Registrar of the University of Ibadan. She served as Registrar for ten years and has contributed extensively to professional university administration, leadership development, training, and mentoring in Nigeria. She earned a first degree in English and a master's in Industrial and Labour Relations from the University of Ibadan and helped revive the Committee of Registrars of Nigerian Universities.",
    initials: "ML",
  },
  {
    slug: "ayodeji-olukoju",
    name: "Distinguished Professor Ayodeji O. Olukoju, FNAL",
    role: "Chairman of the Day — Pro-Chancellor & Chairman, Governing Council, Chrisland University",
    badge: "Chairman",
    excerpt: "Professor of History and Fellow of the Nigerian Academy of Letters. Scholarship spans maritime, transport, economic, social, corporate, and urban history. Former Vice-Chancellor of Caleb University.",
    bio: "Distinguished Professor Ayodeji Oladimeji Olukoju is a Professor of History and Fellow of the Nigerian Academy of Letters. His scholarship spans maritime, transport, economic, social, corporate, and urban history. He previously served as Vice-Chancellor of Caleb University and holds senior academic and university governance experience.",
    initials: "AO",
  },
  {
    slug: "oyedunni-arulogun",
    name: "Professor Oyedunni Sola Arulogun",
    role: "Chief Host — Vice-Chancellor, Chrisland University, Abeokuta",
    badge: "Chief Host",
    excerpt: "Professor of Health Promotion and Education. Her work includes health promotion, community engagement, qualitative research, mentoring, and capacity building. Former academic leadership roles at the University of Ibadan.",
    bio: "Professor Oyedunni Sola Arulogun is a Professor of Health Promotion and Education and Vice-Chancellor of Chrisland University. Her work includes health promotion, community engagement, qualitative research, mentoring, and capacity building. She previously held academic leadership roles at the University of Ibadan.",
    initials: "OA",
  },
  {
    slug: "sb-omotoso",
    name: "Mr. S. B. Omotoso",
    role: "Host — Registrar, Chrisland University, Abeokuta",
    badge: "Host & Convener",
    excerpt: "Registrar of Chrisland University and convener of the Maiden Registry Discourse. Detailed profile to be published upon official confirmation.",
    bio: "Mr. S. B. Omotoso is the Registrar of Chrisland University, Abeokuta and Host of the Maiden Registry Discourse. A fuller profile will be published upon official approval.",
    initials: "SO",
  },
] as const;

export const PROGRAMME = [
  { time: "08:00 – 08:45", title: "Arrival & Registration", speaker: "LOC Secretariat", venue: "Auditorium Foyer", desc: "Collection of access passes, kit and seating." },
  { time: "09:00 – 09:20", title: "Opening & National Anthem", speaker: "University Anthem / Protocol", venue: "Main Auditorium", desc: "Welcome, introductions and opening prayers." },
  { time: "09:20 – 09:35", title: "Welcome Address", speaker: "Mr. S. B. Omotoso — Registrar", venue: "Main Auditorium", desc: "Host remarks and discourse framing." },
  { time: "09:35 – 09:50", title: "Chief Host Address", speaker: "Prof. Oyedunni Sola Arulogun — Vice-Chancellor", venue: "Main Auditorium", desc: "Vision for governance and service." },
  { time: "09:50 – 10:05", title: "Chairman's Opening Remarks", speaker: "Dist. Prof. Ayodeji Olukoju — Pro-Chancellor", venue: "Main Auditorium", desc: "Contextualising change in higher education management." },
  { time: "10:05 – 11:00", title: "Keynote: Governance, Innovation & Service", speaker: "Chief (Mrs.) Mojisola Ladipo, FNIM, mni", venue: "Main Auditorium + Zoom", desc: "The lecture of the day — changing higher education management." },
  { time: "11:00 – 11:30", title: "Tea Break & Networking", speaker: "—", venue: "Auditorium Lounge", desc: "Refreshments and gallery." },
  { time: "11:30 – 12:30", title: "Panel Discourse & Q&A", speaker: "Panel of Registrars & Administrators", venue: "Main Auditorium + Zoom", desc: "Innovation in registry practice, digital governance, service excellence." },
  { time: "12:30 – 12:45", title: "Vote of Thanks & Closing", speaker: "LOC Chairman", venue: "Main Auditorium", desc: "Appreciation and next steps." },
  { time: "12:45 – 13:30", title: "Group Photographs & Departure", speaker: "—", venue: "Auditorium Forecourt", desc: "Certificates and materials released to verified attendees." },
] as const;

export const STATS = [
  { label: "Participants expected", value: "500+", sub: "Physical & Online" },
  { label: "Institutions", value: "40+", sub: "Universities & Polytechnics" },
  { label: "Years of registry wisdom", value: "30+", sub: "Keynote experience" },
  { label: "Discourse edition", value: "Maiden", sub: "Historic first" },
];
