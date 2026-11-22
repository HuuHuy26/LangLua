import { Lock, LogOut, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  AdminEntityModal,
  type AnyEntity,
  type EditableCollection,
} from '../components/admin/AdminEntityModal';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type {
  AdminQuizQuestion,
  Article,
  Artisan,
  Challenge,
  ContactInquiry,
  PreservationEvent,
  ProcessStep,
  Product,
  Story,
} from '../types';
import { EMAIL_REGEX } from '../utils/validation';

type AdminTab = EditableCollection | 'contacts';

export function AdminPage() {
  const { lang, t } = useLanguage();
  const { status, loading: authLoading, claimAdmin, login, logout } = useAuth();

  const [authName, setAuthName] = useState('Curator Vạn Phúc');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [tab, setTab] = useState<AdminTab>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [processes, setProcesses] = useState<ProcessStep[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [events, setEvents] = useState<PreservationEvent[]>([]);
  const [quizList, setQuizList] = useState<AdminQuizQuestion[]>([]);
  const [contacts, setContacts] = useState<ContactInquiry[]>([]);

  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnyEntity | null>(null);

  const loadAdminData = useCallback(async () => {
    setDataLoading(true);
    setDataError('');
    try {
      const [a1, a2, a3, a4, a5, a6, a7, a8, a9] = await Promise.all([
        heritageApi.listArticles(),
        heritageApi.listArtisans(),
        heritageApi.listProducts(),
        heritageApi.listProcesses(),
        heritageApi.listChallenges(),
        heritageApi.listStories(),
        heritageApi.listAdminEvents(),
        heritageApi.listAdminQuiz(),
        heritageApi.listContacts(),
      ]);
      setArticles(a1);
      setArtisans(a2);
      setProducts(a3);
      setProcesses(a4);
      setChallenges(a5);
      setStories(a6);
      setEvents(a7);
      setQuizList(a8);
      setContacts(a9);
    } catch {
      setDataError(
        lang === 'vi' ? 'Không thể tải dữ liệu quản trị từ máy chủ.' : 'Unable to load admin collections.'
      );
    } finally {
      setDataLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    if (status?.authenticated) {
      void loadAdminData();
    }
  }, [status?.authenticated, loadAdminData]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!EMAIL_REGEX.test(authEmail.trim())) {
      setAuthError(lang === 'vi' ? 'Vui lòng nhập email hợp lệ.' : 'Valid email is required.');
      return;
    }
    if (authPassword.length < 8) {
      setAuthError(
        lang === 'vi' ? 'Mật khẩu quản trị cần tối thiểu 8 ký tự.' : 'Password must be at least 8 characters.'
      );
      return;
    }
    setAuthSubmitting(true);
    try {
      await claimAdmin({ name: authName.trim() || 'Vạn Phúc Curator', email: authEmail.trim(), password: authPassword });
    } catch (err: unknown) {
      setAuthError(
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          'Setup failed. Check password length (min 8 chars).'
      );
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!status?.envPasscodeActive && !EMAIL_REGEX.test(authEmail.trim())) {
      setAuthError(lang === 'vi' ? 'Vui lòng nhập email hợp lệ.' : 'Valid email is required.');
      return;
    }
    if (!authPassword) {
      setAuthError(lang === 'vi' ? 'Vui lòng nhập mật khẩu.' : 'Password is required.');
      return;
    }
    setAuthSubmitting(true);
    try {
      await login({ email: authEmail.trim(), password: authPassword });
    } catch (err: unknown) {
      setAuthError(
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          'Invalid credentials.'
      );
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleModalSave = async (payload: Record<string, unknown>, id?: string) => {
    if (tab === 'articles') {
      if (id) {
        const updated = await heritageApi.updateArticle(id, payload);
        setArticles((prev) => prev.map((x) => (x._id === id ? updated : x)));
      } else {
        const created = await heritageApi.createArticle(payload);
        setArticles((prev) => [created, ...prev]);
      }
    } else if (tab === 'artisans') {
      if (id) {
        const updated = await heritageApi.updateArtisan(id, payload);
        setArtisans((prev) => prev.map((x) => (x._id === id ? updated : x)));
      } else {
        const created = await heritageApi.createArtisan(payload);
        setArtisans((prev) => [...prev, created]);
      }
    } else if (tab === 'products') {
      if (id) {
        const updated = await heritageApi.updateProduct(id, payload);
        setProducts((prev) => prev.map((x) => (x._id === id ? updated : x)));
      } else {
        const created = await heritageApi.createProduct(payload);
        setProducts((prev) => [...prev, created]);
      }
    } else if (tab === 'processes') {
      if (id) {
        const updated = await heritageApi.updateProcess(id, payload);
        setProcesses((prev) => prev.map((x) => (x._id === id ? updated : x)).sort((a, b) => a.stepOrder - b.stepOrder));
      } else {
        const created = await heritageApi.createProcess(payload);
        setProcesses((prev) => [...prev, created].sort((a, b) => a.stepOrder - b.stepOrder));
      }
    } else if (tab === 'challenges') {
      if (id) {
        const updated = await heritageApi.updateChallenge(id, payload);
        setChallenges((prev) => prev.map((x) => (x._id === id ? updated : x)));
      } else {
        const created = await heritageApi.createChallenge(payload);
        setChallenges((prev) => [...prev, created]);
      }
    } else if (tab === 'stories') {
      if (id) {
        const updated = await heritageApi.updateStory(id, payload);
        setStories((prev) => prev.map((x) => (x._id === id ? updated : x)));
      } else {
        const created = await heritageApi.createStory(payload);
        setStories((prev) => [created, ...prev]);
      }
    } else if (tab === 'events') {
      if (id) {
        const updated = await heritageApi.updateEvent(id, payload);
        setEvents((prev) => prev.map((x) => (x._id === id ? updated : x)));
      } else {
        const created = await heritageApi.createEvent(payload);
        setEvents((prev) => [...prev, created]);
      }
    } else if (tab === 'quiz') {
      if (id) {
        const updated = await heritageApi.updateQuizQuestion(id, payload);
        setQuizList((prev) => prev.map((x) => (x._id === id ? updated : x)));
      } else {
        const created = await heritageApi.createQuizQuestion(payload);
        setQuizList((prev) => [...prev, created]);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-16">
        <div className="h-48 animate-pulse bg-[#EFEAE1]" />
      </div>
    );
  }

  if (!status?.authenticated) {
    const isClaimMode = Boolean(status?.requiresClaim);
    return (
      <div className="mx-auto max-w-[520px] px-6 py-16">
        <div className="border border-[#DED6C8] bg-white p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#DED6C8] pb-4">
            <Lock className="h-5 w-5 text-[#9B231D]" />
            <div>
              <h1 className="font-display text-2xl font-semibold text-[#1C1917]">
                {isClaimMode
                  ? lang === 'vi'
                    ? 'Thiết lập Tài khoản Quản trị Lần đầu'
                    : 'First-Run Curator Setup'
                  : lang === 'vi'
                  ? 'Đăng nhập Quản trị Di sản'
                  : 'Curator Portal Sign In'}
              </h1>
              <p className="text-xs text-[#57534E]">
                {isClaimMode
                  ? lang === 'vi'
                    ? 'Tạo mật khẩu quản trị viên duy nhất để bảo vệ kho dữ liệu di sản.'
                    : 'Claim administrator access with a secure password (minimum 8 characters).'
                  : status?.envPasscodeActive
                  ? lang === 'vi'
                    ? 'Xác thực bằng mã quản trị viên trên máy chủ.'
                    : 'Authenticate with server-configured admin passcode.'
                  : lang === 'vi'
                  ? 'Nhập email và mật khẩu quản trị viên.'
                  : 'Enter curator email and password.'}
              </p>
            </div>
          </div>

          {authError && (
            <div className="border border-[#9B231D] bg-[#9B231D]/5 p-3 text-xs text-[#9B231D]">
              {authError}
            </div>
          )}

          <form noValidate onSubmit={isClaimMode ? handleClaim : handleLogin} className="space-y-4">
            {isClaimMode && (
              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1">
                  {lang === 'vi' ? 'Tên hiển thị' : 'Display Name'}
                </label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full rounded-md border border-[#DED6C8] bg-[#FBF9F5] px-3 py-2 text-sm"
                />
              </div>
            )}

            {(!status?.envPasscodeActive || isClaimMode) && (
              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1">Email *</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="curator@vanphuc-heritage.vn"
                  className="w-full rounded-md border border-[#DED6C8] bg-[#FBF9F5] px-3 py-2 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#57534E] mb-1">
                {lang === 'vi' ? 'Mật khẩu quản trị *' : 'Administrator Password *'}
              </label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full rounded-md border border-[#DED6C8] bg-[#FBF9F5] px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full rounded-md bg-[#9B231D] px-5 py-2.5 text-sm font-medium text-[#FBF9F5] hover:bg-[#7E1B16]"
            >
              {authSubmitting
                ? '...'
                : isClaimMode
                ? lang === 'vi'
                  ? 'Khởi tạo & Đăng nhập'
                  : 'Initialize Curator Account'
                : lang === 'vi'
                ? 'Đăng nhập'
                : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: Array<[AdminTab, string]> = [
    ['articles', lang === 'vi' ? `Bài viết (${articles.length})` : `Articles (${articles.length})`],
    ['artisans', lang === 'vi' ? `Nghệ nhân (${artisans.length})` : `Artisans (${artisans.length})`],
    ['products', lang === 'vi' ? `Sản phẩm (${products.length})` : `Products (${products.length})`],
    ['processes', lang === 'vi' ? `Quy trình (${processes.length})` : `Processes (${processes.length})`],
    ['challenges', lang === 'vi' ? `Thách thức (${challenges.length})` : `Challenges (${challenges.length})`],
    ['stories', lang === 'vi' ? `Câu chuyện (${stories.length})` : `Stories (${stories.length})`],
    ['events', lang === 'vi' ? `Sự kiện (${events.length})` : `Events (${events.length})`],
    ['quiz', lang === 'vi' ? `Quiz (${quizList.length})` : `Quiz (${quizList.length})`],
    ['contacts', lang === 'vi' ? `Liên hệ (${contacts.length})` : `Contacts (${contacts.length})`],
  ];

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: AnyEntity) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DED6C8] pb-6">
        <div>
          <p className="text-xs font-medium text-[#8C6239]">
            {lang === 'vi' ? 'Cổng Quản trị Nội dung Di sản' : 'Curatorial Management Console'}
          </p>
          <h1 className="font-display text-3xl font-semibold text-[#1C1917]">
            {status.user?.name} ({status.user?.email})
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {tab !== 'contacts' && (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-md bg-[#9B231D] px-4 py-2 text-xs font-medium text-[#FBF9F5] hover:bg-[#7E1B16] whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4" />
              {lang === 'vi' ? 'Thêm bản ghi mới' : 'Create New'}
            </button>
          )}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-md border border-[#DED6C8] bg-white px-4 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#EFEAE1] whitespace-nowrap shrink-0"
          >
            <LogOut className="h-4 w-4" />
            {lang === 'vi' ? 'Đăng xuất' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Scrollable Tabs */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-[#DED6C8] pb-4">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-md px-3.5 py-2 text-xs font-medium tabular-nums transition-colors whitespace-nowrap shrink-0 ${
              tab === key ? 'bg-[#1C1917] text-[#FBF9F5]' : 'border border-[#DED6C8] bg-white text-[#57534E]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {dataError && <QueryErrorBanner message={dataError} onRetry={() => void loadAdminData()} />}

      {dataLoading ? (
        <div className="h-48 animate-pulse bg-[#EFEAE1]" />
      ) : (
        <div className="border border-[#DED6C8] bg-white divide-y divide-[#DED6C8]">
          {tab === 'articles' &&
            articles.map((art) => (
              <div key={art._id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-[#1C1917] truncate">{t(art.title)}</p>
                  <p className="text-xs text-[#57534E]">
                    {art.eraYear} · {art.category} · {art.publishedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(art)}
                    aria-label="Edit article"
                    className="rounded border border-[#DED6C8] p-2 text-[#1C1917] hover:bg-[#EFEAE1]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await heritageApi.deleteArticle(art._id);
                      setArticles((prev) => prev.filter((x) => x._id !== art._id));
                    }}
                    aria-label="Delete article"
                    className="rounded border border-[#DED6C8] p-2 text-[#9B231D] hover:bg-[#9B231D]/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'artisans' &&
            artisans.map((artn) => (
              <div key={artn._id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-[#1C1917]">{artn.name}</p>
                  <p className="text-xs text-[#57534E]">
                    {t(artn.honorificTitle)} · {artn.yearsOfExperience} {lang === 'vi' ? 'năm' : 'yrs'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(artn)}
                    aria-label="Edit artisan"
                    className="rounded border border-[#DED6C8] p-2 text-[#1C1917] hover:bg-[#EFEAE1]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await heritageApi.deleteArtisan(artn._id);
                      setArtisans((prev) => prev.filter((x) => x._id !== artn._id));
                    }}
                    aria-label="Delete artisan"
                    className="rounded border border-[#DED6C8] p-2 text-[#9B231D] hover:bg-[#9B231D]/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'products' &&
            products.map((prod) => (
              <div key={prod._id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-[#1C1917] truncate">{t(prod.name)}</p>
                  <p className="font-mono text-xs text-[#57534E]">
                    {prod.accessionCode} · {prod.weaveType}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(prod)}
                    aria-label="Edit product"
                    className="rounded border border-[#DED6C8] p-2 text-[#1C1917] hover:bg-[#EFEAE1]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await heritageApi.deleteProduct(prod._id);
                      setProducts((prev) => prev.filter((x) => x._id !== prod._id));
                    }}
                    aria-label="Delete product"
                    className="rounded border border-[#DED6C8] p-2 text-[#9B231D] hover:bg-[#9B231D]/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'processes' &&
            processes.map((proc) => (
              <div key={proc._id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-[#1C1917] truncate">
                    0{proc.stepOrder}. {t(proc.title)}
                  </p>
                  <p className="text-xs text-[#57534E]">{t(proc.durationLabel)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(proc)}
                    aria-label="Edit process"
                    className="rounded border border-[#DED6C8] p-2 text-[#1C1917] hover:bg-[#EFEAE1]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await heritageApi.deleteProcess(proc._id);
                      setProcesses((prev) => prev.filter((x) => x._id !== proc._id));
                    }}
                    aria-label="Delete process"
                    className="rounded border border-[#DED6C8] p-2 text-[#9B231D] hover:bg-[#9B231D]/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'challenges' &&
            challenges.map((ch) => (
              <div key={ch._id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-[#1C1917] truncate">{t(ch.title)}</p>
                  <p className="text-xs text-[#57534E]">
                    {ch.severity} · {ch.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(ch)}
                    aria-label="Edit challenge"
                    className="rounded border border-[#DED6C8] p-2 text-[#1C1917] hover:bg-[#EFEAE1]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await heritageApi.deleteChallenge(ch._id);
                      setChallenges((prev) => prev.filter((x) => x._id !== ch._id));
                    }}
                    aria-label="Delete challenge"
                    className="rounded border border-[#DED6C8] p-2 text-[#9B231D] hover:bg-[#9B231D]/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'stories' &&
            stories.map((st) => (
              <div key={st._id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold text-[#1C1917] truncate">{t(st.title)}</p>
                  <p className="text-xs text-[#57534E]">
                    {st.narratorName} · {st.publishedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(st)}
                    aria-label="Edit story"
                    className="rounded border border-[#DED6C8] p-2 text-[#1C1917] hover:bg-[#EFEAE1]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await heritageApi.deleteStory(st._id);
                      setStories((prev) => prev.filter((x) => x._id !== st._id));
                    }}
                    aria-label="Delete story"
                    className="rounded border border-[#DED6C8] p-2 text-[#9B231D] hover:bg-[#9B231D]/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'events' &&
            events.map((evt) => (
              <div key={evt._id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display text-lg font-semibold text-[#1C1917] truncate">{t(evt.title)}</p>
                    <p className="font-mono text-xs text-[#57534E] tabular-nums">
                      {evt.startDate} · {evt.registeredCount}/{evt.capacity} RSVP
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(evt)}
                      aria-label="Edit event"
                      className="rounded border border-[#DED6C8] p-2 text-[#1C1917] hover:bg-[#EFEAE1]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await heritageApi.deleteEvent(evt._id);
                        setEvents((prev) => prev.filter((x) => x._id !== evt._id));
                      }}
                      aria-label="Delete event"
                      className="rounded border border-[#DED6C8] p-2 text-[#9B231D] hover:bg-[#9B231D]/5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {evt.registrations && evt.registrations.length > 0 && (
                  <div className="border-t border-[#DED6C8] pt-2 text-xs text-[#57534E]">
                    {evt.registrations.map((r) => (
                      <div key={r._id} className="py-1">
                        {r.fullName} ({r.email} · {r.phone} · {r.participantType})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

          {tab === 'quiz' &&
            quizList.map((q) => (
              <div key={q._id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-[#1C1917]">{t(q.question)}</p>
                  <p className="text-xs text-[#57534E]">
                    {q.topic} · {q.difficulty}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(q)}
                    aria-label="Edit quiz question"
                    className="rounded border border-[#DED6C8] p-2 text-[#1C1917] hover:bg-[#EFEAE1]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await heritageApi.deleteQuizQuestion(q._id);
                      setQuizList((prev) => prev.filter((x) => x._id !== q._id));
                    }}
                    aria-label="Delete quiz question"
                    className="rounded border border-[#DED6C8] p-2 text-[#9B231D] hover:bg-[#9B231D]/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'contacts' &&
            contacts.map((c) => (
              <div key={c._id} className="p-4 flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <p className="font-medium text-sm text-[#1C1917]">
                    {c.fullName} · <span className="text-[#57534E]">{c.email}</span>
                  </p>
                  <p className="text-xs text-[#8C6239]">
                    {c.inquiryType} · {c.createdAt.slice(0, 10)}
                  </p>
                  <p className="text-xs text-[#57534E]">{c.message}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={c.status}
                    onChange={async (e) => {
                      const nextStatus = e.target.value as ContactInquiry['status'];
                      const updated = await heritageApi.updateContactStatus(c._id, nextStatus);
                      setContacts((prev) => prev.map((x) => (x._id === c._id ? updated : x)));
                    }}
                    className="rounded border border-[#DED6C8] bg-[#FBF9F5] px-2.5 py-1.5 text-xs"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    type="button"
                    onClick={async () => {
                      await heritageApi.deleteContact(c._id);
                      setContacts((prev) => prev.filter((x) => x._id !== c._id));
                    }}
                    aria-label="Delete contact"
                    className="rounded border border-[#DED6C8] p-1.5 text-[#9B231D] hover:bg-[#9B231D]/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {modalOpen && tab !== 'contacts' && (
        <AdminEntityModal
          collection={tab}
          initialItem={editingItem}
          onClose={() => setModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
