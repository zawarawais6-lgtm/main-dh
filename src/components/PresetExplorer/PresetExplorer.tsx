import React, { useState, useMemo } from 'react';
import { SkinDefinition, KnobStyle, PanelTexture, PresetCategory } from '../../types/skin';
import { PRESETS_1000 } from '../../data/presets1000';
import { KnobRenderer } from '../KnobRenderer/KnobRenderer';

interface PresetExplorerProps {
  currentSkin: SkinDefinition;
  onSelectSkin: (skin: SkinDefinition) => void;
  onInspectSkin: (skin: SkinDefinition) => void;
}

export const PresetExplorer: React.FC<PresetExplorerProps> = ({
  currentSkin,
  onSelectSkin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTexture, setSelectedTexture] = useState<string>('All');
  const [selectedKnobStyle, setSelectedKnobStyle] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  const CATEGORIES: (PresetCategory | 'All' | '🔥 New 1,000 Shaders & Shapes')[] = [
    'All',
    '🔥 New 1,000 Shaders & Shapes',
    'Shader Topography & Meshes',
    'Book of Shapes Algorithmic',
    'Shaders.com Visual FX',
    'Fffuel Generative Vectors',
    'Kinetic Chromatic Waveforms',
    'Wada Sanzo Classic',
    'Liquid Gritty',
    'Cyber HUD',
    'Deep Layers',
    'Futuristic Neon',
    'Dark Grit',
    'Pop Halftone',
    'Studio Minimal',
    'Vintage Brass',
    'Holographic Vapor'
  ];

  const TEXTURE_OPTIONS: (PanelTexture | 'All')[] = [
    'All',
    'ShaderTopography',
    'FlowPoles',
    'SpiralMorph',
    'ShiftedSwirls',
    'VibrantWaves',
    'HolographicWaves',
    'GrittyTexture',
    'LiquidGrainGradient',
    'DeepLayers',
    'DarkGrainyGrit',
    'HalftoneDotPattern',
    'BrushedMetal',
    'GridOverlay',
    'CyberCircuit',
    'SolarizedFilm',
    'FlatMatte',
    'CarbonFiber',
    'MarbleStone',
    'HolographicFoil',
    'CRTPhosphor',
    'SteampunkBrass'
  ];

  const KNOB_OPTIONS: (KnobStyle | 'All')[] = [
    'All',
    'ChunkyPointer',
    'ArcIndicator',
    'BoldBlock',
    'CyberRing',
    'LiquidGauge',
    'SteppedWedge',
    'GroovedCap',
    'NeonRim',
    'MinimalDot',
    'VintageFluted',
    'OrbitalEncoder',
    'PrismRotor',
    'ConcentricConsole'
  ];

  const filteredPresets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return PRESETS_1000.filter((preset) => {
      if (selectedCategory === '🔥 New 1,000 Shaders & Shapes') {
        if (preset.id <= 3000) return false;
      } else if (selectedCategory !== 'All' && preset.category !== selectedCategory) {
        return false;
      }
      if (selectedTexture !== 'All' && preset.panelTexture !== selectedTexture) {
        return false;
      }
      if (selectedKnobStyle !== 'All' && preset.knobStyle !== selectedKnobStyle) {
        return false;
      }
      if (q) {
        const matchesName = preset.name.toLowerCase().includes(q);
        const matchesId = String(preset.id).includes(q) || `#${preset.id}`.includes(q);
        const matchesCat = preset.category.toLowerCase().includes(q);
        const matchesTexture = preset.panelTexture.toLowerCase().includes(q);
        const matchesKnob = preset.knobStyle.toLowerCase().includes(q);
        return matchesName || matchesId || matchesCat || matchesTexture || matchesKnob;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedTexture, selectedKnobStyle]);

  const totalPages = Math.ceil(filteredPresets.length / itemsPerPage);
  const paginatedPresets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPresets.slice(start, start + itemsPerPage);
  }, [filteredPresets, currentPage, itemsPerPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Category Filter Section */}
      <div className="p-4 bg-[#141820] border border-white/10 rounded-xl flex flex-col gap-3 shadow-md">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-[240px] relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search 3,000 presets by name, ID (#0042), palette, texture, or knob..."
              className="w-full pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
              🔍
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <select
              value={selectedTexture}
              onChange={(e) => {
                setSelectedTexture(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-black/50 border border-white/20 rounded-xl text-slate-200 cursor-pointer outline-none"
            >
              <option value="All">All Textures</option>
              {TEXTURE_OPTIONS.filter((t) => t !== 'All').map((t) => (
                <option key={t} value={t}>
                  {t.replace(/([A-Z])/g, ' $1').trim()}
                </option>
              ))}
            </select>

            <select
              value={selectedKnobStyle}
              onChange={(e) => {
                setSelectedKnobStyle(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-black/50 border border-white/20 rounded-xl text-slate-200 cursor-pointer outline-none"
            >
              <option value="All">All Knobs</option>
              {KNOB_OPTIONS.filter((k) => k !== 'All').map((k) => (
                <option key={k} value={k}>
                  {k.replace(/([A-Z])/g, ' $1').trim()}
                </option>
              ))}
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-black/50 border border-white/20 rounded-xl text-slate-300 cursor-pointer outline-none"
            >
              <option value={24}>24 / page</option>
              <option value={48}>48 / page</option>
              <option value={96}>96 / page</option>
            </select>

            <div className="text-[11px] text-slate-300 px-2.5 py-1.5 bg-white/10 rounded-xl border border-white/20 font-mono">
              <span className="font-bold text-cyan-300">{filteredPresets.length}</span> / {PRESETS_1000.length} Presets
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer text-[11px] ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-black/40 text-slate-300 hover:text-white hover:bg-white/10 border border-white/15'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {paginatedPresets.map((preset) => {
          const isCurrent = currentSkin.id === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onSelectSkin(preset)}
              className={`p-3 rounded-xl border flex flex-col justify-between gap-2.5 transition-all cursor-pointer relative group ${
                isCurrent
                  ? 'border-cyan-400 bg-[#1A1F2B] ring-2 ring-cyan-400/40 shadow-xl'
                  : 'border-white/5 bg-[#12161F] hover:border-white/20 hover:bg-[#161B26]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-slate-400 group-hover:text-slate-200">
                  #{String(preset.id).padStart(4, '0')}
                </span>
                {isCurrent && (
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>

              {/* Mini Interactive Knob Preview with this skin */}
              <div className="flex justify-center py-1">
                <div
                  className="p-2 rounded-xl border shadow-inner flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: preset.panelDark,
                    borderColor: `${preset.amber}40`
                  }}
                >
                  <KnobRenderer
                    value={0.65}
                    size={46}
                    skin={preset}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-xs text-white truncate" title={preset.name}>
                  {preset.name}
                </span>
                <div className="text-[10px] text-slate-300 flex items-center gap-1 truncate">
                  <span>{preset.category}</span>
                </div>
              </div>

              <div className="flex h-2.5 w-full rounded-full overflow-hidden shadow-inner border border-black/40">
                <div className="flex-1" style={{ backgroundColor: preset.panelDark }} title="panelDark" />
                <div className="flex-1" style={{ backgroundColor: preset.panelDarker }} title="panelDarker" />
                <div className="flex-1" style={{ backgroundColor: preset.cream }} title="cream" />
                <div className="flex-1" style={{ backgroundColor: preset.amber }} title="amber" />
                <div className="flex-1" style={{ backgroundColor: preset.ledRed }} title="ledRed" />
                <div className="flex-1" style={{ backgroundColor: preset.ledOff }} title="ledOff" />
              </div>

              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-white/10 font-mono">
                <span className="truncate text-cyan-300 font-medium">
                  {preset.patternType ? preset.patternType.replace(/-/g, ' ') : preset.panelTexture}
                </span>
                <span className="truncate text-slate-300">{preset.knobStyle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3.5 bg-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl text-xs flex-wrap gap-2">
          <div className="text-slate-300">
            Page <span className="font-bold text-white">{currentPage}</span> of{' '}
            <span className="font-bold text-white">{totalPages}</span> ({filteredPresets.length} presets)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-xl bg-black/40 border border-white/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 cursor-pointer"
            >
              ← Prev
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-xl font-mono text-xs transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'bg-black/30 border border-white/15 text-slate-300 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded-xl bg-black/40 border border-white/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
