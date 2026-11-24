import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { HeritageImage } from '../components/common/HeritageImage';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type { Product, SilkWeaveType } from '../types';

export function ProductsPage() {
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | SilkWeaveType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadProducts = useCallback(async (weaveFilter: 'all' | SilkWeaveType) => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await heritageApi.listProducts(weaveFilter === 'all' ? undefined : weaveFilter);
      setProducts(data);
    } catch {
      setLoadError(
        lang === 'vi' ? 'Không thể tải danh mục sản phẩm lụa.' : 'Unable to load silk catalog.'
      );
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadProducts(filter);
  }, [filter, loadProducts]);

  const filters: Array<{ key: 'all' | SilkWeaveType; vi: string; en: string }> = [
    { key: 'all', vi: 'Tất cả dòng lụa', en: 'All Weaves' },
    { key: 'van', vi: 'Lụa Vân', en: 'Vân Jacquard' },
    { key: 'the', vi: 'Lụa The', en: 'The Gauze' },
    { key: 'linh', vi: 'Lụa Lĩnh', en: 'Lĩnh Satin' },
    { key: 'gam', vi: 'Gấm', en: 'Brocade' },
    { key: 'dui', vi: 'Lụa Đũi', en: 'Đũi Raw Silk' },
  ];

  const safeProducts = Array.isArray(products) ? products : [];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visible = normalizedQuery
    ? safeProducts.filter(
        (p) =>
          t(p.name).toLowerCase().includes(normalizedQuery) ||
          t(p.description).toLowerCase().includes(normalizedQuery) ||
          p.accessionCode.toLowerCase().includes(normalizedQuery)
      )
    : safeProducts;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 space-y-10">
      <div className="border-b border-[#DED6C8] pb-8 space-y-4">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {lang === 'vi' ? 'Danh mục Lưu trữ Chất liệu' : 'Museum Textile Accession'}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1C1917]">
          {lang === 'vi' ? 'Các dòng Sản phẩm Lụa Vạn Phúc' : 'Vạn Phúc Silk Taxonomy & Specimens'}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#57534E]">
          {lang === 'vi'
            ? 'Tìm hiểu đặc tính kỹ thuật, mật độ sợi và ý nghĩa văn hóa của năm dòng lụa tiêu biểu được dệt từ 100% tơ tằm tự nhiên.'
            : 'Examine weave structures, thread density, and cultural motifs across five authentic 100% mulberry silk traditions.'}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  filter === f.key
                    ? 'bg-[#1C1917] text-[#FBF9F5]'
                    : 'border border-[#DED6C8] bg-white text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                {lang === 'vi' ? f.vi : f.en}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#57534E]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'vi' ? 'Tìm hoa văn, mã lưu trữ...' : 'Search motif or code...'}
              className="w-full rounded-md border border-[#DED6C8] bg-white pl-9 pr-3 py-2 text-xs text-[#1C1917]"
            />
          </div>
        </div>
      </div>

      {loadError && <QueryErrorBanner message={loadError} onRetry={() => void loadProducts(filter)} />}

      {loading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="h-80 animate-pulse bg-[#EFEAE1]" />
          <div className="h-80 animate-pulse bg-[#EFEAE1]" />
          <div className="h-80 animate-pulse bg-[#EFEAE1]" />
        </div>
      ) : visible.length === 0 ? (
        <div className="border border-[#DED6C8] bg-white p-8 text-center space-y-3">
          <p className="text-sm text-[#57534E]">
            {lang === 'vi' ? 'Không tìm thấy mẫu lụa phù hợp.' : 'No matching silk specimens found.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="rounded-md border border-[#DED6C8] px-4 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#EFEAE1]"
          >
            {lang === 'vi' ? 'Xóa bộ lọc' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <article
              key={item._id}
              className="border border-[#DED6C8] bg-white p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <HeritageImage src={item.imageUrl} alt={t(item.name)} aspectClass="aspect-[4/3]" />
                <div className="flex items-center justify-between text-xs text-[#57534E]">
                  <span className="font-mono">{item.accessionCode}</span>
                  <span>{item.dimensions}</span>
                </div>
                <h2 className="font-display text-2xl font-semibold text-[#1C1917]">{t(item.name)}</h2>
                <p className="text-xs leading-relaxed text-[#57534E]">{t(item.description)}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(item)}
                className="w-full rounded-md border border-[#DED6C8] bg-[#FBF9F5] px-4 py-2.5 text-xs font-medium text-[#1C1917] transition-colors hover:bg-[#EFEAE1]"
              >
                {lang === 'vi' ? 'Xem hồ sơ kỹ thuật' : 'View Accession Record'}
              </button>
            </article>
          ))}
        </div>
      )}

      {/* Specimen Detail Modal */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#DED6C8] bg-[#FBF9F5] p-6 lg:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-[#DED6C8] pb-4">
              <div>
                <p className="font-mono text-xs text-[#8C6239]">{selected.accessionCode}</p>
                <h3 className="mt-1 font-display text-3xl font-semibold text-[#1C1917]">{t(selected.name)}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close modal"
                className="rounded-md border border-[#DED6C8] p-2 text-[#1C1917] hover:bg-[#EFEAE1]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <HeritageImage src={selected.imageUrl} alt={t(selected.name)} aspectClass="aspect-[16/9]" />

            <p className="text-sm leading-relaxed text-[#1C1917]">{t(selected.description)}</p>

            <dl className="divide-y divide-[#DED6C8] border-y border-[#DED6C8] text-xs">
              <div className="py-3 grid grid-cols-3 gap-4">
                <dt className="font-medium text-[#57534E]">{lang === 'vi' ? 'Chất liệu' : 'Material'}</dt>
                <dd className="col-span-2 text-[#1C1917]">{t(selected.material)}</dd>
              </div>
              <div className="py-3 grid grid-cols-3 gap-4">
                <dt className="font-medium text-[#57534E]">{lang === 'vi' ? 'Quy cách' : 'Specifications'}</dt>
                <dd className="col-span-2 font-mono text-[#1C1917]">{selected.dimensions}</dd>
              </div>
              <div className="py-3 grid grid-cols-3 gap-4">
                <dt className="font-medium text-[#57534E]">{lang === 'vi' ? 'Ý nghĩa hoa văn' : 'Motif Symbolism'}</dt>
                <dd className="col-span-2 text-[#1C1917]">{t(selected.motifMeaning)}</dd>
              </div>
              <div className="py-3 grid grid-cols-3 gap-4">
                <dt className="font-medium text-[#57534E]">{lang === 'vi' ? 'Bảo quản lụa' : 'Silk Care'}</dt>
                <dd className="col-span-2 text-[#1C1917]">{t(selected.careGuide)}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
