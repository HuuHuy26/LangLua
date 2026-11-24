import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function SiteFooter() {
  const { lang } = useLanguage();

  return (
    <footer className="border-t border-[#1E293B] bg-[#0F172A] text-white">
      <div className="mx-auto max-w-[1240px] px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#BE123C] text-white shadow-lg ring-2 ring-[#F59E0B]/50">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12c3-4 7-6 10-6s7 2 10 6c-3 4-7 6-10 6s-7-2-10-6z" />
                  <circle cx="12" cy="12" r="2.5" fill="#FBBF24" stroke="none" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-2xl font-TimeNewRoman tracking-tight text-white">Nối Nhịp Thoi Đưa</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#FBBF24]">
                  {lang === 'vi' ? 'Hà Đông · 1.000 Năm Di Sản' : 'Hà Đông · 1,000-Year Heritage'}
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-[#94A3B8]">
              {lang === 'vi'
                ? 'Không gian lưu giữ ký ức làng nghề dệt lụa hơn 1.000 năm tuổi tại Hà Đông, kết nối các nghệ nhân cao niên với thế hệ trẻ và bạn bè yêu văn hóa truyền thống Việt Nam.'
                : 'A dedicated digital archive safeguarding Vạn Phúc’s millennium-old silk weaving craft—bridging master artisans, Vietnamese youth, and cultural travelers worldwide.'}
            </p>

            <div className="space-y-2 text-xs text-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#E11D48] shrink-0" />
                <span>{lang === 'vi' ? 'Phường Vạn Phúc, Quận Hà Đông, TP. Hà Nội' : 'Vạn Phúc Ward, Hà Đông District, Hanoi'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#F59E0B] shrink-0" />
                <span className="tabular-nums">{lang === 'vi' ? 'Mở cửa đón khách: 08:00 – 17:30 hằng ngày' : 'Visiting hours: 08:00 – 17:30 Daily'}</span>
              </div>
            </div>
          </div>

          {/* Links Column 1: Heritage & History */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
              {lang === 'vi' ? 'Di sản & Ký ức' : 'Heritage Archive'}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li><Link to="/" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? 'Trang chủ' : 'Home'}</Link></li>
              <li><Link to="/gioi-thieu" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? 'Giới thiệu làng lụa' : 'About Village'}</Link></li>
              <li><Link to="/lich-su" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? 'Biên niên sử làng nghề' : 'Village History'}</Link></li>
              <li><Link to="/cau-chuyen" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? 'Câu chuyện di sản' : 'Living Stories'}</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Craft & Master Artisans */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
              {lang === 'vi' ? 'Kỹ nghệ & Tinh hoa' : 'Craft & Artisans'}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li><Link to="/quy-trinh" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? '7 Công đoạn dệt lụa' : '7-Stage Weaving'}</Link></li>
              <li><Link to="/san-pham" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? 'Kho lụa Vân & Hoa văn' : 'Silk Archive & Motifs'}</Link></li>
              <li><Link to="/nghe-nhan" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? 'Bậc thầy Nghệ nhân' : 'Master Artisans'}</Link></li>
              <li><Link to="/thach-thuc" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? 'Thách thức & Bảo tồn' : 'Craft Challenges'}</Link></li>
            </ul>
          </div>

          {/* Links Column 3: Community & Admin */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
              {lang === 'vi' ? 'Kết nối Cộng đồng' : 'Preservation'}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li><Link to="/bao-ton" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? 'Hoạt động & Workshop (RSVP)' : 'Preservation Events'}</Link></li>
              <li><Link to="/kham-pha" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? 'Góc thử thách kiến thức' : 'Heritage Quiz'}</Link></li>
              <li><Link to="/lien-he" className="hover:text-white hover:underline transition-colors">{lang === 'vi' ? 'Liên hệ & Ghé thăm' : 'Contact & Visit'}</Link></li>
              <li><Link to="/quan-tri" className="text-[#F43F5E] hover:underline font-semibold">{lang === 'vi' ? 'Cổng Quản trị viên' : 'Curator Portal'}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[#1E293B] pt-6 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#F59E0B]" />
            <p className="text-[#94A3B8]">
              © 2026 {lang === 'vi' ? 'Dự án Bảo tồn Di sản Nghề dệt lụa Vạn Phúc.' : 'Vạn Phúc Silk Heritage Safeguarding Project.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#1E293B] border border-[#334155] px-3 py-1 text-[11px] font-semibold text-[#FDE68A]">
              {lang === 'vi' ? 'Di sản Văn hóa Phi vật thể Quốc gia' : 'National Cultural Heritage'}
            </span>
            <span className="rounded-full bg-[#1E293B] border border-[#334155] px-3 py-1 text-[11px] font-semibold text-[#60A5FA]">
              Hà Nội City
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
