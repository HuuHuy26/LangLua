import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeritageImage } from '../components/common/HeritageImage';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type { Article } from '../types';

export function HistoryPage() {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('id'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await heritageApi.listArticles();
      const list = Array.isArray(res) ? res : [];
      setArticles(list);
      const paramId = searchParams.get('id');
      if (paramId && list.some((a) => a._id === paramId)) {
        setSelectedId(paramId);
      } else if (list.length > 0) {
        setSelectedId((prev) => prev || list[0]._id);
      }
    } catch {
      setError(lang === 'vi' ? 'Không thể tải tư liệu lịch sử.' : 'Unable to load historical articles.');
    } finally {
      setLoading(false);
    }
  }, [lang, searchParams]);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  const safeArticles = Array.isArray(articles) ? articles : [];
  const selected = safeArticles.find((a) => a._id === selectedId) || safeArticles[0] || null;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 space-y-12">
      <div className="border-b border-[#DED6C8] pb-8 space-y-3">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {lang === 'vi' ? 'Biên niên sử Làng nghề' : 'Village Chronology'}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1C1917]">
          {lang === 'vi' ? 'Lịch sử Làng lụa Vạn Phúc' : 'History of Vạn Phúc Silk Village'}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#57534E]">
          {lang === 'vi'
            ? 'Từ trang Vạn Bảo thế kỷ IX, những tấm lụa tiến vua triều Nguyễn đến dấu ấn hội chợ Paris 1938 và hành trình bảo tồn di sản hôm nay.'
            : 'From 9th-century Vạn Bảo and Nguyễn royal patronage to Paris exhibitions in 1938 and modern cultural revival.'}
        </p>
      </div>

      {error && <QueryErrorBanner message={error} onRetry={() => void loadArticles()} />}

      {loading ? (
        <div className="h-72 animate-pulse bg-[#EFEAE1]" />
      ) : articles.length === 0 ? (
        <div className="border border-[#DED6C8] bg-white p-8 text-center text-sm text-[#57534E]">
          {lang === 'vi' ? 'Chưa có bài viết lịch sử.' : 'No historical articles found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-medium text-[#57534E]">
              {lang === 'vi' ? 'Mốc thời gian lịch sử' : 'Historical Eras'}
            </p>
            <div className="divide-y divide-[#DED6C8] border border-[#DED6C8] bg-white">
              {safeArticles.map((art, index) => {
                const active = selected?._id === art._id;
                return (
                  <button
                    key={art._id}
                    type="button"
                    onClick={() => {
                      setSelectedId(art._id);
                      setSearchParams({ id: art._id });
                    }}
                    className={`w-full p-4 text-left transition-colors ${
                      active ? 'bg-[#EFEAE1]' : 'hover:bg-[#FBF9F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#8C6239]">
                      <span className="font-mono tabular-nums">0{index + 1}</span>
                      <span>{art.eraYear}</span>
                    </div>
                    <p className={`mt-1.5 font-display text-lg font-semibold ${active ? 'text-[#9B231D]' : 'text-[#1C1917]'}`}>
                      {t(art.title)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            {selected && (
              <article className="border border-[#DED6C8] bg-white p-6 lg:p-10 space-y-6">
                <div className="flex items-center gap-3 text-xs text-[#57534E]">
                  <span className="font-medium text-[#9B231D]">{selected.eraYear}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {selected.readMinutes} {lang === 'vi' ? 'phút đọc' : 'min read'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{selected.publishedAt}</span>
                </div>

                <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#1C1917]">
                  {t(selected.title)}
                </h2>

                <HeritageImage
                  src={selected.imageUrl}
                  alt={t(selected.title)}
                  aspectClass="aspect-[16/9]"
                />

                <div className="editorial-prose space-y-4 text-base text-[#1C1917]">
                  {t(selected.content)
                    .split('\n\n')
                    .map((para, i) => (
                      <p key={i} className={i === 0 ? 'editorial-dropcap' : ''}>
                        {para}
                      </p>
                    ))}
                </div>
              </article>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
