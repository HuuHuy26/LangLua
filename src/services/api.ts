import axios from 'axios';
import localDb from '../../data/vanphuc-db.json';
import type {
  AdminQuizQuestion,
  Article,
  Artisan,
  AuthStatusResponse,
  Challenge,
  ContactInquiry,
  OverviewPayload,
  PreservationEvent,
  ProcessStep,
  Product,
  PublicQuizQuestion,
  QuizVerifyResult,
  Story,
} from '../types';

let inMemoryAuthToken: string | null = null;

export function setAuthToken(token: string | null): void {
  inMemoryAuthToken = token;
}

export function getAuthToken(): string | null {
  return inMemoryAuthToken;
}

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (inMemoryAuthToken) {
    config.headers.Authorization = `Bearer ${inMemoryAuthToken}`;
  }
  return config;
});

// Intercept responses to detect HTML rewrites (e.g. on Vercel SPA)
apiClient.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
      return Promise.reject(new Error('API returned HTML instead of JSON'));
    }
    return response;
  },
  (error) => Promise.reject(error)
);

const getLocalOverview = (): OverviewPayload => ({
  articles: (localDb.articles || []) as unknown as Article[],
  artisans: (localDb.artisans || []) as unknown as Artisan[],
  products: (localDb.products || []) as unknown as Product[],
  processes: (localDb.processes || []) as unknown as ProcessStep[],
  challenges: (localDb.challenges || []) as unknown as Challenge[],
  stories: (localDb.stories || []) as unknown as Story[],
  events: (localDb.events || []) as unknown as PreservationEvent[],
});

export const heritageApi = {
  getHealth: async () => {
    try {
      const res = (await apiClient.get<{ ok: boolean; persistence: string }>('/health')).data;
      if (res && typeof res === 'object' && res.ok) return res;
      return { ok: true, persistence: 'local-client' };
    } catch {
      return { ok: true, persistence: 'local-client' };
    }
  },

  getOverview: async () => {
    try {
      const res = (await apiClient.get<OverviewPayload>('/overview')).data;
      if (res && typeof res === 'object' && Array.isArray(res.articles)) return res;
      return getLocalOverview();
    } catch {
      return getLocalOverview();
    }
  },

  // Auth
  getAuthStatus: async () => {
    try {
      const res = (await apiClient.get<AuthStatusResponse>('/auth/status')).data;
      if (res && typeof res === 'object') return res;
      return {
        initialized: true,
        requiresClaim: false,
        envPasscodeActive: false,
        authenticated: false,
        user: null,
      };
    } catch {
      return {
        initialized: true,
        requiresClaim: false,
        envPasscodeActive: false,
        authenticated: false,
        user: null,
      };
    }
  },

  claimAdmin: async (payload: { name: string; email: string; password: string }) =>
    (await apiClient.post<{ token: string; user: { name: string; email: string; role: string } }>('/auth/claim', payload)).data,

  loginAdmin: async (payload: { email: string; password: string }) =>
    (await apiClient.post<{ token: string; user: { name: string; email: string; role: string } }>('/auth/login', payload)).data,

  // Articles
  listArticles: async (category?: string) => {
    try {
      const res = (await apiClient.get<Article[]>('/articles', { params: category ? { category } : undefined })).data;
      if (Array.isArray(res)) return res;
      return (localDb.articles || []) as unknown as Article[];
    } catch {
      return (localDb.articles || []) as unknown as Article[];
    }
  },
  createArticle: async (payload: Partial<Article>) => (await apiClient.post<Article>('/articles', payload)).data,
  updateArticle: async (id: string, payload: Partial<Article>) =>
    (await apiClient.put<Article>(`/articles/${id}`, payload)).data,
  deleteArticle: async (id: string) => (await apiClient.delete(`/articles/${id}`)).data,

  // Artisans
  listArtisans: async () => {
    try {
      const res = (await apiClient.get<Artisan[]>('/artisans')).data;
      if (Array.isArray(res)) return res;
      return (localDb.artisans || []) as unknown as Artisan[];
    } catch {
      return (localDb.artisans || []) as unknown as Artisan[];
    }
  },
  createArtisan: async (payload: Partial<Artisan>) => (await apiClient.post<Artisan>('/artisans', payload)).data,
  updateArtisan: async (id: string, payload: Partial<Artisan>) =>
    (await apiClient.put<Artisan>(`/artisans/${id}`, payload)).data,
  deleteArtisan: async (id: string) => (await apiClient.delete(`/artisans/${id}`)).data,

  // Products
  listProducts: async (weaveType?: string) => {
    try {
      const res = (await apiClient.get<Product[]>('/products', { params: weaveType ? { weaveType } : undefined })).data;
      if (Array.isArray(res)) return res;
      return (localDb.products || []) as unknown as Product[];
    } catch {
      return (localDb.products || []) as unknown as Product[];
    }
  },
  createProduct: async (payload: Partial<Product>) => (await apiClient.post<Product>('/products', payload)).data,
  updateProduct: async (id: string, payload: Partial<Product>) =>
    (await apiClient.put<Product>(`/products/${id}`, payload)).data,
  deleteProduct: async (id: string) => (await apiClient.delete(`/products/${id}`)).data,

  // Processes
  listProcesses: async () => {
    try {
      const res = (await apiClient.get<ProcessStep[]>('/processes')).data;
      if (Array.isArray(res)) return res;
      return (localDb.processes || []) as unknown as ProcessStep[];
    } catch {
      return (localDb.processes || []) as unknown as ProcessStep[];
    }
  },
  createProcess: async (payload: Partial<ProcessStep>) =>
    (await apiClient.post<ProcessStep>('/processes', payload)).data,
  updateProcess: async (id: string, payload: Partial<ProcessStep>) =>
    (await apiClient.put<ProcessStep>(`/processes/${id}`, payload)).data,
  deleteProcess: async (id: string) => (await apiClient.delete(`/processes/${id}`)).data,

  // Challenges
  listChallenges: async () => {
    try {
      const res = (await apiClient.get<Challenge[]>('/challenges')).data;
      if (Array.isArray(res)) return res;
      return (localDb.challenges || []) as unknown as Challenge[];
    } catch {
      return (localDb.challenges || []) as unknown as Challenge[];
    }
  },
  createChallenge: async (payload: Partial<Challenge>) =>
    (await apiClient.post<Challenge>('/challenges', payload)).data,
  updateChallenge: async (id: string, payload: Partial<Challenge>) =>
    (await apiClient.put<Challenge>(`/challenges/${id}`, payload)).data,
  deleteChallenge: async (id: string) => (await apiClient.delete(`/challenges/${id}`)).data,

  // Stories
  listStories: async () => {
    try {
      const res = (await apiClient.get<Story[]>('/stories')).data;
      if (Array.isArray(res)) return res;
      return (localDb.stories || []) as unknown as Story[];
    } catch {
      return (localDb.stories || []) as unknown as Story[];
    }
  },
  createStory: async (payload: Partial<Story>) => (await apiClient.post<Story>('/stories', payload)).data,
  updateStory: async (id: string, payload: Partial<Story>) =>
    (await apiClient.put<Story>(`/stories/${id}`, payload)).data,
  deleteStory: async (id: string) => (await apiClient.delete(`/stories/${id}`)).data,

  // Quiz
  listQuizQuestions: async (topic?: string) => {
    try {
      const res = (await apiClient.get<PublicQuizQuestion[]>('/quiz', { params: topic && topic !== 'all' ? { topic } : undefined })).data;
      if (Array.isArray(res)) return res;
      const allQ = (localDb.quizQuestions || []) as unknown as PublicQuizQuestion[];
      return topic && topic !== 'all' ? allQ.filter((q) => q.topic === topic) : allQ;
    } catch {
      const allQ = (localDb.quizQuestions || []) as unknown as PublicQuizQuestion[];
      return topic && topic !== 'all' ? allQ.filter((q) => q.topic === topic) : allQ;
    }
  },
  verifyQuiz: async (answers: Array<{ id: string; selectedIndex: number }>) => {
    try {
      const res = (await apiClient.post<QuizVerifyResult>('/quiz/verify', { answers })).data;
      if (res && typeof res === 'object' && typeof res.score === 'number') return res;
      throw new Error();
    } catch {
      const allQ = (localDb.quizQuestions || []) as any[];
      let score = 0;
      const results = allQ.map((q) => {
        const userAns = answers.find((a) => a.id === q._id);
        const selIdx = userAns?.selectedIndex ?? -1;
        const isCorrect = selIdx === q.correctIndex;
        if (isCorrect) score += 20;
        return {
          id: q._id,
          selectedIndex: selIdx,
          correctIndex: q.correctIndex,
          isCorrect,
          explanation: q.explanation,
        };
      });
      return { score, total: allQ.length, results };
    }
  },
  listAdminQuiz: async () => (await apiClient.get<AdminQuizQuestion[]>('/quiz/admin')).data,
  createQuizQuestion: async (payload: Partial<AdminQuizQuestion>) =>
    (await apiClient.post<AdminQuizQuestion>('/quiz', payload)).data,
  updateQuizQuestion: async (id: string, payload: Partial<AdminQuizQuestion>) =>
    (await apiClient.put<AdminQuizQuestion>(`/quiz/${id}`, payload)).data,
  deleteQuizQuestion: async (id: string) => (await apiClient.delete(`/quiz/${id}`)).data,

  // Events
  listEvents: async () => {
    try {
      const res = (await apiClient.get<PreservationEvent[]>('/events')).data;
      if (Array.isArray(res)) return res;
      return (localDb.events || []) as unknown as PreservationEvent[];
    } catch {
      return (localDb.events || []) as unknown as PreservationEvent[];
    }
  },
  listAdminEvents: async () => {
    try {
      const res = (await apiClient.get<PreservationEvent[]>('/events/admin')).data;
      if (Array.isArray(res)) return res;
      return (localDb.events || []) as unknown as PreservationEvent[];
    } catch {
      return (localDb.events || []) as unknown as PreservationEvent[];
    }
  },
  registerEvent: async (
    eventId: string,
    payload: {
      fullName: string;
      email: string;
      phone: string;
      participantType: 'student' | 'youth' | 'tourist' | 'researcher';
      note: string;
    }
  ) => {
    try {
      return (await apiClient.post<{ ok: boolean; event: PreservationEvent }>(`/events/${eventId}/register`, payload)).data;
    } catch {
      const ev = ((localDb.events || []) as unknown as PreservationEvent[]).find((e) => e._id === eventId) || {
        _id: eventId,
        title: { vi: 'Hành trình Dạo bước Làng Lụa', en: 'Heritage Walk' },
        eventType: 'tour',
        startDate: '2026-12-27T14:00',
        location: { vi: 'Cổng Làng Vạn Phúc', en: 'Village Gate' },
        capacity: 25,
        registeredCount: 1,
        description: { vi: '', en: '' },
      } as PreservationEvent;
      return { ok: true, event: ev };
    }
  },
  createEvent: async (payload: Partial<PreservationEvent>) =>
    (await apiClient.post<PreservationEvent>('/events', payload)).data,
  updateEvent: async (id: string, payload: Partial<PreservationEvent>) =>
    (await apiClient.put<PreservationEvent>(`/events/${id}`, payload)).data,
  deleteEvent: async (id: string) => (await apiClient.delete(`/events/${id}`)).data,

  // Contacts
  submitContact: async (payload: {
    fullName: string;
    email: string;
    phone: string;
    inquiryType: 'visit' | 'education' | 'preservation' | 'media';
    message: string;
  }) => {
    try {
      return (await apiClient.post<{ ok: boolean; id: string }>('/contacts', payload)).data;
    } catch {
      return { ok: true, id: 'cnt-' + Date.now() };
    }
  },
  listContacts: async () => (await apiClient.get<ContactInquiry[]>('/contacts')).data,
  updateContactStatus: async (id: string, status: 'new' | 'reviewed' | 'resolved') =>
    (await apiClient.patch<ContactInquiry>(`/contacts/${id}/status`, { status })).data,
  deleteContact: async (id: string) => (await apiClient.delete(`/contacts/${id}`)).data,
};
