import axios from 'axios';
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
  timeout: 12000,
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

export const heritageApi = {
  getHealth: async () => (await apiClient.get<{ ok: boolean; persistence: string }>('/health')).data,
  getOverview: async () => (await apiClient.get<OverviewPayload>('/overview')).data,

  // Auth
  getAuthStatus: async () => (await apiClient.get<AuthStatusResponse>('/auth/status')).data,
  claimAdmin: async (payload: { name: string; email: string; password: string }) =>
    (await apiClient.post<{ token: string; user: { name: string; email: string; role: string } }>('/auth/claim', payload)).data,
  loginAdmin: async (payload: { email: string; password: string }) =>
    (await apiClient.post<{ token: string; user: { name: string; email: string; role: string } }>('/auth/login', payload)).data,

  // Articles
  listArticles: async (category?: string) =>
    (await apiClient.get<Article[]>('/articles', { params: category ? { category } : undefined })).data,
  createArticle: async (payload: Partial<Article>) => (await apiClient.post<Article>('/articles', payload)).data,
  updateArticle: async (id: string, payload: Partial<Article>) =>
    (await apiClient.put<Article>(`/articles/${id}`, payload)).data,
  deleteArticle: async (id: string) => (await apiClient.delete(`/articles/${id}`)).data,

  // Artisans
  listArtisans: async () => (await apiClient.get<Artisan[]>('/artisans')).data,
  createArtisan: async (payload: Partial<Artisan>) => (await apiClient.post<Artisan>('/artisans', payload)).data,
  updateArtisan: async (id: string, payload: Partial<Artisan>) =>
    (await apiClient.put<Artisan>(`/artisans/${id}`, payload)).data,
  deleteArtisan: async (id: string) => (await apiClient.delete(`/artisans/${id}`)).data,

  // Products
  listProducts: async (weaveType?: string) =>
    (await apiClient.get<Product[]>('/products', { params: weaveType ? { weaveType } : undefined })).data,
  createProduct: async (payload: Partial<Product>) => (await apiClient.post<Product>('/products', payload)).data,
  updateProduct: async (id: string, payload: Partial<Product>) =>
    (await apiClient.put<Product>(`/products/${id}`, payload)).data,
  deleteProduct: async (id: string) => (await apiClient.delete(`/products/${id}`)).data,

  // Processes
  listProcesses: async () => (await apiClient.get<ProcessStep[]>('/processes')).data,
  createProcess: async (payload: Partial<ProcessStep>) =>
    (await apiClient.post<ProcessStep>('/processes', payload)).data,
  updateProcess: async (id: string, payload: Partial<ProcessStep>) =>
    (await apiClient.put<ProcessStep>(`/processes/${id}`, payload)).data,
  deleteProcess: async (id: string) => (await apiClient.delete(`/processes/${id}`)).data,

  // Challenges
  listChallenges: async () => (await apiClient.get<Challenge[]>('/challenges')).data,
  createChallenge: async (payload: Partial<Challenge>) =>
    (await apiClient.post<Challenge>('/challenges', payload)).data,
  updateChallenge: async (id: string, payload: Partial<Challenge>) =>
    (await apiClient.put<Challenge>(`/challenges/${id}`, payload)).data,
  deleteChallenge: async (id: string) => (await apiClient.delete(`/challenges/${id}`)).data,

  // Stories
  listStories: async () => (await apiClient.get<Story[]>('/stories')).data,
  createStory: async (payload: Partial<Story>) => (await apiClient.post<Story>('/stories', payload)).data,
  updateStory: async (id: string, payload: Partial<Story>) =>
    (await apiClient.put<Story>(`/stories/${id}`, payload)).data,
  deleteStory: async (id: string) => (await apiClient.delete(`/stories/${id}`)).data,

  // Quiz
  listQuizQuestions: async (topic?: string) =>
    (await apiClient.get<PublicQuizQuestion[]>('/quiz', { params: topic && topic !== 'all' ? { topic } : undefined })).data,
  verifyQuiz: async (answers: Array<{ id: string; selectedIndex: number }>) =>
    (await apiClient.post<QuizVerifyResult>('/quiz/verify', { answers })).data,
  listAdminQuiz: async () => (await apiClient.get<AdminQuizQuestion[]>('/quiz/admin')).data,
  createQuizQuestion: async (payload: Partial<AdminQuizQuestion>) =>
    (await apiClient.post<AdminQuizQuestion>('/quiz', payload)).data,
  updateQuizQuestion: async (id: string, payload: Partial<AdminQuizQuestion>) =>
    (await apiClient.put<AdminQuizQuestion>(`/quiz/${id}`, payload)).data,
  deleteQuizQuestion: async (id: string) => (await apiClient.delete(`/quiz/${id}`)).data,

  // Events
  listEvents: async () => (await apiClient.get<PreservationEvent[]>('/events')).data,
  listAdminEvents: async () => (await apiClient.get<PreservationEvent[]>('/events/admin')).data,
  registerEvent: async (
    eventId: string,
    payload: {
      fullName: string;
      email: string;
      phone: string;
      participantType: 'student' | 'youth' | 'tourist' | 'researcher';
      note: string;
    }
  ) => (await apiClient.post<{ ok: boolean; event: PreservationEvent }>(`/events/${eventId}/register`, payload)).data,
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
  }) => (await apiClient.post<{ ok: boolean; id: string }>('/contacts', payload)).data,
  listContacts: async () => (await apiClient.get<ContactInquiry[]>('/contacts')).data,
  updateContactStatus: async (id: string, status: 'new' | 'reviewed' | 'resolved') =>
    (await apiClient.patch<ContactInquiry>(`/contacts/${id}/status`, { status })).data,
  deleteContact: async (id: string) => (await apiClient.delete(`/contacts/${id}`)).data,
};
