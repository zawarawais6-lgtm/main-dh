import { useState, useEffect } from 'react';
import {
  SkinDefinition,
  TextureArchetype,
  KnobArchitectPreset,
  SliderArchitectPreset,
  LfoVisualPreset,
  UiCustomizationState
} from './types/skin';
import { PRESETS_1000 } from './data/presets1000';
import { textureArchetypes1000 } from './data/textureArchetypes1000';
import { knobArchitect1000 } from './data/knobArchitect1000';
import { sliderArchitect1000 } from './data/sliderArchitect1000';
import { lfoVisualPresets } from './data/lfoVisualPresets';
import { VstContainer } from './components/VstPreview/VstContainer';
import { AdvancedTools } from './components/AdvancedTools/AdvancedTools';
import { CodeExporter } from './components/CodeExporter/CodeExporter';
import { defaultUiCustomization } from './components/UiCustomizer/UiCustomizerPanel';
import { getAmorphPatchConnection } from './services/amorphPatchConnection';
import {
  Sliders,
  Sparkles,
  Layers,
  Code,
  Compass,
  Sun,
  Moon,
  Type,
  Shuffle,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  Archive,
  Disc
} from 'lucide-react';
import { ControlCreatorDrawer } from './components/ControlCreator/ControlCreatorDrawer';
import { TextInspectorDrawer } from './components/TextCustomizer/TextInspectorDrawer';
import {
  WheelCreatorConfig,
  SliderCreatorConfig,
  TextLabelConfig,
  DEFAULT_WHEEL_CONFIG,
  DEFAULT_SLIDER_CONFIG
} from './types/controlCreator';
import { exportJuceZipBundle } from './services/juceZipExporter';

type SectionTab = 'studio' | 'tools' | 'export';

export default function App() {
  const [currentSkin, setCurrentSkin] = useState<SkinDefinition>(() => {
    const saved = localStorage.getItem('delayhost_active_skin');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved skin', e);
      }
    }
    return PRESETS_1000[0];
  });

  const [activeSection, setActiveSection] = useState<SectionTab>('studio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Active 4-axis presets (from the 4,000-piece catalog)
  const [currentSliderPreset, setCurrentSliderPreset] = useState<SliderArchitectPreset>(() => {
    return currentSkin.sliderPreset ?? sliderArchitect1000[0];
  });
  const [currentLfoPreset, setCurrentLfoPreset] = useState<LfoVisualPreset>(() => {
    return currentSkin.lfoPreset ?? lfoVisualPresets[0];
  });
  const [currentTextureArchetype, setCurrentTextureArchetype] = useState<TextureArchetype>(() => {
    return currentSkin.textureArchetype ?? textureArchetypes1000[0];
  });
  const [currentKnobPreset, setCurrentKnobPreset] = useState<KnobArchitectPreset>(() => {
    return currentSkin.knobPreset ?? knobArchitect1000[0];
  });

  // UI Customization State: knob/slider position, style, color, height, glow, typography
  const [uiCustomization, setUiCustomization] = useState<UiCustomizationState>(() => {
    const saved = localStorage.getItem('delayhost_ui_customization');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultUiCustomization(PRESETS_1000[0]);
  });

  const [customPresets, setCustomPresets] = useState<SkinDefinition[]>(() => {
    const saved = localStorage.getItem('delayhost_custom_presets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Control Creator states
  const [wheelConfig, setWheelConfig] = useState<WheelCreatorConfig>(DEFAULT_WHEEL_CONFIG);
  const [sliderConfig, setSliderConfig] = useState<SliderCreatorConfig>(DEFAULT_SLIDER_CONFIG);
  const [customKnobs, setCustomKnobs] = useState<Record<string, Partial<WheelCreatorConfig>>>({});
  const [customSliders, setCustomSliders] = useState<Record<string, Partial<SliderCreatorConfig>>>({});
  const [customTexts, setCustomTexts] = useState<Record<string, Partial<TextLabelConfig>>>({});
  const [isControlCreatorOpen, setIsControlCreatorOpen] = useState(false);
  const [activeControlCreatorId, setActiveControlCreatorId] = useState('global');
  const [isTextInspectorOpen, setIsTextInspectorOpen] = useState(false);
  const [activeTextInspectorKey, setActiveTextInspectorKey] = useState('main:title');
  const [isExportingJuceZipApp, setIsExportingJuceZipApp] = useState(false);

  const handleOpenControlCreator = (controlId: string) => {
    setActiveControlCreatorId(controlId);
    setIsControlCreatorOpen(true);
  };

  const handleOpenTextInspector = (key: string) => {
    setActiveTextInspectorKey(key);
    setIsTextInspectorOpen(true);
  };

  const handleQuickZipDownload = async () => {
    try {
      setIsExportingJuceZipApp(true);
      await exportJuceZipBundle({
        skin: currentSkin,
        knobPreset: currentKnobPreset,
        sliderPreset: currentSliderPreset,
        textureArchetype: currentTextureArchetype,
        lfoVisualPreset: currentLfoPreset,
        customization: uiCustomization
      });
      showToast('Downloaded complete JUCE ZIP bundle!');
    } catch (e) {
      console.error(e);
      showToast('Error exporting JUCE ZIP');
    } finally {
      setIsExportingJuceZipApp(false);
    }
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    localStorage.setItem('delayhost_active_skin', JSON.stringify(currentSkin));
  }, [currentSkin]);

  useEffect(() => {
    localStorage.setItem('delayhost_custom_presets', JSON.stringify(customPresets));
  }, [customPresets]);

  useEffect(() => {
    localStorage.setItem('delayhost_ui_customization', JSON.stringify(uiCustomization));
  }, [uiCustomization]);

  const handleSelectSkin = (skin: SkinDefinition) => {
    setCurrentSkin(skin);
    if (skin.textureArchetype) setCurrentTextureArchetype(skin.textureArchetype);
    if (skin.knobPreset) setCurrentKnobPreset(skin.knobPreset);
    if (skin.sliderPreset) setCurrentSliderPreset(skin.sliderPreset);
    if (skin.lfoPreset) setCurrentLfoPreset(skin.lfoPreset);
    getAmorphPatchConnection().connection.sendEventOrValue('themePreset', skin.id);

    setUiCustomization((prev) => ({
      ...prev,
      knobStyleOverride: skin.knobPreset?.style ?? skin.knobStyle,
      knobBodyColor: skin.knobPreset?.bodyColor ?? skin.knobBodyColor ?? skin.cream,
      knobAccentColor: skin.knobPreset?.accentColor ?? skin.knobAccentColor ?? skin.amber,
      knobPointerColor: skin.knobPreset?.pointerColor ?? skin.knobPointerColor ?? skin.ledRed,
      textColor: '#FFFFFF',
      headerTextColor: '#FFFFFF',
      valueTextColor: '#FFFFFF',
      sliderTrackColor: skin.sliderPreset?.trackColor ?? skin.sliderTrackColor ?? skin.panelDarker,
      sliderThumbColor: skin.sliderPreset?.thumbColor ?? skin.sliderThumbColor ?? skin.cream,
      sliderAccentColor: skin.sliderPreset?.accentColor ?? skin.sliderAccentColor ?? skin.secondaryAccent ?? skin.amber
    }));
    showToast(`Applied preset: ${skin.name}`);
  };

  const handleSaveCustom = (skin: SkinDefinition) => {
    const customSkin: SkinDefinition = {
      ...skin,
      id: 10000 + customPresets.length + 1,
      name: `${skin.name} (Custom)`
    };
    setCustomPresets((prev) => [customSkin, ...prev]);
    setCurrentSkin(customSkin);
    showToast(`Saved "${customSkin.name}" to custom library!`);
  };

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * PRESETS_1000.length);
    const picked = PRESETS_1000[randomIndex];
    handleSelectSkin(picked);
    showToast(`🎲 Randomly selected: ${picked.name}`);
  };

  // Section independence: Texture axis
  const handleApplyTexture = (archetype: TextureArchetype) => {
    setCurrentTextureArchetype(archetype);
    setCurrentSkin((prev) => ({
      ...prev,
      textureArchetype: archetype,
      panelTexture: archetype.baseModel,
      patternType: archetype.patternType,
      textureRoughness: archetype.roughness,
      textureContrast: archetype.contrast,
      liquidFlowAngle: archetype.liquidAngle,
      panelDark: archetype.primaryTint,
      panelDarker: archetype.secondaryTint,
      grainDensity: archetype.grainDensity,
      noiseOctaves: archetype.noiseOctaves,
      blendMode: archetype.blendMode,
      vignetteStrength: archetype.vignette
    }));
    showToast(`Applied Texture: ${archetype.name}`);
  };

  // Section independence: Knob axis
  const handleApplyKnob = (preset: KnobArchitectPreset) => {
    setCurrentKnobPreset(preset);
    setCurrentSkin((prev) => ({
      ...prev,
      knobPreset: preset,
      knobStyle: preset.style,
      bezelWidth: preset.bezelWidth,
      tickCount: preset.tickCount,
      tickSpread: preset.tickSpread,
      pointerThickness: preset.pointerThickness,
      pointerLengthRatio: preset.pointerLengthRatio,
      centerCapRatio: preset.centerCapRatio,
      glowIntensity: preset.glowIntensity,
      shadowDepth: preset.shadowDepth,
      metalRoughness: preset.metalRoughness
    }));
    setUiCustomization((prev) => ({
      ...prev,
      knobStyleOverride: preset.style,
      knobBodyColor: preset.bodyColor,
      knobAccentColor: preset.accentColor,
      knobPointerColor: preset.pointerColor,
      knobGlowIntensity: preset.glowIntensity
    }));
    showToast(`Applied Knob Style: ${preset.name}`);
  };

  // Section independence: Slider axis
  const handleApplySlider = (preset: SliderArchitectPreset) => {
    setCurrentSliderPreset(preset);
    setCurrentSkin((prev) => ({
      ...prev,
      sliderPreset: preset
    }));
    setUiCustomization((prev) => ({
      ...prev,
      sliderTrackStyleOverride: preset.trackStyle,
      sliderThumbStyleOverride: preset.thumbStyle,
      sliderTrackHeight: preset.trackHeight,
      sliderThumbWidth: preset.thumbWidth,
      sliderThumbHeight: preset.thumbHeight,
      sliderTrackColor: preset.trackColor,
      sliderThumbColor: preset.thumbColor,
      sliderAccentColor: preset.accentColor,
      sliderGlowIntensity: preset.glowIntensity
    }));
    showToast(`Applied Slider Architecture: ${preset.name}`);
  };

  // Section independence: LFO axis
  const handleApplyLfo = (preset: LfoVisualPreset) => {
    setCurrentLfoPreset(preset);
    setCurrentSkin((prev) => ({
      ...prev,
      lfoPreset: preset
    }));
    showToast(`Applied LFO Visualizer: ${preset.name}`);
  };

  const handleResetCustomization = () => {
    setUiCustomization(defaultUiCustomization(currentSkin));
    showToast('Reset UI layout & control geometry to defaults');
  };

  // Toggle Knob Glow Helper
  const toggleKnobGlow = () => {
    const nextGlow = !uiCustomization.knobGlowEnabled;
    setUiCustomization((prev) => ({
      ...prev,
      knobGlowEnabled: nextGlow
    }));
    setCurrentSkin((prev) => ({
      ...prev,
      knobGlowEnabled: nextGlow
    }));
    showToast(nextGlow ? '✨ Knob Glow ENABLED' : 'Knob Glow DISABLED (Clean Matte)');
  };

  // Fast Text Color Preset Quick-Action
  const applyTextColorPreset = (textColor: string, headerColor: string, valueColor: string, name: string) => {
    setUiCustomization((prev) => ({
      ...prev,
      textColor,
      headerTextColor: headerColor,
      valueTextColor: valueColor
    }));
    setCurrentSkin((prev) => ({
      ...prev,
      textColor,
      headerTextColor: headerColor,
      valueTextColor: valueColor
    }));
    showToast(`Applied text color theme: ${name}`);
  };

  return (
    <div className="min-h-screen bg-[#0C0E12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <header className="h-14 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between bg-[#12161F] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer hidden lg:flex items-center justify-center"
            title={isSidebarOpen ? 'Hide Studio Sidebar' : 'Show Studio Sidebar'}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4 text-cyan-400" /> : <PanelLeftOpen className="w-4 h-4 text-slate-400" />}
          </button>

          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
            DH
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
              DelayHost 2
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 p-1 bg-black/40 rounded-lg border border-white/5 text-xs">
          <button
            type="button"
            onClick={() => setActiveSection('studio')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'studio'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Live VST Rig</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('tools')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'tools'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Architects & Tools</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('export')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'export'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>JUCE C++ & XML Export</span>
          </button>
        </nav>

        {/* Quick Actions in Header */}
        <div className="flex items-center gap-2">
          {/* Quick Glow Toggle Button */}
          <button
            type="button"
            onClick={toggleKnobGlow}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
              uiCustomization.knobGlowEnabled
                ? 'bg-amber-950/80 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-slate-900/60 text-slate-400 border-white/20 hover:text-white'
            }`}
            title={uiCustomization.knobGlowEnabled ? 'Knob Glow is ON (Click to Remove)' : 'Knob Glow is OFF (Click to Add)'}
          >
            {uiCustomization.knobGlowEnabled ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="hidden sm:inline">Glow ON</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Glow OFF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRandomize}
            className="px-2.5 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/40 rounded-xl text-purple-300 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            title="Randomize skin and hardware settings (4,000 Presets)"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-400" />
            <span>Randomize</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenControlCreator('global')}
            className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 rounded-xl text-amber-300 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            title="Open Control Creator to customize individual knobs and sliders"
          >
            <Disc className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Control Creator</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenTextInspector('main:title')}
            className="px-2.5 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 rounded-xl text-cyan-300 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            title="Alter/remove text, change font size, typeface, and surface effects"
          >
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Faceplate Text</span>
          </button>

          <button
            type="button"
            onClick={handleQuickZipDownload}
            disabled={isExportingJuceZipApp}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs cursor-pointer transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-1.5 border border-amber-300/40 disabled:opacity-50"
            title="Single-click download of all JUCE C++ headers, implementation files, XML layout, and README in a .zip"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{isExportingJuceZipApp ? 'Bundling ZIP...' : 'Export JUCE (.ZIP)'}</span>
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Horizontal Nav Bar */}
      <div className="xl:hidden flex items-center overflow-x-auto bg-slate-900/70 backdrop-blur-xl border-b border-white/15 px-3 py-2 text-xs gap-2 scrollbar-none z-30">
        <button
          onClick={() => setActiveSection('studio')}
          className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-all ${activeSection === 'studio' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'}`}
        >
          🎛️ VST Rig
        </button>
        <button
          onClick={() => setActiveSection('tools')}
          className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-all ${activeSection === 'tools' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'}`}
        >
          🛠️ Tools & Catalogs
        </button>
        <button
          onClick={() => setActiveSection('export')}
          className={`py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-all ${activeSection === 'export' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-300 hover:text-white'}`}
        >
          ⚡ Export
        </button>
      </div>

      {/* Active Skin Ribbon Banner */}
      <div className="bg-[#10141D] border-b border-white/5 px-4 sm:px-6 py-2 flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-400 text-[11px]">ACTIVE SKIN:</span>
            <span className="font-bold text-cyan-300">{currentSkin.name}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">{currentSkin.category}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Texture:</span>
            <span className="text-white font-medium">{currentSkin.panelTexture}</span>
            <span>·</span>
            <span>Knob:</span>
            <span className="text-white font-medium">{uiCustomization.knobStyleOverride ?? currentSkin.knobStyle}</span>
            <span>·</span>
            <span>Glow:</span>
            <span className={uiCustomization.knobGlowEnabled ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
              {uiCustomization.knobGlowEnabled ? 'Active' : 'Off'}
            </span>
            <span>·</span>
            <span>Text:</span>
            <span className="w-2.5 h-2.5 rounded-full inline-block border border-white/20" style={{ backgroundColor: uiCustomization.textColor }} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">PALETTE:</span>
          <div className="flex h-3.5 w-32 rounded-full overflow-hidden shadow-inner border border-white/10">
            <div className="flex-1" style={{ backgroundColor: currentSkin.panelDark }} title={`panelDark: ${currentSkin.panelDark}`} />
            <div className="flex-1" style={{ backgroundColor: currentSkin.panelDarker }} title={`panelDarker: ${currentSkin.panelDarker}`} />
            <div className="flex-1" style={{ backgroundColor: uiCustomization.knobBodyColor }} title={`cream: ${uiCustomization.knobBodyColor}`} />
            <div className="flex-1" style={{ backgroundColor: uiCustomization.knobAccentColor }} title={`amber: ${uiCustomization.knobAccentColor}`} />
            <div className="flex-1" style={{ backgroundColor: uiCustomization.knobPointerColor }} title={`ledRed: ${uiCustomization.knobPointerColor}`} />
            <div className="flex-1" style={{ backgroundColor: currentSkin.ledOff }} title={`ledOff: ${currentSkin.ledOff}`} />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full">
        {/* Studio Sidebar */}
        {isSidebarOpen && (
          <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-4 p-4 border-r border-white/10 bg-[#12161F] shadow-xl">
            {/* Sidebar Section 1: Quick Text Color Tuner */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Type className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Text Color Tuner</span>
                </div>
                <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                  Live
                </span>
              </div>

              {/* Quick Text Palette Switchers */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => applyTextColorPreset('#FFFFFF', '#FFFFFF', '#38BDF8', 'Crisp White')}
                  className="px-2 py-1.5 rounded-lg bg-black/50 hover:bg-white/10 border border-white/10 text-slate-200 text-left flex items-center justify-between cursor-pointer transition-all"
                >
                  <span>⚪ Crisp White</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextColorPreset('#00E5FF', '#00E5FF', '#FF2BD6', 'Cyber Cyan')}
                  className="px-2 py-1.5 rounded-lg bg-black/50 hover:bg-white/10 border border-white/10 text-cyan-300 text-left flex items-center justify-between cursor-pointer transition-all"
                >
                  <span>⚡ Cyber Cyan</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextColorPreset('#E8A13A', '#E8A13A', '#F59E0B', 'Amber Gold')}
                  className="px-2 py-1.5 rounded-lg bg-black/50 hover:bg-white/10 border border-white/10 text-amber-300 text-left flex items-center justify-between cursor-pointer transition-all"
                >
                  <span>📻 Amber Gold</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => applyTextColorPreset('#00FF66', '#00FF66', '#00FF66', 'CRT Phosphor')}
                  className="px-2 py-1.5 rounded-lg bg-black/50 hover:bg-white/10 border border-white/10 text-emerald-300 text-left flex items-center justify-between cursor-pointer transition-all"
                >
                  <span>🟢 Phosphor</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                </button>
              </div>

              {/* Direct Color Pickers in Sidebar */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Labels:</span>
                  <input
                    type="color"
                    value={uiCustomization.textColor}
                    onChange={(e) =>
                      setUiCustomization((prev) => ({ ...prev, textColor: e.target.value.toUpperCase() }))
                    }
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    title="Change general text color"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Headers:</span>
                  <input
                    type="color"
                    value={uiCustomization.headerTextColor}
                    onChange={(e) =>
                      setUiCustomization((prev) => ({ ...prev, headerTextColor: e.target.value.toUpperCase() }))
                    }
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    title="Change header title color"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Values:</span>
                  <input
                    type="color"
                    value={uiCustomization.valueTextColor}
                    onChange={(e) =>
                      setUiCustomization((prev) => ({ ...prev, valueTextColor: e.target.value.toUpperCase() }))
                    }
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    title="Change numerical readout color"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Section 2: Knob Glow Optics */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Sun className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Knob Glow Optics</span>
                </div>
                <button
                  type="button"
                  onClick={toggleKnobGlow}
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full border cursor-pointer font-bold transition-all ${
                    uiCustomization.knobGlowEnabled
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {uiCustomization.knobGlowEnabled ? 'TOGGLE OFF' : 'TOGGLE ON'}
                </button>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {uiCustomization.knobGlowEnabled
                  ? 'Optical halo aura is active, radiating accent light around knobs.'
                  : 'Glow aura is removed. Knobs render with clean matte/machined bezels.'}
              </p>

              {uiCustomization.knobGlowEnabled && (
                <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Intensity</span>
                    <span className="text-cyan-300 font-mono">
                      {Math.round(uiCustomization.knobGlowIntensity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={uiCustomization.knobGlowIntensity}
                    onChange={(e) =>
                      setUiCustomization((prev) => ({
                        ...prev,
                        knobGlowIntensity: parseFloat(e.target.value)
                      }))
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Sidebar Section 3: 4-Axis Architecture Breakdown Cards */}
            <div className="relative z-10 flex flex-col gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Active 4-Axis Composition:
              </span>

              <div className="p-3 rounded-xl bg-black/40 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <div>
                    <span className="text-[11px] font-bold text-white block">1. Texture</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                      {currentTextureArchetype.name}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('tools')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                >
                  Edit →
                </button>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <div>
                    <span className="text-[11px] font-bold text-white block">2. Knob Dial</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                      {uiCustomization.knobStyleOverride ?? currentSkin.knobStyle}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('tools')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                >
                  Edit →
                </button>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <div>
                    <span className="text-[11px] font-bold text-white block">3. Slider Rail</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                      {currentSliderPreset.thumbStyle}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('tools')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                >
                  Edit →
                </button>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <div>
                    <span className="text-[11px] font-bold text-white block">4. LFO Scope</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[150px] block">
                      {currentLfoPreset.name}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('tools')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                >
                  Edit →
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Center Stage Area */}
        <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-6 w-full">
          {/* SECTION 1: STUDIO & LIVE VST RIG */}
          {activeSection === 'studio' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center">
                <VstContainer
                  skin={currentSkin}
                  onSkinChange={handleSelectSkin}
                  onRandomize={handleRandomize}
                  availableSkins={PRESETS_1000}
                  onOpenExporter={() => setActiveSection('export')}
                  onOpenCustomizer={() => setActiveSection('tools')}
                  knobPreset={currentKnobPreset}
                  textureArchetype={currentTextureArchetype}
                  sliderPreset={currentSliderPreset}
                  lfoVisualPreset={currentLfoPreset}
                  customization={uiCustomization}
                  wheelConfig={wheelConfig}
                  sliderConfig={sliderConfig}
                  customKnobs={customKnobs}
                  customSliders={customSliders}
                  customTexts={customTexts}
                  onOpenControlCreator={handleOpenControlCreator}
                  onOpenTextInspector={handleOpenTextInspector}
                />
              </div>

              {/* Quick Preset Audition Dock beneath Rig */}
              <div className="mt-4 p-4 rounded-xl bg-[#141820] border border-white/10 flex flex-col gap-3 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Quick Preset Audition Dock</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Audition skins with live textures, custom knobs, and instant glow feedback
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                  {PRESETS_1000.slice(0, 8).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectSkin(p)}
                      className={`p-2 rounded-lg border text-left flex flex-col gap-1.5 cursor-pointer transition-all ${
                        currentSkin.id === p.id
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-white/5 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <span className="font-semibold text-[10px] text-slate-200 truncate">
                        {p.name}
                      </span>
                      <div className="flex h-2 w-full rounded overflow-hidden">
                        <div className="flex-1" style={{ backgroundColor: p.panelDark }} />
                        <div className="flex-1" style={{ backgroundColor: p.amber }} />
                        <div className="flex-1" style={{ backgroundColor: p.ledRed }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADVANCED TOOLS */}
          {activeSection === 'tools' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <AdvancedTools
                  currentSkin={currentSkin}
                  onUpdateSkin={setCurrentSkin}
                  onSaveAsCustom={handleSaveCustom}
                  onRandomize={handleRandomize}
                  onOpenExporter={() => setActiveSection('export')}
                  onApplyTexture={handleApplyTexture}
                  onApplyKnob={handleApplyKnob}
                  onApplySlider={handleApplySlider}
                  onApplyLfoVisual={handleApplyLfo}
                  customization={uiCustomization}
                  onUpdateCustomization={setUiCustomization}
                  onResetCustomization={handleResetCustomization}
                  activeKnobPreset={currentKnobPreset}
                  activeTextureArchetype={currentTextureArchetype}
                  activeSliderPreset={currentSliderPreset}
                  activeLfoPreset={currentLfoPreset}
                />
              </div>
              <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
                <div className="w-full text-center pb-2 text-xs font-semibold text-slate-300">
                  Live VST Hardware Preview
                </div>
                <VstContainer
                  skin={currentSkin}
                  onSkinChange={handleSelectSkin}
                  availableSkins={PRESETS_1000}
                  onOpenExporter={() => setActiveSection('export')}
                  knobPreset={currentKnobPreset}
                  textureArchetype={currentTextureArchetype}
                  sliderPreset={currentSliderPreset}
                  lfoVisualPreset={currentLfoPreset}
                  customization={uiCustomization}
                  wheelConfig={wheelConfig}
                  sliderConfig={sliderConfig}
                  customKnobs={customKnobs}
                  customSliders={customSliders}
                  customTexts={customTexts}
                  onOpenControlCreator={handleOpenControlCreator}
                  onOpenTextInspector={handleOpenTextInspector}
                />
              </div>
            </div>
          )}

          {/* SECTION 5: CODE & ASSET EXPORTER */}
          {activeSection === 'export' && (
            <div className="flex flex-col gap-6">
              <CodeExporter
                skin={currentSkin}
                knobPreset={currentKnobPreset}
                textureArchetype={currentTextureArchetype}
                sliderPreset={currentSliderPreset}
                lfoVisualPreset={currentLfoPreset}
                customization={uiCustomization}
              />
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[880px] text-center pb-2 text-xs font-semibold text-slate-300">
                  Live Skinned VST Preview
                </div>
                <VstContainer
                  skin={currentSkin}
                  onSkinChange={handleSelectSkin}
                  availableSkins={PRESETS_1000}
                  onOpenExporter={() => setActiveSection('export')}
                  knobPreset={currentKnobPreset}
                  textureArchetype={currentTextureArchetype}
                  sliderPreset={currentSliderPreset}
                  lfoVisualPreset={currentLfoPreset}
                  customization={uiCustomization}
                  wheelConfig={wheelConfig}
                  sliderConfig={sliderConfig}
                  customKnobs={customKnobs}
                  customSliders={customSliders}
                  customTexts={customTexts}
                  onOpenControlCreator={handleOpenControlCreator}
                  onOpenTextInspector={handleOpenTextInspector}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Control Creator Drawer (Individual Knobs / Sliders Customization) */}
      <ControlCreatorDrawer
        isOpen={isControlCreatorOpen}
        onClose={() => setIsControlCreatorOpen(false)}
        activeControlId={activeControlCreatorId}
        onSelectControlId={setActiveControlCreatorId}
        wheelConfig={
          customKnobs[activeControlCreatorId]
            ? { ...wheelConfig, ...customKnobs[activeControlCreatorId] }
            : wheelConfig
        }
        sliderConfig={
          customSliders[activeControlCreatorId]
            ? { ...sliderConfig, ...customSliders[activeControlCreatorId] }
            : sliderConfig
        }
        onUpdateWheel={(cfg) => {
          if (activeControlCreatorId === 'global') {
            setWheelConfig(cfg);
          } else {
            setCustomKnobs((prev) => ({ ...prev, [activeControlCreatorId]: cfg }));
          }
        }}
        onUpdateSlider={(cfg) => {
          if (activeControlCreatorId === 'global') {
            setSliderConfig(cfg);
          } else {
            setCustomSliders((prev) => ({ ...prev, [activeControlCreatorId]: cfg }));
          }
        }}
      />

      {/* Faceplate & Text Customizer Drawer */}
      <TextInspectorDrawer
        isOpen={isTextInspectorOpen}
        onClose={() => setIsTextInspectorOpen(false)}
        activeKey={activeTextInspectorKey}
        onSelectKey={setActiveTextInspectorKey}
        customTexts={customTexts}
        onUpdateText={(key, cfg) => setCustomTexts((prev) => ({ ...prev, [key]: cfg }))}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 py-4 px-6 text-center text-[11px] text-slate-500 bg-[#0A0D12] flex items-center justify-between flex-wrap gap-2">
        <span>
          DelayHost VST Skin Studio · Strictly No DSP / No Audio Engine · Ready for YUP C++20 & JUCE 7/8
        </span>
        <span className="font-mono text-slate-600 text-[10px]">
          4,000 Textures · 4,000 Knobs · 4,000 Sliders · 4,000 LFOs
        </span>
      </footer>
    </div>
  );
}
