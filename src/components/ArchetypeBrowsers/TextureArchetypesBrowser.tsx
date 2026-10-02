import React, { useState, useMemo } from 'react';
import { TextureArchetype, SkinDefinition } from '../../types/skin';
import { textureArchetypes1000 } from '../../data/textureArchetypes1000';
import { exportTextureAsPng } from '../TextureEngine/textureGenerator';
import { TexturePatternPreview } from '../TextureEngine/TexturePatternPreview';
import { Search, Layers, Check, Download, ExternalLink, Sparkles } from 'lucide-react';

interface TextureArchetypesBrowserProps {
  currentSkin: SkinDefinition;
  onApplyTexture: (archetype: TextureArchetype) => void;
}

const SERIES_FILTERS = [
  { id: 'All', label: 'All 4,000 Textures' },
  { id: 'New300', label: '🔥 1,000 Shaders & Shapes (300 + 700 New)', link: 'https://shaders.com' },
  { id: 'ShadersCom', label: '⚡ Shaders.com Visual FX', link: 'https://shaders.com' },
  { id: 'BookOfShapes', label: '📐 Book of Shapes (Flow, Spiral, Arcs)', link: 'https://bookofshapes.com' },
  { id: 'ShaderTopo', label: '🗺️ Motion Dev & CodeSandbox', link: 'https://motion.dev/examples/js-three-shader-topography' },
  { id: 'Fffuel', label: '🎨 Fffuel Generative Vectors', link: 'https://www.fffuel.co' },
  { id: 'ReactBits', label: '⚡ React Bits Dynamic', link: 'https://www.reactbits.dev' },
  { id: 'Aceternity', label: '✨ Aceternity (Lamp & Glow)', link: 'https://ui.aceternity.com' },
  { id: '21stDev', label: '🎨 21st.dev (Meshes, Silk & Shaders)', link: 'https://21st.dev' },
  { id: 'OriginKit', label: '🔮 OriginKit (Specular & Horizon)', link: 'https://www.originkit.dev' },
  { id: 'FlowRipple', label: '〰️ Flow Fields & Ripples', link: 'https://kokonutui.com/docs/backgrounds/flow-field' },
  { id: 'Adobe', label: '🧱 Adobe Concrete Grit', link: 'https://stock.adobe.com/search?k=gritty+texture' },
  { id: 'Magnific', label: '🏖️ Magnific Mineral Sand', link: 'https://www.magnific.com/free-photos-vectors/gritty-texture' },
  { id: 'Liquid', label: '💧 Behance Liquid Grain Flow', link: 'https://www.behance.net/gallery/245045951/Liquid-grainy-gradients' },
  { id: 'Deep', label: '🏔️ Behance Deep Layers Vol.1', link: 'https://www.behance.net/gallery/117856369/Deep-Layers-Volume-1' },
  { id: 'Dark90', label: '🌌 Behance 90 Dark Obsidian', link: 'https://www.behance.net/gallery/229601337/90-Dark-Grainy-Textures' }
];

export const TextureArchetypesBrowser: React.FC<TextureArchetypesBrowserProps> = ({
  currentSkin,
  onApplyTexture
}) => {
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedId, setAppliedId] = useState<number | null>(null);
  const pageSize = 24;

  const filteredArchetypes = useMemo(() => {
    let list = textureArchetypes1000;
    if (selectedSeries === 'New300') {
      list = list.filter((a) => a.id > 3000);
    } else if (selectedSeries === 'ShadersCom') {
      list = list.filter((a) => a.category === 'Shaders.com Visual FX');
    } else if (selectedSeries === 'BookOfShapes') {
      list = list.filter((a) => a.category === 'Book of Shapes Algorithmic');
    } else if (selectedSeries === 'ShaderTopo') {
      list = list.filter((a) => a.category === 'Shader Topography & Meshes' || a.category === 'Kinetic Chromatic Waveforms');
    } else if (selectedSeries === 'Fffuel') {
      list = list.filter((a) => a.category === 'Fffuel Generative Vectors');
    } else if (selectedSeries === 'ReactBits') {
      list = list.filter((a) => a.category === 'React Bits Dynamic');
    } else if (selectedSeries === 'Aceternity') {
      list = list.filter((a) => a.category === 'Aceternity & Luminescence');
    } else if (selectedSeries === '21stDev') {
      list = list.filter((a) => a.category === '21st.dev Meshes & Gradients');
    } else if (selectedSeries === 'OriginKit') {
      list = list.filter((a) => a.category === 'OriginKit Shaders & Horizons');
    } else if (selectedSeries === 'FlowRipple') {
      list = list.filter((a) => a.category === 'Flow Fields & Ripples');
    } else if (selectedSeries === 'Adobe') {
      list = list.filter((a) => a.baseModel === 'GrittyTexture');
    } else if (selectedSeries === 'Magnific') {
      list = list.filter((a) => a.baseModel === 'FineMineralGrit');
    } else if (selectedSeries === 'Liquid') {
      list = list.filter((a) => a.baseModel === 'LiquidGrainGradient');
    } else if (selectedSeries === 'Deep') {
      list = list.filter((a) => a.baseModel === 'DeepLayers');
    } else if (selectedSeries === 'Dark90') {
      list = list.filter((a) => a.baseModel === 'DarkGrainyGrit');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.baseModel.toLowerCase().includes(q) ||
          (a.inspirationTitle && a.inspirationTitle.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedSeries, searchQuery]);

  const totalPages = Math.ceil(filteredArchetypes.length / pageSize);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredArchetypes.slice(start, start + pageSize);
  }, [filteredArchetypes, currentPage, pageSize]);

  const handleApply = (archetype: TextureArchetype) => {
    onApplyTexture(archetype);
    setAppliedId(archetype.id);
    setTimeout(() => setAppliedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#141820] border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">4,000 Procedural Textures Catalog</h2>
            <span className="text-xs font-mono text-cyan-400/80 ml-2">Curated Visual Shaders & Backgrounds</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Engineered from curated visual design references: React Bits dynamic backgrounds, Aceternity lamp/glow, 21st.dev gradients & shaders, OriginKit horizon shaders, KokonutUI flow fields, and classic gritty textures.
          </p>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search textures (e.g. aero shards, lamp, silk, prism)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-black/60 border border-white/15 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Requested In-Depth Reference Filter Badges */}
      <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Featured Design Reference Series:</span>
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Click badge to filter & inspect live reference links
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SERIES_FILTERS.map((s) => {
            const isSelected = selectedSeries === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSeries(s.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-black/50 text-slate-300 hover:text-white border border-white/10 hover:border-white/25'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
                {s.link && (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded bg-black/40 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-cyan-300 transition-colors"
                    title={`Open ${s.label} reference link`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Results Count & Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {filteredArchetypes.length} matching procedural textures</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-black/50 border border-white/10 disabled:opacity-30 hover:bg-white/10 cursor-pointer text-white"
            >
              Prev
            </button>
            <span className="px-2 font-mono text-cyan-300 font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-black/50 border border-white/10 disabled:opacity-30 hover:bg-white/10 cursor-pointer text-white"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Archetypes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedList.map((archetype) => (
          <div
            key={archetype.id}
            className="group relative rounded-xl border border-white/10 bg-[#12161F] overflow-hidden flex flex-col hover:border-cyan-400/60 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
          >
            {/* Visual Texture Design Preview */}
            <div className="h-40 w-full relative overflow-hidden">
              <TexturePatternPreview archetype={archetype} height={160} />

              {/* Tag Badges on preview */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between w-full p-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/80 text-zinc-300 border border-white/10">
                  #{archetype.id}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/80 text-cyan-300 border border-cyan-400/40 font-bold uppercase truncate max-w-[140px]">
                  {archetype.patternType.replace(/-/g, ' ')}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
              <div>
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {archetype.name}
                  </h3>
                  {archetype.inspirationLink && (
                    <a
                      href={archetype.inspirationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-cyan-300 transition-colors shrink-0"
                      title={`Reference: ${archetype.inspirationTitle}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {archetype.inspirationTitle && (
                  <span className="text-[10px] font-mono text-cyan-400/90 block mt-0.5 truncate">
                    Series: {archetype.inspirationTitle}
                  </span>
                )}

                <div className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {archetype.description}
                </div>

                {/* Specs Pill List */}
                <div className="flex flex-wrap gap-1.5 mt-2.5 text-[10px] font-mono text-slate-400">
                  <span className="bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    Roughness: {Math.round(archetype.roughness * 100)}%
                  </span>
                  <span className="bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    Contrast: {archetype.contrast}x
                  </span>
                  {archetype.liquidAngle > 0 && (
                    <span className="bg-black/40 px-2 py-0.5 rounded border border-white/10">
                      Flow: {archetype.liquidAngle}°
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleApply(archetype)}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    appliedId === archetype.id
                      ? 'bg-emerald-500 text-black font-semibold'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm'
                  }`}
                >
                  {appliedId === archetype.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Applied!
                    </>
                  ) : (
                    'Apply to VST'
                  )}
                </button>

                <button
                  onClick={() => {
                    const dataUrl = exportTextureAsPng(
                      {
                        ...currentSkin,
                        panelTexture: archetype.baseModel,
                        textureRoughness: archetype.roughness,
                        textureContrast: archetype.contrast,
                        liquidFlowAngle: archetype.liquidAngle,
                        vignetteStrength: archetype.vignette
                      },
                      archetype,
                      2000,
                      1520
                    );
                    const link = document.createElement('a');
                    link.download = `${archetype.name.toLowerCase().replace(/\s+/g, '_')}_texture.png`;
                    link.href = dataUrl;
                    link.click();
                  }}
                  title="Download 2000px PNG Texture"
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4 border-t border-white/10">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 rounded-lg text-xs bg-black/40 border border-white/10 disabled:opacity-30 hover:bg-white/10 text-slate-200 cursor-pointer"
          >
            Previous Page
          </button>
          <span className="px-3 py-1.5 text-xs font-mono text-cyan-300 font-bold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="px-3.5 py-1.5 rounded-lg text-xs bg-black/40 border border-white/10 disabled:opacity-30 hover:bg-white/10 text-slate-200 cursor-pointer"
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
};

export default TextureArchetypesBrowser;
