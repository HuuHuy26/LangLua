import { Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

type MotifKey = 'song-hac' | 'chu-tho' | 'hoa-cuc';
type DyePaletteKey = 'crimson' | 'ivory' | 'indigo' | 'yam';

const PALETTES: Record<DyePaletteKey, { vi: string; en: string; warp: string; weft: string; motif: string }> = {
  crimson: {
    vi: 'Đỏ Cánh Kiến',
    en: 'Sticklac Crimson',
    warp: '#7E1B16',
    weft: '#9B231D',
    motif: '#E8D5B5',
  },
  ivory: {
    vi: 'Kem Tơ Mộc',
    en: 'Raw Ivory Silk',
    warp: '#EFEAE1',
    weft: '#F7F3EA',
    motif: '#8C6239',
  },
  indigo: {
    vi: 'Chàm Cổ Truyền',
    en: 'Heritage Indigo',
    warp: '#1E293B',
    weft: '#2D3E58',
    motif: '#E2D9C8',
  },
  yam: {
    vi: 'Nâu Củ Nâu',
    en: 'Yam-Root Bronze',
    warp: '#5C4028',
    weft: '#7A5435',
    motif: '#F3E9D2',
  },
};

const MOTIFS: Array<{ key: MotifKey; vi: string; en: string; descVi: string; descEn: string }> = [
  {
    key: 'song-hac',
    vi: 'Song Hạc',
    en: 'Twin Cranes',
    descVi: 'Hoa văn đối xứng biểu trưng cho trường thọ và thanh cao.',
    descEn: 'Symmetrical motif expressing longevity and noble grace.',
  },
  {
    key: 'chu-tho',
    vi: 'Chữ Thọ Triện',
    en: 'Longevity Seal',
    descVi: 'Kết cấu hình học cổ điển thường dệt trên lụa The.',
    descEn: 'Classical geometric seal commonly woven on sheer The silk.',
  },
  {
    key: 'hoa-cuc',
    vi: 'Cúc Dây Liên Hoàn',
    en: 'Chrysanthemum Vine',
    descVi: 'Mạng sợi uốn lượn liên tiếp biểu đạt sự kế thừa bền vững.',
    descEn: 'Interlocking tendrils symbolizing unbroken craft continuity.',
  },
];

function isMotifCell(motif: MotifKey, r: number, c: number, rows: number, cols: number): boolean {
  const nr = r / rows;
  const nc = c / cols;
  const dr = Math.abs(nr - 0.5);
  const dc = Math.abs(nc - 0.5);

  if (motif === 'chu-tho') {
    const ring1 = Math.max(dr, dc);
    const cross = (dr < 0.07 && dc < 0.36) || (dc < 0.07 && dr < 0.36);
    const frame = (ring1 > 0.34 && ring1 < 0.42) || (ring1 > 0.16 && ring1 < 0.23);
    return cross || frame;
  }
  if (motif === 'song-hac') {
    const wing = Math.abs(dr * 1.4 - dc) < 0.08 && dc < 0.38;
    const diamond = dr + dc < 0.28 && dr + dc > 0.14;
    const corners = dr > 0.32 && dc > 0.32;
    return wing || diamond || corners;
  }
  // hoa-cuc
  const dist = Math.sqrt(dr * dr + dc * dc);
  const angle = Math.atan2(nr - 0.5, nc - 0.5);
  const petal = Math.abs(Math.cos(angle * 4)) * 0.2 + 0.18;
  return (dist < petal && dist > 0.09) || dist < 0.06;
}

export function LoomSimulator() {
  const { lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [motif, setMotif] = useState<MotifKey>('song-hac');
  const [paletteKey, setPaletteKey] = useState<DyePaletteKey>('crimson');
  const [density, setDensity] = useState<number>(32);
  const [wovenRows, setWovenRows] = useState<number>(20);
  const [isWeaving, setIsWeaving] = useState<boolean>(false);

  const palette = PALETTES[paletteKey];
  const activeMotif = MOTIFS.find((m) => m.key === motif) || MOTIFS[0];

  useEffect(() => {
    if (!isWeaving) return;
    const timer = window.setInterval(() => {
      setWovenRows((prev) => {
        if (prev >= density) {
          setIsWeaving(false);
          return density;
        }
        return prev + 1;
      });
    }, 55);
    return () => window.clearInterval(timer);
  }, [isWeaving, density]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#EFEAE1';
    ctx.fillRect(0, 0, width, height);

    const cols = density;
    const rows = density;
    const cellW = width / cols;
    const cellH = height / rows;

    // Draw unwoven warp threads vertically across entire loom
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = palette.warp;
      ctx.globalAlpha = 0.25;
      ctx.fillRect(c * cellW + cellW * 0.3, 0, Math.max(1.5, cellW * 0.4), height);
    }
    ctx.globalAlpha = 1;

    // Draw woven rows up to wovenRows
    const activeRows = Math.min(wovenRows, rows);
    for (let r = 0; r < activeRows; r++) {
      for (let c = 0; c < cols; c++) {
        const isPattern = isMotifCell(motif, r, c, rows, cols);
        const checker = (r + c) % 2 === 0;
        if (isPattern) {
          ctx.fillStyle = palette.motif;
          ctx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
        } else {
          ctx.fillStyle = checker ? palette.weft : palette.warp;
          ctx.fillRect(c * cellW, r * cellH, cellW - 0.5, cellH - 0.5);
        }
      }
    }

    // Active shuttle line indicator
    if (activeRows < rows) {
      const y = activeRows * cellH;
      ctx.fillStyle = '#8C6239';
      ctx.fillRect(0, y, width, 3);
    }
  }, [motif, palette, density, wovenRows]);

  const handleThrowShuttle = () => {
    if (wovenRows >= density) {
      setWovenRows(0);
    }
    setIsWeaving(true);
  };

  const handleReset = () => {
    setIsWeaving(false);
    setWovenRows(0);
  };

  return (
    <div className="border border-[#DED6C8] bg-white p-6 lg:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#DED6C8] pb-4">
        <div>
          <p className="text-xs font-medium tracking-wider text-[#8C6239]">
            {lang === 'vi' ? 'Mô phỏng Khung cửi Jacquard' : 'Interactive Jacquard Loom Simulator'}
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-[#1C1917]">
            {lang === 'vi' ? 'Thử nghiệm Đan sợi & Hoa văn Lụa Vân' : 'Test Warp–Weft Density & Vân Silk Motifs'}
          </h3>
        </div>
        <div className="font-mono text-xs text-[#57534E] tabular-nums">
          {wovenRows}/{density} {lang === 'vi' ? 'nhịp thoi' : 'shuttle passes'}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div>
            <p className="mb-2 text-xs font-medium text-[#57534E]">
              {lang === 'vi' ? '1. Chọn hoa văn bìa đục lỗ' : '1. Select Punched Card Motif'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {MOTIFS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMotif(m.key)}
                  className={`px-3 py-2.5 text-left text-xs font-medium border transition-colors ${
                    motif === m.key
                      ? 'border-[#9B231D] bg-[#9B231D] text-[#FBF9F5]'
                      : 'border-[#DED6C8] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#EFEAE1]'
                  }`}
                >
                  {lang === 'vi' ? m.vi : m.en}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[#57534E]">
              {lang === 'vi' ? activeMotif.descVi : activeMotif.descEn}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-[#57534E]">
              {lang === 'vi' ? '2. Chọn bảng màu nhuộm tự nhiên' : '2. Select Botanical Dye Bath'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PALETTES) as DyePaletteKey[]).map((key) => {
                const p = PALETTES[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPaletteKey(key)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium border transition-colors ${
                      paletteKey === key
                        ? 'border-[#1C1917] bg-[#EFEAE1] text-[#1C1917]'
                        : 'border-[#DED6C8] bg-white text-[#57534E] hover:bg-[#FBF9F5]'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 shrink-0 border border-black/15"
                      style={{ backgroundColor: p.weft }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{lang === 'vi' ? p.vi : p.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <label htmlFor="loom-density" className="font-medium text-[#57534E]">
                {lang === 'vi' ? '3. Mật độ sợi dọc / ngang' : '3. Warp & Weft Thread Density'}
              </label>
              <span className="font-mono text-[#1C1917] tabular-nums">{density} × {density}</span>
            </div>
            <input
              id="loom-density"
              type="range"
              min={20}
              max={44}
              step={4}
              value={density}
              onChange={(e) => {
                const next = Number(e.target.value);
                setDensity(next);
                setWovenRows((prev) => Math.min(prev, next));
              }}
              className="w-full accent-[#9B231D]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleThrowShuttle}
              className="inline-flex items-center gap-2 rounded-md bg-[#9B231D] px-5 py-2.5 text-sm font-medium text-[#FBF9F5] transition-colors hover:bg-[#7E1B16] whitespace-nowrap shrink-0"
            >
              <Play className="h-4 w-4" />
              {wovenRows >= density
                ? lang === 'vi'
                  ? 'Dệt lại tấm mới'
                  : 'Weave New Bolt'
                : isWeaving
                ? lang === 'vi'
                  ? 'Đang phóng thoi...'
                  : 'Weaving...'
                : lang === 'vi'
                ? 'Phóng thoi dệt thử'
                : 'Throw Shuttle'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-md border border-[#DED6C8] bg-[#FBF9F5] px-4 py-2.5 text-sm font-medium text-[#1C1917] transition-colors hover:bg-[#EFEAE1] whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
              {lang === 'vi' ? 'Đặt lại khung' : 'Reset Loom'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[360px] border border-[#DED6C8] bg-[#FBF9F5] p-3">
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              className="w-full h-auto block border border-[#DED6C8]"
            />
          </div>
          <p className="mt-2.5 text-center font-display text-xs italic text-[#57534E]">
            {lang === 'vi'
              ? `Mô phỏng mặt vải ${activeMotif.vi} · Màu ${palette.vi}`
              : `Simulated ${activeMotif.en} weave · ${palette.en}`}
          </p>
        </div>
      </div>
    </div>
  );
}
