export type Locale = 'vi' | 'en';

export interface LocalizedText {
  vi: string;
  en: string;
}

export type UserRole = 'admin' | 'editor' | 'member';

export interface UserEntity {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export type ArticleCategory = 'history' | 'heritage' | 'news';

export interface ArticleEntity {
  _id: string;
  slug: string;
  title: LocalizedText;
  category: ArticleCategory;
  eraYear: string;
  summary: LocalizedText;
  content: LocalizedText;
  imageUrl: string;
  readMinutes: number;
  publishedAt: string;
}

export interface ArtisanEntity {
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

export interface ProductEntity {
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

export interface ProcessEntity {
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

export type ChallengeSeverity = 'critical' | 'high' | 'moderate';
export type ChallengeCategory = 'economic' | 'succession' | 'supply' | 'environmental';

export interface ChallengeEntity {
  _id: string;
  title: LocalizedText;
  severity: ChallengeSeverity;
  category: ChallengeCategory;
  description: LocalizedText;
  impactMetric: LocalizedText;
  preservationSolution: LocalizedText;
}

export interface StoryEntity {
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

export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type QuizTopic = 'history' | 'weaving' | 'motifs' | 'preservation';

export interface QuizQuestionEntity {
  _id: string;
  question: LocalizedText;
  options: {
    vi: string[];
    en: string[];
  };
  correctIndex: number;
  explanation: LocalizedText;
  difficulty: QuizDifficulty;
  topic: QuizTopic;
}

export type EventType = 'workshop' | 'exhibition' | 'volunteer' | 'tour';

export interface EventRegistration {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  participantType: 'student' | 'youth' | 'tourist' | 'researcher';
  note: string;
  createdAt: string;
}

export interface EventEntity {
  _id: string;
  title: LocalizedText;
  eventType: EventType;
  startDate: string;
  location: LocalizedText;
  capacity: number;
  registeredCount: number;
  description: LocalizedText;
  formUrl?: string;
  registrations: EventRegistration[];
}

export type ContactInquiryType = 'visit' | 'education' | 'preservation' | 'media';
export type ContactStatus = 'new' | 'reviewed' | 'resolved';

export interface ContactEntity {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  inquiryType: ContactInquiryType;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export interface LocalDatabaseSnapshot {
  users: UserEntity[];
  articles: ArticleEntity[];
  artisans: ArtisanEntity[];
  products: ProductEntity[];
  processes: ProcessEntity[];
  challenges: ChallengeEntity[];
  stories: StoryEntity[];
  quizQuestions: QuizQuestionEntity[];
  events: EventEntity[];
  contacts: ContactEntity[];
}
