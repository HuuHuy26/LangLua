import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getPersistenceMode } from '../config/database.js';
import { createInitialSeedSnapshot } from '../data/seedData.js';
import {
  ArticleModel,
  ArtisanModel,
  ChallengeModel,
  ContactModel,
  EventModel,
  ProcessModel,
  ProductModel,
  QuizQuestionModel,
  StoryModel,
  UserModel,
} from '../models/schemas.js';
import type {
  ArticleEntity,
  ArtisanEntity,
  ChallengeEntity,
  ContactEntity,
  ContactStatus,
  EventEntity,
  EventRegistration,
  LocalDatabaseSnapshot,
  ProcessEntity,
  ProductEntity,
  QuizQuestionEntity,
  StoryEntity,
  UserEntity,
} from '../types/heritage.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const LOCAL_DB_FILE = path.join(DATA_DIR, 'vanphuc-db.json');

let memoryStore: LocalDatabaseSnapshot | null = null;

function ensureLocalStore(): LocalDatabaseSnapshot {
  if (memoryStore) return memoryStore;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(LOCAL_DB_FILE)) {
    try {
      const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf8');
      memoryStore = JSON.parse(raw) as LocalDatabaseSnapshot;
      return memoryStore;
    } catch {
      // Recover cleanly if corrupted
    }
  }
  memoryStore = createInitialSeedSnapshot();
  persistLocalStore();
  return memoryStore;
}

function persistLocalStore(): void {
  if (!memoryStore) return;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
}

function toPlain<T>(doc: unknown): T {
  if (doc && typeof doc === 'object' && 'toObject' in doc && typeof (doc as { toObject: () => unknown }).toObject === 'function') {
    const obj = (doc as { toObject: () => Record<string, unknown> }).toObject();
    return { ...obj, _id: String(obj._id) } as unknown as T;
  }
  if (doc && typeof doc === 'object' && '_id' in doc) {
    const obj = doc as Record<string, unknown>;
    return { ...obj, _id: String(obj._id) } as unknown as T;
  }
  return doc as T;
}

export async function initializeRepositorySeed(): Promise<void> {
  if (getPersistenceMode() === 'local-json') {
    ensureLocalStore();
    return;
  }

  const seed = createInitialSeedSnapshot();
  const [articleCount, artisanCount, productCount, processCount, challengeCount, storyCount, quizCount, eventCount] =
    await Promise.all([
      ArticleModel.countDocuments(),
      ArtisanModel.countDocuments(),
      ProductModel.countDocuments(),
      ProcessModel.countDocuments(),
      ChallengeModel.countDocuments(),
      StoryModel.countDocuments(),
      QuizQuestionModel.countDocuments(),
      EventModel.countDocuments(),
    ]);

  const stripId = <T extends { _id: string }>(arr: T[]) => arr.map(({ _id: _omit, ...rest }) => rest);

  if (articleCount === 0) await ArticleModel.insertMany(stripId(seed.articles));
  if (artisanCount === 0) await ArtisanModel.insertMany(stripId(seed.artisans));
  if (productCount === 0) await ProductModel.insertMany(stripId(seed.products));
  if (processCount === 0) await ProcessModel.insertMany(stripId(seed.processes));
  if (challengeCount === 0) await ChallengeModel.insertMany(stripId(seed.challenges));
  if (storyCount === 0) await StoryModel.insertMany(stripId(seed.stories));
  if (quizCount === 0) await QuizQuestionModel.insertMany(stripId(seed.quizQuestions));
  if (eventCount === 0) await EventModel.insertMany(stripId(seed.events));

  const contactCount = await ContactModel.countDocuments();
  if (contactCount === 0) await ContactModel.insertMany(stripId(seed.contacts));
}

export const heritageRepository = {
  // --- Users (Admin Auth) ---
  async countAdmins(): Promise<number> {
    if (getPersistenceMode() === 'mongodb') {
      return UserModel.countDocuments({ role: 'admin' });
    }
    return ensureLocalStore().users.filter((u) => u.role === 'admin').length;
  },

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const normalized = email.toLowerCase().trim();
    if (getPersistenceMode() === 'mongodb') {
      const doc = await UserModel.findOne({ email: normalized }).lean();
      return doc ? toPlain<UserEntity>(doc) : null;
    }
    return ensureLocalStore().users.find((u) => u.email.toLowerCase() === normalized) || null;
  },

  async createAdminUser(input: Omit<UserEntity, '_id' | 'createdAt'>): Promise<UserEntity> {
    if (getPersistenceMode() === 'mongodb') {
      const created = await UserModel.create(input);
      return toPlain<UserEntity>(created);
    }
    const store = ensureLocalStore();
    const entity: UserEntity = {
      ...input,
      _id: `usr-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
    };
    store.users.push(entity);
    persistLocalStore();
    return entity;
  },

  // --- Articles ---
  async listArticles(category?: string): Promise<ArticleEntity[]> {
    if (getPersistenceMode() === 'mongodb') {
      const filter = category && ['history', 'heritage', 'news'].includes(category) ? { category } : {};
      const docs = await ArticleModel.find(filter).sort({ publishedAt: -1 }).lean();
      return docs.map((d) => toPlain<ArticleEntity>(d));
    }
    const items = ensureLocalStore().articles;
    return category ? items.filter((a) => a.category === category) : [...items];
  },

  async createArticle(data: Omit<ArticleEntity, '_id'>): Promise<ArticleEntity> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ArticleModel.create(data);
      return toPlain<ArticleEntity>(doc);
    }
    const store = ensureLocalStore();
    const entity: ArticleEntity = { ...data, _id: `art-${crypto.randomUUID().slice(0, 8)}` };
    store.articles.unshift(entity);
    persistLocalStore();
    return entity;
  },

  async updateArticle(id: string, data: Partial<ArticleEntity>): Promise<ArticleEntity | null> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ArticleModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
      return doc ? toPlain<ArticleEntity>(doc) : null;
    }
    const store = ensureLocalStore();
    const idx = store.articles.findIndex((a) => a._id === id);
    if (idx === -1) return null;
    store.articles[idx] = { ...store.articles[idx], ...data, _id: id };
    persistLocalStore();
    return store.articles[idx];
  },

  async deleteArticle(id: string): Promise<boolean> {
    if (getPersistenceMode() === 'mongodb') {
      const res = await ArticleModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const store = ensureLocalStore();
    const before = store.articles.length;
    store.articles = store.articles.filter((a) => a._id !== id);
    persistLocalStore();
    return store.articles.length < before;
  },

  // --- Artisans ---
  async listArtisans(): Promise<ArtisanEntity[]> {
    if (getPersistenceMode() === 'mongodb') {
      const docs = await ArtisanModel.find().sort({ featured: -1, yearsOfExperience: -1 }).lean();
      return docs.map((d) => toPlain<ArtisanEntity>(d));
    }
    return [...ensureLocalStore().artisans];
  },

  async createArtisan(data: Omit<ArtisanEntity, '_id'>): Promise<ArtisanEntity> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ArtisanModel.create(data);
      return toPlain<ArtisanEntity>(doc);
    }
    const store = ensureLocalStore();
    const entity: ArtisanEntity = { ...data, _id: `artn-${crypto.randomUUID().slice(0, 8)}` };
    store.artisans.push(entity);
    persistLocalStore();
    return entity;
  },

  async updateArtisan(id: string, data: Partial<ArtisanEntity>): Promise<ArtisanEntity | null> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ArtisanModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
      return doc ? toPlain<ArtisanEntity>(doc) : null;
    }
    const store = ensureLocalStore();
    const idx = store.artisans.findIndex((a) => a._id === id);
    if (idx === -1) return null;
    store.artisans[idx] = { ...store.artisans[idx], ...data, _id: id };
    persistLocalStore();
    return store.artisans[idx];
  },

  async deleteArtisan(id: string): Promise<boolean> {
    if (getPersistenceMode() === 'mongodb') {
      const res = await ArtisanModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const store = ensureLocalStore();
    const before = store.artisans.length;
    store.artisans = store.artisans.filter((a) => a._id !== id);
    persistLocalStore();
    return store.artisans.length < before;
  },

  // --- Products ---
  async listProducts(weaveType?: string): Promise<ProductEntity[]> {
    if (getPersistenceMode() === 'mongodb') {
      const filter = weaveType && ['van', 'the', 'linh', 'gam', 'dui'].includes(weaveType) ? { weaveType } : {};
      const docs = await ProductModel.find(filter).sort({ accessionCode: 1 }).lean();
      return docs.map((d) => toPlain<ProductEntity>(d));
    }
    const items = ensureLocalStore().products;
    return weaveType ? items.filter((p) => p.weaveType === weaveType) : [...items];
  },

  async createProduct(data: Omit<ProductEntity, '_id'>): Promise<ProductEntity> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ProductModel.create(data);
      return toPlain<ProductEntity>(doc);
    }
    const store = ensureLocalStore();
    const entity: ProductEntity = { ...data, _id: `prod-${crypto.randomUUID().slice(0, 8)}` };
    store.products.push(entity);
    persistLocalStore();
    return entity;
  },

  async updateProduct(id: string, data: Partial<ProductEntity>): Promise<ProductEntity | null> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ProductModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
      return doc ? toPlain<ProductEntity>(doc) : null;
    }
    const store = ensureLocalStore();
    const idx = store.products.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    store.products[idx] = { ...store.products[idx], ...data, _id: id };
    persistLocalStore();
    return store.products[idx];
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (getPersistenceMode() === 'mongodb') {
      const res = await ProductModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const store = ensureLocalStore();
    const before = store.products.length;
    store.products = store.products.filter((p) => p._id !== id);
    persistLocalStore();
    return store.products.length < before;
  },

  // --- Processes ---
  async listProcesses(): Promise<ProcessEntity[]> {
    if (getPersistenceMode() === 'mongodb') {
      const docs = await ProcessModel.find().sort({ stepOrder: 1 }).lean();
      return docs.map((d) => toPlain<ProcessEntity>(d));
    }
    return [...ensureLocalStore().processes].sort((a, b) => a.stepOrder - b.stepOrder);
  },

  async createProcess(data: Omit<ProcessEntity, '_id'>): Promise<ProcessEntity> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ProcessModel.create(data);
      return toPlain<ProcessEntity>(doc);
    }
    const store = ensureLocalStore();
    const entity: ProcessEntity = { ...data, _id: `proc-${crypto.randomUUID().slice(0, 8)}` };
    store.processes.push(entity);
    persistLocalStore();
    return entity;
  },

  async updateProcess(id: string, data: Partial<ProcessEntity>): Promise<ProcessEntity | null> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ProcessModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
      return doc ? toPlain<ProcessEntity>(doc) : null;
    }
    const store = ensureLocalStore();
    const idx = store.processes.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    store.processes[idx] = { ...store.processes[idx], ...data, _id: id };
    persistLocalStore();
    return store.processes[idx];
  },

  async deleteProcess(id: string): Promise<boolean> {
    if (getPersistenceMode() === 'mongodb') {
      const res = await ProcessModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const store = ensureLocalStore();
    const before = store.processes.length;
    store.processes = store.processes.filter((p) => p._id !== id);
    persistLocalStore();
    return store.processes.length < before;
  },

  // --- Challenges ---
  async listChallenges(): Promise<ChallengeEntity[]> {
    if (getPersistenceMode() === 'mongodb') {
      const docs = await ChallengeModel.find().lean();
      return docs.map((d) => toPlain<ChallengeEntity>(d));
    }
    return [...ensureLocalStore().challenges];
  },

  async createChallenge(data: Omit<ChallengeEntity, '_id'>): Promise<ChallengeEntity> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ChallengeModel.create(data);
      return toPlain<ChallengeEntity>(doc);
    }
    const store = ensureLocalStore();
    const entity: ChallengeEntity = { ...data, _id: `chal-${crypto.randomUUID().slice(0, 8)}` };
    store.challenges.push(entity);
    persistLocalStore();
    return entity;
  },

  async updateChallenge(id: string, data: Partial<ChallengeEntity>): Promise<ChallengeEntity | null> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ChallengeModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
      return doc ? toPlain<ChallengeEntity>(doc) : null;
    }
    const store = ensureLocalStore();
    const idx = store.challenges.findIndex((c) => c._id === id);
    if (idx === -1) return null;
    store.challenges[idx] = { ...store.challenges[idx], ...data, _id: id };
    persistLocalStore();
    return store.challenges[idx];
  },

  async deleteChallenge(id: string): Promise<boolean> {
    if (getPersistenceMode() === 'mongodb') {
      const res = await ChallengeModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const store = ensureLocalStore();
    const before = store.challenges.length;
    store.challenges = store.challenges.filter((c) => c._id !== id);
    persistLocalStore();
    return store.challenges.length < before;
  },

  // --- Stories ---
  async listStories(): Promise<StoryEntity[]> {
    if (getPersistenceMode() === 'mongodb') {
      const docs = await StoryModel.find().sort({ publishedAt: -1 }).lean();
      return docs.map((d) => toPlain<StoryEntity>(d));
    }
    return [...ensureLocalStore().stories];
  },

  async createStory(data: Omit<StoryEntity, '_id'>): Promise<StoryEntity> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await StoryModel.create(data);
      return toPlain<StoryEntity>(doc);
    }
    const store = ensureLocalStore();
    const entity: StoryEntity = { ...data, _id: `story-${crypto.randomUUID().slice(0, 8)}` };
    store.stories.unshift(entity);
    persistLocalStore();
    return entity;
  },

  async updateStory(id: string, data: Partial<StoryEntity>): Promise<StoryEntity | null> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await StoryModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
      return doc ? toPlain<StoryEntity>(doc) : null;
    }
    const store = ensureLocalStore();
    const idx = store.stories.findIndex((s) => s._id === id);
    if (idx === -1) return null;
    store.stories[idx] = { ...store.stories[idx], ...data, _id: id };
    persistLocalStore();
    return store.stories[idx];
  },

  async deleteStory(id: string): Promise<boolean> {
    if (getPersistenceMode() === 'mongodb') {
      const res = await StoryModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const store = ensureLocalStore();
    const before = store.stories.length;
    store.stories = store.stories.filter((s) => s._id !== id);
    persistLocalStore();
    return store.stories.length < before;
  },

  // --- Quiz Questions ---
  async listQuizQuestions(topic?: string): Promise<QuizQuestionEntity[]> {
    if (getPersistenceMode() === 'mongodb') {
      const filter = topic && ['history', 'weaving', 'motifs', 'preservation'].includes(topic) ? { topic } : {};
      const docs = await QuizQuestionModel.find(filter).lean();
      return docs.map((d) => toPlain<QuizQuestionEntity>(d));
    }
    const items = ensureLocalStore().quizQuestions;
    return topic ? items.filter((q) => q.topic === topic) : [...items];
  },

  async createQuizQuestion(data: Omit<QuizQuestionEntity, '_id'>): Promise<QuizQuestionEntity> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await QuizQuestionModel.create(data);
      return toPlain<QuizQuestionEntity>(doc);
    }
    const store = ensureLocalStore();
    const entity: QuizQuestionEntity = { ...data, _id: `quiz-${crypto.randomUUID().slice(0, 8)}` };
    store.quizQuestions.push(entity);
    persistLocalStore();
    return entity;
  },

  async updateQuizQuestion(id: string, data: Partial<QuizQuestionEntity>): Promise<QuizQuestionEntity | null> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await QuizQuestionModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
      return doc ? toPlain<QuizQuestionEntity>(doc) : null;
    }
    const store = ensureLocalStore();
    const idx = store.quizQuestions.findIndex((q) => q._id === id);
    if (idx === -1) return null;
    store.quizQuestions[idx] = { ...store.quizQuestions[idx], ...data, _id: id };
    persistLocalStore();
    return store.quizQuestions[idx];
  },

  async deleteQuizQuestion(id: string): Promise<boolean> {
    if (getPersistenceMode() === 'mongodb') {
      const res = await QuizQuestionModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const store = ensureLocalStore();
    const before = store.quizQuestions.length;
    store.quizQuestions = store.quizQuestions.filter((q) => q._id !== id);
    persistLocalStore();
    return store.quizQuestions.length < before;
  },

  // --- Events & RSVP ---
  async listEvents(): Promise<EventEntity[]> {
    if (getPersistenceMode() === 'mongodb') {
      const docs = await EventModel.find().sort({ startDate: 1 }).lean();
      return docs.map((d) => toPlain<EventEntity>(d));
    }
    return [...ensureLocalStore().events].sort((a, b) => a.startDate.localeCompare(b.startDate));
  },

  async registerForEvent(
    eventId: string,
    reg: Omit<EventRegistration, '_id' | 'createdAt'>
  ): Promise<{ ok: true; event: EventEntity } | { ok: false; code: 404 | 409; message: string }> {
    const registrationEntry: Omit<EventRegistration, '_id'> = {
      ...reg,
      createdAt: new Date().toISOString(),
    };

    if (getPersistenceMode() === 'mongodb') {
      const updated = await EventModel.findOneAndUpdate(
        {
          _id: eventId,
          $expr: { $lt: ['$registeredCount', '$capacity'] },
        },
        {
          $inc: { registeredCount: 1 },
          $push: { registrations: registrationEntry },
        },
        { new: true }
      ).lean();

      if (!updated) {
        const exists = await EventModel.exists({ _id: eventId });
        if (!exists) {
          return { ok: false, code: 404, message: 'Event not found' };
        }
        return { ok: false, code: 409, message: 'Event capacity is full' };
      }
      return { ok: true, event: toPlain<EventEntity>(updated) };
    }

    const store = ensureLocalStore();
    const idx = store.events.findIndex((e) => e._id === eventId);
    if (idx === -1) {
      return { ok: false, code: 404, message: 'Event not found' };
    }
    const evt = store.events[idx];
    if (evt.registeredCount >= evt.capacity) {
      return { ok: false, code: 409, message: 'Event capacity is full' };
    }
    const alreadyRegistered = evt.registrations.some(
      (r) => r.email.toLowerCase() === reg.email.toLowerCase()
    );
    if (alreadyRegistered) {
      return { ok: false, code: 409, message: 'Email is already registered for this event' };
    }
    evt.registeredCount += 1;
    evt.registrations.push({
      ...registrationEntry,
      _id: `reg-${crypto.randomUUID().slice(0, 8)}`,
    });
    persistLocalStore();
    return { ok: true, event: evt };
  },

  async createEvent(data: Omit<EventEntity, '_id' | 'registrations' | 'registeredCount'>): Promise<EventEntity> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await EventModel.create({ ...data, registeredCount: 0, registrations: [] });
      return toPlain<EventEntity>(doc);
    }
    const store = ensureLocalStore();
    const entity: EventEntity = {
      ...data,
      _id: `evt-${crypto.randomUUID().slice(0, 8)}`,
      registeredCount: 0,
      registrations: [],
    };
    store.events.push(entity);
    persistLocalStore();
    return entity;
  },

  async updateEvent(id: string, data: Partial<EventEntity>): Promise<EventEntity | null> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await EventModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
      return doc ? toPlain<EventEntity>(doc) : null;
    }
    const store = ensureLocalStore();
    const idx = store.events.findIndex((e) => e._id === id);
    if (idx === -1) return null;
    store.events[idx] = { ...store.events[idx], ...data, _id: id };
    persistLocalStore();
    return store.events[idx];
  },

  async deleteEvent(id: string): Promise<boolean> {
    if (getPersistenceMode() === 'mongodb') {
      const res = await EventModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const store = ensureLocalStore();
    const before = store.events.length;
    store.events = store.events.filter((e) => e._id !== id);
    persistLocalStore();
    return store.events.length < before;
  },

  // --- Contacts ---
  async listContacts(): Promise<ContactEntity[]> {
    if (getPersistenceMode() === 'mongodb') {
      const docs = await ContactModel.find().sort({ createdAt: -1 }).lean();
      return docs.map((d) => toPlain<ContactEntity>(d));
    }
    return [...ensureLocalStore().contacts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async createContact(
    data: Omit<ContactEntity, '_id' | 'status' | 'createdAt'>
  ): Promise<ContactEntity> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ContactModel.create({ ...data, status: 'new' });
      return toPlain<ContactEntity>(doc);
    }
    const store = ensureLocalStore();
    const entity: ContactEntity = {
      ...data,
      _id: `cnt-${crypto.randomUUID().slice(0, 8)}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    store.contacts.unshift(entity);
    persistLocalStore();
    return entity;
  },

  async updateContactStatus(id: string, status: ContactStatus): Promise<ContactEntity | null> {
    if (getPersistenceMode() === 'mongodb') {
      const doc = await ContactModel.findByIdAndUpdate(id, { $set: { status } }, { new: true, runValidators: true }).lean();
      return doc ? toPlain<ContactEntity>(doc) : null;
    }
    const store = ensureLocalStore();
    const idx = store.contacts.findIndex((c) => c._id === id);
    if (idx === -1) return null;
    store.contacts[idx].status = status;
    persistLocalStore();
    return store.contacts[idx];
  },

  async deleteContact(id: string): Promise<boolean> {
    if (getPersistenceMode() === 'mongodb') {
      const res = await ContactModel.findByIdAndDelete(id);
      return Boolean(res);
    }
    const store = ensureLocalStore();
    const before = store.contacts.length;
    store.contacts = store.contacts.filter((c) => c._id !== id);
    persistLocalStore();
    return store.contacts.length < before;
  },
};
