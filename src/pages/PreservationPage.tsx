import { CalendarCheck, ExternalLink, MapPin, Sparkles, CheckCircle2, Settings2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import { eventRegistrationService } from '../services/eventRegistrationService';
import type { PreservationEvent } from '../types';

export function PreservationPage() {
  const { lang, t } = useLanguage();
  const [events, setEvents] = useState<PreservationEvent[]>([]);
  const [filter, setFilter] = useState<'all' | PreservationEvent['eventType']>('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Real-time registration sync state
  const [liveCount, setLiveCount] = useState<number>(0);
  const [confirmPending, setConfirmPending] = useState<boolean>(false);
  const [justRegistered, setJustRegistered] = useState<boolean>(false);

  // Google Sheet auto-sync config toggle
  const [showSheetConfig, setShowSheetConfig] = useState<boolean>(false);
  const [sheetInput, setSheetInput] = useState<string>(() => eventRegistrationService.getGoogleSheetUrl());
  const [sheetSaveMsg, setSheetSaveMsg] = useState<string>('');

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await heritageApi.listEvents();
      setEvents(data);
    } catch {
      setLoadError(
        lang === 'vi' ? 'Không thể tải danh sách hoạt động bảo tồn.' : 'Unable to load preservation events.'
      );
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    void eventRegistrationService.getCount().then(setLiveCount);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('registered') === 'true' || params.get('registered') === '1') {
        const updated = eventRegistrationService.recordRegistration();
        setLiveCount(updated);
        setJustRegistered(true);
        const url = new URL(window.location.href);
        url.searchParams.delete('registered');
        window.history.replaceState({}, '', url.toString());
      }

      const sync = () => {
        void eventRegistrationService.getCount().then(setLiveCount);
      };
      window.addEventListener('workshop-registered-updated', sync);
      window.addEventListener('storage', sync);
      return () => {
        window.removeEventListener('workshop-registered-updated', sync);
        window.removeEventListener('storage', sync);
      };
    }
  }, []);

  const safeEvents = Array.isArray(events) ? events : [];
  const visibleEvents = filter === 'all' ? safeEvents : safeEvents.filter((e) => e.eventType === filter);

  const typeLabel = (type: PreservationEvent['eventType']) => {
    const map: Record<PreservationEvent['eventType'], { vi: string; en: string }> = {
      workshop: { vi: 'Workshop Thực hành', en: 'Craft Workshop' },
      exhibition: { vi: 'Triển lãm', en: 'Exhibition' },
      volunteer: { vi: 'Tình nguyện Bảo tồn', en: 'Volunteer Drive' },
      tour: { vi: 'Tham quan Di sản', en: 'Heritage Walk' },
    };
    return lang === 'vi' ? map[type].vi : map[type].en;
  };

  const getEventFormUrl = (evt: PreservationEvent): string => {
    if (evt.formUrl) return evt.formUrl;
    const titleVi = evt.title?.vi || '';
    if (titleVi.includes('Vân Lụa Ngàn Năm') || titleVi.includes('Triển lãm Chuyên đề') || evt._id === 'evt-2') {
      return 'https://forms.gle/HnLdbN3Yn8FRtnFE6';
    }
    if (titleVi.includes('ươm tơ') || titleVi.includes('Workshop Cuối tuần') || evt._id === 'evt-1') {
      return 'https://forms.gle/TMAKH7oR8gqmsbxF7';
    }
    if (titleVi.includes('Số hóa Kho Hoa văn') || titleVi.includes('Du lịch Xanh') || evt._id === 'evt-3') {
      return 'https://forms.gle/qHcVSwDAMj9dXDKH6';
    }
    if (titleVi.includes('Nhuộm Thảo mộc') || titleVi.includes('Hành trình Dạo bước') || evt._id === 'evt-4') {
      return 'https://forms.gle/ySagaCdfeT4coH4SA';
    }
    return 'https://forms.gle/HnLdbN3Yn8FRtnFE6';
  };

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-12 space-y-12">
      {/* Page Header with Silk Heritage Badge */}
      <div className="border-b border-[#E2D9CC] pb-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="silk-badge silk-badge-crimson">
            <Sparkles className="h-3 w-3 text-[#C59B27]" />
            {lang === 'vi' ? 'Chương trình Cộng đồng & Thế hệ Trẻ' : 'Youth & Community Programs'}
          </span>
          <span className="silk-badge">
            {lang === 'vi' ? 'Bảo tồn Sống' : 'Living Safeguarding'}
          </span>
        </div>

        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-[#0F172A]">
          {lang === 'vi' ? 'Hoạt động & Workshop Bảo tồn Di sản' : 'Preservation Workshops & Events'}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#334155]">
          {lang === 'vi'
            ? 'Đăng ký tham gia trực tiếp các buổi thực hành ươm tơ, dệt cửi mini, triển lãm hoa văn hoàng cung hoặc chiến dịch số hóa di sản cùng các nghệ nhân cao niên.'
            : 'Reserve your spot at weekend silk-reeling workshops, curated exhibitions, and youth heritage digitization drives with master weavers.'}
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {(['all', 'workshop', 'exhibition', 'volunteer', 'tour'] as const).map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap shadow-2xs ${
                  active
                    ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-xs scale-105'
                    : 'border border-slate-200 bg-white text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]'
                }`}
              >
                {key === 'all' ? (lang === 'vi' ? 'Tất cả hoạt động' : 'All Activities') : typeLabel(key)}
              </button>
            );
          })}
        </div>
      </div>

      {loadError && <QueryErrorBanner message={loadError} onRetry={() => void loadEvents()} />}

      {loading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="h-72 rounded-2xl animate-pulse bg-[#EDE5D8]" />
          <div className="h-72 rounded-2xl animate-pulse bg-[#EDE5D8]" />
        </div>
      ) : visibleEvents.length === 0 ? (
        <div className="silk-card rounded-2xl p-12 text-center text-sm text-[#6B645A]">
          {lang === 'vi' ? 'Hiện chưa có hoạt động thuộc danh mục này.' : 'No activities found for this category.'}
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${visibleEvents.length === 1 ? 'max-w-2xl mx-auto' : 'md:grid-cols-2'} gap-8`}>
          {visibleEvents.map((evt) => {
            const currentCount = Math.max(liveCount, evt.registeredCount);
            const remaining = Math.max(0, evt.capacity - currentCount);
            const isFull = remaining === 0;
            const formUrl = getEventFormUrl(evt);

            return (
              <article
                key={evt._id}
                className="silk-card rounded-2xl p-6 lg:p-8 flex flex-col justify-between space-y-6 group hover:border-[#C59B27]/50"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2D9CC] pb-3 text-xs">
                    <span className="silk-badge silk-badge-gold">
                      {typeLabel(evt.eventType)}
                    </span>
                    <span className="font-mono text-[#845B32] font-semibold tabular-nums">
                      {evt.startDate.replace('T', ' · ')}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#0F172A] group-hover:text-[#E11D48] transition-colors leading-snug">
                    {t(evt.title)}
                  </h2>

                  <p className="flex items-start gap-2 text-xs font-bold text-[#D97706]">
                    <MapPin className="h-4 w-4 shrink-0 text-[#E11D48]" />
                    <span>{t(evt.location)}</span>
                  </p>

                  <p className="text-sm leading-relaxed text-[#475569] line-clamp-3">
                    {t(evt.description)}
                  </p>
                </div>

                {/* Interactive Confirmation & Celebration state */}
                {confirmPending && !justRegistered && (
                  <div className="rounded-2xl border border-amber-300 bg-amber-50/95 p-4 text-xs text-amber-900 space-y-3 animate-in fade-in">
                    <p className="font-semibold flex items-center gap-1.5">
                      <span>📝</span>
                      <span>
                        {lang === 'vi'
                          ? 'Biểu mẫu đã mở ở tab mới. Sau khi bạn gửi form xong, hãy nhấn nút dưới đây để cập nhật số lượng ngay:'
                          : 'Form opened in a new tab. After submitting Google Form, please confirm here:'}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const newCount = eventRegistrationService.recordRegistration();
                          setLiveCount(newCount);
                          setJustRegistered(true);
                          setConfirmPending(false);
                        }}
                        className="rounded-xl bg-[#E11D48] text-white px-4 py-2 font-bold hover:bg-[#BE123C] transition-colors shadow-xs"
                      >
                        {lang === 'vi' ? '✓ Tôi đã gửi biểu mẫu' : '✓ I have submitted the form'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmPending(false)}
                        className="text-slate-500 hover:text-slate-700 px-2 py-1"
                      >
                        {lang === 'vi' ? 'Đóng' : 'Close'}
                      </button>
                    </div>
                  </div>
                )}

                {justRegistered && (
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      {lang === 'vi'
                        ? '🎉 Đã ghi nhận đăng ký của bạn! Số lượng người tham gia đã được tự động cập nhật.'
                        : '🎉 Registration confirmed! Participant count updated automatically.'}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E2D9CC] pt-4">
                  <div className="text-xs text-[#6B645A] tabular-nums">
                    <span className="font-mono font-bold text-[#181512]">
                      {currentCount}/{evt.capacity}
                    </span>{' '}
                    <span className={isFull ? 'text-red-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                      {isFull
                        ? lang === 'vi' ? '(Đã hết chỗ)' : '(Fully Booked)'
                        : lang === 'vi' ? `(Còn ${remaining} chỗ)` : `(${remaining} slots left)`}
                    </span>
                  </div>

                  {/* Direct Google Form RSVP Button */}
                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setConfirmPending(true)}
                    className="silk-btn-primary text-sm py-2.5 px-5 shadow-xs whitespace-nowrap shrink-0"
                  >
                    <CalendarCheck className="h-4 w-4 text-[#FDE68A]" />
                    <span>{lang === 'vi' ? 'Đăng ký tham gia' : 'Register Now'}</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Optional Google Sheet live sync configuration */}
      <div className="pt-4 border-t border-[#E2D9CC] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setShowSheetConfig((prev) => !prev)}
          className="text-xs font-semibold text-[#8C6239] hover:underline inline-flex items-center gap-1.5 opacity-80 hover:opacity-100"
        >
          <Settings2 className="h-3.5 w-3.5" />
          <span>
            {lang === 'vi'
              ? 'Tùy chọn: Tự động đồng bộ số lượng từ Google Sheets'
              : 'Optional: Auto-sync participant count from Google Sheets'}
          </span>
        </button>

        {showSheetConfig && (
          <div className="mt-4 w-full max-w-xl rounded-2xl border border-[#DED6C8] bg-white p-5 space-y-3 text-xs text-[#1C1917] shadow-sm animate-in fade-in">
            <h4 className="font-bold text-[#8C6239] text-sm">
              {lang === 'vi' ? 'Đồng bộ tự động từ Google Sheets' : 'Sync directly from Google Sheets'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {lang === 'vi'
                ? 'Mở Google Sheet liên kết với Google Form của bạn > Nhấn "Chia sẻ" > Chọn "Bất kỳ ai có liên kết đều có thể xem" (hoặc Xuất bản lên web dạng CSV) và dán link vào đây:'
                : 'Open the Google Sheet linked to your Form > Click "Share" > "Anyone with the link can view" and paste the link below:'}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={sheetInput}
                onChange={(e) => setSheetInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-[#E11D48] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={async () => {
                  eventRegistrationService.setGoogleSheetUrl(sheetInput);
                  const count = await eventRegistrationService.getCount();
                  setLiveCount(count);
                  setSheetSaveMsg(lang === 'vi' ? `✓ Đã kết nối! Số phản hồi: ${count}` : `✓ Connected! Responses: ${count}`);
                  setTimeout(() => setSheetSaveMsg(''), 4000);
                }}
                className="silk-btn-primary py-2 px-3.5 text-xs whitespace-nowrap"
              >
                {lang === 'vi' ? 'Lưu & Đồng bộ' : 'Save & Sync'}
              </button>
            </div>
            {sheetSaveMsg && (
              <p className="text-emerald-700 font-bold">{sheetSaveMsg}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
