import crypto from 'crypto';
import { Router } from 'express';
import { getPersistenceMode } from '../config/database.js';
import {
  extractBearerToken,
  hashPassword,
  isValidEmail,
  requireAdmin,
  sanitizeInput,
  signToken,
  verifyPassword,
  verifyToken,
  type AuthenticatedRequest,
} from '../middleware/auth.js';
import { heritageRepository } from '../repositories/heritageRepository.js';
import type { ContactStatus, LocalizedText } from '../types/heritage.js';

export const apiRouter = Router();

function isLocalizedText(val: unknown): val is LocalizedText {
  return (
    typeof val === 'object' &&
    val !== null &&
    typeof (val as LocalizedText).vi === 'string' &&
    (val as LocalizedText).vi.trim().length > 0 &&
    typeof (val as LocalizedText).en === 'string' &&
    (val as LocalizedText).en.trim().length > 0
  );
}

function timingSafeCompareText(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function isValidPhone(phone: string): boolean {
  return /^[0-9+\-\s().]{8,20}$/.test(phone);
}

function stripProtectedFields(body: Record<string, unknown>, extraOmit: string[] = []): Record<string, unknown> {
  const omit = new Set(['_id', 'createdAt', 'updatedAt', 'passwordHash', 'role', ...extraOmit]);
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(body)) {
    if (!omit.has(key)) out[key] = val;
  }
  return out;
}

// --- Health Check ---
apiRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    persistence: getPersistenceMode(),
    timestamp: new Date().toISOString(),
  });
});

// --- Auth & First-Run Admin Setup ---
apiRouter.get('/auth/status', async (req, res, next) => {
  try {
    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    const adminCount = await heritageRepository.countAdmins();
    const requiresClaim = !envPasscode && adminCount === 0;
    const token = extractBearerToken(req);
    const payload = token ? verifyToken(token) : null;

    res.json({
      initialized: !requiresClaim,
      requiresClaim,
      envPasscodeActive: Boolean(envPasscode),
      authenticated: Boolean(payload && payload.role === 'admin'),
      user: payload ? { name: payload.name, email: payload.email, role: payload.role } : null,
    });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/auth/claim', async (req, res, next) => {
  try {
    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    const adminCount = await heritageRepository.countAdmins();
    if (envPasscode || adminCount > 0) {
      res.status(409).json({ error: 'Administrator credentials are already configured.' });
      return;
    }

    const body = sanitizeInput(req.body as Record<string, unknown>);
    const name = typeof body.name === 'string' ? body.name.trim() : 'Curator';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!isValidEmail(email) || password.length < 8) {
      res.status(400).json({ error: 'Valid email and password (minimum 8 characters) are required.' });
      return;
    }

    const created = await heritageRepository.createAdminUser({
      name: name || 'Vạn Phúc Curator',
      email,
      passwordHash: hashPassword(password),
      role: 'admin',
    });

    const token = signToken({
      sub: created._id,
      email: created.email,
      name: created.name,
      role: 'admin',
    });

    res.status(201).json({
      token,
      user: { name: created.name, email: created.email, role: created.role },
    });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/auth/login', async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!password) {
      res.status(400).json({ error: 'Password is required.' });
      return;
    }

    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    if (envPasscode) {
      if (!timingSafeCompareText(password, envPasscode)) {
        res.status(401).json({ error: 'Invalid administrator credentials.' });
        return;
      }
      const adminEmail = isValidEmail(email) ? email : 'curator@vanphuc-heritage.vn';
      const token = signToken({
        sub: 'env-admin',
        email: adminEmail,
        name: 'Vạn Phúc Curator',
        role: 'admin',
      });
      res.json({
        token,
        user: { name: 'Vạn Phúc Curator', email: adminEmail, role: 'admin' },
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Valid email is required.' });
      return;
    }

    const user = await heritageRepository.findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = signToken({
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// --- Aggregated Overview ---
apiRouter.get('/overview', async (_req, res, next) => {
  try {
    const [articles, artisans, products, processes, challenges, stories, events] = await Promise.all([
      heritageRepository.listArticles(),
      heritageRepository.listArtisans(),
      heritageRepository.listProducts(),
      heritageRepository.listProcesses(),
      heritageRepository.listChallenges(),
      heritageRepository.listStories(),
      heritageRepository.listEvents(),
    ]);

    const safeEvents = events.map(({ registrations: _omit, ...evt }) => evt);

    res.json({
      articles,
      artisans,
      products,
      processes,
      challenges,
      stories,
      events: safeEvents,
    });
  } catch (err) {
    next(err);
  }
});

// --- Articles ---
apiRouter.get('/articles', async (req, res, next) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const articles = await heritageRepository.listArticles(category);
    res.json(articles);
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/articles', requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    if (!isLocalizedText(body.title) || !isLocalizedText(body.summary) || !isLocalizedText(body.content)) {
      res.status(400).json({ error: 'Bilingual title, summary, and content are required.' });
      return;
    }
    const slug =
      typeof body.slug === 'string' && body.slug.trim()
        ? body.slug.trim()
        : `article-${Date.now()}`;
    const created = await heritageRepository.createArticle({
      slug,
      title: body.title,
      category: body.category === 'heritage' || body.category === 'news' ? body.category : 'history',
      eraYear: typeof body.eraYear === 'string' && body.eraYear.trim() ? body.eraYear.trim() : '2026',
      summary: body.summary,
      content: body.content,
      imageUrl:
        typeof body.imageUrl === 'string' && body.imageUrl.trim()
          ? body.imageUrl.trim()
          : '/src/assets/images/hero_vanphuc_loom_1795364489896.jpg',
      readMinutes: typeof body.readMinutes === 'number' && body.readMinutes > 0 ? body.readMinutes : 4,
      publishedAt:
        typeof body.publishedAt === 'string' && body.publishedAt.trim()
          ? body.publishedAt.trim()
          : new Date().toISOString().slice(0, 10),
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/articles/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = stripProtectedFields(sanitizeInput(req.body as Record<string, unknown>));
    const updated = await heritageRepository.updateArticle(req.params.id, body);
    if (!updated) {
      res.status(404).json({ error: 'Article not found.' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/articles/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await heritageRepository.deleteArticle(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Article not found.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Artisans ---
apiRouter.get('/artisans', async (_req, res, next) => {
  try {
    const artisans = await heritageRepository.listArtisans();
    res.json(artisans);
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/artisans', requireAdmin, async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    if (
      typeof body.name !== 'string' ||
      !body.name.trim() ||
      !isLocalizedText(body.honorificTitle) ||
      !isLocalizedText(body.specialty) ||
      !isLocalizedText(body.biography)
    ) {
      res.status(400).json({ error: 'Name and bilingual artisan details are required.' });
      return;
    }
    const created = await heritageRepository.createArtisan({
      name: body.name.trim(),
      honorificTitle: body.honorificTitle,
      birthYear: typeof body.birthYear === 'number' ? body.birthYear : 1958,
      yearsOfExperience: typeof body.yearsOfExperience === 'number' ? body.yearsOfExperience : 35,
      specialty: body.specialty,
      lineage: isLocalizedText(body.lineage)
        ? body.lineage
        : { vi: 'Làng nghề Vạn Phúc', en: 'Vạn Phúc Silk Village' },
      biography: body.biography,
      quote: isLocalizedText(body.quote)
        ? body.quote
        : { vi: 'Giữ lửa khung cửi truyền thống.', en: 'Keeping the loom flame alive.' },
      portraitUrl:
        typeof body.portraitUrl === 'string' && body.portraitUrl.trim()
          ? body.portraitUrl.trim()
          : '/src/assets/images/artisan_portrait_master_1795364490116.jpg',
      featured: Boolean(body.featured),
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/artisans/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = stripProtectedFields(sanitizeInput(req.body as Record<string, unknown>));
    const updated = await heritageRepository.updateArtisan(req.params.id, body);
    if (!updated) {
      res.status(404).json({ error: 'Artisan not found.' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/artisans/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await heritageRepository.deleteArtisan(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Artisan not found.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Products ---
apiRouter.get('/products', async (req, res, next) => {
  try {
    const weaveType = typeof req.query.weaveType === 'string' ? req.query.weaveType : undefined;
    const products = await heritageRepository.listProducts(weaveType);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/products', requireAdmin, async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    if (!isLocalizedText(body.name) || !isLocalizedText(body.description)) {
      res.status(400).json({ error: 'Bilingual product name and description are required.' });
      return;
    }
    const created = await heritageRepository.createProduct({
      accessionCode:
        typeof body.accessionCode === 'string' && body.accessionCode.trim()
          ? body.accessionCode.trim()
          : `VP-ARC-${String(Date.now()).slice(-4)}`,
      name: body.name,
      weaveType:
        body.weaveType === 'van' ||
        body.weaveType === 'the' ||
        body.weaveType === 'linh' ||
        body.weaveType === 'gam' ||
        body.weaveType === 'dui'
          ? body.weaveType
          : 'van',
      motifMeaning: isLocalizedText(body.motifMeaning)
        ? body.motifMeaning
        : { vi: 'Hoa văn truyền thống Vạn Phúc', en: 'Traditional Vạn Phúc motif' },
      material: isLocalizedText(body.material)
        ? body.material
        : { vi: '100% tơ tằm tự nhiên', en: '100% natural mulberry silk' },
      dimensions:
        typeof body.dimensions === 'string' && body.dimensions.trim()
          ? body.dimensions.trim()
          : 'Khổ 90 cm',
      careGuide: isLocalizedText(body.careGuide)
        ? body.careGuide
        : { vi: 'Giặt tay nước mát, phơi bóng râm.', en: 'Hand wash cool, shade dry.' },
      description: body.description,
      imageUrl:
        typeof body.imageUrl === 'string' && body.imageUrl.trim()
          ? body.imageUrl.trim()
          : '/src/assets/images/silk_van_phuc_swatch_1795364489683.jpg',
      isHeritageHighlight: Boolean(body.isHeritageHighlight),
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/products/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = stripProtectedFields(sanitizeInput(req.body as Record<string, unknown>));
    const updated = await heritageRepository.updateProduct(req.params.id, body);
    if (!updated) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/products/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await heritageRepository.deleteProduct(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Processes ---
apiRouter.get('/processes', async (_req, res, next) => {
  try {
    const processes = await heritageRepository.listProcesses();
    res.json(processes);
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/processes', requireAdmin, async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    if (!isLocalizedText(body.title) || !isLocalizedText(body.description)) {
      res.status(400).json({ error: 'Bilingual process title and description are required.' });
      return;
    }
    const created = await heritageRepository.createProcess({
      stepOrder: typeof body.stepOrder === 'number' ? body.stepOrder : 8,
      title: body.title,
      subtitle: isLocalizedText(body.subtitle) ? body.subtitle : body.title,
      description: body.description,
      toolsUsed: isLocalizedText(body.toolsUsed)
        ? body.toolsUsed
        : { vi: 'Dụng cụ truyền thống', en: 'Traditional craft tools' },
      artisanTip: isLocalizedText(body.artisanTip)
        ? body.artisanTip
        : { vi: 'Thực hiện tỉ mỉ từng công đoạn.', en: 'Performed with steady precision.' },
      durationLabel: isLocalizedText(body.durationLabel)
        ? body.durationLabel
        : { vi: '1 ngày', en: '1 day' },
      imageUrl:
        typeof body.imageUrl === 'string' && body.imageUrl.trim()
          ? body.imageUrl.trim()
          : '/src/assets/images/hero_vanphuc_loom_1795364489896.jpg',
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/processes/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = stripProtectedFields(sanitizeInput(req.body as Record<string, unknown>));
    const updated = await heritageRepository.updateProcess(req.params.id, body);
    if (!updated) {
      res.status(404).json({ error: 'Process step not found.' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/processes/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await heritageRepository.deleteProcess(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Process step not found.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Challenges ---
apiRouter.get('/challenges', async (_req, res, next) => {
  try {
    const challenges = await heritageRepository.listChallenges();
    res.json(challenges);
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/challenges', requireAdmin, async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    if (!isLocalizedText(body.title) || !isLocalizedText(body.description)) {
      res.status(400).json({ error: 'Bilingual title and description are required.' });
      return;
    }
    const created = await heritageRepository.createChallenge({
      title: body.title,
      severity: body.severity === 'critical' || body.severity === 'moderate' ? body.severity : 'high',
      category:
        body.category === 'economic' ||
        body.category === 'succession' ||
        body.category === 'supply' ||
        body.category === 'environmental'
          ? body.category
          : 'succession',
      description: body.description,
      impactMetric: isLocalizedText(body.impactMetric)
        ? body.impactMetric
        : { vi: 'Đang theo dõi', en: 'Under observation' },
      preservationSolution: isLocalizedText(body.preservationSolution)
        ? body.preservationSolution
        : { vi: 'Giải pháp bảo tồn cộng đồng', en: 'Community preservation action' },
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/challenges/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = stripProtectedFields(sanitizeInput(req.body as Record<string, unknown>));
    const updated = await heritageRepository.updateChallenge(req.params.id, body);
    if (!updated) {
      res.status(404).json({ error: 'Challenge not found.' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/challenges/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await heritageRepository.deleteChallenge(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Challenge not found.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Stories ---
apiRouter.get('/stories', async (_req, res, next) => {
  try {
    const stories = await heritageRepository.listStories();
    res.json(stories);
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/stories', requireAdmin, async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    if (!isLocalizedText(body.title) || !isLocalizedText(body.body)) {
      res.status(400).json({ error: 'Bilingual story title and body are required.' });
      return;
    }
    const created = await heritageRepository.createStory({
      slug:
        typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : `story-${Date.now()}`,
      title: body.title,
      narratorName:
        typeof body.narratorName === 'string' && body.narratorName.trim()
          ? body.narratorName.trim()
          : 'Nghệ nhân Vạn Phúc',
      narratorRole: isLocalizedText(body.narratorRole)
        ? body.narratorRole
        : { vi: 'Người giữ nghề', en: 'Craft Keeper' },
      eraContext: isLocalizedText(body.eraContext)
        ? body.eraContext
        : { vi: 'Làng Vạn Phúc', en: 'Vạn Phúc Village' },
      excerpt: isLocalizedText(body.excerpt) ? body.excerpt : body.title,
      body: body.body,
      pullQuote: isLocalizedText(body.pullQuote) ? body.pullQuote : body.title,
      coverUrl:
        typeof body.coverUrl === 'string' && body.coverUrl.trim()
          ? body.coverUrl.trim()
          : '/src/assets/images/silk_dyeing_courtyard_1795364490119.jpg',
      publishedAt: new Date().toISOString().slice(0, 10),
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/stories/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = stripProtectedFields(sanitizeInput(req.body as Record<string, unknown>));
    const updated = await heritageRepository.updateStory(req.params.id, body);
    if (!updated) {
      res.status(404).json({ error: 'Story not found.' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/stories/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await heritageRepository.deleteStory(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Story not found.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Quiz ---
apiRouter.get('/quiz', async (req, res, next) => {
  try {
    const topic = typeof req.query.topic === 'string' ? req.query.topic : undefined;
    const questions = await heritageRepository.listQuizQuestions(topic);
    const publicQuestions = questions.map(({ correctIndex: _c, explanation: _e, ...rest }) => rest);
    res.json(publicQuestions);
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/quiz/verify', async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    const answers = Array.isArray(body.answers) ? body.answers : [];
    const allQuestions = await heritageRepository.listQuizQuestions();
    const map = new Map(allQuestions.map((q) => [q._id, q]));

    let score = 0;
    const results = answers
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const { id, selectedIndex } = item as { id?: unknown; selectedIndex?: unknown };
        if (typeof id !== 'string' || typeof selectedIndex !== 'number') return null;
        const q = map.get(id);
        if (!q) return null;
        const isCorrect = q.correctIndex === selectedIndex;
        if (isCorrect) score += 1;
        return {
          id: q._id,
          selectedIndex,
          correctIndex: q.correctIndex,
          isCorrect,
          explanation: q.explanation,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    res.json({
      score,
      total: results.length,
      results,
    });
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/quiz/admin', requireAdmin, async (_req, res, next) => {
  try {
    const questions = await heritageRepository.listQuizQuestions();
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/quiz', requireAdmin, async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    if (!isLocalizedText(body.question) || !isLocalizedText(body.explanation)) {
      res.status(400).json({ error: 'Bilingual question and explanation are required.' });
      return;
    }
    const opts = body.options as { vi?: unknown; en?: unknown } | undefined;
    if (!opts || !Array.isArray(opts.vi) || !Array.isArray(opts.en) || opts.vi.length < 2) {
      res.status(400).json({ error: 'At least 2 bilingual options are required.' });
      return;
    }
    const created = await heritageRepository.createQuizQuestion({
      question: body.question,
      options: {
        vi: opts.vi.map((s) => String(s)),
        en: opts.en.map((s) => String(s)),
      },
      correctIndex: typeof body.correctIndex === 'number' ? body.correctIndex : 0,
      explanation: body.explanation,
      difficulty:
        body.difficulty === 'easy' || body.difficulty === 'hard' ? body.difficulty : 'medium',
      topic:
        body.topic === 'history' ||
        body.topic === 'weaving' ||
        body.topic === 'motifs' ||
        body.topic === 'preservation'
          ? body.topic
          : 'history',
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/quiz/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = stripProtectedFields(sanitizeInput(req.body as Record<string, unknown>));
    const updated = await heritageRepository.updateQuizQuestion(req.params.id, body);
    if (!updated) {
      res.status(404).json({ error: 'Quiz question not found.' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/quiz/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await heritageRepository.deleteQuizQuestion(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Quiz question not found.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Events & RSVP ---
apiRouter.get('/events', async (_req, res, next) => {
  try {
    const events = await heritageRepository.listEvents();
    const publicEvents = events.map(({ registrations: _omit, ...evt }) => evt);
    res.json(publicEvents);
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/events/admin', requireAdmin, async (_req, res, next) => {
  try {
    const events = await heritageRepository.listEvents();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/events/:id/register', async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const participantType =
      body.participantType === 'student' ||
      body.participantType === 'youth' ||
      body.participantType === 'tourist' ||
      body.participantType === 'researcher'
        ? body.participantType
        : 'youth';
    const note = typeof body.note === 'string' ? body.note.trim().slice(0, 400) : '';

    if (fullName.length < 2 || !isValidEmail(email) || !isValidPhone(phone)) {
      res.status(400).json({ error: 'Valid full name, email, and phone number (8-20 digits) are required.' });
      return;
    }

    const result = await heritageRepository.registerForEvent(req.params.id, {
      fullName,
      email,
      phone,
      participantType,
      note,
    });

    if (!result.ok) {
      res.status(result.code).json({ error: result.message });
      return;
    }

    const { registrations: _omit, ...safeEvent } = result.event;
    res.status(201).json({ ok: true, event: safeEvent });
  } catch (err) {
    next(err);
  }
});

apiRouter.post('/events', requireAdmin, async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    if (!isLocalizedText(body.title) || !isLocalizedText(body.description) || !isLocalizedText(body.location)) {
      res.status(400).json({ error: 'Bilingual event title, location, and description are required.' });
      return;
    }
    const created = await heritageRepository.createEvent({
      title: body.title,
      eventType:
        body.eventType === 'exhibition' ||
        body.eventType === 'volunteer' ||
        body.eventType === 'tour'
          ? body.eventType
          : 'workshop',
      startDate:
        typeof body.startDate === 'string' && body.startDate.trim()
          ? body.startDate.trim()
          : '2026-12-30T09:00',
      location: body.location,
      capacity: typeof body.capacity === 'number' && body.capacity > 0 ? body.capacity : 30,
      description: body.description,
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

apiRouter.put('/events/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = stripProtectedFields(sanitizeInput(req.body as Record<string, unknown>), [
      'registrations',
      'registeredCount',
    ]);
    const updated = await heritageRepository.updateEvent(req.params.id, body);
    if (!updated) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/events/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await heritageRepository.deleteEvent(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Event not found.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// --- Contacts ---
apiRouter.post('/contacts', async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const inquiryType =
      body.inquiryType === 'visit' ||
      body.inquiryType === 'education' ||
      body.inquiryType === 'preservation' ||
      body.inquiryType === 'media'
        ? body.inquiryType
        : 'visit';

    if (fullName.length < 2 || !isValidEmail(email) || message.length < 10) {
      res.status(400).json({ error: 'Full name, valid email, and message (at least 10 characters) are required.' });
      return;
    }
    if (phone && !isValidPhone(phone)) {
      res.status(400).json({ error: 'Invalid phone number format.' });
      return;
    }

    const created = await heritageRepository.createContact({
      fullName,
      email,
      phone,
      inquiryType,
      message,
    });
    res.status(201).json({ ok: true, id: created._id });
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/contacts', requireAdmin, async (_req, res, next) => {
  try {
    const contacts = await heritageRepository.listContacts();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

apiRouter.patch('/contacts/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const body = sanitizeInput(req.body as Record<string, unknown>);
    const status = body.status as ContactStatus;
    if (!['new', 'reviewed', 'resolved'].includes(status)) {
      res.status(400).json({ error: 'Invalid contact status.' });
      return;
    }
    const updated = await heritageRepository.updateContactStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'Contact message not found.' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

apiRouter.delete('/contacts/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await heritageRepository.deleteContact(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Contact message not found.' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
