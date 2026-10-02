import React, { useState, useMemo } from 'react';
import { KnobArchitectPreset, KnobStyle } from '../../types/skin';
import { knobArchitect1000 } from '../../data/knobArchitect1000';
import { KnobRenderer } from '../KnobRenderer/KnobRenderer';
import { Search, Compass, Check, Copy } from 'lucide-react';

interface KnobArchitectBrowserProps {
  onApplyKnob: (preset: KnobArchitectPreset) => void;
  activeKnobStyle?: KnobStyle;
}

const categories = [
  'All',
  'Futuristic HUD',
  'Analog Hardware',
  'Liquid Organic',
  'Cyber Minimal',
  'Vintage Classic',
  'Industrial Machined',
  'Optical Precision',
  'Boutique Studio'
] as const;

export const KnobArchitectBrowser: React.FC<KnobArchitectBrowserProps> = ({
  onApplyKnob
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedId, setAppliedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [interactiveValues, setInteractiveValues] = useState<Record<number, number>>({});
  const pageSize = 24;

  const filteredKnobs = useMemo(() => {
    let list = knobArchitect1000;
    if (selectedCategory !== 'All') {
      list = list.filter((k) => k.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (k) =>
          k.name.toLowerCase().includes(q) ||
          k.style.toLowerCase().includes(q) ||
          k.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredKnobs.length / pageSize);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredKnobs.slice(start, start + pageSize);
  }, [filteredKnobs, currentPage, pageSize]);

  const handleApply = (preset: KnobArchitectPreset) => {
    onApplyKnob(preset);
    setAppliedId(preset.id);
    setTimeout(() => setAppliedId(null), 2000);
  };

  const handleCopyCode = (preset: KnobArchitectPreset) => {
    const code = `// YUP / JUCE Knob Draw Routine: ${preset.name}
void drawCustomKnob_${preset.id}(juce::Graphics& g, juce::Rectangle<float> bounds, float sliderPos)
{
    const auto centre = bounds.getCentre();
    const auto radius = bounds.getWidth() * 0.5f;
    const auto angle = -juce::MathConstants<float>::pi * 0.75f + sliderPos * (juce::MathConstants<float>::pi * 1.5f);

    g.setColour(juce::Colour::fromString("${preset.bodyColor}").darker(0.3f));
    g.fillEllipse(bounds);
    g.setColour(juce::Colour::fromString("${preset.accentColor}").withAlpha(${preset.glowIntensity}f));
    g.drawEllipse(bounds.reduced(${preset.bezelWidth}f), ${preset.bezelWidth}f);
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
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">4,000 Knob Architect Presets</h2>
            <span className="text-xs font-mono text-cyan-400/80 ml-2">Interactive Rotational Testing</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Audition 4,000 physical, orbital, prismatic, console, liquid, and cyber dials with real tactile drag.
          </p>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 4,000 knobs (e.g. orbital, prism, titanium)..."
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
            {cat} {cat === 'All' ? `(${knobArchitect1000.length})` : ''}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {filteredKnobs.length} matching knob geometries (Drag any knob to test rotation)</span>
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

      {/* Knobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedList.map((preset) => {
          const val = interactiveValues[preset.id] ?? 0.45;

          return (
            <div
              key={preset.id}
              className="group relative rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-cyan-400/60 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/50 text-slate-400 border border-white/10">
                  #{preset.id}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                  {preset.category}
                </span>
              </div>

              {/* Interactive Knob Showcase */}
              <div className="flex flex-col items-center justify-center py-2.5 bg-black/40 rounded-xl border border-white/10">
                <KnobRenderer
                  preset={preset}
                  skin={{
                    id: preset.id,
                    name: preset.name,
                    category: 'Wada Sanzo Classic',
                    panelDark: preset.bodyColor,
                    panelDarker: '#0a0d12',
                    cream: preset.bodyColor,
                    amber: preset.accentColor,
                    ledRed: preset.pointerColor,
                    ledOff: '#3a1c17',
                    knobStyle: preset.style,
                    panelTexture: 'FlatMatte',
                    decorativeDots: false
                  }}
                  value={val}
                  onChange={(newVal) =>
                    setInteractiveValues((prev) => ({ ...prev, [preset.id]: newVal }))
                  }
                  size={84}
                />
                <span className="text-[10px] font-mono text-white mt-2">
                  Value: {Math.round(val * 100)}% (Drag to rotate)
                </span>
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
                    Ticks: {preset.tickCount > 0 ? preset.tickCount : 'Smooth'}
                  </div>
                  <div className="bg-black/40 px-2 py-1 rounded-md border border-white/10 truncate">
                    Glow: {Math.round(preset.glowIntensity * 100)}%
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleApply(preset)}
                  className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    appliedId === preset.id
                      ? 'bg-emerald-500 text-black'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm'
                  }`}
                >
                  {appliedId === preset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Applied!
                    </>
                  ) : (
                    'Apply to VST'
                  )}
                </button>

                <button
                  onClick={() => handleCopyCode(preset)}
                  title="Copy C++ Knob Draw Code"
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
