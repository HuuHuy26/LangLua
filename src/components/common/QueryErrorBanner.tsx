import { RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface QueryErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export function QueryErrorBanner({ message, onRetry }: QueryErrorBannerProps) {
  const { lang } = useLanguage();
  return (
    <div className="border border-[#9B231D]/40 bg-[#9B231D]/5 p-5 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-[#9B231D]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-md border border-[#9B231D] bg-white px-4 py-2 text-xs font-medium text-[#9B231D] hover:bg-[#9B231D] hover:text-[#FBF9F5] transition-colors whitespace-nowrap shrink-0"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {lang === 'vi' ? 'Thử lại' : 'Retry'}
      </button>
    </div>
  );
}
