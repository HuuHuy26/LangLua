import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function OperationalRibbon() {
  const { lang, setLang } = useLanguage();
  const location = useLocation();

  const secondaryLinks = [
    { to: '/gioi-thieu', label: lang === 'vi' ? 'Giới thiệu' : 'About' },
    { to: '/thach-thuc', label: lang === 'vi' ? 'Thách thức' : 'Challenges' },
    { to: '/cau-chuyen', label: lang === 'vi' ? 'Câu chuyện' : 'Stories' },
    { to: '/bao-ton', label: lang === 'vi' ? 'Hoạt động' : 'Events' },
    { to: '/lien-he', label: lang === 'vi' ? 'Liên hệ' : 'Contact' },
  ];

  return (
    <div className="border-b border-[#DED6C8] bg-[#EFEAE1]/70">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-2.5 text-xs text-[#57534E]">
        <div className="flex flex-wrap items-center gap-2">
          <span>{lang === 'vi' ? 'Làng lụa Vạn Phúc, Hà Đông, Hà Nội' : 'Vạn Phúc Silk Village, Hà Đông, Hanoi'}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{lang === 'vi' ? 'Mở cửa: 08:00 – 17:30' : 'Hours: 08:00 – 17:30'}</span>
        </div>

        <div className="flex items-center gap-5">
          <nav aria-label="Secondary" className="hidden lg:flex items-center gap-4">
            {secondaryLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  location.pathname === item.to
                    ? 'font-semibold text-[#9B231D]'
                    : 'hover:text-[#1C1917]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div
            role="group"
            aria-label={lang === 'vi' ? 'Chọn ngôn ngữ' : 'Select language'}
            className="inline-flex items-center rounded-md border border-[#DED6C8] bg-[#FBF9F5] p-0.5"
          >
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                lang === 'vi'
                  ? 'bg-[#1C1917] text-[#FBF9F5]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                lang === 'en'
                  ? 'bg-[#1C1917] text-[#FBF9F5]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
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
