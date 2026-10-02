import React, { useState } from 'react';
import {
  SkinDefinition,
  TextureArchetype,
  KnobArchitectPreset,
  SliderArchitectPreset,
  LfoVisualPreset,
  UiCustomizationState
} from '../../types/skin';
import { SANZO_WADA_PALETTES, FUTURISTIC_CYBER_PALETTES } from '../../data/sanzoWadaData';
import { TextureArchetypesBrowser } from '../ArchetypeBrowsers/TextureArchetypesBrowser';
import { KnobArchitectBrowser } from '../ArchetypeBrowsers/KnobArchitectBrowser';
import { SliderArchitectBrowser } from '../ArchetypeBrowsers/SliderArchitectBrowser';
import { LfoVisualizerBrowser } from '../ArchetypeBrowsers/LfoVisualizerBrowser';
import { UiCustomizerPanel } from '../UiCustomizer/UiCustomizerPanel';
import { Palette, Sparkles } from 'lucide-react';

interface AdvancedToolsProps {
  currentSkin: SkinDefinition;
  onUpdateSkin: (skin: SkinDefinition) => void;
  onSaveAsCustom: (skin: SkinDefinition) => void;
  onRandomize: () => void;
  onOpenExporter?: () => void;
  onApplyTexture?: (archetype: TextureArchetype) => void;
  onApplyKnob?: (preset: KnobArchitectPreset) => void;
  onApplySlider?: (preset: SliderArchitectPreset) => void;
  onApplyLfoVisual?: (preset: LfoVisualPreset) => void;
  customization?: UiCustomizationState;
  onUpdateCustomization?: (custom: UiCustomizationState) => void;
  onResetCustomization?: () => void;
  activeKnobPreset?: KnobArchitectPreset;
  activeTextureArchetype?: TextureArchetype;
  activeSliderPreset?: SliderArchitectPreset;
  activeLfoPreset?: LfoVisualPreset;
}

export const AdvancedTools: React.FC<AdvancedToolsProps> = ({
  currentSkin,
  onUpdateSkin,
  onSaveAsCustom,
  onRandomize,
  onOpenExporter,
  onApplyTexture,
  onApplyKnob,
  onApplySlider,
  onApplyLfoVisual,
  customization,
  onUpdateCustomization,
  onResetCustomization,
  activeSliderPreset,
  activeLfoPreset
}) => {
  const [activeTab, setActiveTab] = useState<
    'palette' | 'customizer' | 'textures1000' | 'knobs1000' | 'sliders1000' | 'lfos1000'
  >('customizer');
  const updateColor = (key: keyof SkinDefinition, hex: string) => {
    onUpdateSkin({
      ...currentSkin,
      [key]: hex
    });
  };

  return (
    <div className="bg-[#141820] border border-white/10 rounded-xl p-4 flex flex-col gap-4 text-xs shadow-xl">
      {/* Tool Header & Navigation */}
      <div className="flex flex-col gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-wide">
              Advanced Skin & UI Studio Tools
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              · Real-time tuning for VST parameters, textures, knobs, sliders & LFOs
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRandomize}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-slate-300 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              🎲 Randomize
            </button>
            <button
              type="button"
              onClick={() => onSaveAsCustom(currentSkin)}
              className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded transition-colors cursor-pointer shadow-md"
            >
              ★ Save Custom
            </button>
          </div>
        </div>

        {/* Studio Sub-Tabs Bar */}
        <div className="flex items-center gap-1 p-1 bg-black/50 backdrop-blur-md rounded-xl border border-white/15 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('customizer')}
            className={`px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'customizer'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚙️ UI Customizer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('textures1000')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'textures1000'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🧱 4,000 Textures</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('knobs1000')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'knobs1000'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🧭 4,000 Knobs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sliders1000')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sliders1000'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🎚️ 4,000 Sliders</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lfos1000')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'lfos1000'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>〰️ 4,000 LFOs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('palette')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'palette'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Palette Lab</span>
          </button>
        </div>
      </div>

      {/* TAB: UI CUSTOMIZER (POSITION, STYLE, COLOR, HEIGHT, GLOW) */}
      {activeTab === 'customizer' && customization && onUpdateCustomization && onResetCustomization && (
        <UiCustomizerPanel
          currentSkin={currentSkin}
          customization={customization}
          onUpdateCustomization={onUpdateCustomization}
          onResetToDefaults={onResetCustomization}
        />
      )}

      {/* TAB: 1,000 TEXTURES */}
      {activeTab === 'textures1000' && onApplyTexture && (
        <TextureArchetypesBrowser
          currentSkin={currentSkin}
          onApplyTexture={onApplyTexture}
        />
      )}

      {/* TAB: 1,000 KNOBS */}
      {activeTab === 'knobs1000' && onApplyKnob && (
        <KnobArchitectBrowser
          onApplyKnob={onApplyKnob}
          activeKnobStyle={currentSkin.knobStyle}
        />
      )}

      {/* TAB: 1,000 SLIDERS */}
      {activeTab === 'sliders1000' && onApplySlider && (
        <SliderArchitectBrowser
          onApplySlider={onApplySlider}
          activeSliderPreset={activeSliderPreset}
        />
      )}

      {/* TAB: 1,000 LFOs */}
      {activeTab === 'lfos1000' && onApplyLfoVisual && (
        <LfoVisualizerBrowser
          onApplyLfoVisual={onApplyLfoVisual}
          activeLfoPreset={activeLfoPreset}
        />
      )}

      {/* TAB: PALETTE LAB */}
      {activeTab === 'palette' && (
        <div className="relative z-10 flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              6 Core Color Roles (Mapped to YUP / JUCE)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {[
                { key: 'panelDark', label: 'panelDark', desc: 'Chassis Back' },
                { key: 'panelDarker', label: 'panelDarker', desc: 'Wells & Bezels' },
                { key: 'cream', label: 'cream', desc: 'Text & Scales' },
                { key: 'amber', label: 'amber', desc: 'Main Glow Accent' },
                { key: 'ledRed', label: 'ledRed', desc: 'Active LED / Tip' },
                { key: 'ledOff', label: 'ledOff', desc: 'Inactive LED' }
              ].map(({ key, label, desc }) => {
                const hex = (currentSkin as any)[key] || '#000000';
                return (
                  <div
                    key={key}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/15 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[10px] text-slate-300">
                        {label}
                      </span>
                      <div
                        className="w-4 h-4 rounded-full border border-black/40 shadow-sm shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={hex}
                        onChange={(e) => updateColor(key as any, e.target.value.toUpperCase())}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={hex}
                        onChange={(e) => updateColor(key as any, e.target.value.toUpperCase())}
                        className="w-full text-[10px] font-mono uppercase bg-black/60 text-white px-1.5 py-0.5 rounded border border-white/20 text-center"
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 truncate">{desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Apply: Sanzo Wada Japanese Palettes */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Sanzo Wada Japanese Harmonies
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1">
              {SANZO_WADA_PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onUpdateSkin({
                      ...currentSkin,
                      name: `${p.name} Theme`,
                      panelDark: p.colors[0],
                      panelDarker: '#141414',
                      cream: p.colors[p.colors.length - 1],
                      amber: p.colors[1] || '#E8A13A',
                      ledRed: p.colors[2] || '#E6402B',
                      ledOff: '#331515'
                    });
                  }}
                  className="p-2 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-400/50 text-left flex flex-col gap-1 cursor-pointer transition-all hover:bg-black/60"
                >
                  <span className="font-semibold text-[10px] text-slate-200 truncate">{p.name}</span>
                  <div className="flex h-3 w-full rounded-md overflow-hidden shadow-inner">
                    {p.colors.map((c, idx) => (
                      <div key={idx} className="flex-1 h-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Apply: Futuristic Cyber Palettes */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Futuristic Cyber / Synthwave Palettes
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {FUTURISTIC_CYBER_PALETTES.map((cp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onUpdateSkin({
                      ...currentSkin,
                      name: `${cp.name}`,
                      panelDark: cp.colors[0],
                      panelDarker: cp.colors[1],
                      cream: cp.colors[2],
                      amber: cp.colors[3],
                      ledRed: cp.colors[4],
                      ledOff: cp.colors[5]
                    });
                  }}
                  className="p-2 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-400/50 text-left flex flex-col gap-1 cursor-pointer transition-all hover:bg-black/60"
                >
                  <span className="font-semibold text-[10px] text-slate-200 truncate">{cp.name}</span>
                  <div className="flex h-3 w-full rounded-md overflow-hidden shadow-inner">
                    {cp.colors.map((c, i) => (
                      <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdvancedTools;
