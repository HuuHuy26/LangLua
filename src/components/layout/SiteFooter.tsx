import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function SiteFooter() {
  const { lang } = useLanguage();

  return (
    <footer className="border-t border-[#DED6C8] bg-[#EFEAE1] text-[#1C1917]">
      <div className="mx-auto max-w-[1200px] px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <p className="font-display text-2xl font-semibold tracking-tight">Lụa Vạn Phúc</p>
            <p className="max-w-md text-sm leading-relaxed text-[#57534E]">
              {lang === 'vi'
                ? 'Không gian lưu giữ ký ức làng nghề dệt lụa hơn 1.000 năm tuổi tại Hà Đông, kết nối nghệ nhân truyền thống với thế hệ trẻ và du khách yêu văn hóa Việt.'
                : 'A digital archive dedicated to safeguarding Vạn Phúc’s 1,000-year silk weaving heritage—bridging master artisans, Vietnamese youth, and global travelers.'}
            </p>
            <p className="text-xs text-[#57534E]">
              {lang === 'vi'
                ? 'Phường Vạn Phúc, Quận Hà Đông, Thành phố Hà Nội · Thứ Hai – Chủ Nhật: 08:00 – 17:30'
                : 'Vạn Phúc Ward, Hà Đông District, Hanoi · Daily: 08:00 – 17:30'}
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#8C6239]">
              {lang === 'vi' ? 'Di sản & Tri thức' : 'Heritage Archive'}
            </h3>
            <ul className="space-y-2 text-sm text-[#57534E]">
              <li><Link to="/" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Trang chủ' : 'Home'}</Link></li>
              <li><Link to="/gioi-thieu" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Giới thiệu' : 'About'}</Link></li>
              <li><Link to="/lich-su" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Lịch sử làng nghề' : 'Village History'}</Link></li>
              <li><Link to="/cau-chuyen" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Câu chuyện di sản' : 'Heritage Stories'}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#8C6239]">
              {lang === 'vi' ? 'Kỹ nghệ & Nghệ nhân' : 'Craft & Makers'}
            </h3>
            <ul className="space-y-2 text-sm text-[#57534E]">
              <li><Link to="/quy-trinh" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Quy trình dệt lụa' : 'Weaving Process'}</Link></li>
              <li><Link to="/san-pham" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Sản phẩm lụa' : 'Silk Catalog'}</Link></li>
              <li><Link to="/nghe-nhan" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Chân dung Nghệ nhân' : 'Master Artisans'}</Link></li>
              <li><Link to="/thach-thuc" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Thách thức làng nghề' : 'Craft Challenges'}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#8C6239]">
              {lang === 'vi' ? 'Kết nối Cộng đồng' : 'Community'}
            </h3>
            <ul className="space-y-2 text-sm text-[#57534E]">
              <li><Link to="/bao-ton" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Hoạt động bảo tồn' : 'Preservation Events'}</Link></li>
              <li><Link to="/kham-pha" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Góc khám phá (Quiz)' : 'Discovery Quiz'}</Link></li>
              <li><Link to="/lien-he" className="hover:text-[#1C1917]">{lang === 'vi' ? 'Liên hệ' : 'Contact Us'}</Link></li>
              <li><Link to="/quan-tri" className="hover:text-[#9B231D]">{lang === 'vi' ? 'Quản trị Di sản' : 'Curator Admin'}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#DED6C8] pt-6 text-xs text-[#57534E]">
          <p>
            © 2026 {lang === 'vi' ? 'Dự án Bảo tồn Nghề dệt lụa Vạn Phúc.' : 'Vạn Phúc Silk Heritage Preservation Project.'}
          </p>
          <p>
            {lang === 'vi' ? 'Di sản văn hóa phi vật thể Quốc gia' : 'National Intangible Cultural Heritage'}
          </p>
        </div>
      </div>
    </footer>
  );
}
