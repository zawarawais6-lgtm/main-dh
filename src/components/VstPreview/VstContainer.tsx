import React, { useRef, useEffect, useState } from 'react';
import {
  SkinDefinition,
  SliderArchitectPreset,
  LfoVisualPreset,
  UiCustomizationState,
  TextureArchetype,
  KnobArchitectPreset
} from '../../types/skin';
import {
  WheelCreatorConfig,
  SliderCreatorConfig,
  TextLabelConfig
} from '../../types/controlCreator';
import { VstMainPage } from './VstMainPage';
import { VstNodesPage } from './VstNodesPage';
import { VstMacrosPage } from './VstMacrosPage';
import { VstLfosPage } from './VstLfosPage';
import { renderTextureToCanvas } from '../TextureEngine/textureGenerator';
import { Sliders, Type, Disc, Sparkles, Edit3, Shuffle } from 'lucide-react';

interface VstContainerProps {
  skin: SkinDefinition;
  onSkinChange?: (skin: SkinDefinition) => void;
  onRandomize?: () => void;
  availableSkins?: SkinDefinition[];
  onOpenExporter?: () => void;
  onOpenCustomizer?: () => void;
  knobPreset?: KnobArchitectPreset;
  textureArchetype?: TextureArchetype;
  sliderPreset?: SliderArchitectPreset;
  lfoVisualPreset?: LfoVisualPreset;
  customization?: UiCustomizationState;
  // Individual Control Creator & Text Customization
  wheelConfig?: WheelCreatorConfig;
  sliderConfig?: SliderCreatorConfig;
  customKnobs?: Record<string, Partial<WheelCreatorConfig>>;
  customSliders?: Record<string, Partial<SliderCreatorConfig>>;
  customTexts?: Record<string, Partial<TextLabelConfig>>;
  onOpenControlCreator?: (controlId: string) => void;
  onOpenTextInspector?: (key: string) => void;
}

export const VstContainer: React.FC<VstContainerProps> = ({
  skin,
  onSkinChange,
  onRandomize,
  availableSkins = [],
  onOpenCustomizer,
  knobPreset,
  textureArchetype,
  sliderPreset,
  lfoVisualPreset,
  customization,
  wheelConfig,
  sliderConfig,
  customKnobs,
  customSliders,
  customTexts,
  onOpenControlCreator,
  onOpenTextInspector
}) => {
  const [activeTab, setActiveTab] = useState<'Main' | 'Nodes' | 'Macros' | 'LFOs'>('Main');
  const [guiScale, setGuiScale] = useState<number>(1.0);
  const [isTextEditModeActive, setIsTextEditModeActive] = useState(false);
  const [isCustomizeControlsActive, setIsCustomizeControlsActive] = useState(false);
  const [isAltPressed, setIsAltPressed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Global Alt-key listener for effortless text editing anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltPressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltPressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isTextEditMode = isTextEditModeActive || isAltPressed;

  useEffect(() => {
    if (canvasRef.current) {
      renderTextureToCanvas(canvasRef.current, skin, 1000, 760, textureArchetype);
    }
  }, [skin, textureArchetype]);

  const pageTitles = {
    Main: 'DELAY HOST // ENGINE',
    Nodes: 'MODULAR AUDIO ROUTING MATRIX',
    Macros: 'ASSIGNABLE 16-MACRO HARDWARE RACK',
    LFOs: 'LFO & ANALYTICAL MODULATION ENGINE'
  };

  const accentColor = customization?.knobAccentColor || skin.amber;
  const phosphorColor = lfoVisualPreset?.phosphorColor || skin.amber;
  const headerTextColor = customization?.headerTextColor || skin.headerTextColor || accentColor;
  const generalTextColor = customization?.textColor || skin.textColor || skin.cream;
  const glowEnabled = customization?.knobGlowEnabled ?? skin.knobGlowEnabled ?? true;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Outer VST Shell with GUI Scale */}
      <div
        className="w-full max-w-[880px] rounded-xl shadow-2xl border overflow-hidden transition-all duration-150 relative bg-[#181A1F]"
        style={{
          borderColor: '#2D3540',
          transform: `scale(${guiScale})`,
          transformOrigin: 'top center',
          boxShadow: glowEnabled
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 ${customization?.accentGlowSpread ?? 8}px ${accentColor}25`
            : '0 25px 50px -12px rgba(0,0,0,0.6)'
        }}
      >
        {/* Top Metallic Rack Bar */}
        <div className="h-11 px-3 flex flex-wrap items-center justify-between border-b text-xs bg-[#15171C] border-black/60 z-20 relative select-none gap-2">
          {/* Zone 1: Page Switcher Tabs */}
          <div className="flex items-center gap-1.5">
            {(['Main', 'Nodes', 'Macros', 'LFOs'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`h-7 px-3.5 flex items-center justify-center font-bold text-[11px] rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'shadow-md scale-[1.02] border border-white/30'
                      : 'hover:bg-white/10 opacity-75 hover:opacity-100 border border-transparent'
                  }`}
                  style={{
                    backgroundColor: isActive ? accentColor : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#000000' : generalTextColor
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Zone 2: Control Creator, Text Customizer & Edit Toggles */}
          <div className="flex items-center gap-2">
            {/* Edit Text Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsTextEditModeActive(!isTextEditModeActive)}
              className={`h-7 px-2.5 flex items-center gap-1.5 rounded-lg text-[11px] font-semibold transition-all shadow-sm cursor-pointer ${
                isTextEditMode
                  ? 'bg-cyan-500 text-black border border-cyan-300 ring-2 ring-cyan-400/50 scale-[1.02]'
                  : 'bg-[#20272F] hover:bg-[#2A3440] text-cyan-300 border border-cyan-500/40'
              }`}
              title="Toggle Edit Text mode (or hold Alt key anywhere to edit labels)"
            >
              <Type size={13} className={isTextEditMode ? 'text-black' : 'text-cyan-400'} />
              <span>{isTextEditMode ? 'Edit Text (ON)' : 'Edit Text'}</span>
            </button>

            {/* Customize Controls Toggle */}
            <button
              type="button"
              onClick={() => setIsCustomizeControlsActive(!isCustomizeControlsActive)}
              className={`h-7 px-2.5 flex items-center gap-1.5 rounded-lg text-[11px] font-semibold transition-all shadow-sm cursor-pointer ${
                isCustomizeControlsActive
                  ? 'bg-amber-500 text-black border border-amber-300 ring-2 ring-amber-400/50 scale-[1.02]'
                  : 'bg-[#20272F] hover:bg-[#2A3440] text-amber-300 border border-amber-500/40'
              }`}
              title="Show customize triggers on all knobs and sliders"
            >
              <Disc size={13} className={isCustomizeControlsActive ? 'text-black' : 'text-amber-400'} />
              <span>{isCustomizeControlsActive ? 'Customize (ON)' : 'Customize'}</span>
            </button>

            {/* Open Full Control Creator Drawer */}
            <button
              type="button"
              onClick={() => onOpenControlCreator?.('global')}
              className="h-7 px-2.5 flex items-center gap-1.5 rounded-lg bg-[#20272F] hover:bg-[#2A3440] text-slate-200 border border-slate-600/50 text-[11px] font-semibold transition-colors shadow-sm cursor-pointer"
              title="Open Control Creator for custom knob/slider wheel parameters"
            >
              <Sliders size={13} className="text-amber-400" />
              <span className="hidden sm:inline">Control Creator</span>
            </button>

            {/* Available Skins Dropdown */}
            {availableSkins.length > 0 && onSkinChange && (
              <select
                value={skin.id}
                onChange={(e) => {
                  const picked = availableSkins.find((s) => s.id === parseInt(e.target.value, 10));
                  if (picked) onSkinChange(picked);
                }}
                className="h-7 px-2 text-[11px] rounded-lg bg-black/60 border border-white/20 text-amber-300 font-semibold cursor-pointer outline-none max-w-[120px] truncate"
              >
                {availableSkins.slice(0, 100).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            {/* Randomize Button */}
            {onRandomize && (
              <button
                type="button"
                onClick={onRandomize}
                className="h-7 px-2.5 flex items-center gap-1.5 rounded-lg bg-[#20272F] hover:bg-[#2A3440] text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all shadow-sm cursor-pointer hover:border-amber-400 hover:text-white"
                title="Randomize Skin & Hardware Parameters across 4,000 Presets"
              >
                <Shuffle size={12} className="text-amber-400" />
                <span>Randomize</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Mode Notifications */}
        {isTextEditMode && (
          <div className="w-full bg-cyan-950/95 border-b border-cyan-400/60 px-4 py-1.5 flex items-center justify-between text-[11px] text-cyan-200 z-30 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold">
                ✏️ EDIT TEXT MODE ACTIVE: Click any text label, title, or name to open the Faceplate Customizer
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsTextEditModeActive(false)}
              className="text-[10px] underline hover:text-white cursor-pointer px-1.5 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/40"
            >
              Exit Edit Text
            </button>
          </div>
        )}
        {isCustomizeControlsActive && (
          <div className="w-full bg-amber-950/95 border-b border-amber-400/60 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-200 z-30 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold">
                🎛️ CUSTOMIZE CONTROLS ACTIVE: Click or right-click any knob/slider to customize in Control Creator
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCustomizeControlsActive(false)}
              className="text-[10px] underline hover:text-white cursor-pointer px-1.5 py-0.5 rounded bg-amber-900/60 border border-amber-500/40"
            >
              Exit Customize
            </button>
          </div>
        )}

        {/* 2. Rack Panel Faceplate Area with Procedural Texture Canvas */}
        <div className="relative min-h-[440px] flex flex-col justify-between overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          />

          {/* Corner Screws */}
          <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full border border-black/80 shadow flex items-center justify-center bg-gradient-to-br from-stone-300 to-stone-600 z-10 pointer-events-none">
            <div className="w-2.5 h-[1.2px] bg-black/90 rotate-45" />
          </div>
          <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full border border-black/80 shadow flex items-center justify-center bg-gradient-to-br from-stone-300 to-stone-600 z-10 pointer-events-none">
            <div className="w-2.5 h-[1.2px] bg-black/90 -rotate-45" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full border border-black/80 shadow flex items-center justify-center bg-gradient-to-br from-stone-300 to-stone-600 z-10 pointer-events-none">
            <div className="w-2.5 h-[1.2px] bg-black/90 -rotate-12" />
          </div>
          <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full border border-black/80 shadow flex items-center justify-center bg-gradient-to-br from-stone-300 to-stone-600 z-10 pointer-events-none">
            <div className="w-2.5 h-[1.2px] bg-black/90 rotate-60" />
          </div>

          {/* Subheader Title */}
          <div className="relative pt-3 pb-1 text-center z-10 select-none">
            <div className="flex items-center justify-center gap-2">
              <h2
                onClick={() =>
                  onOpenTextInspector?.(
                    activeTab === 'Main'
                      ? 'main:title'
                      : activeTab === 'Nodes'
                      ? 'nodes:title'
                      : activeTab === 'Macros'
                      ? 'macros:title'
                      : 'lfos:title'
                  )
                }
                className={`text-base sm:text-lg font-black tracking-widest uppercase transition-all cursor-pointer ${
                  isTextEditMode
                    ? 'ring-1 ring-cyan-400 bg-cyan-950/70 px-3 py-0.5 rounded text-cyan-200 inline-block shadow'
                    : 'hover:opacity-90'
                }`}
                style={{
                  color: headerTextColor,
                  textShadow: glowEnabled
                    ? `0 0 16px ${headerTextColor}80, 0 1px 3px rgba(0,0,0,0.9)`
                    : '0 1px 2px rgba(0,0,0,0.9)'
                }}
                title={isTextEditMode ? 'Click to customize title text and typography' : 'Hold Alt or click Edit Text to customize'}
              >
                {pageTitles[activeTab]}
              </h2>
            </div>

            <div
              className="text-[10px] tracking-wider uppercase font-mono flex items-center justify-center gap-2 mt-0.5 transition-colors"
              style={{ color: generalTextColor, opacity: 0.85 }}
            >
              <span>SKIN: {skin.name}</span>
              <span>·</span>
              <span className="text-amber-400/90">{skin.panelTexture}</span>
              {lfoVisualPreset && (
                <>
                  <span>·</span>
                  <span style={{ color: phosphorColor }}>LFO: {lfoVisualPreset.name}</span>
                </>
              )}
            </div>
          </div>

          {/* Active View Container */}
          <div className="relative z-10 flex-1">
            {activeTab === 'Main' && (
              <VstMainPage
                skin={skin}
                knobPreset={knobPreset}
                sliderPreset={sliderPreset}
                customization={customization}
                customKnobs={customKnobs}
                customTexts={customTexts}
                isTextEditMode={isTextEditMode}
                isCustomizeMode={isCustomizeControlsActive}
                onOpenControlCreator={onOpenControlCreator}
                onOpenTextInspector={onOpenTextInspector}
              />
            )}
            {activeTab === 'Nodes' && (
              <VstNodesPage
                skin={skin}
                customization={customization}
                customTexts={customTexts}
                isTextEditMode={isTextEditMode}
                isCustomizeMode={isCustomizeControlsActive}
                onOpenTextInspector={onOpenTextInspector}
              />
            )}
            {activeTab === 'Macros' && (
              <VstMacrosPage
                skin={skin}
                knobPreset={knobPreset}
                customization={customization}
                customKnobs={customKnobs}
                customTexts={customTexts}
                isTextEditMode={isTextEditMode}
                isCustomizeMode={isCustomizeControlsActive}
                onOpenControlCreator={onOpenControlCreator}
                onOpenTextInspector={onOpenTextInspector}
              />
            )}
            {activeTab === 'LFOs' && (
              <VstLfosPage
                skin={skin}
                lfoVisualPreset={lfoVisualPreset}
                sliderPreset={sliderPreset}
                sliderConfig={sliderConfig}
                customSliders={customSliders}
                customization={customization}
                customTexts={customTexts}
                isTextEditMode={isTextEditMode}
                isCustomizeMode={isCustomizeControlsActive}
                onOpenControlCreator={onOpenControlCreator}
                onOpenTextInspector={onOpenTextInspector}
              />
            )}
          </div>

          <div
            className="h-3 border-t relative z-10"
            style={{ borderColor: `${accentColor}25` }}
          />
        </div>
      </div>
    </div>
  );
};
