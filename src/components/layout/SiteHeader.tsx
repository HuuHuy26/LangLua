import { Compass, Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function SiteHeader() {
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryNav = [
    { to: '/lich-su', label: lang === 'vi' ? 'Lịch sử' : 'History' },
    { to: '/quy-trinh', label: lang === 'vi' ? 'Quy trình dệt' : 'Weaving' },
    { to: '/san-pham', label: lang === 'vi' ? 'Kho lụa Vân' : 'Silk Archive' },
    { to: '/nghe-nhan', label: lang === 'vi' ? 'Nghệ nhân' : 'Artisans' },
    { to: '/kham-pha', label: lang === 'vi' ? 'Góc thử thách' : 'Quiz & Trivia' },
  ];

  const allRoutes = [
    { to: '/', label: lang === 'vi' ? 'Trang chủ' : 'Home' },
    { to: '/gioi-thieu', label: lang === 'vi' ? 'Giới thiệu tổng quan' : 'About Archive' },
    { to: '/lich-su', label: lang === 'vi' ? 'Lịch sử & Dòng thời gian' : 'History & Timeline' },
    { to: '/quy-trinh', label: lang === 'vi' ? '7 Công đoạn dệt lụa' : '7-Stage Weaving Craft' },
    { to: '/san-pham', label: lang === 'vi' ? 'Bảo tàng hoa văn & Sản phẩm' : 'Textiles & Jacquard Patterns' },
    { to: '/nghe-nhan', label: lang === 'vi' ? 'Bậc thầy Nghệ nhân' : 'Master Artisans' },
    { to: '/cau-chuyen', label: lang === 'vi' ? 'Ký ức & Câu chuyện di sản' : 'Living Heritage Stories' },
    { to: '/thach-thuc', label: lang === 'vi' ? 'Thách thức & Bảo tồn' : 'Craft Challenges' },
    { to: '/bao-ton', label: lang === 'vi' ? 'Hoạt động & Workshop (RSVP)' : 'Preservation Events (RSVP)' },
    { to: '/kham-pha', label: lang === 'vi' ? 'Góc khám phá & Đố vui' : 'Discovery Quiz' },
    { to: '/lien-he', label: lang === 'vi' ? 'Liên hệ & Ghé thăm làng' : 'Contact & Visit' },
    { to: '/quan-tri', label: lang === 'vi' ? 'Cổng Quản trị Viên' : 'Curator Portal' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0]/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-6 py-3.5">
        {/* Brand Logo & Heritage Title */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#9F1239] text-[#FFFBEB] shadow-md ring-2 ring-[#F59E0B]/50 transition-transform duration-300 group-hover:scale-105">
            {/* Traditional Silk Shuttle & Loom Motif Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c3-4 7-6 10-6s7 2 10 6c-3 4-7 6-10 6s-7-2-10-6z" />
              <circle cx="12" cy="12" r="2.5" fill="#FBBF24" stroke="none" />
              <path d="M12 4v2m0 12v2M6 8l1.5 1.5M16.5 14.5L18 16" stroke="#FEF3C7" strokeWidth="1.2" />
            </svg>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-[#F59E0B] ring-2 ring-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-2xl font-TimeNewRoman tracking-tight text-[#0F172A] transition-colors group-hover:text-[#E11D48]">
              Làng Lụa Vạn Phúc
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#D97706]">
              {lang === 'vi' ? 'Hà Đông · 1.000 Năm Di Sản' : 'Hà Đông · Living Heritage'}
            </span>
          </div>
        </Link>

        {/* Primary Desktop Navigation */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-1 lg:gap-2">
          {primaryNav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-xl whitespace-nowrap ${active
                  ? 'text-[#E11D48] bg-[#FFF1F2]'
                  : 'text-[#334155] hover:text-[#E11D48] hover:bg-[#F8FAFC]'
                  }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-[#E11D48]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/bao-ton"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E11D48] via-[#BE123C] to-[#9F1239] px-4 py-2 text-xs font-bold text-white shadow-md ring-1 ring-white/30 transition-all duration-200 hover:shadow-lg hover:from-[#F43F5E] hover:to-[#BE123C] hover:scale-[1.02] whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FDE68A]" />
            <span>{lang === 'vi' ? 'Tham gia bảo tồn' : 'Preserve Heritage'}</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] shadow-xs hover:bg-[#F8FAFC]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-[#E2E8F0] bg-white px-6 py-5 md:hidden shadow-xl animate-in fade-in duration-200">
          <div className="mb-4 flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
              {lang === 'vi' ? 'Ngôn ngữ hiển thị' : 'Language'}
            </span>
            <div className="inline-flex rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setLang('vi')}
                className={`px-3 py-1 text-xs font-bold rounded-full ${lang === 'vi' ? 'bg-[#E11D48] text-white shadow-xs' : 'text-[#64748B]'
                  }`}
              >
                Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-bold rounded-full ${lang === 'en' ? 'bg-[#E11D48] text-white shadow-xs' : 'text-[#64748B]'
                  }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1 text-sm">
            {allRoutes.map((route) => (
              <Link
                key={route.to}
                to={route.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors font-medium ${location.pathname === route.to
                  ? 'bg-[#FFF1F2] font-bold text-[#E11D48]'
                  : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
              >
                <span>{route.label}</span>
                <Compass className="h-4 w-4 opacity-40" />
              </Link>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
            <Link
              to="/bao-ton"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] py-3 text-xs font-bold text-white shadow-md"
            >
              <Sparkles className="h-4 w-4 text-[#FDE68A]" />
              <span>{lang === 'vi' ? 'Đăng ký tham gia bảo tồn (RSVP)' : 'Preserve Heritage (RSVP)'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
