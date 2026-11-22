import { ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type { Challenge } from '../types';

export function ChallengesPage() {
  const { lang, t } = useLanguage();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadChallenges = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await heritageApi.listChallenges();
      setChallenges(data);
    } catch {
      setError(lang === 'vi' ? 'Không thể tải báo cáo thách thức.' : 'Unable to load challenge reports.');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadChallenges();
  }, [loadChallenges]);

  const severityLabel = (sev: Challenge['severity']) => {
    if (sev === 'critical') return lang === 'vi' ? 'Mức độ: Khẩn thiết' : 'Severity: Critical';
    if (sev === 'high') return lang === 'vi' ? 'Mức độ: Cao' : 'Severity: High';
    return lang === 'vi' ? 'Mức độ: Đáng lưu ý' : 'Severity: Moderate';
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 space-y-12">
      <div className="border-b border-[#DED6C8] pb-8 space-y-3">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {lang === 'vi' ? 'Thực trạng & Nguy cơ Mai một' : 'Preservation Risk Assessment'}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1C1917]">
          {lang === 'vi' ? 'Thách thức của Làng nghề Vạn Phúc' : 'Challenges Facing Traditional Silk Weaving'}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#57534E]">
          {lang === 'vi'
            ? 'Nhận diện thẳng thắn bốn rào cản lớn đang đe dọa nghề dệt lụa truyền thống—từ thiếu hụt thợ trẻ, hàng pha giả danh đến chuỗi nguyên liệu và môi trường đô thị.'
            : 'An objective look at four structural pressures threatening Vạn Phúc—from youth succession gaps and synthetic imitations to raw silk supply and urban dyeing constraints.'}
        </p>
      </div>

      {error && <QueryErrorBanner message={error} onRetry={() => void loadChallenges()} />}

      {loading ? (
        <div className="h-72 animate-pulse bg-[#EFEAE1]" />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {challenges.map((ch, idx) => (
            <article key={ch._id} className="border border-[#DED6C8] bg-white p-6 lg:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DED6C8] pb-3 text-xs">
                  <span className="font-mono text-[#8C6239] tabular-nums">0{idx + 1}</span>
                  <span className={ch.severity === 'critical' ? 'font-semibold text-[#9B231D]' : 'text-[#57534E]'}>
                    {severityLabel(ch.severity)}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-semibold text-[#1C1917]">{t(ch.title)}</h2>
                <p className="text-sm leading-relaxed text-[#57534E]">{t(ch.description)}</p>
              </div>

              <div className="space-y-3 border-t border-[#DED6C8] pt-4 text-xs">
                <div>
                  <p className="font-medium text-[#1C1917]">
                    {lang === 'vi' ? 'Tác động thực tế' : 'Measured Impact'}
                  </p>
                  <p className="mt-1 text-[#9B231D]">{t(ch.impactMetric)}</p>
                </div>
                <div>
                  <p className="font-medium text-[#1C1917]">
                    {lang === 'vi' ? 'Hướng giải pháp bảo tồn' : 'Preservation Response'}
                  </p>
                  <p className="mt-1 text-[#57534E]">{t(ch.preservationSolution)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="border border-[#DED6C8] bg-[#EFEAE1] p-8 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
            {lang === 'vi' ? 'Bạn trẻ có thể góp sức như thế nào?' : 'How Youth Can Help Turn the Tide'}
          </h2>
          <p className="text-sm text-[#57534E]">
            {lang === 'vi'
              ? 'Tham gia đội ngũ tình nguyện viên số hóa mẫu hoa văn cổ, trải nghiệm workshop cuối tuần hoặc lan tỏa kiến thức phân biệt lụa thật.'
              : 'Join pattern-digitization volunteer teams, attend weekend craft workshops, or help travelers identify authentic mulberry silk.'}
          </p>
        </div>
        <Link
          to="/bao-ton"
          className="inline-flex items-center gap-2 rounded-md bg-[#9B231D] px-5 py-3 text-sm font-medium text-[#FBF9F5] hover:bg-[#7E1B16] whitespace-nowrap shrink-0"
        >
          {lang === 'vi' ? 'Xem hoạt động bảo tồn' : 'Join Preservation Activities'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
