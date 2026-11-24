import { Clock, MapPin, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function OperationalRibbon() {
  const { lang, setLang } = useLanguage();
  const location = useLocation();

  const secondaryLinks = [
    { to: '/gioi-thieu', label: lang === 'vi' ? 'Giới thiệu' : 'About' },
    { to: '/cau-chuyen', label: lang === 'vi' ? 'Chuyện di sản' : 'Stories' },
    { to: '/thach-thuc', label: lang === 'vi' ? 'Thách thức' : 'Challenges' },
    { to: '/bao-ton', label: lang === 'vi' ? 'Hoạt động bảo tồn' : 'Preservation' },
    { to: '/lien-he', label: lang === 'vi' ? 'Liên hệ' : 'Contact' },
  ];

  return (
    <div className="border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-6 py-2 text-xs text-[#64748B]">
        {/* Heritage Status & Location */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="flex items-center gap-1.5 text-[#E11D48] font-bold">
            <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>{lang === 'vi' ? 'Di sản Văn hóa Phi vật thể Quốc gia' : 'National Intangible Cultural Heritage'}</span>
          </div>
          <span className="hidden sm:inline text-[#CBD5E1]" aria-hidden="true">•</span>
          <div className="hidden sm:flex items-center gap-1.5 font-medium text-[#334155]">
            <MapPin className="h-3.5 w-3.5 text-[#E11D48]" />
            <span>{lang === 'vi' ? 'Vạn Phúc, Hà Đông, Hà Nội' : 'Vạn Phúc, Hà Đông, Hanoi'}</span>
          </div>
          <span className="hidden md:inline text-[#CBD5E1]" aria-hidden="true">•</span>
          <div className="hidden md:flex items-center gap-1.5 tabular-nums text-[#334155]">
            <Clock className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>{lang === 'vi' ? '08:00 – 17:30 hằng ngày' : '08:00 – 17:30 Daily'}</span>
          </div>
        </div>

        {/* Secondary Links & Language Selector */}
        <div className="flex items-center gap-5 ml-auto">
          <nav aria-label="Secondary" className="hidden lg:flex items-center gap-4">
            {secondaryLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`transition-colors whitespace-nowrap shrink-0 font-medium ${
                  location.pathname === item.to
                    ? 'font-bold text-[#E11D48]'
                    : 'hover:text-[#0F172A]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div
            role="group"
            aria-label={lang === 'vi' ? 'Chọn ngôn ngữ' : 'Select language'}
            className="inline-flex items-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-0.5 shadow-2xs"
          >
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all whitespace-nowrap ${
                lang === 'vi'
                  ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-all whitespace-nowrap ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
