import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HERITAGE_IMAGES } from '../../constants/assets';
import { useLanguage } from '../../context/LanguageContext';
import type {
  AdminQuizQuestion,
  Article,
  Artisan,
  Challenge,
  PreservationEvent,
  ProcessStep,
  Product,
  Story,
} from '../../types';

export type EditableCollection =
  | 'articles'
  | 'artisans'
  | 'products'
  | 'processes'
  | 'challenges'
  | 'stories'
  | 'events'
  | 'quiz';

export type AnyEntity =
  | Article
  | Artisan
  | Product
  | ProcessStep
  | Challenge
  | Story
  | PreservationEvent
  | AdminQuizQuestion;

interface AdminEntityModalProps {
  collection: EditableCollection;
  initialItem: AnyEntity | null;
  onClose: () => void;
  onSave: (payload: Record<string, unknown>, id?: string) => Promise<void>;
}

const IMAGE_PRESETS = [
  { label: 'Loom Workshop', url: HERITAGE_IMAGES.heroLoom },
  { label: 'Vân Silk Swatches', url: HERITAGE_IMAGES.silkSwatch },
  { label: 'Master Artisan', url: HERITAGE_IMAGES.artisanPortrait },
  { label: 'Dyeing Courtyard', url: HERITAGE_IMAGES.dyeCourtyard },
  { label: 'Cocoon Reeling', url: HERITAGE_IMAGES.cocoonReel },
];

export function AdminEntityModal({
  collection,
  initialItem,
  onClose,
  onSave,
}: AdminEntityModalProps) {
  const { lang } = useLanguage();
  const isEditing = Boolean(initialItem);

  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Common bilingual fields
  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subVi, setSubVi] = useState('');
  const [subEn, setSubEn] = useState('');
  const [bodyVi, setBodyVi] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [extraVi, setExtraVi] = useState('');
  const [extraEn, setExtraEn] = useState('');
  const [imageUrl, setImageUrl] = useState<string>(HERITAGE_IMAGES.heroLoom);

  // Entity-specific scalar fields
  const [category, setCategory] = useState('history');
  const [eraYear, setEraYear] = useState('2026');
  const [birthYear, setBirthYear] = useState(1958);
  const [yearsOfExperience, setYearsOfExperience] = useState(35);
  const [featured, setFeatured] = useState(true);
  const [accessionCode, setAccessionCode] = useState('VP-ARC-010');
  const [weaveType, setWeaveType] = useState('van');
  const [dimensions, setDimensions] = useState('Khổ 90 cm · 100% tơ tằm');
  const [stepOrder, setStepOrder] = useState(8);
  const [severity, setSeverity] = useState('high');
  const [narratorName, setNarratorName] = useState('');
  const [eventType, setEventType] = useState('workshop');
  const [startDate, setStartDate] = useState('2026-12-30T09:00');
  const [capacity, setCapacity] = useState(35);
  const [quizOptionsVi, setQuizOptionsVi] = useState('');
  const [quizOptionsEn, setQuizOptionsEn] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [quizTopic, setQuizTopic] = useState('history');

  useEffect(() => {
    if (!initialItem) return;
    if (collection === 'articles') {
      const a = initialItem as Article;
      setTitleVi(a.title.vi);
      setTitleEn(a.title.en);
      setSubVi(a.summary.vi);
      setSubEn(a.summary.en);
      setBodyVi(a.content.vi);
      setBodyEn(a.content.en);
      setCategory(a.category);
      setEraYear(a.eraYear);
      setImageUrl(a.imageUrl);
    } else if (collection === 'artisans') {
      const a = initialItem as Artisan;
      setTitleVi(a.name);
      setTitleEn(a.name);
      setSubVi(a.honorificTitle.vi);
      setSubEn(a.honorificTitle.en);
      setBodyVi(a.biography.vi);
      setBodyEn(a.biography.en);
      setExtraVi(a.specialty.vi);
      setExtraEn(a.specialty.en);
      setBirthYear(a.birthYear);
      setYearsOfExperience(a.yearsOfExperience);
      setFeatured(a.featured);
      setImageUrl(a.portraitUrl);
    } else if (collection === 'products') {
      const p = initialItem as Product;
      setTitleVi(p.name.vi);
      setTitleEn(p.name.en);
      setSubVi(p.motifMeaning.vi);
      setSubEn(p.motifMeaning.en);
      setBodyVi(p.description.vi);
      setBodyEn(p.description.en);
      setExtraVi(p.careGuide.vi);
      setExtraEn(p.careGuide.en);
      setAccessionCode(p.accessionCode);
      setWeaveType(p.weaveType);
      setDimensions(p.dimensions);
      setImageUrl(p.imageUrl);
    } else if (collection === 'processes') {
      const p = initialItem as ProcessStep;
      setStepOrder(p.stepOrder);
      setTitleVi(p.title.vi);
      setTitleEn(p.title.en);
      setSubVi(p.subtitle.vi);
      setSubEn(p.subtitle.en);
      setBodyVi(p.description.vi);
      setBodyEn(p.description.en);
      setExtraVi(p.artisanTip.vi);
      setExtraEn(p.artisanTip.en);
      setImageUrl(p.imageUrl);
    } else if (collection === 'challenges') {
      const c = initialItem as Challenge;
      setTitleVi(c.title.vi);
      setTitleEn(c.title.en);
      setSubVi(c.impactMetric.vi);
      setSubEn(c.impactMetric.en);
      setBodyVi(c.description.vi);
      setBodyEn(c.description.en);
      setExtraVi(c.preservationSolution.vi);
      setExtraEn(c.preservationSolution.en);
      setSeverity(c.severity);
      setCategory(c.category);
    } else if (collection === 'stories') {
      const s = initialItem as Story;
      setNarratorName(s.narratorName);
      setTitleVi(s.title.vi);
      setTitleEn(s.title.en);
      setSubVi(s.pullQuote.vi);
      setSubEn(s.pullQuote.en);
      setBodyVi(s.body.vi);
      setBodyEn(s.body.en);
      setExtraVi(s.narratorRole.vi);
      setExtraEn(s.narratorRole.en);
      setImageUrl(s.coverUrl);
    } else if (collection === 'events') {
      const ev = initialItem as PreservationEvent;
      setTitleVi(ev.title.vi);
      setTitleEn(ev.title.en);
      setSubVi(ev.location.vi);
      setSubEn(ev.location.en);
      setBodyVi(ev.description.vi);
      setBodyEn(ev.description.en);
      setEventType(ev.eventType);
      setStartDate(ev.startDate);
      setCapacity(ev.capacity);
    } else if (collection === 'quiz') {
      const q = initialItem as AdminQuizQuestion;
      setTitleVi(q.question.vi);
      setTitleEn(q.question.en);
      setQuizOptionsVi(q.options.vi.join('\n'));
      setQuizOptionsEn(q.options.en.join('\n'));
      setBodyVi(q.explanation.vi);
      setBodyEn(q.explanation.en);
      setCorrectIndex(q.correctIndex);
      setDifficulty(q.difficulty);
      setQuizTopic(q.topic);
    }
  }, [collection, initialItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!titleVi.trim() || (!titleEn.trim() && collection !== 'artisans')) {
      setFormError(
        lang === 'vi'
          ? 'Vui lòng nhập đầy đủ tiêu đề / nội dung chính bằng cả tiếng Việt và tiếng Anh.'
          : 'Please complete the required Vietnamese and English title fields.'
      );
      return;
    }

    let payload: Record<string, unknown> = {};
    if (collection === 'articles') {
      if (!subVi.trim() || !subEn.trim() || !bodyVi.trim() || !bodyEn.trim()) {
        setFormError(lang === 'vi' ? 'Vui lòng nhập tóm tắt và nội dung song ngữ.' : 'Summary and content are required.');
        return;
      }
      payload = {
        title: { vi: titleVi.trim(), en: titleEn.trim() },
        summary: { vi: subVi.trim(), en: subEn.trim() },
        content: { vi: bodyVi.trim(), en: bodyEn.trim() },
        category,
        eraYear: eraYear.trim() || '2026',
        imageUrl,
      };
    } else if (collection === 'artisans') {
      if (!subVi.trim() || !subEn.trim() || !bodyVi.trim() || !bodyEn.trim()) {
        setFormError(lang === 'vi' ? 'Vui lòng nhập danh hiệu và tiểu sử song ngữ.' : 'Title and biography are required.');
        return;
      }
      payload = {
        name: titleVi.trim(),
        honorificTitle: { vi: subVi.trim(), en: subEn.trim() },
        specialty: {
          vi: extraVi.trim() || 'Dệt lụa truyền thống',
          en: extraEn.trim() || 'Traditional silk weaving',
        },
        biography: { vi: bodyVi.trim(), en: bodyEn.trim() },
        birthYear: Number(birthYear),
        yearsOfExperience: Number(yearsOfExperience),
        featured,
        portraitUrl: imageUrl,
      };
    } else if (collection === 'products') {
      if (!bodyVi.trim() || !bodyEn.trim()) {
        setFormError(lang === 'vi' ? 'Vui lòng nhập mô tả sản phẩm song ngữ.' : 'Product description is required.');
        return;
      }
      payload = {
        accessionCode: accessionCode.trim(),
        name: { vi: titleVi.trim(), en: titleEn.trim() },
        weaveType,
        dimensions: dimensions.trim(),
        motifMeaning: {
          vi: subVi.trim() || 'Hoa văn truyền thống Vạn Phúc',
          en: subEn.trim() || 'Traditional Vạn Phúc motif',
        },
        description: { vi: bodyVi.trim(), en: bodyEn.trim() },
        careGuide: {
          vi: extraVi.trim() || 'Giặt tay nước mát, phơi bóng râm.',
          en: extraEn.trim() || 'Hand wash cool, shade dry.',
        },
        imageUrl,
      };
    } else if (collection === 'processes') {
      if (!bodyVi.trim() || !bodyEn.trim()) {
        setFormError(lang === 'vi' ? 'Vui lòng nhập mô tả công đoạn song ngữ.' : 'Stage description is required.');
        return;
      }
      payload = {
        stepOrder: Number(stepOrder),
        title: { vi: titleVi.trim(), en: titleEn.trim() },
        subtitle: {
          vi: subVi.trim() || titleVi.trim(),
          en: subEn.trim() || titleEn.trim(),
        },
        description: { vi: bodyVi.trim(), en: bodyEn.trim() },
        artisanTip: {
          vi: extraVi.trim() || 'Thực hiện tỉ mỉ từng bước.',
          en: extraEn.trim() || 'Performed with care.',
        },
        imageUrl,
      };
    } else if (collection === 'challenges') {
      if (!bodyVi.trim() || !bodyEn.trim()) {
        setFormError(lang === 'vi' ? 'Vui lòng nhập mô tả thách thức song ngữ.' : 'Description is required.');
        return;
      }
      payload = {
        title: { vi: titleVi.trim(), en: titleEn.trim() },
        severity,
        category,
        impactMetric: {
          vi: subVi.trim() || 'Tác động trực tiếp đến làng nghề',
          en: subEn.trim() || 'Direct craft impact',
        },
        description: { vi: bodyVi.trim(), en: bodyEn.trim() },
        preservationSolution: {
          vi: extraVi.trim() || 'Hành động bảo tồn cộng đồng',
          en: extraEn.trim() || 'Community preservation action',
        },
      };
    } else if (collection === 'stories') {
      if (!bodyVi.trim() || !bodyEn.trim()) {
        setFormError(lang === 'vi' ? 'Vui lòng nhập nội dung câu chuyện song ngữ.' : 'Story body is required.');
        return;
      }
      payload = {
        title: { vi: titleVi.trim(), en: titleEn.trim() },
        narratorName: narratorName.trim() || 'Nghệ nhân Vạn Phúc',
        narratorRole: {
          vi: extraVi.trim() || 'Nghệ nhân làng nghề',
          en: extraEn.trim() || 'Village Master Weaver',
        },
        pullQuote: {
          vi: subVi.trim() || titleVi.trim(),
          en: subEn.trim() || titleEn.trim(),
        },
        excerpt: { vi: bodyVi.trim().slice(0, 140), en: bodyEn.trim().slice(0, 140) },
        body: { vi: bodyVi.trim(), en: bodyEn.trim() },
        coverUrl: imageUrl,
      };
    } else if (collection === 'events') {
      if (!subVi.trim() || !subEn.trim() || !bodyVi.trim() || !bodyEn.trim() || capacity < 1) {
        setFormError(lang === 'vi' ? 'Vui lòng nhập địa điểm, mô tả và sức chứa hợp lệ.' : 'Location, description, and valid capacity are required.');
        return;
      }
      payload = {
        title: { vi: titleVi.trim(), en: titleEn.trim() },
        location: { vi: subVi.trim(), en: subEn.trim() },
        description: { vi: bodyVi.trim(), en: bodyEn.trim() },
        eventType,
        startDate,
        capacity: Number(capacity),
      };
    } else if (collection === 'quiz') {
      const optsVi = quizOptionsVi.split('\n').map((s) => s.trim()).filter(Boolean);
      const optsEn = quizOptionsEn.split('\n').map((s) => s.trim()).filter(Boolean);
      if (optsVi.length < 2 || optsEn.length < 2 || !bodyVi.trim() || !bodyEn.trim()) {
        setFormError(
          lang === 'vi'
            ? 'Cần ít nhất 2 lựa chọn (mỗi dòng 1 đáp án) và phần giải thích song ngữ.'
            : 'Provide at least 2 options (one per line) and bilingual explanation.'
        );
        return;
      }
      payload = {
        question: { vi: titleVi.trim(), en: titleEn.trim() },
        options: { vi: optsVi, en: optsEn },
        correctIndex: Math.min(Number(correctIndex), optsVi.length - 1),
        explanation: { vi: bodyVi.trim(), en: bodyEn.trim() },
        difficulty,
        topic: quizTopic,
      };
    }

    setSaving(true);
    try {
      await onSave(payload, initialItem?._id);
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (lang === 'vi' ? 'Không thể lưu thay đổi.' : 'Unable to save record.');
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-[#DED6C8] bg-[#FBF9F5] p-6 lg:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-[#DED6C8] pb-4">
          <h2 className="font-display text-2xl font-semibold text-[#1C1917]">
            {isEditing
              ? lang === 'vi'
                ? `Chỉnh sửa (${collection})`
                : `Edit (${collection})`
              : lang === 'vi'
              ? `Tạo mới (${collection})`
              : `Create New (${collection})`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="rounded border border-[#DED6C8] p-2 hover:bg-[#EFEAE1]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {formError && (
          <div className="border border-[#9B231D] bg-[#9B231D]/5 p-3 text-xs text-[#9B231D]">
            {formError}
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Top metadata controls per collection */}
          {collection === 'articles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2">
                  <option value="history">History</option>
                  <option value="heritage">Heritage</option>
                  <option value="news">News</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Era / Year</label>
                <input type="text" value={eraYear} onChange={(e) => setEraYear(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
            </div>
          )}

          {collection === 'artisans' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Birth Year</label>
                <input type="number" value={birthYear} onChange={(e) => setBirthYear(Number(e.target.value))} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Years of Craft</label>
                <input type="number" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(Number(e.target.value))} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
              <div className="flex items-end pb-2">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                  <span>Featured on Home</span>
                </label>
              </div>
            </div>
          )}

          {collection === 'products' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Accession Code</label>
                <input type="text" value={accessionCode} onChange={(e) => setAccessionCode(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Weave Type</label>
                <select value={weaveType} onChange={(e) => setWeaveType(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2">
                  <option value="van">Lụa Vân</option>
                  <option value="the">Lụa The</option>
                  <option value="linh">Lụa Lĩnh</option>
                  <option value="gam">Gấm</option>
                  <option value="dui">Đũi</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Dimensions</label>
                <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
            </div>
          )}

          {collection === 'processes' && (
            <div>
              <label className="block font-medium text-[#57534E] mb-1">Step Order (1–20)</label>
              <input type="number" min={1} max={20} value={stepOrder} onChange={(e) => setStepOrder(Number(e.target.value))} className="w-32 rounded border border-[#DED6C8] bg-white px-3 py-2" />
            </div>
          )}

          {collection === 'challenges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Severity</label>
                <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2">
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="moderate">Moderate</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2">
                  <option value="succession">Succession</option>
                  <option value="economic">Economic</option>
                  <option value="supply">Supply</option>
                  <option value="environmental">Environmental</option>
                </select>
              </div>
            </div>
          )}

          {collection === 'stories' && (
            <div>
              <label className="block font-medium text-[#57534E] mb-1">Narrator Name</label>
              <input type="text" value={narratorName} onChange={(e) => setNarratorName(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
            </div>
          )}

          {collection === 'events' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Type</label>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2">
                  <option value="workshop">Workshop</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="tour">Tour</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Start Date & Time</label>
                <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Capacity</label>
                <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
            </div>
          )}

          {collection === 'quiz' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Topic</label>
                <select value={quizTopic} onChange={(e) => setQuizTopic(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2">
                  <option value="history">History</option>
                  <option value="weaving">Weaving</option>
                  <option value="motifs">Motifs</option>
                  <option value="preservation">Preservation</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Correct Option Index (0-based)</label>
                <input type="number" min={0} max={5} value={correctIndex} onChange={(e) => setCorrectIndex(Number(e.target.value))} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
            </div>
          )}

          {/* Primary Bilingual Title / Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#57534E] mb-1">
                {collection === 'artisans' ? 'Họ tên Nghệ nhân *' : 'Tiêu đề / Câu hỏi (VI) *'}
              </label>
              <input type="text" value={titleVi} onChange={(e) => setTitleVi(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
            </div>
            {collection !== 'artisans' && (
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Title / Question (EN) *</label>
                <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
            )}
          </div>

          {/* Subtitle / Summary / Options */}
          {collection === 'quiz' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Các lựa chọn (VI, mỗi dòng 1 đáp án) *</label>
                <textarea rows={4} value={quizOptionsVi} onChange={(e) => setQuizOptionsVi(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Options (EN, one per line) *</label>
                <textarea rows={4} value={quizOptionsEn} onChange={(e) => setQuizOptionsEn(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#57534E] mb-1">
                  {collection === 'events'
                    ? 'Địa điểm (VI) *'
                    : collection === 'artisans'
                    ? 'Danh hiệu (VI) *'
                    : 'Tóm tắt / Phụ đề (VI)'}
                </label>
                <input type="text" value={subVi} onChange={(e) => setSubVi(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">
                  {collection === 'events'
                    ? 'Location (EN) *'
                    : collection === 'artisans'
                    ? 'Honorific Title (EN) *'
                    : 'Summary / Subtitle (EN)'}
                </label>
                <input type="text" value={subEn} onChange={(e) => setSubEn(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
            </div>
          )}

          {/* Main Body / Description / Explanation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#57534E] mb-1">
                {collection === 'quiz' ? 'Giải thích đáp án (VI) *' : 'Nội dung / Mô tả (VI) *'}
              </label>
              <textarea rows={4} value={bodyVi} onChange={(e) => setBodyVi(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium text-[#57534E] mb-1">
                {collection === 'quiz' ? 'Explanation (EN) *' : 'Content / Description (EN) *'}
              </label>
              <textarea rows={4} value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
            </div>
          </div>

          {/* Extra Bilingual Field */}
          {['artisans', 'products', 'processes', 'challenges', 'stories'].includes(collection) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Thông tin bổ sung (VI)</label>
                <input type="text" value={extraVi} onChange={(e) => setExtraVi(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium text-[#57534E] mb-1">Supplementary Note (EN)</label>
                <input type="text" value={extraEn} onChange={(e) => setExtraEn(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2" />
              </div>
            </div>
          )}

          {/* Image Asset Picker */}
          {['articles', 'artisans', 'products', 'processes', 'stories'].includes(collection) && (
            <div>
              <label className="block font-medium text-[#57534E] mb-1">Heritage Image Asset</label>
              <select value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full rounded border border-[#DED6C8] bg-white px-3 py-2">
                {IMAGE_PRESETS.map((p) => (
                  <option key={p.url} value={p.url}>{p.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-[#DED6C8] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#DED6C8] bg-white px-4 py-2 text-xs font-medium text-[#1C1917]"
            >
              {lang === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-[#9B231D] px-5 py-2 text-xs font-medium text-[#FBF9F5] hover:bg-[#7E1B16]"
            >
              {saving ? '...' : lang === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
