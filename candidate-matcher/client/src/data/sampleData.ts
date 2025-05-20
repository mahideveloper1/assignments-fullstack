import { Candidate, JobRequirement } from '../types';

// Sample job requirements
export const sampleJobRequirements: JobRequirement[] = [
  {
    skill: 'React',
    yearsRequired: 3,
    importance: 0.9
  },
  {
    skill: 'TypeScript',
    yearsRequired: 2,
    importance: 0.8
  },
  {
    skill: 'Node.js',
    yearsRequired: 2,
    importance: 0.7
  },
  {
    skill: 'GraphQL',
    yearsRequired: 1,
    importance: 0.6
  },
  {
    skill: 'AWS',
    yearsRequired: 1,
    importance: 0.5
  }
];

// Sample candidates
export const sampleCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    skills: [
      {
        name: 'React.js',
        yearsOfExperience: 4,
        projects: ['E-commerce Platform', 'Social Media Dashboard']
      },
      {
        name: 'TypeScript',
        yearsOfExperience: 3,
        projects: ['Banking App', 'CRM System']
      },
      {
        name: 'Node.js',
        yearsOfExperience: 2,
        projects: ['RESTful API', 'Authentication Service']
      },
      {
        name: 'MongoDB',
        yearsOfExperience: 2,
        projects: ['Data Migration Tool']
      }
    ],
    education: 'BS Computer Science',
    learningAbility: 'Quick learner, completed 5 certifications in the last year'
  },
  {
    id: '2',
    name: 'Bob Smith',
    skills: [
      {
        name: 'ReactJS',
        yearsOfExperience: 2,
        projects: ['Portfolio Website', 'Weather App']
      },
      {
        name: 'JavaScript',
        yearsOfExperience: 5,
        projects: ['Game Development', 'Browser Extension']
      },
      {
        name: 'Express',
        yearsOfExperience: 3,
        projects: ['API Gateway', 'E-commerce Backend']
      },
      {
        name: 'AWS Lambda',
        yearsOfExperience: 1,
        projects: ['Serverless Functions']
      }
    ],
    education: 'Self-taught, Bootcamp Graduate',
    learningAbility: 'Constantly learning new technologies, active on GitHub'
  },
  {
    id: '3',
    name: 'Charlie Davis',
    skills: [
      {
        name: 'Angular',
        yearsOfExperience: 4,
        projects: ['Enterprise Dashboard', 'Healthcare Portal']
      },
      {
        name: 'TypeScript',
        yearsOfExperience: 4,
        projects: ['Financial Application', 'Data Visualization Tool']
      },
      {
        name: 'Java',
        yearsOfExperience: 6,
        projects: ['Microservices Architecture', 'Payment Processing System']
      },
      {
        name: 'Spring Boot',
        yearsOfExperience: 3,
        projects: ['API Development']
      }
    ],
    education: 'MS Software Engineering',
    learningAbility: 'Methodical learner, prefers deep understanding'
  },
  {
    id: '4',
    name: 'Diana Miller',
    skills: [
      {
        name: 'React Native',
        yearsOfExperience: 3,
        projects: ['Mobile Banking App', 'Fitness Tracker']
      },
      {
        name: 'JavaScript',
        yearsOfExperience: 4,
        projects: ['SPA Development', 'E-learning Platform']
      },
      {
        name: 'GraphQL',
        yearsOfExperience: 2,
        projects: ['API Design', 'Data Fetching Optimization']
      },
      {
        name: 'Firebase',
        yearsOfExperience: 2,
        projects: ['Real-time Chat Application']
      }
    ],
    education: 'BA Computer Science',
    learningAbility: 'Fast adapter, learns through practical application'
  }
];