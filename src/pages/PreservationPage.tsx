import { CalendarCheck, MapPin, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type { PreservationEvent } from '../types';
import { validateRsvpForm, type FieldErrors } from '../utils/validation';

export function PreservationPage() {
  const { lang, t } = useLanguage();
  const [events, setEvents] = useState<PreservationEvent[]>([]);
  const [filter, setFilter] = useState<'all' | PreservationEvent['eventType']>('all');
  const [activeEvent, setActiveEvent] = useState<PreservationEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [participantType, setParticipantType] = useState<'student' | 'youth' | 'tourist' | 'researcher'>('student');
  const [note, setNote] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

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

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent) return;

    const errors = validateRsvpForm({ fullName, email, phone }, lang);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await heritageApi.registerEvent(activeEvent._id, {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        participantType,
        note: note.trim(),
      });
      setEvents((prev) => prev.map((ev) => (ev._id === res.event._id ? res.event : ev)));
      setFeedback({
        type: 'ok',
        msg:
          lang === 'vi'
            ? `Đăng ký thành công cho hoạt động "${t(res.event.title)}". Hẹn gặp bạn tại Vạn Phúc!`
            : `Registration confirmed for "${t(res.event.title)}". See you in Vạn Phúc!`,
      });
      setFullName('');
      setEmail('');
      setPhone('');
      setNote('');
      setFieldErrors({});
      setActiveEvent(null);
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (lang === 'vi' ? 'Không thể hoàn tất đăng ký. Vui lòng kiểm tra thông tin.' : 'Unable to complete registration.');
      setFeedback({ type: 'err', msg: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 space-y-10">
      <div className="border-b border-[#DED6C8] pb-8 space-y-4">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {lang === 'vi' ? 'Chương trình Cộng đồng & Giáo dục' : 'Community & Youth Programs'}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1C1917]">
          {lang === 'vi' ? 'Hoạt động Bảo tồn Di sản' : 'Preservation Workshops & Events'}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#57534E]">
          {lang === 'vi'
            ? 'Đăng ký tham gia trực tiếp các buổi thực hành ươm tơ dệt lụa, triển lãm hoa văn cổ hoặc chiến dịch tình nguyện số hóa di sản cùng nghệ nhân.'
            : 'Reserve your spot at weekend silk-reeling workshops, curated exhibitions, and youth heritage digitization drives.'}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {(['all', 'workshop', 'exhibition', 'volunteer', 'tour'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filter === key
                  ? 'bg-[#1C1917] text-[#FBF9F5]'
                  : 'border border-[#DED6C8] bg-white text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              {key === 'all' ? (lang === 'vi' ? 'Tất cả hoạt động' : 'All Activities') : typeLabel(key)}
            </button>
          ))}
        </div>
      </div>

      {loadError && <QueryErrorBanner message={loadError} onRetry={() => void loadEvents()} />}

      {feedback && (
        <div
          className={`border p-4 text-sm ${
            feedback.type === 'ok'
              ? 'border-[#8C6239] bg-[#EFEAE1] text-[#1C1917]'
              : 'border-[#9B231D] bg-[#9B231D]/5 text-[#9B231D]'
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {loading ? (
        <div className="h-64 animate-pulse bg-[#EFEAE1]" />
      ) : visibleEvents.length === 0 ? (
        <div className="border border-[#DED6C8] bg-white p-8 text-center text-sm text-[#57534E]">
          {lang === 'vi' ? 'Chưa có hoạt động thuộc danh mục này.' : 'No activities found for this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {visibleEvents.map((evt) => {
            const remaining = Math.max(0, evt.capacity - evt.registeredCount);
            const isFull = remaining === 0;
            return (
              <article key={evt._id} className="border border-[#DED6C8] bg-white p-6 lg:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DED6C8] pb-3 text-xs">
                    <span className="font-medium text-[#8C6239]">{typeLabel(evt.eventType)}</span>
                    <span className="font-mono text-[#57534E] tabular-nums">
                      {evt.startDate.replace('T', ' · ')}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl font-semibold text-[#1C1917]">{t(evt.title)}</h2>

                  <p className="flex items-start gap-2 text-xs text-[#57534E]">
                    <MapPin className="h-4 w-4 shrink-0 text-[#8C6239]" />
                    <span>{t(evt.location)}</span>
                  </p>

                  <p className="text-sm leading-relaxed text-[#57534E]">{t(evt.description)}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#DED6C8] pt-4">
                  <div className="text-xs text-[#57534E] tabular-nums">
                    <span className="font-mono font-medium text-[#1C1917]">
                      {evt.registeredCount}/{evt.capacity}
                    </span>{' '}
                    {lang === 'vi' ? `đã đăng ký (còn ${remaining} chỗ)` : `registered (${remaining} left)`}
                  </div>

                  <button
                    type="button"
                    disabled={isFull}
                    onClick={() => {
                      setFeedback(null);
                      setFieldErrors({});
                      setActiveEvent(evt);
                    }}
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isFull
                        ? 'cursor-not-allowed bg-[#DED6C8] text-[#57534E]'
                        : 'bg-[#9B231D] text-[#FBF9F5] hover:bg-[#7E1B16]'
                    }`}
                  >
                    <CalendarCheck className="h-4 w-4" />
                    {isFull
                      ? lang === 'vi'
                        ? 'Đã đủ số lượng'
                        : 'Fully Booked'
                      : lang === 'vi'
                      ? 'Đăng ký tham gia'
                      : 'Reserve Seat (RSVP)'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* RSVP Modal */}
      {activeEvent && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#DED6C8] bg-[#FBF9F5] p-6 lg:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-[#DED6C8] pb-4">
              <div>
                <p className="text-xs font-medium text-[#8C6239]">
                  {lang === 'vi' ? 'Phiếu Đăng ký Tham gia' : 'Event RSVP Registration'}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-[#1C1917]">{t(activeEvent.title)}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveEvent(null)}
                aria-label="Close RSVP modal"
                className="rounded-md border border-[#DED6C8] p-2 text-[#1C1917] hover:bg-[#EFEAE1]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {feedback?.type === 'err' && (
              <div className="border border-[#9B231D] bg-[#9B231D]/5 p-3 text-xs text-[#9B231D]">
                {feedback.msg}
              </div>
            )}

            <form noValidate onSubmit={handleRsvp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1">
                  {lang === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-[#1C1917] ${
                    fieldErrors.fullName ? 'border-[#9B231D]' : 'border-[#DED6C8]'
                  }`}
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-[#9B231D]">{fieldErrors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#57534E] mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-[#1C1917] ${
                      fieldErrors.email ? 'border-[#9B231D]' : 'border-[#DED6C8]'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-[#9B231D]">{fieldErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#57534E] mb-1">
                    {lang === 'vi' ? 'Số điện thoại *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-[#1C1917] ${
                      fieldErrors.phone ? 'border-[#9B231D]' : 'border-[#DED6C8]'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-[#9B231D]">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1">
                  {lang === 'vi' ? 'Nhóm tham gia' : 'Participant Group'}
                </label>
                <select
                  value={participantType}
                  onChange={(e) =>
                    setParticipantType(e.target.value as 'student' | 'youth' | 'tourist' | 'researcher')
                  }
                  className="w-full rounded-md border border-[#DED6C8] bg-white px-3 py-2 text-sm text-[#1C1917]"
                >
                  <option value="student">{lang === 'vi' ? 'Học sinh / Sinh viên' : 'Student'}</option>
                  <option value="youth">{lang === 'vi' ? 'Thanh niên yêu văn hóa' : 'Young Enthusiast'}</option>
                  <option value="tourist">{lang === 'vi' ? 'Du khách' : 'Traveler / Visitor'}</option>
                  <option value="researcher">{lang === 'vi' ? 'Nhà nghiên cứu / Giáo viên' : 'Researcher / Educator'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1">
                  {lang === 'vi' ? 'Ghi chú thêm (tùy chọn)' : 'Notes (optional)'}
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-md border border-[#DED6C8] bg-white px-3 py-2 text-sm text-[#1C1917]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveEvent(null)}
                  className="rounded-md border border-[#DED6C8] bg-white px-4 py-2 text-xs font-medium text-[#1C1917]"
                >
                  {lang === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-[#9B231D] px-5 py-2 text-xs font-medium text-[#FBF9F5] hover:bg-[#7E1B16]"
                >
                  {submitting
                    ? lang === 'vi'
                      ? 'Đang gửi...'
                      : 'Submitting...'
                    : lang === 'vi'
                    ? 'Xác nhận đăng ký'
                    : 'Confirm RSVP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
