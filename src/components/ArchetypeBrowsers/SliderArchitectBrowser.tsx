import React, { useState, useMemo } from 'react';
import { SliderArchitectPreset } from '../../types/skin';
import { sliderArchitect1000 } from '../../data/sliderArchitect1000';
import { SliderRenderer } from '../SliderRenderer/SliderRenderer';
import { Search, Sliders, Check, Copy } from 'lucide-react';

interface SliderArchitectBrowserProps {
  onApplySlider: (preset: SliderArchitectPreset) => void;
  activeSliderPreset?: SliderArchitectPreset;
}

const categories = [
  'All',
  'Precision Hardware',
  'Cyberpunk Glow',
  'Liquid Chamber',
  'Vintage Console',
  'Minimalist Rail',
  'Broadcast Mixing',
  'Aerospace Linear',
  'Mastering Fader'
] as const;

export const SliderArchitectBrowser: React.FC<SliderArchitectBrowserProps> = ({
  onApplySlider,
  activeSliderPreset
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedId, setAppliedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [sliderValues, setSliderValues] = useState<Record<number, number>>({});
  const pageSize = 24;

  const filteredSliders = useMemo(() => {
    let list = sliderArchitect1000;
    if (selectedCategory !== 'All') {
      list = list.filter((s) => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.trackStyle.toLowerCase().includes(q) ||
          s.thumbStyle.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredSliders.length / pageSize);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSliders.slice(start, start + pageSize);
  }, [filteredSliders, currentPage, pageSize]);

  const handleApply = (preset: SliderArchitectPreset) => {
    onApplySlider(preset);
    setAppliedId(preset.id);
    setTimeout(() => setAppliedId(null), 2000);
  };

  const handleCopyCode = (preset: SliderArchitectPreset) => {
    const code = `// YUP / JUCE Slider Draw Routine: ${preset.name}
void drawLinearSlider_${preset.id}(juce::Graphics& g, int x, int y, int width, int height, float sliderPos, juce::Slider& slider)
{
    auto bounds = juce::Rectangle<float>((float) x, (float) y, (float) width, (float) height);
    auto track = bounds.withSizeKeepingCentre(bounds.getWidth(), ${preset.trackHeight}.0f);

    g.setColour(juce::Colour::fromString("${preset.trackColor}"));
    g.fillRoundedRectangle(track, ${preset.cornerRadius}.0f);

    auto thumbX = juce::jlimit(bounds.getX() + ${preset.thumbWidth * 0.5}f, bounds.getRight() - ${preset.thumbWidth * 0.5}f, sliderPos);
    auto thumbBounds = juce::Rectangle<float>(${preset.thumbWidth}.0f, ${preset.thumbHeight}.0f).withCentre({ thumbX, bounds.getCentreY() });

    g.setColour(juce::Colour::fromString("${preset.thumbColor}"));
    g.fillRoundedRectangle(thumbBounds, 2.0f);
}`;
    navigator.clipboard.writeText(code);
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">4,000 Slider Architect Presets</h2>
            <span className="text-xs font-mono text-cyan-400/80 ml-2">Interactive Linear Faders</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Test and customize 4,000 linear fader geometries across recessed grooves, liquid channels, and cyber neon rails.
          </p>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 4,000 sliders (e.g. glide, fader, rail)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-300 hover:text-white border border-white/15 hover:border-white/30'
            }`}
          >
            {cat} {cat === 'All' ? `(${sliderArchitect1000.length})` : ''}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {filteredSliders.length} matching slider architectures (Drag fader to test)</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 disabled:opacity-30 hover:bg-white/10 cursor-pointer text-white"
            >
              Prev
            </button>
            <span className="px-2 font-mono text-cyan-300 font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/20 disabled:opacity-30 hover:bg-white/10 cursor-pointer text-white"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedList.map((preset) => {
          const val = sliderValues[preset.id] ?? 0.5;

          return (
            <div
              key={preset.id}
              className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-cyan-400/60 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/50 text-slate-400 border border-white/10">
                  #{preset.id}
                </span>
                <span className="min-w-0 truncate text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                  {preset.category}
                </span>
              </div>

              {/* Interactive Slider Showcase */}
              <div className="min-w-0 overflow-hidden flex flex-col py-3 px-3 bg-black/40 rounded-xl border border-white/10">
                <SliderRenderer
                  preset={preset}
                  value={val}
                  onChange={(newVal) =>
                    setSliderValues((prev) => ({ ...prev, [preset.id]: newVal }))
                  }
                  label={preset.name}
                  suffix="%"
                  min={0}
                  max={100}
                />
              </div>

              {/* Specs & Description */}
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                  {preset.name}
                </h3>
                <div className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                  {preset.description}
                </div>

                <div className="grid grid-cols-2 gap-1.5 mt-2.5 text-[10px] font-mono text-slate-400">
                  <div className="bg-black/40 px-2 py-1 rounded-md border border-white/10 truncate">
                    Track: {preset.trackStyle}
                  </div>
                  <div className="bg-black/40 px-2 py-1 rounded-md border border-white/10 truncate">
                    Thumb: {preset.thumbStyle}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleApply(preset)}
                  className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    appliedId === preset.id || activeSliderPreset?.id === preset.id
                      ? 'bg-emerald-500 text-black'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm'
                  }`}
                >
                  {appliedId === preset.id || activeSliderPreset?.id === preset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Applied!
                    </>
                  ) : (
                    'Apply to VST Sliders'
                  )}
                </button>

                <button
                  onClick={() => handleCopyCode(preset)}
                  title="Copy C++ Slider Draw Code"
                  className="p-1.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedId === preset.id ? (
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

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4 border-t border-white/10">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 rounded-xl text-xs bg-slate-900/60 border border-white/20 disabled:opacity-30 hover:bg-white/10 text-slate-200 cursor-pointer"
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
            className="px-3.5 py-1.5 rounded-xl text-xs bg-slate-900/60 border border-white/20 disabled:opacity-30 hover:bg-white/10 text-slate-200 cursor-pointer"
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
};

export default SliderArchitectBrowser;
