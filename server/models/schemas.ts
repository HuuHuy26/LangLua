import mongoose, { Schema } from 'mongoose';

const LocalizedTextSchema = new Schema(
  {
    vi: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'member'], default: 'admin' },
  },
  { timestamps: true }
);

const ArticleSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: LocalizedTextSchema, required: true },
    category: { type: String, enum: ['history', 'heritage', 'news'], required: true },
    eraYear: { type: String, required: true, trim: true },
    summary: { type: LocalizedTextSchema, required: true },
    content: { type: LocalizedTextSchema, required: true },
    imageUrl: { type: String, required: true, trim: true },
    readMinutes: { type: Number, required: true, min: 1, default: 4 },
    publishedAt: { type: String, required: true },
  },
  { timestamps: true }
);

const ArtisanSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    honorificTitle: { type: LocalizedTextSchema, required: true },
    birthYear: { type: Number, required: true, min: 1900, max: 2010 },
    yearsOfExperience: { type: Number, required: true, min: 1 },
    specialty: { type: LocalizedTextSchema, required: true },
    lineage: { type: LocalizedTextSchema, required: true },
    biography: { type: LocalizedTextSchema, required: true },
    quote: { type: LocalizedTextSchema, required: true },
    portraitUrl: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProductSchema = new Schema(
  {
    accessionCode: { type: String, required: true, unique: true, trim: true },
    name: { type: LocalizedTextSchema, required: true },
    weaveType: { type: String, enum: ['van', 'the', 'linh', 'gam', 'dui'], required: true },
    motifMeaning: { type: LocalizedTextSchema, required: true },
    material: { type: LocalizedTextSchema, required: true },
    dimensions: { type: String, required: true, trim: true },
    careGuide: { type: LocalizedTextSchema, required: true },
    description: { type: LocalizedTextSchema, required: true },
    imageUrl: { type: String, required: true, trim: true },
    isHeritageHighlight: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProcessSchema = new Schema(
  {
    stepOrder: { type: Number, required: true, min: 1, max: 20, unique: true },
    title: { type: LocalizedTextSchema, required: true },
    subtitle: { type: LocalizedTextSchema, required: true },
    description: { type: LocalizedTextSchema, required: true },
    toolsUsed: { type: LocalizedTextSchema, required: true },
    artisanTip: { type: LocalizedTextSchema, required: true },
    durationLabel: { type: LocalizedTextSchema, required: true },
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const ChallengeSchema = new Schema(
  {
    title: { type: LocalizedTextSchema, required: true },
    severity: { type: String, enum: ['critical', 'high', 'moderate'], required: true },
    category: { type: String, enum: ['economic', 'succession', 'supply', 'environmental'], required: true },
    description: { type: LocalizedTextSchema, required: true },
    impactMetric: { type: LocalizedTextSchema, required: true },
    preservationSolution: { type: LocalizedTextSchema, required: true },
  },
  { timestamps: true }
);

const StorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: LocalizedTextSchema, required: true },
    narratorName: { type: String, required: true, trim: true },
    narratorRole: { type: LocalizedTextSchema, required: true },
    eraContext: { type: LocalizedTextSchema, required: true },
    excerpt: { type: LocalizedTextSchema, required: true },
    body: { type: LocalizedTextSchema, required: true },
    pullQuote: { type: LocalizedTextSchema, required: true },
    coverUrl: { type: String, required: true, trim: true },
    publishedAt: { type: String, required: true },
  },
  { timestamps: true }
);

const QuizQuestionSchema = new Schema(
  {
    question: { type: LocalizedTextSchema, required: true },
    options: {
      vi: { type: [String], required: true },
      en: { type: [String], required: true },
    },
    correctIndex: { type: Number, required: true, min: 0, max: 5 },
    explanation: { type: LocalizedTextSchema, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    topic: { type: String, enum: ['history', 'weaving', 'motifs', 'preservation'], required: true },
  },
  { timestamps: true }
);

const EventRegistrationSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    participantType: { type: String, enum: ['student', 'youth', 'tourist', 'researcher'], default: 'youth' },
    note: { type: String, default: '', trim: true },
    createdAt: { type: String, required: true },
  },
  { _id: true }
);

const EventSchema = new Schema(
  {
    title: { type: LocalizedTextSchema, required: true },
    eventType: { type: String, enum: ['workshop', 'exhibition', 'volunteer', 'tour'], required: true },
    startDate: { type: String, required: true },
    location: { type: LocalizedTextSchema, required: true },
    capacity: { type: Number, required: true, min: 1 },
    registeredCount: { type: Number, default: 0, min: 0 },
    description: { type: LocalizedTextSchema, required: true },
    registrations: { type: [EventRegistrationSchema], default: [] },
  },
  { timestamps: true }
);

const ContactSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    inquiryType: { type: String, enum: ['visit', 'education', 'preservation', 'media'], required: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'reviewed', 'resolved'], default: 'new' },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const ArticleModel = mongoose.models.Article || mongoose.model('Article', ArticleSchema);
export const ArtisanModel = mongoose.models.Artisan || mongoose.model('Artisan', ArtisanSchema);
export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const ProcessModel = mongoose.models.Process || mongoose.model('Process', ProcessSchema);
export const ChallengeModel = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);
export const StoryModel = mongoose.models.Story || mongoose.model('Story', StorySchema);
export const QuizQuestionModel = mongoose.models.QuizQuestion || mongoose.model('QuizQuestion', QuizQuestionSchema);
export const EventModel = mongoose.models.Event || mongoose.model('Event', EventSchema);
export const ContactModel = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
