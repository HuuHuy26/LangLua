import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function SiteHeader() {
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryNav = [
    { to: '/lich-su', label: lang === 'vi' ? 'Lịch sử' : 'History' },
    { to: '/quy-trinh', label: lang === 'vi' ? 'Quy trình' : 'Weaving' },
    { to: '/san-pham', label: lang === 'vi' ? 'Sản phẩm' : 'Silk Archive' },
    { to: '/nghe-nhan', label: lang === 'vi' ? 'Nghệ nhân' : 'Artisans' },
    { to: '/kham-pha', label: lang === 'vi' ? 'Khám phá' : 'Quiz' },
  ];

  const allRoutes = [
    { to: '/', label: lang === 'vi' ? 'Trang chủ' : 'Home' },
    { to: '/gioi-thieu', label: lang === 'vi' ? 'Giới thiệu' : 'About' },
    { to: '/lich-su', label: lang === 'vi' ? 'Lịch sử làng nghề' : 'Village History' },
    { to: '/quy-trinh', label: lang === 'vi' ? 'Quy trình dệt lụa' : 'Weaving Process' },
    { to: '/san-pham', label: lang === 'vi' ? 'Sản phẩm lụa' : 'Silk Products' },
    { to: '/nghe-nhan', label: lang === 'vi' ? 'Nghệ nhân' : 'Artisans' },
    { to: '/thach-thuc', label: lang === 'vi' ? 'Thách thức làng nghề' : 'Craft Challenges' },
    { to: '/cau-chuyen', label: lang === 'vi' ? 'Câu chuyện di sản' : 'Heritage Stories' },
    { to: '/bao-ton', label: lang === 'vi' ? 'Hoạt động bảo tồn' : 'Preservation' },
    { to: '/kham-pha', label: lang === 'vi' ? 'Góc khám phá' : 'Discovery Quiz' },
    { to: '/lien-he', label: lang === 'vi' ? 'Liên hệ' : 'Contact' },
    { to: '/quan-tri', label: lang === 'vi' ? 'Quản trị' : 'Admin Portal' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#DED6C8] bg-[#FBF9F5]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-4">
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0"
        >
          Lụa Vạn Phúc
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
          {primaryNav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`whitespace-nowrap shrink-0 transition-colors duration-150 pb-0.5 ${
                  active
                    ? 'text-[#9B231D] border-b border-[#9B231D]'
                    : 'hover:text-[#1C1917] hover:border-b hover:border-[#8C6239]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/bao-ton"
            className="hidden sm:inline-flex items-center justify-center rounded-md bg-[#9B231D] px-4 py-2 text-xs font-medium text-[#FBF9F5] transition-colors duration-150 hover:bg-[#7E1B16] whitespace-nowrap shrink-0"
          >
            {lang === 'vi' ? 'Tham gia bảo tồn' : 'Join Preservation'}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-md border border-[#DED6C8] text-[#1C1917] hover:bg-[#EFEAE1]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#DED6C8] bg-[#FBF9F5] px-6 py-5 md:hidden">
          <div className="mb-4 flex items-center justify-between border-b border-[#DED6C8] pb-3">
            <span className="text-xs font-medium text-[#57534E]">
              {lang === 'vi' ? 'Ngôn ngữ' : 'Language'}
            </span>
            <div className="inline-flex rounded-md border border-[#DED6C8] bg-[#EFEAE1] p-0.5">
              <button
                type="button"
                onClick={() => setLang('vi')}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  lang === 'vi' ? 'bg-white text-[#1C1917] shadow-xs' : 'text-[#57534E]'
                }`}
              >
                Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  lang === 'en' ? 'bg-white text-[#1C1917] shadow-xs' : 'text-[#57534E]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {allRoutes.map((route) => (
              <Link
                key={route.to}
                to={route.to}
                onClick={() => setMobileOpen(false)}
                className={`py-1.5 ${
                  location.pathname === route.to ? 'font-semibold text-[#9B231D]' : 'text-[#1C1917]'
                }`}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
