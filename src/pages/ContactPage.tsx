import { Clock, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import { validateContactForm, type FieldErrors } from '../utils/validation';

export function ContactPage() {
  const { lang } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<'visit' | 'education' | 'preservation' | 'media'>('education');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateContactForm({ fullName, email, phone, message }, lang);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      await heritageApi.submitContact({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        inquiryType,
        message: message.trim(),
      });
      setFeedback({
        type: 'ok',
        text:
          lang === 'vi'
            ? 'Lời nhắn của bạn đã được gửi tới Ban Bảo tồn Làng nghề Vạn Phúc. Chúng tôi sẽ phản hồi sớm nhất.'
            : 'Your message has been delivered to the Vạn Phúc Preservation Team. We will respond shortly.',
      });
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setFieldErrors({});
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (lang === 'vi' ? 'Vui lòng kiểm tra lại thông tin liên hệ.' : 'Please verify your contact fields.');
      setFeedback({ type: 'err', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 space-y-12">
      <div className="border-b border-[#DED6C8] pb-8 space-y-3">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {lang === 'vi' ? 'Kết nối Làng nghề' : 'Connect With the Village'}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1C1917]">
          {lang === 'vi' ? 'Liên hệ & Đăng ký Tham quan Học tập' : 'Contact & Educational Visit Inquiries'}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5 space-y-6 border border-[#DED6C8] bg-[#EFEAE1]/70 p-6 lg:p-8">
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
            {lang === 'vi' ? 'Thông tin Tham quan Làng lụa' : 'Visiting Vạn Phúc Silk Village'}
          </h2>

          <div className="space-y-4 text-sm text-[#57534E]">
            <p className="flex items-start gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-[#9B231D] mt-0.5" />
              <span>
                {lang === 'vi'
                  ? 'Phường Vạn Phúc, Quận Hà Đông, Hà Nội (cách trung tâm Hồ Hoàn Kiếm khoảng 10 km theo trục Lê Văn Lương – Tố Hữu)'
                  : 'Vạn Phúc Ward, Hà Đông District, Hanoi (approx. 10 km southwest of Hoàn Kiếm Lake)'}
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Clock className="h-4 w-4 shrink-0 text-[#9B231D] mt-0.5" />
              <span>
                {lang === 'vi'
                  ? 'Mở cửa đón khách hàng ngày: 08:00 – 17:30 (Miễn phí vé vào làng cổ)'
                  : 'Open daily: 08:00 – 17:30 (Free village entry)'}
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Mail className="h-4 w-4 shrink-0 text-[#9B231D] mt-0.5" />
              <span>baoton@vanphuc-heritage.vn</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 border border-[#DED6C8] bg-white p-6 lg:p-8 space-y-5">
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
            {lang === 'vi' ? 'Gửi yêu cầu trực tuyến' : 'Send an Inquiry'}
          </h2>

          {feedback && (
            <div
              className={`border p-4 text-sm ${
                feedback.type === 'ok'
                  ? 'border-[#8C6239] bg-[#EFEAE1] text-[#1C1917]'
                  : 'border-[#9B231D] bg-[#9B231D]/5 text-[#9B231D]'
              }`}
            >
              {feedback.text}
            </div>
          )}

          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  className={`w-full rounded-md border bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917] ${
                    fieldErrors.fullName ? 'border-[#9B231D]' : 'border-[#DED6C8]'
                  }`}
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-[#9B231D]">{fieldErrors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full rounded-md border bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917] ${
                    fieldErrors.email ? 'border-[#9B231D]' : 'border-[#DED6C8]'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-[#9B231D]">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1">
                  {lang === 'vi' ? 'Số điện thoại' : 'Phone'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full rounded-md border bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917] ${
                    fieldErrors.phone ? 'border-[#9B231D]' : 'border-[#DED6C8]'
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-[#9B231D]">{fieldErrors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1">
                  {lang === 'vi' ? 'Chủ đề liên hệ' : 'Inquiry Topic'}
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) =>
                    setInquiryType(e.target.value as 'visit' | 'education' | 'preservation' | 'media')
                  }
                  className="w-full rounded-md border border-[#DED6C8] bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917]"
                >
                  <option value="education">
                    {lang === 'vi' ? 'Tham quan trường học / Sinh viên' : 'School & University Field Trip'}
                  </option>
                  <option value="visit">{lang === 'vi' ? 'Du lịch trải nghiệm' : 'Heritage Visit'}</option>
                  <option value="preservation">
                    {lang === 'vi' ? 'Hợp tác bảo tồn / Tình nguyện' : 'Preservation & Volunteering'}
                  </option>
                  <option value="media">{lang === 'vi' ? 'Báo chí / Nghiên cứu' : 'Press & Research'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#57534E] mb-1">
                {lang === 'vi' ? 'Nội dung chi tiết *' : 'Message *'}
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, message: '' }));
                }}
                className={`w-full rounded-md border bg-[#FBF9F5] px-3 py-2 text-sm text-[#1C1917] ${
                  fieldErrors.message ? 'border-[#9B231D]' : 'border-[#DED6C8]'
                }`}
              />
              {fieldErrors.message && (
                <p className="mt-1 text-xs text-[#9B231D]">{fieldErrors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-[#9B231D] px-6 py-2.5 text-sm font-medium text-[#FBF9F5] hover:bg-[#7E1B16]"
            >
              {submitting
                ? lang === 'vi'
                  ? 'Đang gửi...'
                  : 'Sending...'
                : lang === 'vi'
                ? 'Gửi liên hệ'
                : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
