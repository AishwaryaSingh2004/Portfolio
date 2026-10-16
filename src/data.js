export const profile = {
  name: 'Aishwarya Singh',
  role: 'Software Engineer',
  location: 'Hyderabad, India',
  email: 'aishwaryasingh2k04@gmail.com',
  linkedin: 'https://www.linkedin.com/in/aishwarya-singh-1767a6243',
  github: '',
  resume: '/Aishwarya_Singh_Resume.pdf'
};

export const stats = [
  { value: '2026', label: 'B.Tech IT graduate' },
  { value: '02', label: 'Engineering internships' },
  { value: '7.61', label: 'CGPA, Banasthali Vidyapith' },
  { value: 'Meta', label: 'Back-End Developer certified' }
];

export const projects = [
  {
    id: '01',
    slug: 'resume-analyzer',
    title: 'AI Resume Analyzer',
    subtitle: 'Career recommendation platform',
    context: 'Personal project',
    year: '2026',
    stack: ['React.js', 'Node.js', 'Python', 'Google Gemini API'],
    summary: 'A full-stack platform that reads a resume, maps skill gaps and generates personalised career recommendations and interview prep.',
    points: [
      'Python PDF pipeline that extracts resume content and structures skills, experience and education for AI processing.',
      'Gemini API integration for skill-gap analysis, job-role classification and personalised interview questions.',
      'End-to-end flow connecting frontend, backend and AI services — from upload to recommendation.',
      'Skill matching that surfaces relevant job opportunities from extracted candidate skills.'
    ]
  },
  {
    id: '02',
    slug: 'account-intelligence',
    link: 'https://vtklvr7lj4dcowgyeqffap.streamlit.app/',
    title: 'AI Account Intelligence System',
    subtitle: 'Multi-agent sales enrichment',
    context: 'Personal project',
    year: '2026',
    stack: ['Python', 'Google Gemini API', 'Pydantic', 'Streamlit'],
    summary: 'A multi-agent Gemini pipeline that turns a company name, or an anonymous visitor’s IP and browsing behaviour, into a sales-ready account profile, intent score and recommended next step.',
    points: [
      'Researcher → Scorer → Strategist agents, plus Risk Analyst and Q&A agents, produce a company profile, likely buyer persona, 0⁠–⁠10 intent score and recommended sales action.',
      'Live Google Search grounding adds real, recent news and verifiable source links, and degrades gracefully when search quota runs out.',
      'Pydantic schemas with enums and range limits validate every model response, backed by a test runner covering misspelled, garbled, made-up and IP-only inputs.',
      'Retry and backoff on rate limits and bad JSON with automatic fallback to a second model, plus a Streamlit dashboard with an “Ask AI” chat and downloadable PDF reports.'
    ]
  },
  {
    id: '03',
    slug: 'food-delivery',
    title: 'Food Delivery Platform',
    subtitle: 'MERN-stack ordering system',
    context: 'C-DAC, Delhi',
    year: '2026',
    stack: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
    summary: 'Backend REST APIs for a food delivery app covering authentication, cart management, order placement and payments.',
    points: [
      'Built and integrated REST endpoints for auth, cart, orders and payment workflows.',
      'Refined MongoDB queries and schema design across authentication, cart and order data.',
      'JWT-based authentication and integrated payments for a secure checkout.',
      'Coding, testing, debugging and deployment support across the SDLC.'
    ]
  }
];

export const experience = [
  {
    role: 'Software Engineer Intern',
    org: 'Zen Technologies Ltd.',
    when: 'Jul 2026 — Present',
    year: 'Now',
    summary: 'Building C# and .NET Core modules for a defense-simulation platform — shipping simulator features alongside senior engineers, design and QA, and keeping them stable through systematic debugging and testing.',
    points: [
      'C# and .NET Core modules for a defense-simulation platform.',
      'Simulator features built with senior engineers, design and QA.',
      'Systematic debugging and testing for module stability.'
    ]
  },
  {
    role: 'Project Intern',
    org: 'C-DAC, Delhi',
    when: 'Jan 2026 — Jun 2026',
    year: '2026',
    summary: 'Built REST APIs for a MERN food delivery app covering authentication, cart, orders and payments — with MongoDB schema design, query optimisation and a JWT-secured checkout.',
    points: [
      'REST APIs for a MERN food delivery app — auth, cart, orders, payments.',
      'MongoDB schema design and query optimisation.',
      'JWT authentication and secure checkout integration.'
    ]
  }
];

export const skills = [
  { group: 'Languages', items: ['Python', 'Java', 'C#', 'SQL'] },
  { group: 'Backend & APIs', items: ['Node.js', '.NET Core', 'REST APIs', 'JWT Auth'] },
  { group: 'Frontend', items: ['React.js', 'HTML', 'CSS'] },
  { group: 'Databases', items: ['MongoDB', 'MySQL'] },
  { group: 'AI & LLMs', items: ['Generative AI', 'LLMs', 'Google Gemini API'] },
  { group: 'Tools & Practice', items: ['Git', 'GitHub', 'Postman', 'Unit & Integration Testing', 'Debugging'] }
];

export const services = [
  {
    title: 'Develop',
    kicker: 'Backend & APIs',
    lead: 'Reliable backends, built to last.',
    body: 'I design clean REST APIs, secure authentication and well-structured data models — services that are easy to extend, test and trust in production.'
  },
  {
    title: 'Build with AI',
    kicker: 'GenAI & LLM features',
    lead: 'AI that solves real problems.',
    body: 'I turn large language models into practical product features — from understanding documents to generating personalised, context-aware recommendations.'
  },
  {
    title: 'Deliver',
    kicker: 'Quality & teamwork',
    lead: 'Shipped, tested and dependable.',
    body: 'I take features from specification to release — writing tests, debugging methodically and working closely with design, QA and senior engineers.'
  }
];
