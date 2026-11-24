import { CalendarCheck, ExternalLink, MapPin, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type { PreservationEvent } from '../types';


export function PreservationPage() {
  const { lang, t } = useLanguage();
  const [events, setEvents] = useState<PreservationEvent[]>([]);
  const [filter, setFilter] = useState<'all' | PreservationEvent['eventType']>('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

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

  const visibleEvents = filter === 'all' ? events : events.filter((e) => e.eventType === filter);

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

        <h1 className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A]">
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
            const remaining = Math.max(0, evt.capacity - evt.registeredCount);
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

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E2D9CC] pt-4">
                  <div className="text-xs text-[#6B645A] tabular-nums">
                    <span className="font-mono font-bold text-[#181512]">
                      {evt.registeredCount}/{evt.capacity}
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
    </div>
  );
}
