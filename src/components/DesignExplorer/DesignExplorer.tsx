import React, { useState, useMemo } from 'react';
import { DesignTheme, SkinDefinition } from '../../types/skin';
import { CURATED_DESIGN_THEMES } from '../../data/curatedDesignThemes';
import { TexturePatternPreview } from '../TextureEngine/TexturePatternPreview';
import { KnobRenderer } from '../KnobRenderer/KnobRenderer';
import { SliderRenderer } from '../SliderRenderer/SliderRenderer';
import { Sparkles, Check, Copy, Search, ArrowUpRight } from 'lucide-react';

interface DesignExplorerProps {
  currentSkin: SkinDefinition;
  onApplyTheme: (theme: DesignTheme) => void;
  onAuditionOnRig: (theme: DesignTheme) => void;
}

const CATEGORIES = [
  'All',
  'Cyberpunk & High-Tech',
  'Japanese Traditional',
  'Vintage Console',
  'Aerospace & Industrial',
  'Acid & Neon Synthwave',
  'Boutique Minimal'
] as const;

export const DesignExplorer: React.FC<DesignExplorerProps> = ({
  currentSkin,
  onApplyTheme,
  onAuditionOnRig
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [interactiveKnobVals, setInteractiveKnobVals] = useState<Record<string, number>>({});
  const [interactiveSliderVals, setInteractiveSliderVals] = useState<Record<string, number>>({});

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const filteredThemes = useMemo(() => {
    let list = CURATED_DESIGN_THEMES;
    if (selectedCategory !== 'All') {
      list = list.filter((t) => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.mood.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredThemes.length / itemsPerPage);
  const paginatedThemes = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredThemes.slice(start, start + itemsPerPage);
  }, [filteredThemes, page, itemsPerPage]);

  const handleApply = (theme: DesignTheme) => {
    onApplyTheme(theme);
    setAppliedId(theme.id);
    setTimeout(() => setAppliedId(null), 2200);
  };

  const handleCopyCode = (theme: DesignTheme) => {
    const code = `// Curated Design Theme: ${theme.name}`;
    navigator.clipboard.writeText(code);
    setCopiedId(theme.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Curated Stylistic Design Themes
              </h2>
              <span className="text-[11px] text-cyan-300 font-mono">
                Unified Visual Sets (Texture + Knob + Slider + LFO)
              </span>
            </div>
          </div>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-300 hover:text-white border border-white/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedThemes.map((theme) => {
          const isCurrent =
            currentSkin.patternType === theme.texture.patternType ||
            currentSkin.name.toLowerCase().includes(theme.name.toLowerCase());
          const knobVal = interactiveKnobVals[theme.id] ?? 0.65;
          const sliderVal = interactiveSliderVals[theme.id] ?? 0.5;

          return (
            <div
              key={theme.id}
              className={`rounded-2xl border bg-slate-900/60 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-all shadow-xl group hover:shadow-2xl ${
                isCurrent
                  ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-cyan-500/15'
                  : 'border-white/20 hover:border-white/35'
              }`}
            >
              <div className="relative h-48 w-full border-b border-white/15 overflow-hidden flex items-center justify-between p-4">
                <div className="absolute inset-0 pointer-events-none opacity-85">
                  <TexturePatternPreview archetype={theme.texture} height={192} />
                </div>

                <div className="relative z-10 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 shadow-2xl flex flex-col items-center">
                  <span className="text-[9px] font-mono text-white mb-1 uppercase tracking-wider">
                    {theme.knob.style}
                  </span>
                  <KnobRenderer
                    value={knobVal}
                    min={0}
                    max={100}
                    size={theme.customization.knobSize ?? 68}
                    skin={{
                      id: 9999,
                      name: theme.name,
                      category: 'Wada Sanzo Classic',
                      panelDark: theme.skin.panelDark ?? '#10141D',
                      panelDarker: theme.skin.panelDarker ?? '#080A0D',
                      cream: theme.skin.cream ?? '#E0E2E6',
                      amber: theme.accentColor,
                      ledRed: theme.skin.ledRed ?? '#E63946',
                      ledOff: '#20181A',
                      knobStyle: theme.knob.style,
                      panelTexture: theme.texture.baseModel,
                      decorativeDots: false
                    }}
                    knobStyleOverride={theme.knob.style}
                    customSize={theme.customization.knobSize}
                    customGlow={theme.knob.glowIntensity}
                    customBodyColor={theme.knob.bodyColor}
                    customAccentColor={theme.knob.accentColor}
                    customPointerColor={theme.knob.pointerColor}
                    onChange={(nv) =>
                      setInteractiveKnobVals((prev) => ({ ...prev, [theme.id]: nv }))
                    }
                  />
                  <span className="text-[8px] font-mono text-slate-400 mt-1">
                    {Math.round(knobVal)}%
                  </span>
                </div>

                <div className="relative z-10 flex-1 ml-4 flex flex-col gap-3">
                  <div className="p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 shadow-2xl flex flex-col">
                    <SliderRenderer
                      value={sliderVal}
                      onChange={(nv) =>
                        setInteractiveSliderVals((prev) => ({ ...prev, [theme.id]: nv }))
                      }
                      customTrackStyle={theme.slider.trackStyle}
                      customThumbStyle={theme.slider.thumbStyle}
                      customTrackHeight={theme.slider.trackHeight}
                      customThumbWidth={theme.slider.thumbWidth}
                      customThumbHeight={theme.slider.thumbHeight}
                      customTrackColor={theme.slider.trackColor}
                      customThumbColor={theme.slider.thumbColor}
                      customAccentColor={theme.slider.accentColor}
                      customGlow={theme.slider.glowIntensity}
                    />
                  </div>
                </div>

                {isCurrent && (
                  <div className="absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[9px] font-mono shadow-lg flex items-center gap-1">
                    <Check className="w-3 h-3" /> ACTIVE ON RIG
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col gap-3 justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {theme.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => handleApply(theme)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${
                      appliedId === theme.id
                        ? 'bg-emerald-500 text-black'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {appliedId === theme.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Applied!
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Apply Theme
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onAuditionOnRig(theme)}
                    className="py-2 px-3 rounded-xl bg-black/40 hover:bg-white/10 text-slate-200 border border-white/20 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Audition</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(theme)}
                    className="p-2 rounded-xl bg-black/40 hover:bg-white/10 text-slate-400 hover:text-white border border-white/20 transition-colors cursor-pointer"
                  >
                    {copiedId === theme.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
