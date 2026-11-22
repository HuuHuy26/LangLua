import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeritageImage } from '../components/common/HeritageImage';
import { HERITAGE_IMAGES } from '../constants/assets';
import { useLanguage } from '../context/LanguageContext';

export function AboutPage() {
  const { lang } = useLanguage();

  const audienceGroups = [
    {
      index: '01',
      title: lang === 'vi' ? 'Học sinh & Sinh viên' : 'Students & Youth',
      desc:
        lang === 'vi'
          ? 'Tiếp cận di sản qua mô phỏng khung cửi trực quan, trắc nghiệm tương tác và cơ hội tình nguyện số hóa mẫu hoa văn cổ.'
          : 'Engage with silk heritage through an interactive loom simulator, cultural quizzes, and motif digitization volunteer drives.',
      to: '/kham-pha',
      cta: lang === 'vi' ? 'Khám phá Quiz di sản' : 'Take Discovery Quiz',
    },
    {
      index: '02',
      title: lang === 'vi' ? 'Du khách trong & ngoài nước' : 'Domestic & Global Travelers',
      desc:
        lang === 'vi'
          ? 'Hướng dẫn song ngữ Việt – Anh về cách nhận biết lụa tơ tằm thật, tham quan đình cổ, giếng ngọc và xưởng dệt truyền thống.'
          : 'Bilingual guide to distinguishing pure mulberry silk, visiting historic courtyards, and joining weekend weaving walks.',
      to: '/san-pham',
      cta: lang === 'vi' ? 'Xem các dòng lụa' : 'Browse Silk Archive',
    },
    {
      index: '03',
      title: lang === 'vi' ? 'Nhà nghiên cứu & Bảo tồn' : 'Researchers & Cultural Advocates',
      desc:
        lang === 'vi'
          ? 'Lưu trữ tư liệu lịch sử, ký ức nghệ nhân cao niên và phân tích thực trạng mai một nghề thủ công tại đô thị.'
          : 'Structured archival profiles of master weavers, oral histories, and critical analysis of urban craft sustainability.',
      to: '/thach-thuc',
      cta: lang === 'vi' ? 'Đọc báo cáo thách thức' : 'Read Challenge Report',
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 space-y-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <p className="text-xs font-medium tracking-wider text-[#8C6239]">
            {lang === 'vi' ? 'Giới thiệu Dự án Bảo tồn' : 'About the Preservation Initiative'}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1C1917]">
            {lang === 'vi'
              ? 'Giữ tiếng thoi Vạn Phúc giữa lòng Hà Nội đương đại'
              : 'Sustaining Vạn Phúc’s Looms in Contemporary Hanoi'}
          </h1>
          <p className="editorial-prose editorial-dropcap text-base text-[#1C1917]">
            {lang === 'vi'
              ? 'Nằm bên bờ sông Nhuệ thuộc quận Hà Đông, làng lụa Vạn Phúc là một trong những cái nôi dệt tơ tằm cổ xưa và bền bỉ nhất Việt Nam. Cổng thông tin này ra đời nhằm kết nối tri thức ngàn năm của các nghệ nhân với nhịp sống số của giới trẻ—biến sự thấu hiểu lịch sử thành hành động bảo tồn thiết thực.'
              : 'Situated along the Nhuệ River in Hà Đông District, Vạn Phúc Silk Village stands among Vietnam’s oldest living sericulture sanctuaries. This portal bridges master weavers’ millennial knowledge with youth digital culture—turning heritage curiosity into active craft preservation.'}
          </p>
        </div>

        <div className="lg:col-span-5">
          <HeritageImage
            src={HERITAGE_IMAGES.dyeCourtyard}
            alt={lang === 'vi' ? 'Sân phơi tơ lụa nhuộm tự nhiên tại Vạn Phúc' : 'Natural silk dyeing courtyard in Vạn Phúc'}
            caption={
              lang === 'vi'
                ? 'Hình 1 — Sân gạch cổ phơi những con tơ nhuộm thảo mộc buổi sớm.'
                : 'Fig. 1 — Morning sun drying botanically dyed silk skeins in a brick courtyard.'
            }
          />
        </div>
      </div>

      <section className="border-t border-[#DED6C8] pt-12 space-y-8">
        <h2 className="font-display text-3xl font-semibold text-[#1C1917]">
          {lang === 'vi' ? 'Trải nghiệm dành riêng cho từng nhóm đối tượng' : 'Tailored Journeys for Every Visitor'}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {audienceGroups.map((g) => (
            <div key={g.index} className="border border-[#DED6C8] bg-white p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <p className="font-mono text-xs text-[#8C6239]">{g.index}</p>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917]">{g.title}</h3>
                <p className="text-sm leading-relaxed text-[#57534E]">{g.desc}</p>
              </div>
              <Link to={g.to} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9B231D] hover:underline">
                {g.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
