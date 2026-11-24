import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { QueryErrorBanner } from '../components/common/QueryErrorBanner';
import { useLanguage } from '../context/LanguageContext';
import { heritageApi } from '../services/api';
import type { PublicQuizQuestion, QuizVerifyResult } from '../types';

export function DiscoveryQuizPage() {
  const { lang, t } = useLanguage();
  const [topic, setTopic] = useState<'all' | 'history' | 'weaving' | 'motifs' | 'preservation'>('all');
  const [questions, setQuestions] = useState<PublicQuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizVerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadQuestions = useCallback(async (selectedTopic: string) => {
    setLoading(true);
    setError('');
    setResult(null);
    setSelectedAnswers({});
    try {
      const list = await heritageApi.listQuizQuestions(selectedTopic);
      setQuestions(list);
    } catch {
      setError(lang === 'vi' ? 'Không thể tải ngân hàng câu hỏi.' : 'Unable to load quiz questions.');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    void loadQuestions(topic);
  }, [topic, loadQuestions]);

  const handleSelect = (questionId: string, optionIdx: number) => {
    if (result) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = questions.map((q) => ({
        id: q._id,
        selectedIndex: selectedAnswers[q._id] ?? -1,
      }));
      const res = await heritageApi.verifyQuiz(payload);
      setResult(res);
    } catch {
      setError(lang === 'vi' ? 'Không thể chấm điểm bài kiểm tra.' : 'Unable to verify quiz answers.');
    } finally {
      setSubmitting(false);
    }
  };

  const topics = [
    { key: 'all', vi: 'Tất cả chủ đề', en: 'All Topics' },
    { key: 'history', vi: 'Lịch sử', en: 'History' },
    { key: 'weaving', vi: 'Quy trình dệt', en: 'Weaving Craft' },
    { key: 'motifs', vi: 'Hoa văn', en: 'Silk Motifs' },
    { key: 'preservation', vi: 'Bảo tồn', en: 'Preservation' },
  ] as const;

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-12 space-y-10">
      <div className="border-b border-[#DED6C8] pb-8 space-y-4">
        <p className="text-xs font-medium tracking-wider text-[#8C6239]">
          {lang === 'vi' ? 'Góc Khám phá Tương tác' : 'Interactive Cultural Discovery'}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#1C1917]">
          {lang === 'vi' ? 'Trắc nghiệm Kiến thức Di sản Lụa Vạn Phúc' : 'Vạn Phúc Silk Heritage Quiz'}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#57534E]">
          {lang === 'vi'
            ? 'Thử tài hiểu biết của bạn về lịch sử ngàn năm, kỹ thuật ươm tơ dệt lụa và cách nhận biết tơ tằm Vạn Phúc chính gốc.'
            : 'Test your understanding of Vạn Phúc’s millennial history, mulberry silk-making stages, and authenticity markers.'}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {topics.map((tp) => (
            <button
              key={tp.key}
              type="button"
              onClick={() => setTopic(tp.key)}
              className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                topic === tp.key
                  ? 'bg-[#1C1917] text-[#FBF9F5]'
                  : 'border border-[#DED6C8] bg-white text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              {lang === 'vi' ? tp.vi : tp.en}
            </button>
          ))}
        </div>
      </div>

      {error && <QueryErrorBanner message={error} onRetry={() => void loadQuestions(topic)} />}

      {result && (
        <div className="border border-[#8C6239] bg-[#EFEAE1] p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#8C6239]">
              {lang === 'vi' ? 'Kết quả đánh giá' : 'Quiz Evaluation'}
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#1C1917] tabular-nums">
              {result.score} / {result.total} {lang === 'vi' ? 'câu trả lời chính xác' : 'correct answers'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => void loadQuestions(topic)}
            className="inline-flex items-center gap-2 rounded-md border border-[#1C1917] bg-white px-4 py-2.5 text-xs font-medium text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBF9F5]"
          >
            <RotateCcw className="h-4 w-4" />
            {lang === 'vi' ? 'Làm lại bài kiểm tra' : 'Retake Quiz'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="h-72 animate-pulse bg-[#EFEAE1]" />
      ) : (Array.isArray(questions) ? questions : []).length === 0 ? (
        <div className="border border-[#DED6C8] bg-white p-8 text-center text-sm text-[#57534E]">
          {lang === 'vi' ? 'Chưa có câu hỏi trong chủ đề này.' : 'No questions found in this topic.'}
        </div>
      ) : (
        <div className="space-y-6">
          {(Array.isArray(questions) ? questions : []).map((q, qIdx) => {
            const chosen = selectedAnswers[q._id];
            const verified = result?.results?.find((r) => r.id === q._id);
            const opts = lang === 'vi' ? q.options.vi : q.options.en;

            return (
              <div key={q._id} className="border border-[#DED6C8] bg-white p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#8C6239]">
                  <span className="font-mono tabular-nums">
                    {lang === 'vi' ? `Câu ${qIdx + 1}` : `Question ${qIdx + 1}`}
                  </span>
                  <span className="uppercase tracking-wider">{q.difficulty}</span>
                </div>

                <h3 className="font-display text-2xl font-semibold text-[#1C1917]">{t(q.question)}</h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {opts.map((optText, oIdx) => {
                    const isPicked = chosen === oIdx;
                    const isCorrectOpt = verified && verified.correctIndex === oIdx;
                    const isWrongPicked = verified && isPicked && !verified.isCorrect;

                    let styleClass = 'border-[#DED6C8] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#EFEAE1]';
                    if (isCorrectOpt) {
                      styleClass = 'border-[#14532D] bg-[#14532D]/10 text-[#14532D] font-medium';
                    } else if (isWrongPicked) {
                      styleClass = 'border-[#9B231D] bg-[#9B231D]/10 text-[#9B231D]';
                    } else if (isPicked) {
                      styleClass = 'border-[#1C1917] bg-[#1C1917] text-[#FBF9F5]';
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={Boolean(result)}
                        onClick={() => handleSelect(q._id, oIdx)}
                        className={`flex items-center justify-between gap-3 border px-4 py-3 text-left text-sm transition-colors ${styleClass}`}
                      >
                        <span>{optText}</span>
                        {isCorrectOpt && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                        {isWrongPicked && <XCircle className="h-4 w-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {verified && (
                  <div className="border-t border-[#DED6C8] pt-3 text-xs leading-relaxed text-[#57534E]">
                    <span className="font-semibold text-[#1C1917]">
                      {lang === 'vi' ? 'Giải thích: ' : 'Cultural Note: '}
                    </span>
                    {t(verified.explanation)}
                  </div>
                )}
              </div>
            );
          })}

          {!result && questions.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#DED6C8] pt-6">
              <p className="text-xs text-[#57534E] tabular-nums">
                {lang === 'vi'
                  ? `Đã chọn ${answeredCount} / ${questions.length} câu hỏi`
                  : `${answeredCount} of ${questions.length} questions answered`}
              </p>
              <button
                type="button"
                disabled={submitting || answeredCount === 0}
                onClick={handleSubmit}
                className="rounded-md bg-[#9B231D] px-6 py-3 text-sm font-medium text-[#FBF9F5] transition-colors hover:bg-[#7E1B16] disabled:opacity-50"
              >
                {submitting
                  ? lang === 'vi'
                    ? 'Đang chấm điểm...'
                    : 'Grading...'
                  : lang === 'vi'
                  ? 'Nộp bài & Xem đáp án'
                  : 'Submit Answers'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
