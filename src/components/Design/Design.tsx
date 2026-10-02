import React, { useState, useMemo } from 'react';
import {
  DesignTheme,
  SkinDefinition
} from '../../types/skin';
import { CURATED_DESIGN_THEMES } from '../../data/curatedDesignThemes';
import {
  PROCEDURAL_DESIGN_THEMES_1000,
  generateProceduralTheme
} from '../../services/proceduralThemeEngine';
import { useAmorphPatchConnection } from '../../services/amorphPatchConnection';
import { TexturePatternPreview } from '../TextureEngine/TexturePatternPreview';
import { KnobRenderer } from '../KnobRenderer/KnobRenderer';
import { SliderRenderer } from '../SliderRenderer/SliderRenderer';
import {
  Sparkles,
  Check,
  Copy,
  Search,
  Eye,
  ArrowUpRight,
  Shuffle,
  Layers,
  Activity,
  SlidersHorizontal,
  Palette,
  Terminal,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Radio,
  Sliders as SlidersIcon,
  RefreshCw
} from 'lucide-react';

interface DesignProps {
  currentSkin: SkinDefinition;
  onApplyTheme: (theme: DesignTheme) => void;
  onAuditionOnRig: (theme: DesignTheme) => void;
  onOpenCustomizer?: () => void;
}

const CATEGORIES = [
  'All',
  'New 1,000 Shaders & Shapes',
  'Shader Topography & Meshes',
  'Book of Shapes Algorithmic',
  'Shaders.com Visual FX',
  'Fffuel Generative Vectors',
  'Kinetic Chromatic Waveforms',
  'Cyberpunk & High-Tech',
  'Japanese Traditional',
  'Vintage Console',
  'Aerospace & Industrial',
  'Acid & Neon Synthwave',
  'Boutique Minimal',
  'Analog Vacuum Tube',
  'Deep Topographic Layer',
  'Pop Art Halftone',
  'Holographic Specular'
] as const;

export const Design: React.FC<DesignProps> = ({
  currentSkin,
  onApplyTheme,
  onAuditionOnRig,
  onOpenCustomizer
}) => {
  const [viewMode, setViewMode] = useState<'curated' | 'matrix1000' | 'seedLab'>('curated');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [interactiveKnobVals, setInteractiveKnobVals] = useState<Record<string, number>>({});
  const [interactiveSliderVals, setInteractiveSliderVals] = useState<Record<string, number>>({});
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const [customSeedInput, setCustomSeedInput] = useState('amorph-vst-909');
  const [labSeedTheme, setLabSeedTheme] = useState<DesignTheme>(() =>
    generateProceduralTheme('amorph-vst-909')
  );

  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const { isRealHost, sendThemePreset, sendThemeSeed } =
    useAmorphPatchConnection();

  const activeThemesSource = useMemo(() => {
    return viewMode === 'curated' ? CURATED_DESIGN_THEMES : PROCEDURAL_DESIGN_THEMES_1000;
  }, [viewMode]);

  const filteredThemes = useMemo(() => {
    let list = activeThemesSource;
    if (selectedCategory === 'New 1,000 Shaders & Shapes') {
      list = list.filter((t) => t.tags.includes('NewPresets') || t.tags.includes('New300') || (typeof t.skin.id === 'number' && t.skin.id > 3000));
    } else if (selectedCategory !== 'All') {
      list = list.filter((t) => t.category === selectedCategory);
    }
    if (selectedTag) {
      list = list.filter((t) => t.tags.includes(selectedTag));
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
  }, [activeThemesSource, selectedCategory, selectedTag, searchQuery]);

  const totalPages = Math.ceil(filteredThemes.length / itemsPerPage);
  const paginatedThemes = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredThemes.slice(start, start + itemsPerPage);
  }, [filteredThemes, page, itemsPerPage]);

  const handleApply = (theme: DesignTheme, index?: number) => {
    onApplyTheme(theme);
    setAppliedId(theme.id);

    const themeIndex = typeof index === 'number' ? index + 1 : (typeof theme.skin.id === 'number' ? theme.skin.id : 1);
    sendThemePreset(themeIndex);
    sendThemeSeed(theme.id);

    setTimeout(() => setAppliedId(null), 2200);
  };

  const handleCopyCode = (theme: DesignTheme) => {
    const code = `// Curated Theme: ${theme.name}
namespace DelayHost::Themes
{
    inline constexpr ThemeBundle ${theme.id.replace(/-/g, '_')} = {
        .themeName = "${theme.name}",
        .texturePattern = "${theme.texture.patternType}",
        .panelBase = "${theme.skin.panelDark}",
        .accentGlow = "${theme.accentColor}"
    };
}`;
    navigator.clipboard.writeText(code);
    setCopiedId(theme.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRandomTheme = () => {
    const source = activeThemesSource;
    const randomIndex = Math.floor(Math.random() * source.length);
    const theme = source[randomIndex];
    handleApply(theme, randomIndex);
  };

  const handleGenerateLabSeed = () => {
    const seed = customSeedInput.trim() || `seed-${Date.now().toString(36)}`;
    const generated = generateProceduralTheme(seed);
    setLabSeedTheme(generated);
  };

  const handleRandomizeLabSeed = () => {
    const prefixes = ['quantum', 'tachyon', 'obsidian', 'sumi', 'titanium', 'cyber', 'solar', 'velvet'];
    const nouns = ['foundry', 'resonance', 'fader', 'matrix', 'core', 'horizon', 'pulse', 'lattice'];
    const num = Math.floor(Math.random() * 999) + 1;
    const newSeed = `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}-${num}`;
    setCustomSeedInput(newSeed);
    const generated = generateProceduralTheme(newSeed);
    setLabSeedTheme(generated);
  };

  const popularTags = useMemo(() => {
    const set = new Set<string>();
    activeThemesSource.slice(0, 80).forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).slice(0, 10);
  }, [activeThemesSource]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header Banner & Diagnostics Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zinc-900/95 via-[#131720] to-zinc-900/95 border border-zinc-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Procedural Design Theme Studio
              </h2>
              <span className="text-[11px] text-cyan-300 font-mono flex items-center gap-1.5">
                <span>Amorph VST & Cmajor Engine</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400">
                  {isRealHost ? 'Live Cmajor Host Connected' : 'Virtual Amorph patchConnection Active'}
                </span>
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Generative control-skin system combining 4 independent variation axes (Texture/Material Pattern, Knob Geometry + Finish, Slider Track/Handle, and LFO CRT Oscilloscope) with zero duplicate results.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="px-3.5 py-2 bg-cyan-950/70 hover:bg-cyan-900/90 border border-cyan-400/40 text-cyan-300 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Architecture</span>
            {showDiagnostics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleRandomTheme}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-slate-200 text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Random Theme</span>
          </button>

          {onOpenCustomizer && (
            <button
              type="button"
              onClick={onOpenCustomizer}
              className="px-3.5 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Fine-Tune Geometry</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Variance & Procedural Architecture Deep-Dive */}
      {showDiagnostics && (
        <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-cyan-400/30 shadow-2xl flex flex-col gap-4 text-xs">
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">
                Procedural Variance Diagnostics & Cmajor Engine Architecture
              </h3>
            </div>
            <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-lg border border-cyan-800">
              Deterministic Seeded PRNG · SplitMix32 + Mulberry32
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Palette className="w-3.5 h-3.5" />
                <span>Axis 1: Texture & Material</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                30+ procedural algorithms (Damascus Steel, Seigaiha, PCB traces, Honeycomb, Treadplate) with roughness, contrast, and flow vectors.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Radio className="w-3.5 h-3.5" />
                <span>Axis 2: Knob Geometry + Finish</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                13 rotary geometries, including Orbital Encoder, Prism Rotor, and Concentric Console, with calibrated tick counts and glow control.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <SlidersIcon className="w-3.5 h-3.5" />
                <span>Axis 3: Slider Architecture</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                7 track topologies × 8 handle styles (brushed metal, glowing pill, bakelite, knurled slug, laser dot).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Activity className="w-3.5 h-3.5" />
                <span>Axis 4: LFO CRT Scope</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                7 display graticules + phosphor decay chemistries (P1 Green, P3 Amber, Cyan CRT, Violet Plasma) with beam bloom.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Navigation View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-xl p-2 rounded-2xl border border-white/20">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setViewMode('curated');
              setPage(1);
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'curated'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <span>⭐ Curated Flagships</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
              {CURATED_DESIGN_THEMES.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('matrix1000');
              setPage(1);
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'matrix1000'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <span>⚡ 3,000 Procedural Matrix</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
              3,000
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('seedLab')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              viewMode === 'seedLab'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <span>🧪 Seed Lab</span>
          </button>
        </div>

        {viewMode !== 'seedLab' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={`Search ${activeThemesSource.length} themes...`}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        )}
      </div>

      {/* 4. Curated / Matrix Theme Grid Showcase */}
      {viewMode !== 'seedLab' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedThemes.map((theme, idx) => {
            const isCurrent = currentSkin.name.includes(theme.name);
            const knobVal = interactiveKnobVals[theme.id] ?? 0.65;
            const sliderVal = interactiveSliderVals[theme.id] ?? 0.55;
            const globalIndex = (page - 1) * itemsPerPage + idx;

            return (
              <div
                key={theme.id}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-2xl bg-slate-900/60 backdrop-blur-xl ${
                  isCurrent
                    ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                    : 'border-white/20 hover:border-white/35 hover:shadow-2xl'
                }`}
              >
                <div className="p-4 sm:p-5 border-b border-white/10 flex items-start justify-between gap-3 bg-black/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {theme.name}
                      </h3>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                          ACTIVE ON RIG
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-cyan-400 font-mono mt-0.5">
                      {theme.category} · <span className="text-slate-400">{theme.mood}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-black/60 rounded-xl border border-white/15 shadow-inner">
                    <div
                      className="w-4 h-4 rounded-lg shadow-sm"
                      style={{ backgroundColor: theme.skin.panelDark }}
                      title={`Chassis Base: ${theme.skin.panelDark}`}
                    />
                    <div
                      className="w-4 h-4 rounded-lg shadow-sm"
                      style={{ backgroundColor: theme.skin.panelDarker }}
                      title={`Chassis Secondary: ${theme.skin.panelDarker}`}
                    />
                    <div
                      className="w-4 h-4 rounded-lg shadow-sm"
                      style={{ backgroundColor: theme.accentColor }}
                      title={`Glow Accent: ${theme.accentColor}`}
                    />
                    <div
                      className="w-4 h-4 rounded-lg shadow-sm"
                      style={{ backgroundColor: theme.knob.pointerColor }}
                      title={`Indicator Tip: ${theme.knob.pointerColor}`}
                    />
                  </div>
                </div>

                <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 flex flex-col gap-2">
                    <div className="h-28 w-full rounded-xl overflow-hidden border border-white/15 relative shadow-inner">
                      <TexturePatternPreview archetype={theme.texture} height={112} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-300 z-10">
                        <span className="truncate">{theme.texture.patternType.replace(/-/g, ' ')}</span>
                        <span className="text-cyan-400">{theme.texture.baseModel}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 font-mono">
                      Texture: {theme.texture.name}
                    </div>
                  </div>

                  <div className="sm:col-span-3 flex flex-col items-center justify-center p-2 rounded-xl bg-black/40 border border-white/10">
                    <div className="w-[74px] h-[74px] flex items-center justify-center">
                      <KnobRenderer
                        value={knobVal}
                        onChange={(v) =>
                          setInteractiveKnobVals((prev) => ({ ...prev, [theme.id]: v }))
                        }
                        skin={{
                          ...currentSkin,
                          knobStyle: theme.knob.style,
                          panelDark: theme.skin.panelDark || currentSkin.panelDark,
                          amber: theme.knob.accentColor,
                          ledRed: theme.knob.pointerColor,
                          cream: theme.knob.bodyColor
                        }}
                        knobStyleOverride={theme.knob.style}
                        size={66}
                        customBodyColor={theme.knob.bodyColor}
                        customAccentColor={theme.knob.accentColor}
                        customPointerColor={theme.knob.pointerColor}
                        customGlow={theme.knob.glowIntensity}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-white mt-1 text-center truncate max-w-full">
                      {theme.knob.style}
                    </div>
                  </div>

                  <div className="sm:col-span-4 flex flex-col gap-2.5">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="truncate">{theme.slider.trackStyle}</span>
                        <span className="text-slate-400">{(sliderVal * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-7 flex items-center justify-center">
                        <SliderRenderer
                          preset={theme.slider}
                          value={sliderVal}
                          onChange={(v) =>
                            setInteractiveSliderVals((prev) => ({ ...prev, [theme.id]: v }))
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

                    <div
                      className="p-1.5 rounded-xl border flex items-center justify-between gap-2 bg-black/60"
                      style={{ borderColor: `${theme.lfo.phosphorColor}40` }}
                    >
                      <div className="flex items-center gap-1.5">
                        <Activity
                          className="w-3.5 h-3.5"
                          style={{ color: theme.lfo.phosphorColor }}
                        />
                        <span
                          className="text-[10px] font-mono font-bold truncate max-w-[85px]"
                          style={{ color: theme.lfo.phosphorColor }}
                        >
                          {theme.lfo.gridStyle}
                        </span>
                      </div>
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-ping"
                        style={{ backgroundColor: theme.lfo.phosphorColor }}
                      />
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {theme.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {theme.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/40 border border-white/10 text-slate-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-3 border-t border-white/10 bg-black/40 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApply(theme, globalIndex)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                      appliedId === theme.id
                        ? 'bg-emerald-500 text-black'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {appliedId === theme.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Applied to VST!
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Apply Coherent Set
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onAuditionOnRig(theme)}
                    className="py-2 px-3 rounded-xl text-xs font-medium bg-black/50 hover:bg-white/10 text-slate-200 border border-white/20 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Audition</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(theme)}
                    className="py-2 px-2.5 rounded-xl text-xs font-mono bg-black/50 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/20 transition-colors cursor-pointer"
                  >
                    {copiedId === theme.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {viewMode !== 'seedLab' && totalPages > 1 && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/20 text-xs">
          <span className="text-slate-300 font-mono">
            Showing {((page - 1) * itemsPerPage) + 1}–{Math.min(page * itemsPerPage, filteredThemes.length)} of {filteredThemes.length} presets
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3.5 py-1.5 rounded-xl bg-black/40 disabled:opacity-30 border border-white/20 hover:bg-white/10 text-white cursor-pointer"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 font-mono text-cyan-400 font-bold">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3.5 py-1.5 rounded-xl bg-black/40 disabled:opacity-30 border border-white/20 hover:bg-white/10 text-white cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
