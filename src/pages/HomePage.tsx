import { ArrowRight, Calendar, Compass, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeritageImage } from '../components/common/HeritageImage';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { HERITAGE_IMAGES } from '../constants/assets';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type { OverviewPayload } from '../types';

export function HomePage() {
  const { lang, t } = useLanguage();
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await heritageApi.getOverview();
      setData(res);
    } catch {
      setError(lang === 'vi' ? 'Không thể tải dữ liệu di sản.' : 'Unable to load heritage data.');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const leadArticle = data?.articles[0];
  const featuredArtisans = data?.artisans.filter((a) => a.featured).slice(0, 3) || [];
  const upcomingEvents = data?.events.slice(0, 2) || [];
  const highlightProducts = data?.products.slice(0, 3) || [];

  return (
    <div className="space-y-20 pb-20">
      {/* Exhibition Marquee Hero */}
      <section className="mx-auto max-w-[1200px] px-6 pt-10 lg:pt-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-6 flex flex-col justify-between py-2"
          >
            <div className="space-y-6">
              <p className="text-xs font-medium tracking-wider text-[#8C6239]">
                {lang === 'vi'
                  ? 'Hồ sơ Di sản Quốc gia · Vạn Phúc, Hà Đông'
                  : 'National Heritage Archive · Vạn Phúc, Hà Đông'}
              </p>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] tracking-tight text-[#1C1917]">
                {lang === 'vi'
                  ? 'Hồn tơ ngàn năm trên từng nhịp thoi Vạn Phúc'
                  : 'A Thousand Years of Living Silk on Wooden Looms'}
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-[#57534E]">
                {lang === 'vi'
                  ? 'Khám phá hành trình từ kén tằm đến tấm lụa Vân tiến vua, lắng nghe câu chuyện giữ nghề của các nghệ nhân cao niên và cùng thế hệ trẻ tham gia bảo tồn di sản dệt thủ công đất Việt.'
                  : 'Trace silk from riverside mulberry leaves to royal Vân jacquard, meet Vạn Phúc’s master weavers, and join youth workshops keeping traditional looms alive.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/quy-trinh"
                  className="inline-flex items-center gap-2 rounded-md bg-[#9B231D] px-6 py-3 text-sm font-medium text-[#FBF9F5] transition-colors hover:bg-[#7E1B16] whitespace-nowrap shrink-0"
                >
                  {lang === 'vi' ? 'Khám phá quy trình dệt' : 'Explore Weaving Process'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/kham-pha"
                  className="inline-flex items-center gap-2 rounded-md border border-[#DED6C8] bg-white px-5 py-3 text-sm font-medium text-[#1C1917] transition-colors hover:bg-[#EFEAE1] whitespace-nowrap shrink-0"
                >
                  {lang === 'vi' ? 'Thử thách kiến thức' : 'Take Heritage Quiz'}
                </Link>
              </div>
            </div>

            <div className="mt-10 border-t border-[#DED6C8] pt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#57534E]">
              <span>{lang === 'vi' ? 'Tổ nghề: Bà Lã Thị Nga' : 'Founder: Lady Lã Thị Nga'}</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'vi' ? 'Thành viên Mạng lưới Thủ công Thế giới' : 'World Crafts Council Creative City'}</span>
            </div>
          </motion.div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[320px] border border-[#DED6C8] bg-[#EFEAE1] overflow-hidden">
              <img
                src={HERITAGE_IMAGES.heroLoom}
                alt={lang === 'vi' ? 'Nghệ nhân dệt lụa trên khung cửi gỗ truyền thống Vạn Phúc' : 'Master weaver at a traditional Vạn Phúc wooden silk loom'}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Operational Heritage Strip */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-[#DED6C8] py-6 lg:grid-cols-4">
          <div>
            <p className="font-mono text-2xl font-medium text-[#1C1917] tabular-nums">1.000+</p>
            <p className="mt-1 text-xs text-[#57534E]">
              {lang === 'vi' ? 'Năm lịch sử nghề dệt lụa Vạn Phúc' : 'Years of documented silk weaving'}
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[#1C1917] tabular-nums">07</p>
            <p className="mt-1 text-xs text-[#57534E]">
              {lang === 'vi' ? 'Công đoạn thủ công từ kén đến lụa' : 'Handcrafted stages from cocoon to bolt'}
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[#1C1917] tabular-nums">70+</p>
            <p className="mt-1 text-xs text-[#57534E]">
              {lang === 'vi' ? 'Mẫu hoa văn lụa Vân cổ được lưu giữ' : 'Historic Vân jacquard patterns archived'}
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-medium text-[#9B231D] tabular-nums">1931</p>
            <p className="mt-1 text-xs text-[#57534E]">
              {lang === 'vi' ? 'Năm lụa Hà Đông vang danh tại Marseille' : 'Year Hà Đông silk debuted in Marseille'}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-[1200px] px-6">
          <QueryErrorBanner message={error} onRetry={() => void loadOverview()} />
        </div>
      )}

      {/* Section 2: Lead History & Craft Challenges Preview */}
      <section className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#DED6C8] pb-3">
              <h2 className="font-display text-3xl font-semibold text-[#1C1917]">
                {lang === 'vi' ? 'Biên niên sử Làng nghề' : 'Chronicles of the Silk Village'}
              </h2>
              <Link to="/lich-su" className="text-xs font-medium text-[#9B231D] hover:underline whitespace-nowrap shrink-0">
                {lang === 'vi' ? 'Xem toàn bộ dòng thời gian' : 'Full Timeline'}
              </Link>
            </div>

            {loading ? (
              <div className="h-64 animate-pulse bg-[#EFEAE1]" />
            ) : leadArticle ? (
              <article className="space-y-4">
                <HeritageImage
                  src={leadArticle.imageUrl}
                  alt={t(leadArticle.title)}
                  aspectClass="aspect-[16/9]"
                  caption={`${leadArticle.eraYear} · ${t(leadArticle.title)}`}
                />
                <div className="flex items-center gap-2 text-xs text-[#57534E]">
                  <span>{leadArticle.eraYear}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {leadArticle.readMinutes} {lang === 'vi' ? 'phút đọc' : 'min read'}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917]">
                  {t(leadArticle.title)}
                </h3>
                <p className="text-sm leading-relaxed text-[#57534E]">{t(leadArticle.summary)}</p>
                <Link
                  to={`/lich-su?id=${leadArticle._id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9B231D] hover:underline"
                >
                  {lang === 'vi' ? 'Đọc bài nghiên cứu' : 'Read Historical Essay'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ) : null}
          </div>

          <aside className="lg:col-span-5 space-y-5 border border-[#DED6C8] bg-[#EFEAE1]/60 p-6 lg:p-8">
            <div className="flex items-center justify-between border-b border-[#DED6C8] pb-3">
              <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
                {lang === 'vi' ? 'Vì sao nghề đang mai một?' : 'Why the Craft Faces Risk'}
              </h2>
              <Compass className="h-4 w-4 text-[#8C6239]" aria-hidden="true" />
            </div>

            <div className="divide-y divide-[#DED6C8]">
              {(data?.challenges || []).slice(0, 3).map((ch) => (
                <div key={ch._id} className="py-4 first:pt-1 last:pb-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#8C6239]">
                    <span className="font-medium uppercase tracking-wider">
                      {ch.severity === 'critical'
                        ? lang === 'vi' ? 'Khẩn thiết' : 'Critical'
                        : ch.severity === 'high'
                        ? lang === 'vi' ? 'Cao' : 'High'
                        : lang === 'vi' ? 'Đáng lưu ý' : 'Moderate'}
                    </span>
                    <span>{t(ch.impactMetric).slice(0, 42)}...</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#1C1917]">{t(ch.title)}</h3>
                  <p className="text-xs leading-relaxed text-[#57534E] line-clamp-2">{t(ch.description)}</p>
                </div>
              ))}
            </div>

            <Link
              to="/thach-thuc"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#1C1917] bg-white px-4 py-2.5 text-xs font-medium text-[#1C1917] transition-colors hover:bg-[#1C1917] hover:text-[#FBF9F5]"
            >
              {lang === 'vi' ? 'Phân tích thách thức & Giải pháp' : 'Explore Challenges & Solutions'}
            </Link>
          </aside>
        </div>
      </section>

      {/* Section 3: Signature Silk Archive */}
      <section className="border-y border-[#DED6C8] bg-[#EFEAE1]/50 py-16">
        <div className="mx-auto max-w-[1200px] px-6 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#8C6239]">
                {lang === 'vi' ? 'Lưu trữ Chất liệu & Hoa văn' : 'Textiles & Motif Catalog'}
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-[#1C1917]">
                {lang === 'vi' ? 'Những dòng lụa làm nên danh tiếng Hà Đông' : 'Iconic Weaves of Vạn Phúc'}
              </h2>
            </div>
            <Link
              to="/san-pham"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9B231D] hover:underline whitespace-nowrap shrink-0"
            >
              {lang === 'vi' ? 'Xem kho tư liệu lụa' : 'View Full Catalog'}
              <Layers className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {highlightProducts.map((prod) => (
              <div key={prod._id} className="border border-[#DED6C8] bg-white p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <HeritageImage src={prod.imageUrl} alt={t(prod.name)} aspectClass="aspect-[4/3]" />
                  <div className="flex items-center justify-between text-xs text-[#57534E]">
                    <span className="font-mono">{prod.accessionCode}</span>
                    <span aria-hidden="true">·</span>
                    <span>{prod.dimensions.split('·')[0]}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#1C1917]">{t(prod.name)}</h3>
                  <p className="text-xs leading-relaxed text-[#57534E]">{t(prod.description)}</p>
                </div>
                <Link
                  to="/san-pham"
                  className="pt-2 text-xs font-medium text-[#9B231D] hover:underline inline-flex items-center gap-1"
                >
                  {lang === 'vi' ? 'Chi tiết kỹ thuật dệt' : 'Inspect Weave Specs'}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Master Artisans & Upcoming Events */}
      <section className="mx-auto max-w-[1200px] px-6 space-y-16">
        <div className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#DED6C8] pb-4">
            <div>
              <p className="text-xs font-medium text-[#8C6239]">
                {lang === 'vi' ? 'Những người giữ lửa khung cửi' : 'Keepers of the Loom'}
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-[#1C1917]">
                {lang === 'vi' ? 'Nghệ nhân Làng lụa Vạn Phúc' : 'Master Artisans of Vạn Phúc'}
              </h2>
            </div>
            <Link to="/nghe-nhan" className="text-xs font-medium text-[#9B231D] hover:underline">
              {lang === 'vi' ? 'Tất cả nghệ nhân' : 'All Artisans'}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredArtisans.map((art) => (
              <article key={art._id} className="space-y-3">
                <HeritageImage src={art.portraitUrl} alt={art.name} aspectClass="aspect-[3/4]" />
                <div className="flex items-center gap-2 text-xs text-[#57534E]">
                  <span>{t(art.honorificTitle)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {art.yearsOfExperience} {lang === 'vi' ? 'năm nghề' : 'yrs craft'}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917]">{art.name}</h3>
                <p className="font-display text-sm italic text-[#57534E]">“{t(art.quote)}”</p>
              </article>
            ))}
          </div>
        </div>

        {/* Upcoming Conservation Events CTA Strip */}
        <div className="border border-[#DED6C8] bg-white p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DED6C8] pb-5">
            <div>
              <p className="text-xs font-medium text-[#8C6239]">
                {lang === 'vi' ? 'Hành động cùng Thế hệ Trẻ' : 'Youth & Community Action'}
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-[#1C1917]">
                {lang === 'vi' ? 'Hoạt động Bảo tồn Sắp Diễn ra' : 'Upcoming Preservation Events'}
              </h2>
            </div>
            <Link
              to="/bao-ton"
              className="inline-flex items-center gap-2 rounded-md bg-[#9B231D] px-5 py-2.5 text-xs font-medium text-[#FBF9F5] hover:bg-[#7E1B16] whitespace-nowrap shrink-0"
            >
              <Calendar className="h-4 w-4" />
              {lang === 'vi' ? 'Đăng ký tham gia (RSVP)' : 'Register & RSVP'}
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {upcomingEvents.map((evt) => {
              const remaining = Math.max(0, evt.capacity - evt.registeredCount);
              return (
                <div key={evt._id} className="border border-[#DED6C8] bg-[#FBF9F5] p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#57534E]">
                    <span className="font-mono tabular-nums">{evt.startDate.slice(0, 10)}</span>
                    <span className="font-medium text-[#9B231D] tabular-nums">
                      {lang === 'vi' ? `Còn ${remaining} chỗ` : `${remaining} seats left`}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#1C1917]">{t(evt.title)}</h3>
                  <p className="text-xs text-[#57534E]">{t(evt.location)}</p>
                  <p className="text-xs leading-relaxed text-[#57534E] line-clamp-2">{t(evt.description)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
