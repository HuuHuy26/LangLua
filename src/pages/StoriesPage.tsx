import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeritageImage } from '../components/common/HeritageImage';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type { Story } from '../types';

export function StoriesPage() {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeId, setActiveId] = useState<string | null>(searchParams.get('id'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await heritageApi.listStories();
      const list = Array.isArray(res) ? res : [];
      setStories(list);
      const paramId = searchParams.get('id');
      if (paramId && list.some((s) => s._id === paramId)) {
        setActiveId(paramId);
      } else if (list.length > 0) {
        setActiveId((prev) => prev || list[0]._id);
      }
    } catch {
      setError(lang === 'vi' ? 'Không thể tải câu chuyện di sản.' : 'Unable to load heritage stories.');
    } finally {
      setLoading(false);
    }
  }, [lang, searchParams]);

  useEffect(() => {
    void loadStories();
  }, [loadStories]);

  const safeStories = Array.isArray(stories) ? stories : [];
  const current = safeStories.find((s) => s._id === activeId) || safeStories[0] || null;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 space-y-12">
      <div className="border-b border-[#DED6C8] pb-8 space-y-3">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {lang === 'vi' ? 'Ký ức Làng nghề & Lời kể Nhân chứng' : 'Oral Histories & Cultural Essays'}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1C1917]">
          {lang === 'vi' ? 'Câu chuyện Di sản Vạn Phúc' : 'Stories Woven Through Generations'}
        </h1>
      </div>

      {error && <QueryErrorBanner message={error} onRetry={() => void loadStories()} />}

      {loading ? (
        <div className="h-72 animate-pulse bg-[#EFEAE1]" />
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          <aside className="lg:col-span-4 space-y-3">
            <p className="text-xs font-medium text-[#57534E]">
              {lang === 'vi' ? 'Danh mục bài viết' : 'Collected Narratives'}
            </p>
            <div className="divide-y divide-[#DED6C8] border border-[#DED6C8] bg-white">
              {safeStories.map((st) => {
                const isSelected = current?._id === st._id;
                return (
                  <button
                    key={st._id}
                    type="button"
                    onClick={() => {
                      setActiveId(st._id);
                      setSearchParams({ id: st._id });
                    }}
                    className={`w-full p-4 text-left transition-colors ${
                      isSelected ? 'bg-[#EFEAE1]' : 'hover:bg-[#FBF9F5]'
                    }`}
                  >
                    <p className="text-xs text-[#8C6239]">{st.narratorName}</p>
                    <p className={`mt-1 font-display text-lg font-semibold ${isSelected ? 'text-[#9B231D]' : 'text-[#1C1917]'}`}>
                      {t(st.title)}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="lg:col-span-8">
            {current && (
              <article className="border border-[#DED6C8] bg-white p-6 lg:p-10 space-y-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                  <span className="font-medium text-[#1C1917]">{current.narratorName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t(current.narratorRole)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t(current.eraContext)}</span>
                </div>

                <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#1C1917]">
                  {t(current.title)}
                </h2>

                <HeritageImage src={current.coverUrl} alt={t(current.title)} aspectClass="aspect-[16/9]" />

                <blockquote className="border-y border-[#DED6C8] py-5 font-display text-2xl italic text-[#1C1917]">
                  “{t(current.pullQuote)}”
                </blockquote>

                <div className="editorial-prose space-y-4 text-base text-[#1C1917]">
                  {t(current.body)
                    .split('\n\n')
                    .map((p, idx) => (
                      <p key={idx} className={idx === 0 ? 'editorial-dropcap' : ''}>
                        {p}
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
