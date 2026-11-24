import { useCallback, useEffect, useState } from 'react';
import { HeritageImage } from '../components/common/HeritageImage';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { LoomSimulator } from '../components/interactive/LoomSimulator';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type { ProcessStep } from '../types';

export function ProcessPage() {
  const { lang, t } = useLanguage();
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSteps = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await heritageApi.listProcesses();
      const list = Array.isArray(res) ? res : [];
      setSteps(list);
      if (list.length > 0) setActiveStep(list[0].stepOrder);
    } catch {
      setError(lang === 'vi' ? 'Không thể tải quy trình dệt lụa.' : 'Unable to load weaving process steps.');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadSteps();
  }, [loadSteps]);

  const safeSteps = Array.isArray(steps) ? steps : [];
  const current = safeSteps.find((s) => s.stepOrder === activeStep) || safeSteps[0] || null;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 space-y-16">
      <div className="border-b border-[#DED6C8] pb-8 space-y-3">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {lang === 'vi' ? '7 Công đoạn Thủ công Truyền thống' : '7 Traditional Craft Stages'}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1C1917]">
          {lang === 'vi' ? 'Quy trình Dệt lụa Vạn Phúc' : 'From Mulberry Leaf to Vân Silk'}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#57534E]">
          {lang === 'vi'
            ? 'Mỗi thước lụa Vạn Phúc chân chính đi qua 7 công đoạn tỉ mỉ kéo dài nhiều tuần lễ. Chọn từng bước bên dưới hoặc trải nghiệm dệt thử trên mô phỏng khung cửi Jacquard.'
            : 'Authentic Vạn Phúc silk passes through seven meticulous stages over several weeks. Select each stage below or weave a pattern on our interactive loom simulator.'}
        </p>
      </div>

      {error && <QueryErrorBanner message={error} onRetry={() => void loadSteps()} />}

      {loading ? (
        <div className="h-80 animate-pulse bg-[#EFEAE1]" />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {safeSteps.map((step) => {
              const isSelected = step.stepOrder === activeStep;
              return (
                <button
                  key={step._id}
                  type="button"
                  onClick={() => setActiveStep(step.stepOrder)}
                  className={`border p-3 text-left transition-colors ${
                    isSelected
                      ? 'border-[#9B231D] bg-[#9B231D] text-[#FBF9F5]'
                      : 'border-[#DED6C8] bg-white text-[#1C1917] hover:bg-[#EFEAE1]'
                  }`}
                >
                  <p className={`font-mono text-xs tabular-nums ${isSelected ? 'text-[#FBF9F5]/80' : 'text-[#8C6239]'}`}>
                    0{step.stepOrder}
                  </p>
                  <p className="mt-1 text-xs font-medium leading-snug line-clamp-2">{t(step.title)}</p>
                </button>
              );
            })}
          </div>

          {current && (
            <div className="grid grid-cols-1 gap-8 border border-[#DED6C8] bg-white p-6 lg:grid-cols-12 lg:p-10 items-center">
              <div className="lg:col-span-6">
                <HeritageImage src={current.imageUrl} alt={t(current.title)} aspectClass="aspect-[4/3]" />
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-3 text-xs text-[#8C6239]">
                  <span className="font-medium">{t(current.subtitle)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{t(current.durationLabel)}</span>
                </div>

                <h2 className="font-display text-3xl font-semibold text-[#1C1917]">{t(current.title)}</h2>
                <p className="text-sm leading-relaxed text-[#1C1917]">{t(current.description)}</p>

                <dl className="divide-y divide-[#DED6C8] border-y border-[#DED6C8] text-xs">
                  <div className="py-3 grid grid-cols-3 gap-4">
                    <dt className="font-medium text-[#57534E]">
                      {lang === 'vi' ? 'Dụng cụ chính' : 'Primary Tools'}
                    </dt>
                    <dd className="col-span-2 text-[#1C1917]">{t(current.toolsUsed)}</dd>
                  </div>
                  <div className="py-3 grid grid-cols-3 gap-4">
                    <dt className="font-medium text-[#57534E]">
                      {lang === 'vi' ? 'Bí quyết nghệ nhân' : 'Artisan Secret'}
                    </dt>
                    <dd className="col-span-2 italic text-[#1C1917]">{t(current.artisanTip)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      )}

      <section className="space-y-4">
        <LoomSimulator />
      </section>
    </div>
  );
}
