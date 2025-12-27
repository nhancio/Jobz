
export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  postedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  experience: string;
  avatar: string;
  bio: string;
  skills: string[];
  location: string;
  education: string;
}

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechFlow',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&q=80',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$140k - $180k',
    type: 'Full-time',
    description: 'We are looking for an experienced Frontend Engineer to lead our core product team. You will be working with React, TypeScript, and Tailwind CSS.',
    requirements: ['5+ years React', 'TypeScript', 'System Design'],
    postedAt: '2 days ago'
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Creative Studio',
    logo: 'https://images.unsplash.com/photo-1572044162444-ad6021194360?w=100&h=100&fit=crop&q=80',
    location: 'Remote',
    salary: '$110k - $150k',
    type: 'Contract',
    description: 'Join our award-winning design team. We value creativity, pixel-perfection, and user-centric design approaches.',
    requirements: ['Figma', 'Prototyping', 'Design Systems'],
    postedAt: '1 day ago'
  },
  {
    id: '3',
    title: 'Backend Developer',
    company: 'DataCorp',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80',
    location: 'New York, NY',
    salary: '$150k - $190k',
    type: 'Full-time',
    description: 'Scale our distributed systems to handle millions of requests. Experience with Go and Kubernetes is a must.',
    requirements: ['Go', 'Kubernetes', 'PostgreSQL'],
    postedAt: '3 days ago'
  },
  {
    id: '4',
    title: 'Marketing Manager',
    company: 'Growth.io',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95dd0f?w=100&h=100&fit=crop&q=80',
    location: 'Austin, TX',
    salary: '$90k - $120k',
    type: 'Full-time',
    description: 'Lead our growth initiatives and marketing campaigns. You will work closely with the sales team to drive revenue.',
    requirements: ['B2B Marketing', 'SEO/SEM', 'Analytics'],
    postedAt: 'Just now'
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Senior Product Designer',
    experience: '6 years',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80',
    bio: 'Passionate about creating intuitive and beautiful user experiences. I specialize in complex design systems and accessibility.',
    skills: ['Figma', 'React', 'UI/UX', 'Prototyping'],
    location: 'San Francisco, CA',
    education: 'BFA Design, RISD'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    title: 'Full Stack Engineer',
    experience: '4 years',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80',
    bio: 'Full stack developer with a focus on scalable backend systems and clean frontend code. Love solving hard problems.',
    skills: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
    location: 'Remote / NY',
    education: 'BS CS, MIT'
  },
  {
    id: '3',
    name: 'Emily Davis',
    title: 'Marketing Specialist',
    experience: '3 years',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80',
    bio: 'Data-driven marketer with a creative edge. I help brands find their voice and grow their audience through strategic campaigns.',
    skills: ['Content Strategy', 'Social Media', 'Google Analytics'],
    location: 'Chicago, IL',
    education: 'BA Marketing, UT Austin'
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'DevOps Engineer',
    experience: '7 years',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
    bio: 'Infrastructure as code enthusiast. I build robust CI/CD pipelines and manage cloud infrastructure for high-traffic apps.',
    skills: ['Docker', 'Kubernetes', 'Terraform', 'Python'],
    location: 'Seattle, WA',
    education: 'MS CS, UW'
  }
];
