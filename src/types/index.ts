export type Locale = 'vi' | 'en';

export interface LocalizedText {
  vi: string;
  en: string;
}

export interface Article {
  _id: string;
  slug: string;
  title: LocalizedText;
  category: 'history' | 'heritage' | 'news';
  eraYear: string;
  summary: LocalizedText;
  content: LocalizedText;
  imageUrl: string;
  readMinutes: number;
  publishedAt: string;
}

export interface Artisan {
  _id: string;
  name: string;
  honorificTitle: LocalizedText;
  birthYear: number;
  yearsOfExperience: number;
  specialty: LocalizedText;
  lineage: LocalizedText;
  biography: LocalizedText;
  quote: LocalizedText;
  portraitUrl: string;
  featured: boolean;
}

export type SilkWeaveType = 'van' | 'the' | 'linh' | 'gam' | 'dui';

export interface Product {
  _id: string;
  accessionCode: string;
  name: LocalizedText;
  weaveType: SilkWeaveType;
  motifMeaning: LocalizedText;
  material: LocalizedText;
  dimensions: string;
  careGuide: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
  isHeritageHighlight: boolean;
}

export interface ProcessStep {
  _id: string;
  stepOrder: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  toolsUsed: LocalizedText;
  artisanTip: LocalizedText;
  durationLabel: LocalizedText;
  imageUrl: string;
}

export interface Challenge {
  _id: string;
  title: LocalizedText;
  severity: 'critical' | 'high' | 'moderate';
  category: 'economic' | 'succession' | 'supply' | 'environmental';
  description: LocalizedText;
  impactMetric: LocalizedText;
  preservationSolution: LocalizedText;
}

export interface Story {
  _id: string;
  slug: string;
  title: LocalizedText;
  narratorName: string;
  narratorRole: LocalizedText;
  eraContext: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  pullQuote: LocalizedText;
  coverUrl: string;
  publishedAt: string;
}

export interface PublicQuizQuestion {
  _id: string;
  question: LocalizedText;
  options: {
    vi: string[];
    en: string[];
  };
  difficulty: 'easy' | 'medium' | 'hard';
  topic: 'history' | 'weaving' | 'motifs' | 'preservation';
}

export interface AdminQuizQuestion extends PublicQuizQuestion {
  correctIndex: number;
  explanation: LocalizedText;
}

export interface QuizVerifyResult {
  score: number;
  total: number;
  results: Array<{
    id: string;
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
    explanation: LocalizedText;
  }>;
}

export interface EventRegistration {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  participantType: 'student' | 'youth' | 'tourist' | 'researcher';
  note: string;
  createdAt: string;
}

export interface PreservationEvent {
  _id: string;
  title: LocalizedText;
  eventType: 'workshop' | 'exhibition' | 'volunteer' | 'tour';
  startDate: string;
  location: LocalizedText;
  capacity: number;
  registeredCount: number;
  description: LocalizedText;
  formUrl?: string;
  registrations?: EventRegistration[];
}

export interface ContactInquiry {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  inquiryType: 'visit' | 'education' | 'preservation' | 'media';
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface OverviewPayload {
  articles: Article[];
  artisans: Artisan[];
  products: Product[];
  processes: ProcessStep[];
  challenges: Challenge[];
  stories: Story[];
  events: PreservationEvent[];
}

export interface AuthStatusResponse {
  initialized: boolean;
  requiresClaim: boolean;
  envPasscodeActive: boolean;
  authenticated: boolean;
  user: { name: string; email: string; role: string } | null;
}
