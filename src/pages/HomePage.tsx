import { ArrowRight, Calendar, Compass, ExternalLink, Layers, Sparkles, Trophy, Users, ShieldCheck, BookmarkCheck } from 'lucide-react';
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
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);

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

  const articles = Array.isArray(data?.articles) ? data.articles : [];
  const currentLeadArticle = articles[activeArticleIndex] || articles[0];
  const featuredArtisans = Array.isArray(data?.artisans)
    ? (data.artisans.filter((a) => a.featured).slice(0, 3).length > 0
        ? data.artisans.filter((a) => a.featured).slice(0, 3)
        : data.artisans.slice(0, 3))
    : [];
  const upcomingEvents = Array.isArray(data?.events) ? data.events.slice(0, 4) : [];
  const highlightProducts = Array.isArray(data?.products) ? data.products.slice(0, 3) : [];

  // Helper to map exact Google Form links as required
  const getEventFormUrl = (titleVi: string, eventId: string, customUrl?: string) => {
    if (customUrl && customUrl.startsWith('https://forms.gle')) return customUrl;
    if (titleVi.includes('Vân Lụa Ngàn Năm') || titleVi.includes('Tiến Vua') || eventId === 'evt-2') {
      return 'https://forms.gle/HnLdbN3Yn8FRtnFE6';
    }
    if (titleVi.includes('ươm tơ') || titleVi.includes('khung cửi mini') || eventId === 'evt-1') {
      return 'https://forms.gle/TMAKH7oR8gqmsbxF7';
    }
    if (titleVi.includes('Số hóa') || titleVi.includes('Thanh niên') || eventId === 'evt-3') {
      return 'https://forms.gle/qHcVSwDAMj9dXDKH6';
    }
    return 'https://forms.gle/ySagaCdfeT4coH4SA';
  };

  return (
    <div className="space-y-24 pb-24 bg-silk-pattern">
      {/* 1. Hero Section: Exhibition Marquee */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:pt-16 lg:pb-20 border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Typography & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-7 flex flex-col justify-center space-y-6"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="silk-badge silk-badge-gold">
                  <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
                  {lang === 'vi' ? 'Di sản Văn hóa Quốc gia' : 'National Heritage'}
                </span>
                <span className="silk-badge silk-badge-crimson">
                  {lang === 'vi' ? 'Làng nghề 1.000 năm tuổi' : '1,000-Year Legacy'}
                </span>
                <span className="silk-badge silk-badge-sapphire">
                  WCC Craft City
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.8rem] font-bold leading-[1.08] text-[#0F172A]">
                {lang === 'vi' ? (
                  <>
                    Hành trình giữ lửa Làng {' '}
                    <span className="bg-gradient-to-r from-[#E11D48] via-[#BE123C] to-[#F59E0B] bg-clip-text text-transparent">
                      Vạn Phúc
                    </span>
                  </>
                ) : (
                  <>
                    Living Silk Heritage on the Wooden Looms of {' '}
                    <span className="bg-gradient-to-r from-[#E11D48] via-[#BE123C] to-[#F59E0B] bg-clip-text text-transparent">
                      Vạn Phúc
                    </span>
                  </>
                )}
              </h1>

              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#334155]">
                {lang === 'vi'
                  ? 'Khám phá hành trình từ búp kén tằm vàng đến tấm lụa Vân tiến vua trứ danh. Cùng các nghệ nhân cao niên giữ lửa khung cửi cổ và lan tỏa di sản dệt thủ công đất Việt.'
                  : 'Trace silk from riverside mulberry leaves to royal Vân jacquard, meet master weavers, and join youth workshops keeping traditional looms alive.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/quy-trinh"
                  className="silk-btn-primary shadow-lg shadow-rose-500/25 whitespace-nowrap shrink-0"
                >
                  <span>{lang === 'vi' ? 'Khám phá 7 công đoạn dệt' : 'Explore Weaving Craft'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/kham-pha"
                  className="silk-btn-secondary whitespace-nowrap shrink-0"
                >
                  <Trophy className="h-4 w-4 text-[#F59E0B]" />
                  <span>{lang === 'vi' ? 'Thử thách kiến thức' : 'Heritage Quiz'}</span>
                </Link>
              </div>

              {/* Founder & Worldwide Recognition Strip */}
              <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#64748B]">
                <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                  <BookmarkCheck className="h-4 w-4 text-[#E11D48]" />
                  <span>{lang === 'vi' ? 'Khởi tổ: Đức Thành hoàng Lã Thị Nga (845 – 885)' : 'Founder: Lady Lã Thị Nga (845 – 885)'}</span>
                </div>
                <span className="text-[#CBD5E1]" aria-hidden="true">•</span>
                <span className="font-medium">{lang === 'vi' ? 'Thành viên Mạng lưới Thủ công Sáng tạo Thế giới (WCC)' : 'World Crafts Council Creative Craft City'}</span>
              </div>
            </motion.div>

            {/* Right Column: Hero Visual Frame with Cổng Làng Vạn Phúc */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Silk Frame */}
                <div className="relative overflow-hidden rounded-3xl border-2 border-[#F59E0B]/60 bg-white p-3 shadow-2xl shadow-rose-950/10">
                  <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-2xl">
                    <img
                      src={HERITAGE_IMAGES.heroLoom}
                      alt={lang === 'vi' ? 'Cổng Làng lụa Vạn Phúc cổ kính rợp bóng lịch sử' : 'Historic Ancient Gate of Vạn Phúc Silk Village'}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="inline-block rounded-full bg-[#E11D48] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs mb-1">
                        {lang === 'vi' ? 'Biểu tượng Di sản Làng cổ' : 'Historic Landmark'}
                      </span>
                      <p className="font-serif text-xl font-bold text-white drop-shadow-md">
                        {lang === 'vi' ? 'Cổng Làng dệt lụa Vạn Phúc' : 'Ancient Gate of Vạn Phúc Silk Village'}
                      </p>
                    </div>
                  </div>

                  {/* Floating Metric Pill */}
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#FFFBEB] to-[#FFF1F2] px-4 py-2.5 text-xs">
                    <span className="font-bold text-[#E11D48]">
                      {lang === 'vi' ? 'Hơn 10 thế kỷ canh cửi' : 'Over 10 centuries of silk craft'}
                    </span>
                    <span className="font-mono font-extrabold text-[#D97706]">EST. 865</span>
                  </div>
                </div>

                {/* Ambient Glows */}
                <div className="absolute -bottom-8 -right-8 -z-10 h-56 w-56 rounded-full bg-[#F59E0B]/25 blur-3xl" />
                <div className="absolute -top-8 -left-8 -z-10 h-56 w-56 rounded-full bg-[#E11D48]/20 blur-3xl" />
              </div>
            </motion.div>
          </div>

          {/* 4-Stat Heritage Metric Strip - Tươi sáng, phân biệt màu sắc rõ ràng */}
          <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="silk-card rounded-2xl p-5 border-l-4 border-l-[#E11D48] bg-gradient-to-br from-white to-[#FFF1F2]/60">
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#E11D48] tabular-nums">1.000+</p>
              <p className="mt-1 font-serif text-lg font-bold text-[#0F172A]">
                {lang === 'vi' ? 'Năm tuổi làng nghề' : 'Years of Silk Heritage'}
              </p>
              <p className="mt-0.5 text-xs text-[#64748B]">
                {lang === 'vi' ? 'Khởi nguồn từ thế kỷ IX thời bà Lã Thị Nga' : 'Originated in 9th century by Lady Nga'}
              </p>
            </div>

            <div className="silk-card rounded-2xl p-5 border-l-4 border-l-[#F59E0B] bg-gradient-to-br from-white to-[#FFFBEB]/60">
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#D97706] tabular-nums">07</p>
              <p className="mt-1 font-serif text-lg font-bold text-[#0F172A]">
                {lang === 'vi' ? 'Công đoạn thủ công' : 'Handcrafted Stages'}
              </p>
              <p className="mt-0.5 text-xs text-[#64748B]">
                {lang === 'vi' ? 'Từ trồng dâu, ươm tơ đến dệt hoa văn & nhuộm' : 'From mulberry leaves to dyeing & finishing'}
              </p>
            </div>

            <div className="silk-card rounded-2xl p-5 border-l-4 border-l-[#2563EB] bg-gradient-to-br from-white to-[#EFF6FF]/60">
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#2563EB] tabular-nums">70+</p>
              <p className="mt-1 font-serif text-lg font-bold text-[#0F172A]">
                {lang === 'vi' ? 'Mẫu hoa văn lụa Vân' : 'Historic Jacquard Motifs'}
              </p>
              <p className="mt-0.5 text-xs text-[#64748B]">
                {lang === 'vi' ? 'Song hạc, chữ Thọ, hoa cúc, tứ quý vương giả' : 'Song Hạc, Thọ, Lotus & imperial motifs'}
              </p>
            </div>

            <div className="silk-card rounded-2xl p-5 border-l-4 border-l-[#059669] bg-gradient-to-br from-white to-[#ECFDF5]/60">
              <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#059669] tabular-nums">1931</p>
              <p className="mt-1 font-serif text-lg font-bold text-[#0F172A]">
                {lang === 'vi' ? 'Vang danh quốc tế' : 'Global Acclaim'}
              </p>
              <p className="mt-0.5 text-xs text-[#64748B]">
                {lang === 'vi' ? 'Đấu xảo Marseille & Paris nức tiếng châu Âu' : 'Exhibited in Marseille & Paris expos'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-[1240px] px-6">
          <QueryErrorBanner message={error} onRetry={() => void loadOverview()} />
        </div>
      )}

      {/* 2. Section 2: "Biên niên sử Làng nghề" & Thách thức bảo tồn */}
      <section className="mx-auto max-w-[1240px] px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="silk-badge silk-badge-crimson">
                <Sparkles className="h-3 w-3" />
                {lang === 'vi' ? 'Dòng chảy lịch sử' : 'Living Chronology'}
              </span>
            </div>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#0F172A]">
              {lang === 'vi' ? 'Biên niên sử Làng nghề' : 'Chronicles of the Silk Village'}
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              {lang === 'vi'
                ? 'Lần theo từng dấu mốc từ thời trang Vạn Bảo thế kỷ IX đến vị thế Di sản Quốc gia hôm nay'
                : 'Tracing key milestones from 9th-century Vạn Bảo to contemporary National Cultural Heritage'}
            </p>
          </div>
          <Link
            to="/lich-su"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E11D48] hover:underline shrink-0"
          >
            {lang === 'vi' ? 'Xem toàn bộ dòng thời gian' : 'Full Village Timeline'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Main Chronicle Feature Card */}
          <div className="lg:col-span-7 space-y-6">
            {loading ? (
              <div className="h-96 rounded-3xl animate-pulse bg-slate-200" />
            ) : currentLeadArticle ? (
              <div className="silk-card rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-200 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="silk-badge silk-badge-crimson">
                      {currentLeadArticle.eraYear}
                    </span>
                    <span className="text-xs font-semibold text-[#64748B]">
                      {currentLeadArticle.readMinutes} {lang === 'vi' ? 'phút đọc' : 'min read'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#D97706]">
                    {currentLeadArticle.publishedAt?.slice(0, 7)}
                  </span>
                </div>

                {/* Main Heritage Image with high aesthetics */}
                <div className="relative overflow-hidden rounded-2xl shadow-sm">
                  <HeritageImage
                    src={currentLeadArticle.imageUrl}
                    alt={t(currentLeadArticle.title)}
                    aspectClass="aspect-[16/9]"
                    caption={`${currentLeadArticle.eraYear} · ${t(currentLeadArticle.title)}`}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A] leading-snug">
                    {t(currentLeadArticle.title)}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#334155]">
                    {t(currentLeadArticle.summary)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200">
                  {/* Select timeline tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    {articles.slice(0, 4).map((art, idx) => (
                      <button
                        key={art._id}
                        type="button"
                        onClick={() => setActiveArticleIndex(idx)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shadow-2xs ${activeArticleIndex === idx
                          ? 'bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white shadow-xs scale-105'
                          : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                          }`}
                      >
                        {art.eraYear.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <Link
                    to={`/lich-su?id=${currentLeadArticle._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E11D48] hover:underline"
                  >
                    <span>{lang === 'vi' ? 'Đọc tư liệu lịch sử đầy đủ' : 'Read Full History'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Column: Thách thức làng nghề & Giải pháp */}
          <aside className="lg:col-span-5 silk-card rounded-3xl p-6 sm:p-8 space-y-6 bg-gradient-to-br from-white via-slate-50/70 to-rose-50/20 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E11D48]">
                  {lang === 'vi' ? 'Bảo tồn khẩn cấp' : 'Craft Safeguarding'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0F172A]">
                  {lang === 'vi' ? 'Vì sao nghề đang mai một?' : 'Urgent Craft Challenges'}
                </h3>
              </div>
              <Compass className="h-6 w-6 text-[#E11D48]" aria-hidden="true" />
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              {lang === 'vi'
                ? 'Để giữ được tiếng thoi lách cách giữa nhịp sống hiện đại, Làng lụa Vạn Phúc đang đối diện 3 bài toán sống còn:'
                : 'To keep wooden looms sounding amid modern rush, Vạn Phúc faces three pivotal preservation hurdles:'}
            </p>

            <div className="space-y-3.5">
              {(data?.challenges || []).slice(0, 3).map((ch, idx) => (
                <div
                  key={ch._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-[#F59E0B]/60 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${ch.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : ch.severity === 'high'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                    >
                      {ch.severity === 'critical'
                        ? lang === 'vi' ? 'Khẩn thiết' : 'Critical'
                        : ch.severity === 'high'
                          ? lang === 'vi' ? 'Ưu tiên cao' : 'High Priority'
                          : lang === 'vi' ? 'Đáng lưu ý' : 'Moderate'}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#64748B]">0{idx + 1}</span>
                  </div>
                  <h4 className="mt-2 font-serif text-base font-bold text-[#0F172A]">
                    {t(ch.title)}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#64748B] line-clamp-2">
                    {t(ch.description)}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/thach-thuc"
              className="silk-btn-primary w-full py-3 text-xs shadow-md"
            >
              <ShieldCheck className="h-4 w-4 text-[#FDE68A]" />
              <span>{lang === 'vi' ? 'Xem phân tích thách thức & Hành động' : 'Explore Solutions & Actions'}</span>
            </Link>
          </aside>
        </div>
      </section>

      {/* 3. Section 3: Signature Silk Archive (Kho tàng Lụa Vân & Chất liệu Tinh hoa) */}
      <section className="border-y border-[#E2E8F0] bg-gradient-to-b from-slate-50/80 to-white py-20">
        <div className="mx-auto max-w-[1240px] px-6 space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="silk-badge silk-badge-gold">
                <Layers className="h-3 w-3 text-[#D97706]" />
                {lang === 'vi' ? 'Bảo tàng Chất liệu & Hoa văn' : 'Textile Archive & Motifs'}
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#0F172A]">
                {lang === 'vi' ? 'Những dòng lụa làm nên danh tiếng Vạn Phúc' : 'Signature Weaves of Hà Đông'}
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                {lang === 'vi'
                  ? 'Kỹ thuật dệt hoa nổi hoa chìm tinh xảo bậc nhất của người thợ dệt Vạn Phúc'
                  : 'Exquisite jacquard and gauze weaving techniques perfected over centuries'}
              </p>
            </div>
            <Link
              to="/san-pham"
              className="silk-btn-secondary py-2.5 px-4 text-xs shrink-0"
            >
              <span>{lang === 'vi' ? 'Khám phá trọn bộ kho lụa' : 'View Full Catalog'}</span>
              <Layers className="h-3.5 w-3.5 text-[#E11D48]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {highlightProducts.map((prod) => (
              <div
                key={prod._id}
                className="silk-card rounded-3xl p-5 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-2xl shadow-sm">
                    <HeritageImage src={prod.imageUrl} alt={t(prod.name)} aspectClass="aspect-[4/3]" />
                    <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 font-mono text-[10px] font-extrabold text-[#E11D48] shadow-sm backdrop-blur-xs border border-rose-200">
                      {prod.accessionCode}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#D97706]">
                      {prod.dimensions.split('·')[0]}
                    </span>
                    <h3 className="mt-1 font-serif text-xl font-bold text-[#0F172A] group-hover:text-[#E11D48] transition-colors">
                      {t(prod.name)}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#64748B] line-clamp-3">
                      {t(prod.description)}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <Link
                    to="/san-pham"
                    className="font-bold text-[#E11D48] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{lang === 'vi' ? 'Xem thông số dệt' : 'Weave Specs'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] text-amber-800 font-bold">
                    OCOP 5 Sao
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section 4: Master Artisans (Bậc thầy Nghệ nhân làng lụa) */}
      <section className="mx-auto max-w-[1240px] px-6 space-y-12">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <span className="silk-badge silk-badge-sapphire">
              <Users className="h-3 w-3 text-[#2563EB]" />
              {lang === 'vi' ? 'Những người giữ lửa' : 'Living National Treasures'}
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#0F172A]">
              {lang === 'vi' ? 'Nghệ nhân Làng lụa Vạn Phúc' : 'Master Artisans of Vạn Phúc'}
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              {lang === 'vi'
                ? 'Những bàn tay tài hoa dành trọn cuộc đời phục chế hoa văn cổ và truyền dạy nghề dệt cho thế hệ mai sau'
                : 'Master craftspeople dedicating their lives to reviving antique jacquard weaves'}
            </p>
          </div>
          <Link
            to="/nghe-nhan"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E11D48] hover:underline shrink-0"
          >
            {lang === 'vi' ? 'Tất cả nghệ nhân làng nghề' : 'All Master Artisans'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {featuredArtisans.map((art) => (
            <article
              key={art._id}
              className="silk-card rounded-3xl p-5 space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border-2 border-[#F59E0B]/40 shadow-sm">
                  <HeritageImage src={art.portraitUrl} alt={art.name} aspectClass="aspect-[3/4]" />
                  <div className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3 py-1 text-[11px] font-bold text-[#FDE68A] backdrop-blur-xs">
                    {art.yearsOfExperience} {lang === 'vi' ? 'năm gắn bó' : 'years of craft'}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-extrabold text-[#E11D48] uppercase tracking-wider">
                    {t(art.honorificTitle)}
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-[#0F172A] group-hover:text-[#E11D48] transition-colors">
                    {art.name}
                  </h3>
                  <p className="font-serif text-sm italic text-[#475569] leading-relaxed pt-1">
                    “{t(art.quote)}”
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <Link
                  to="/nghe-nhan"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:text-[#E11D48] transition-colors"
                >
                  <span>{lang === 'vi' ? 'Tiểu sử & Công trình phục chế' : 'Biography & Works'}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Section 5: Upcoming Preservation Events & 4 Google Form CTAs */}
      <section className="mx-auto max-w-[1240px] px-6">
        <div className="silk-card rounded-3xl p-8 sm:p-10 lg:p-12 border-2 border-[#F59E0B]/40 bg-gradient-to-br from-white via-rose-50/20 to-amber-50/20 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <span className="silk-badge silk-badge-crimson">
                <Calendar className="h-3.5 w-3.5" />
                {lang === 'vi' ? 'Hành động cùng thế hệ trẻ' : 'Youth & Community Action'}
              </span>
              <h2 className="mt-2 font-TimeNewRoman text-3xl sm:text-4xl font-TimeNewRoman text-[#0F172A]">
                {lang === 'vi' ? 'WorkShop bảo tồn văn hóa' : 'Preservation Events & Workshops'}
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                {lang === 'vi'
                  ? 'Đăng ký tham gia trực tiếp các workshop dệt thủ công, triển lãm và chương trình số hóa hoa văn'
                  : 'Register directly for hands-on weaving workshops, exhibitions, and digital motif archiving'}
              </p>
            </div>
            <Link
              to="/bao-ton"
              className="silk-btn-primary whitespace-nowrap shrink-0 text-xs py-2.5 px-4"
            >
              <Calendar className="h-4 w-4 text-[#FDE68A]" />
              <span>{lang === 'vi' ? 'Xem toàn bộ lịch sự kiện' : 'Full Events Calendar'}</span>
            </Link>
          </div>

          <div className={`mt-8 grid grid-cols-1 ${upcomingEvents.length === 1 ? 'max-w-2xl mx-auto' : 'md:grid-cols-2'} gap-6`}>
            {upcomingEvents.map((evt) => {
              const remaining = Math.max(0, evt.capacity - evt.registeredCount);
              const titleVi = evt.title?.vi || '';
              const formUrl = getEventFormUrl(titleVi, evt._id, evt.formUrl);

              return (
                <div
                  key={evt._id}
                  className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-300 hover:border-[#F59E0B] hover:shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-[#D97706] font-extrabold">
                        <Calendar className="h-4 w-4 text-[#E11D48]" />
                        <span>{evt.startDate.slice(0, 10)}</span>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200 font-mono">
                        {evt.registeredCount}/{evt.capacity} ({lang === 'vi' ? `Còn ${remaining} chỗ` : `${remaining} slots left`})
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A] leading-snug">
                      {t(evt.title)}
                    </h3>

                    <p className="text-xs font-semibold text-[#D97706]">
                      📍 {t(evt.location)}
                    </p>

                    <p className="text-xs leading-relaxed text-[#64748B] line-clamp-2">
                      {t(evt.description)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                    <a
                      href={formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="silk-btn-primary text-xs py-2.5 px-4 shadow-xs whitespace-nowrap"
                    >
                      <Calendar className="h-3.5 w-3.5 text-[#FDE68A]" />
                      <span>{lang === 'vi' ? 'Đăng ký tham gia (Biểu mẫu)' : 'Register (Form)'}</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-90" />
                    </a>

                    <span className="text-[11px] text-[#64748B] font-medium hidden sm:inline">
                      {lang === 'vi' ? 'Miễn phí / Trợ cấp' : 'Free admission'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
