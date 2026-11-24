import { Lock, LogOut, Pencil, Plus, Trash2, Sparkles, Shield, Database, Users, Package, RefreshCw, AlertTriangle, BookOpen, Calendar, HelpCircle, Mail } from 'lucide-react';
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
      await claimAdmin({
        name: authName.trim() || 'Curator Vạn Phúc',
        email: authEmail.trim(),
        password: authPassword,
      });
      setAuthPassword('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (lang === 'vi' ? 'Không thể khởi tạo tài khoản quản trị.' : 'Claim setup failed.');
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      await login({ email: authEmail.trim(), password: authPassword });
      setAuthPassword('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (lang === 'vi' ? 'Thông tin đăng nhập không hợp lệ.' : 'Invalid login credentials.');
      setAuthError(msg);
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
        <div className="h-48 rounded-2xl animate-pulse bg-[#EDE5D8]" />
      </div>
    );
  }

  if (!status?.authenticated) {
    const isClaimMode = Boolean(status?.requiresClaim);
    return (
      <div className="mx-auto max-w-[520px] px-6 py-20">
        <div className="silk-card rounded-3xl p-8 lg:p-10 space-y-6 border-2 border-[#C59B27]/30 shadow-xl bg-gradient-to-br from-white to-[#FAF7F2]">
          <div className="flex items-center gap-3.5 border-b border-[#E2D9CC] pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8C1D1D] text-[#F3E5AB] shadow-sm ring-2 ring-[#C59B27]/40">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <span className="silk-badge silk-badge-crimson">
                {lang === 'vi' ? 'Bảo mật Lưu trữ' : 'Curator Security'}
              </span>
              <h1 className="mt-1 font-serif text-2xl font-bold text-[#181512]">
                {isClaimMode
                  ? lang === 'vi'
                    ? 'Thiết lập Tài khoản Quản trị'
                    : 'First-Run Curator Setup'
                  : lang === 'vi'
                  ? 'Đăng nhập Quản trị Di sản'
                  : 'Curator Portal Sign In'}
              </h1>
            </div>
          </div>

          <p className="text-xs text-[#6B645A] leading-relaxed">
            {isClaimMode
              ? lang === 'vi'
                ? 'Tạo mật khẩu quản trị viên duy nhất để bảo vệ kho dữ liệu di sản làng nghề Vạn Phúc.'
                : 'Claim administrator access with a secure password (minimum 8 characters).'
              : status?.envPasscodeActive
              ? lang === 'vi'
                ? 'Xác thực bằng mã quản trị viên được cấu hình trên máy chủ.'
                : 'Authenticate with server-configured admin passcode.'
              : lang === 'vi'
              ? 'Nhập email và mật khẩu của người quản trị di sản để tiếp tục.'
              : 'Enter curator email and password.'}
          </p>

          {authError && (
            <div className="rounded-xl border border-[#8C1D1D] bg-[#FDF2F2] p-3 text-xs text-[#8C1D1D]">
              {authError}
            </div>
          )}

          <form noValidate onSubmit={isClaimMode ? handleClaim : handleLogin} className="space-y-4">
            {isClaimMode && (
              <div>
                <label className="block text-xs font-semibold text-[#48433C] mb-1">
                  {lang === 'vi' ? 'Tên hiển thị' : 'Display Name'}
                </label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full rounded-xl border border-[#E2D9CC] bg-white px-3.5 py-2.5 text-xs text-[#181512] shadow-2xs focus:border-[#8C1D1D] focus:outline-hidden"
                />
              </div>
            )}

            {(!status?.envPasscodeActive || isClaimMode) && (
              <div>
                <label className="block text-xs font-semibold text-[#48433C] mb-1">Email *</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="curator@vanphuc-heritage.vn"
                  className="w-full rounded-xl border border-[#E2D9CC] bg-white px-3.5 py-2.5 text-xs text-[#181512] shadow-2xs focus:border-[#8C1D1D] focus:outline-hidden"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#48433C] mb-1">
                {lang === 'vi' ? 'Mật khẩu quản trị *' : 'Administrator Password *'}
              </label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E2D9CC] bg-white px-3.5 py-2.5 text-xs text-[#181512] shadow-2xs focus:border-[#8C1D1D] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="silk-btn-primary w-full py-3 text-sm shadow-md"
            >
              <Sparkles className="h-4 w-4 text-[#F3E5AB]" />
              <span>
                {authSubmitting
                  ? '...'
                  : isClaimMode
                  ? lang === 'vi'
                    ? 'Khởi tạo & Đăng nhập'
                    : 'Initialize Curator Account'
                  : lang === 'vi'
                  ? 'Đăng nhập vào Kho Di sản'
                  : 'Sign In to Portal'}
              </span>
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
    <div className="mx-auto max-w-[1240px] px-6 py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2D9CC] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="silk-badge silk-badge-crimson">
              <Shield className="h-3 w-3 text-[#C59B27]" />
              {lang === 'vi' ? 'Cổng Quản trị Nội dung Di sản' : 'Curatorial Console'}
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#181512]">
            {status.user?.name}{' '}
            <span className="text-sm font-sans font-normal text-[#6B645A]">({status.user?.email})</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {tab !== 'contacts' && (
            <button
              type="button"
              onClick={openCreate}
              className="silk-btn-primary text-xs py-2.5 px-4 shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4 text-[#F3E5AB]" />
              <span>{lang === 'vi' ? 'Thêm bản ghi mới' : 'Create New'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={logout}
            className="silk-btn-secondary text-xs py-2.5 px-4 whitespace-nowrap shrink-0"
          >
            <LogOut className="h-4 w-4" />
            <span>{lang === 'vi' ? 'Đăng xuất' : 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* Modern Scrollable Tab Bar */}
      <div className="flex gap-2 overflow-x-auto border-b border-[#E2D9CC] pb-4">
        {tabs.map(([key, label]) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-xl px-4 py-2 text-xs font-bold tabular-nums transition-all whitespace-nowrap shadow-2xs shrink-0 ${
                active
                  ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-xs scale-105'
                  : 'border border-slate-200 bg-white text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {dataError && <QueryErrorBanner message={dataError} onRetry={() => void loadAdminData()} />}

      {dataLoading ? (
        <div className="h-64 rounded-2xl animate-pulse bg-[#EDE5D8]" />
      ) : (
        <div className="silk-card rounded-2xl divide-y divide-[#E2D9CC] overflow-hidden shadow-sm">
          {tab === 'articles' &&
            articles.map((art) => (
              <div key={art._id} className="flex items-center justify-between gap-4 p-5 hover:bg-[#F4EFE6]/40 transition-colors">
                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold text-[#181512] truncate">{t(art.title)}</p>
                  <p className="text-xs text-[#6B645A]">
                    <span className="font-semibold text-[#8C1D1D]">{art.eraYear}</span> · {art.category} · {art.publishedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(art)}
                    aria-label="Edit article"
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#181512] hover:bg-[#FBF6E9] hover:border-[#C59B27]"
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
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#8C1D1D] hover:bg-[#FDF2F2] hover:border-[#8C1D1D]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'artisans' &&
            artisans.map((artn) => (
              <div key={artn._id} className="flex items-center justify-between gap-4 p-5 hover:bg-[#F4EFE6]/40 transition-colors">
                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold text-[#181512]">{artn.name}</p>
                  <p className="text-xs text-[#6B645A]">
                    <span className="text-[#8C1D1D] font-medium">{t(artn.honorificTitle)}</span> · {artn.yearsOfExperience} {lang === 'vi' ? 'năm gắn bó' : 'yrs craft'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(artn)}
                    aria-label="Edit artisan"
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#181512] hover:bg-[#FBF6E9] hover:border-[#C59B27]"
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
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#8C1D1D] hover:bg-[#FDF2F2] hover:border-[#8C1D1D]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'products' &&
            products.map((prod) => (
              <div key={prod._id} className="flex items-center justify-between gap-4 p-5 hover:bg-[#F4EFE6]/40 transition-colors">
                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold text-[#181512] truncate">{t(prod.name)}</p>
                  <p className="font-mono text-xs text-[#845B32]">
                    {prod.accessionCode} · {prod.weaveType}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(prod)}
                    aria-label="Edit product"
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#181512] hover:bg-[#FBF6E9] hover:border-[#C59B27]"
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
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#8C1D1D] hover:bg-[#FDF2F2] hover:border-[#8C1D1D]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'processes' &&
            processes.map((proc) => (
              <div key={proc._id} className="flex items-center justify-between gap-4 p-5 hover:bg-[#F4EFE6]/40 transition-colors">
                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold text-[#181512]">
                    <span className="font-mono text-[#8C1D1D] mr-2">0{proc.stepOrder}.</span>
                    {t(proc.title)}
                  </p>
                  <p className="text-xs text-[#6B645A] truncate">{t(proc.description)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(proc)}
                    aria-label="Edit process"
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#181512] hover:bg-[#FBF6E9] hover:border-[#C59B27]"
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
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#8C1D1D] hover:bg-[#FDF2F2] hover:border-[#8C1D1D]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'challenges' &&
            challenges.map((ch) => (
              <div key={ch._id} className="flex items-center justify-between gap-4 p-5 hover:bg-[#F4EFE6]/40 transition-colors">
                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold text-[#181512]">{t(ch.title)}</p>
                  <p className="text-xs text-[#6B645A]">
                    <span className="uppercase font-semibold text-[#8C1D1D]">{ch.severity}</span> · {t(ch.impactMetric)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(ch)}
                    aria-label="Edit challenge"
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#181512] hover:bg-[#FBF6E9] hover:border-[#C59B27]"
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
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#8C1D1D] hover:bg-[#FDF2F2] hover:border-[#8C1D1D]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'stories' &&
            stories.map((st) => (
              <div key={st._id} className="flex items-center justify-between gap-4 p-5 hover:bg-[#F4EFE6]/40 transition-colors">
                <div className="min-w-0">
                  <p className="font-serif text-lg font-bold text-[#181512]">{t(st.title)}</p>
                  <p className="text-xs text-[#6B645A]">
                    {st.narratorName} ({t(st.narratorRole)}) · {t(st.eraContext)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(st)}
                    aria-label="Edit story"
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#181512] hover:bg-[#FBF6E9] hover:border-[#C59B27]"
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
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#8C1D1D] hover:bg-[#FDF2F2] hover:border-[#8C1D1D]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'events' &&
            events.map((evt) => (
              <div key={evt._id} className="p-5 space-y-3 hover:bg-[#F4EFE6]/40 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-serif text-lg font-bold text-[#181512]">{t(evt.title)}</p>
                    <p className="font-mono text-xs text-[#845B32] tabular-nums">
                      {evt.startDate} · {evt.registeredCount}/{evt.capacity} RSVP
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(evt)}
                      aria-label="Edit event"
                      className="rounded-xl border border-[#E2D9CC] p-2 text-[#181512] hover:bg-[#FBF6E9] hover:border-[#C59B27]"
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
                      className="rounded-xl border border-[#E2D9CC] p-2 text-[#8C1D1D] hover:bg-[#FDF2F2] hover:border-[#8C1D1D]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {evt.registrations && evt.registrations.length > 0 && (
                  <div className="border-t border-[#E2D9CC] pt-2 text-xs text-[#6B645A]">
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
              <div key={q._id} className="flex items-center justify-between gap-4 p-5 hover:bg-[#F4EFE6]/40 transition-colors">
                <div className="min-w-0">
                  <p className="font-serif text-base font-bold text-[#181512]">{t(q.question)}</p>
                  <p className="text-xs text-[#6B645A]">
                    {q.topic} · <span className="font-semibold text-[#8C1D1D]">{q.difficulty}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(q)}
                    aria-label="Edit quiz question"
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#181512] hover:bg-[#FBF6E9] hover:border-[#C59B27]"
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
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#8C1D1D] hover:bg-[#FDF2F2] hover:border-[#8C1D1D]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

          {tab === 'contacts' &&
            contacts.map((c) => (
              <div key={c._id} className="p-5 flex flex-wrap items-start justify-between gap-4 hover:bg-[#F4EFE6]/40 transition-colors">
                <div className="space-y-1.5 max-w-xl">
                  <p className="font-serif text-base font-bold text-[#181512]">
                    {c.fullName} · <span className="font-sans font-normal text-xs text-[#6B645A]">{c.email}</span>
                  </p>
                  <p className="text-xs font-semibold text-[#845B32]">
                    {c.inquiryType} · {c.createdAt.slice(0, 10)}
                  </p>
                  <p className="text-xs text-[#48433C] leading-relaxed">{c.message}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={c.status}
                    onChange={async (e) => {
                      const nextStatus = e.target.value as ContactInquiry['status'];
                      const updated = await heritageApi.updateContactStatus(c._id, nextStatus);
                      setContacts((prev) => prev.map((x) => (x._id === c._id ? updated : x)));
                    }}
                    className="rounded-xl border border-[#E2D9CC] bg-white px-3 py-1.5 text-xs text-[#181512] shadow-2xs"
                  >
                    <option value="new">Mới (New)</option>
                    <option value="reviewed">Đã xem (Reviewed)</option>
                    <option value="resolved">Đã xử lý (Resolved)</option>
                  </select>
                  <button
                    type="button"
                    onClick={async () => {
                      await heritageApi.deleteContact(c._id);
                      setContacts((prev) => prev.filter((x) => x._id !== c._id));
                    }}
                    aria-label="Delete contact"
                    className="rounded-xl border border-[#E2D9CC] p-2 text-[#8C1D1D] hover:bg-[#FDF2F2] hover:border-[#8C1D1D]"
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
