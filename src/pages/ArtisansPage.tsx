import { useCallback, useEffect, useState } from 'react';
import { HeritageImage } from '../components/common/HeritageImage';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type { Artisan } from '../types';

export function ArtisansPage() {
  const { lang, t } = useLanguage();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadArtisans = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await heritageApi.listArtisans();
      setArtisans(data);
    } catch {
      setError(lang === 'vi' ? 'Không thể tải danh sách nghệ nhân.' : 'Unable to load artisan profiles.');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadArtisans();
  }, [loadArtisans]);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 space-y-12">
      <div className="border-b border-[#DED6C8] pb-8 space-y-3">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {lang === 'vi' ? 'Hồ sơ Nhân vật Di sản' : 'Master Weavers Directory'}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1C1917]">
          {lang === 'vi' ? 'Nghệ nhân Làng nghề Vạn Phúc' : 'Artisans of Vạn Phúc Silk Village'}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#57534E]">
          {lang === 'vi'
            ? 'Tôn vinh những nghệ nhân đã dành trọn cuộc đời gìn giữ khung cửi gỗ, phục dựng hoa văn cổ và truyền lửa cho thế hệ kế cận.'
            : 'Honoring the master weavers who preserved wooden looms, revived antique motifs, and now mentor a younger generation.'}
        </p>
      </div>

      {error && <QueryErrorBanner message={error} onRetry={() => void loadArtisans()} />}

      {loading ? (
        <div className="h-72 animate-pulse bg-[#EFEAE1]" />
      ) : (
        <div className="space-y-10">
          {(Array.isArray(artisans) ? artisans : []).map((art, index) => (
            <article
              key={art._id}
              className="grid grid-cols-1 gap-8 border border-[#DED6C8] bg-white p-6 lg:grid-cols-12 lg:p-8 items-center"
            >
              <div className={`lg:col-span-4 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <HeritageImage src={art.portraitUrl} alt={art.name} aspectClass="aspect-[3/4]" />
              </div>

              <div className={`lg:col-span-8 space-y-4 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C6239]">
                  <span className="font-medium">{t(art.honorificTitle)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {lang === 'vi' ? `Sinh năm ${art.birthYear}` : `Born ${art.birthYear}`}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {art.yearsOfExperience} {lang === 'vi' ? 'năm gắn bó nghề' : 'years in craft'}
                  </span>
                </div>

                <h2 className="font-display text-3xl font-semibold text-[#1C1917]">{art.name}</h2>
                <p className="text-xs font-medium text-[#57534E]">{t(art.lineage)}</p>
                <p className="text-sm leading-relaxed text-[#1C1917]">{t(art.biography)}</p>

                <div className="border-t border-[#DED6C8] pt-4 space-y-2">
                  <p className="text-xs text-[#57534E]">
                    <span className="font-medium text-[#1C1917]">
                      {lang === 'vi' ? 'Kỹ nghệ tiêu biểu: ' : 'Signature Mastery: '}
                    </span>
                    {t(art.specialty)}
                  </p>
                  <blockquote className="font-display text-xl italic text-[#9B231D]">
                    “{t(art.quote)}”
                  </blockquote>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
