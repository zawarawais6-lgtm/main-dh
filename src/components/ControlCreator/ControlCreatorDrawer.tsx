import React, { useState, useEffect, useRef } from 'react';
import {
  WheelCreatorConfig,
  SliderCreatorConfig,
  DEFAULT_WHEEL_CONFIG,
  DEFAULT_SLIDER_CONFIG,
  WheelGearStyle,
  WheelGearTexture,
  WheelPauseStep,
  WheelPointerStyle,
  WheelRailStyle,
  WheelCapStyle,
  SliderHandleStyle,
  SliderPauseStep,
  SliderPointerStyle,
  SliderRulerStyle,
  SliderRailStyle
} from '../../types/controlCreator';
import { MiniRotaryDial } from './MiniRotaryDial';
import { WHEEL_CREATOR_PRESETS, SLIDER_CREATOR_PRESETS } from '../../data/controlCreatorPresets';
import { X, Sparkles, RotateCcw, Check, Sliders, Disc } from 'lucide-react';

export interface ControlItemTarget {
  id: string;
  name: string;
  page: 'main' | 'macros' | 'lfos' | 'nodes';
  type: 'wheel' | 'slider';
}

export const ALL_CONTROLLABLE_ITEMS: ControlItemTarget[] = [
  { id: 'global', name: 'Global Default (All Controls)', page: 'main', type: 'wheel' },
  // Main page
  { id: 'main_delay', name: 'Main: Delay Time', page: 'main', type: 'wheel' },
  { id: 'main_glide', name: 'Main: Glide', page: 'main', type: 'wheel' },
  { id: 'main_feedback', name: 'Main: Feedback', page: 'main', type: 'wheel' },
  { id: 'main_mix', name: 'Main: Mix', page: 'main', type: 'wheel' },
  { id: 'main_input_gain', name: 'Main: Input Gain', page: 'main', type: 'wheel' },
  { id: 'main_output_gain', name: 'Main: Output Gain', page: 'main', type: 'wheel' },
  { id: 'main_width', name: 'Main: Stereo Width', page: 'main', type: 'wheel' },
  { id: 'main_asym', name: 'Main: Delay Asym', page: 'main', type: 'wheel' },
  { id: 'main_duck', name: 'Main: Ducking', page: 'main', type: 'wheel' },
  // LFOs
  { id: 'lfo_rate', name: 'LFOs: Rate Slider', page: 'lfos', type: 'slider' },
  { id: 'lfo_depth', name: 'LFOs: Depth Slider', page: 'lfos', type: 'slider' },
  { id: 'lfo_phase', name: 'LFOs: Phase Slider', page: 'lfos', type: 'slider' },
  // Macros 1 to 16
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `macro_${i}`,
    name: `Macro ${i + 1}`,
    page: 'macros' as const,
    type: 'wheel' as const
  }))
];

interface ControlCreatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeControlId?: string;
  onSelectControlId?: (id: string) => void;
  wheelConfig: WheelCreatorConfig;
  sliderConfig: SliderCreatorConfig;
  onUpdateWheel: (cfg: WheelCreatorConfig) => void;
  onUpdateSlider: (cfg: SliderCreatorConfig) => void;
}

export const ControlCreatorDrawer: React.FC<ControlCreatorDrawerProps> = ({
  isOpen,
  onClose,
  activeControlId = 'global',
  onSelectControlId,
  wheelConfig,
  sliderConfig,
  onUpdateWheel,
  onUpdateSlider
}) => {
  const [activeTab, setActiveTab] = useState<'wheel' | 'slider' | 'button'>('wheel');
  const [selectedTargetId, setSelectedTargetId] = useState(activeControlId);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previewValue, setPreviewValue] = useState(0.42);
  const [presetsActive, setPresetsActive] = useState(true);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Sync incoming control ID
  useEffect(() => {
    if (activeControlId) {
      setSelectedTargetId(activeControlId);
      const target = ALL_CONTROLLABLE_ITEMS.find((c) => c.id === activeControlId);
      if (target?.type === 'slider') {
        setActiveTab('slider');
      } else if (target?.type === 'wheel') {
        setActiveTab('wheel');
      }
    }
  }, [activeControlId]);

  // Animation cycle
  useEffect(() => {
    if (!isAnimating) return;
    let frameId: number;
    let start = performance.now();
    const animate = (time: number) => {
      const elapsed = (time - start) / 1000;
      const val = 0.5 + 0.45 * Math.sin(elapsed * 2.2);
      setPreviewValue(val);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isAnimating]);

  if (!isOpen) return null;

  const currentTarget = ALL_CONTROLLABLE_ITEMS.find((c) => c.id === selectedTargetId);

  const handleRandomize = () => {
    if (activeTab === 'wheel') {
      const randomPreset = WHEEL_CREATOR_PRESETS[Math.floor(Math.random() * WHEEL_CREATOR_PRESETS.length)];
      onUpdateWheel({
        ...randomPreset.config,
        dentCount: Math.floor(Math.random() * 24),
        pointerDentSize: Number((Math.random() * 0.8).toFixed(2))
      });
    } else {
      const randomPreset = SLIDER_CREATOR_PRESETS[Math.floor(Math.random() * SLIDER_CREATOR_PRESETS.length)];
      onUpdateSlider({
        ...randomPreset.config,
        shadowSize: Number((Math.random() * 0.6).toFixed(2))
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 select-none">
      {/* Outer Window Box matching screenshot */}
      <div className="w-full max-w-[1240px] h-[92vh] max-h-[820px] bg-[#1E252B] border border-[#333E48] rounded-md shadow-2xl flex flex-col overflow-hidden text-slate-200 font-sans text-xs">
        {/* Title Bar */}
        <div className="h-8 bg-[#181E23] border-b border-[#2C353D] px-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 tracking-wide text-xs">Control Creator</span>
            <span className="text-slate-500">|</span>
            {/* Target Control Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Targeting:</span>
              <select
                value={selectedTargetId}
                onChange={(e) => {
                  setSelectedTargetId(e.target.value);
                  onSelectControlId?.(e.target.value);
                  const item = ALL_CONTROLLABLE_ITEMS.find((c) => c.id === e.target.value);
                  if (item?.type === 'slider') setActiveTab('slider');
                  else if (item?.type === 'wheel') setActiveTab('wheel');
                }}
                className="bg-[#12161A] text-amber-400 font-semibold text-[11px] px-2 py-0.5 rounded border border-[#2D3841] outline-none"
              >
                {ALL_CONTROLLABLE_ITEMS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Action & Tab Subheader Bar */}
        <div className="h-10 bg-[#222A31] border-b border-[#2C353D] px-3 flex items-center justify-between">
          {/* Main Mode Tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('wheel')}
              className={`px-3 py-1 font-semibold text-xs rounded transition-colors ${
                activeTab === 'wheel'
                  ? 'text-[#55E68C] bg-[#182025] shadow-inner border-b-2 border-[#55E68C]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wheel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('slider')}
              className={`px-3 py-1 font-semibold text-xs rounded transition-colors ${
                activeTab === 'slider'
                  ? 'text-[#55E68C] bg-[#182025] shadow-inner border-b-2 border-[#55E68C]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Slider
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('button')}
              className={`px-3 py-1 font-semibold text-xs rounded transition-colors ${
                activeTab === 'button'
                  ? 'text-[#55E68C] bg-[#182025] shadow-inner border-b-2 border-[#55E68C]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Button
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {saveNotification && (
              <span className="text-[11px] text-[#55E68C] font-mono animate-fade-in flex items-center gap-1">
                <Check size={12} />
                {saveNotification}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSaveNotification(`Saved: ${currentTarget?.name ?? 'Control'}`);
                setTimeout(() => setSaveNotification(null), 3000);
              }}
              className="px-2.5 py-1 bg-[#182026] hover:bg-[#202B33] border border-[#35414C] rounded text-[11px] text-slate-300 font-medium transition-colors"
            >
              Save in presets
            </button>
            <button
              type="button"
              onClick={handleRandomize}
              className="px-2.5 py-1 bg-[#182026] hover:bg-[#202B33] border border-[#35414C] rounded text-[11px] text-slate-300 font-medium transition-colors flex items-center gap-1"
            >
              <Sparkles size={12} className="text-amber-400" />
              Randomize
            </button>
            <button
              type="button"
              onClick={() => setPresetsActive(!presetsActive)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                presetsActive
                  ? 'bg-[#182026] text-[#55E68C] border-[#55E68C]'
                  : 'bg-[#182026] text-slate-400 border-[#35414C]'
              }`}
            >
              Presets
            </button>
          </div>
        </div>

        {/* Content Body: Left Panels + Center Preview + Right Presets */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Parameters Inspector Grid */}
          <div className="w-[430px] p-3 overflow-y-auto border-r border-[#2C353D] flex flex-col gap-3 bg-[#1B2127]">
            {activeTab === 'wheel' ? (
              <>
                {/* 1. Gear Box */}
                <div className="bg-[#222A30] border border-[#2D3840] rounded p-2.5 flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-slate-300">Gear</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Style</span>
                      <select
                        value={wheelConfig.gearStyle}
                        onChange={(e) =>
                          onUpdateWheel({ ...wheelConfig, gearStyle: e.target.value as WheelGearStyle })
                        }
                        className="bg-[#15191D] border border-[#2F3A43] text-slate-200 text-[11px] px-1.5 py-0.5 rounded w-28"
                      >
                        <option value="None">None</option>
                        <option value="Notched">Notched</option>
                        <option value="Milled">Milled</option>
                        <option value="VintageTeeth">VintageTeeth</option>
                        <option value="Segmented">Segmented</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Texture</span>
                      <select
                        value={wheelConfig.gearTexture}
                        onChange={(e) =>
                          onUpdateWheel({ ...wheelConfig, gearTexture: e.target.value as WheelGearTexture })
                        }
                        className="bg-[#15191D] border border-[#2F3A43] text-slate-200 text-[11px] px-1.5 py-0.5 rounded w-28"
                      >
                        <option value="Glow">Glow</option>
                        <option value="Brushed">Brushed</option>
                        <option value="Matte">Matte</option>
                        <option value="Glossy">Glossy</option>
                        <option value="Metallic">Metallic</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Color</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={wheelConfig.gearColor}
                        onChange={(e) => onUpdateWheel({ ...wheelConfig, gearColor: e.target.value })}
                        className="bg-[#15191D] border border-[#2F3A43] text-slate-200 font-mono text-[10px] px-1.5 py-0.5 rounded w-20"
                      />
                      <input
                        type="color"
                        value={wheelConfig.gearColor.length === 7 ? wheelConfig.gearColor : '#3F484D'}
                        onChange={(e) => onUpdateWheel({ ...wheelConfig, gearColor: e.target.value })}
                        className="w-5 h-5 rounded border border-[#2F3A43] cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <MiniRotaryDial
                      label="Size"
                      value={wheelConfig.gearSize}
                      min={0.5}
                      max={1.5}
                      step={0.01}
                      onChange={(v) => onUpdateWheel({ ...wheelConfig, gearSize: v })}
                    />
                    <MiniRotaryDial
                      label="Shadow size"
                      value={wheelConfig.gearShadowSize}
                      min={0}
                      max={1.0}
                      step={0.01}
                      onChange={(v) => onUpdateWheel({ ...wheelConfig, gearShadowSize: v })}
                    />
                  </div>
                </div>

                {/* 2. Dent Box */}
                <div className="bg-[#222A30] border border-[#2D3840] rounded p-2.5 flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-slate-300">Dent</span>
                  <div className="grid grid-cols-3 gap-1">
                    <MiniRotaryDial
                      label="Count"
                      value={wheelConfig.dentCount}
                      min={0}
                      max={36}
                      step={1}
                      format={(v) => Math.round(v).toString()}
                      onChange={(v) => onUpdateWheel({ ...wheelConfig, dentCount: Math.round(v) })}
                    />
                    <MiniRotaryDial
                      label="Gap"
                      value={wheelConfig.dentGap}
                      min={-1.0}
                      max={1.0}
                      step={0.02}
                      onChange={(v) => onUpdateWheel({ ...wheelConfig, dentGap: v })}
                    />
                    <MiniRotaryDial
                      label="Size"
                      value={wheelConfig.dentSize}
                      min={0.01}
                      max={0.2}
                      step={0.01}
                      onChange={(v) => onUpdateWheel({ ...wheelConfig, dentSize: v })}
                    />
                  </div>
                </div>

                {/* 3. Fill & Various Box */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Fill */}
                  <div className="bg-[#222A30] border border-[#2D3840] rounded p-2 flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-300">Fill</span>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Fill color</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={wheelConfig.fillColor.length === 7 ? wheelConfig.fillColor : '#7D3986'}
                          onChange={(e) => onUpdateWheel({ ...wheelConfig, fillColor: e.target.value })}
                          className="w-5 h-5 rounded cursor-pointer border border-[#3A4550] bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Pressed</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={wheelConfig.pressedColor.length === 7 ? wheelConfig.pressedColor : '#ED94FF'}
                          onChange={(e) => onUpdateWheel({ ...wheelConfig, pressedColor: e.target.value })}
                          className="w-5 h-5 rounded cursor-pointer border border-[#3A4550] bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Various */}
                  <div className="bg-[#222A30] border border-[#2D3840] rounded p-2 flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-300">Various</span>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Pause step</span>
                      <select
                        value={wheelConfig.pauseStep}
                        onChange={(e) =>
                          onUpdateWheel({ ...wheelConfig, pauseStep: e.target.value as WheelPauseStep })
                        }
                        className="bg-[#15191D] border border-[#2F3A43] text-slate-200 text-[10px] px-1 py-0.5 rounded w-20"
                      >
                        <option value="InRuler">InRuler</option>
                        <option value="Continuous">Continuous</option>
                        <option value="Snap12">Snap12</option>
                        <option value="Snap24">Snap24</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Pointer</span>
                      <select
                        value={wheelConfig.pointer}
                        onChange={(e) =>
                          onUpdateWheel({ ...wheelConfig, pointer: e.target.value as WheelPointerStyle })
                        }
                        className="bg-[#15191D] border border-[#2F3A43] text-slate-200 text-[10px] px-1 py-0.5 rounded w-20"
                      >
                        <option value="BevelledLine">BevelledLine</option>
                        <option value="CarvedLine">CarvedLine</option>
                        <option value="NotchDot">NotchDot</option>
                        <option value="Needle">Needle</option>
                        <option value="Triangle">Triangle</option>
                      </select>
                    </div>
                    <MiniRotaryDial
                      label="Dent size"
                      value={wheelConfig.pointerDentSize}
                      min={0.1}
                      max={1.0}
                      step={0.02}
                      onChange={(v) => onUpdateWheel({ ...wheelConfig, pointerDentSize: v })}
                    />
                  </div>
                </div>

                {/* 4. Rail & Options */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#222A30] border border-[#2D3840] rounded p-2 flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-300">Rail</span>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Style</span>
                      <select
                        value={wheelConfig.railStyle}
                        onChange={(e) =>
                          onUpdateWheel({ ...wheelConfig, railStyle: e.target.value as WheelRailStyle })
                        }
                        className="bg-[#15191D] border border-[#2F3A43] text-slate-200 text-[10px] px-1 py-0.5 rounded w-20"
                      >
                        <option value="FlatGauge">FlatGauge</option>
                        <option value="ArcRing">ArcRing</option>
                        <option value="Dots">Dots</option>
                        <option value="RadialNotches">RadialNotches</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Color</span>
                      <input
                        type="color"
                        value={wheelConfig.railColor.length === 7 ? wheelConfig.railColor : '#3F484D'}
                        onChange={(e) => onUpdateWheel({ ...wheelConfig, railColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border border-[#3A4550] bg-transparent"
                      />
                    </div>
                    <MiniRotaryDial
                      label="Big Steps"
                      value={wheelConfig.rulerBigSteps}
                      min={0}
                      max={12}
                      step={1}
                      format={(v) => Math.round(v).toString()}
                      onChange={(v) => onUpdateWheel({ ...wheelConfig, rulerBigSteps: Math.round(v) })}
                    />
                    <MiniRotaryDial
                      label="Small Steps"
                      value={wheelConfig.rulerSmallSteps}
                      min={0}
                      max={24}
                      step={1}
                      format={(v) => Math.round(v).toString()}
                      onChange={(v) => onUpdateWheel({ ...wheelConfig, rulerSmallSteps: Math.round(v) })}
                    />
                  </div>

                  {/* Options */}
                  <div className="bg-[#222A30] border border-[#2D3840] rounded p-2 flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-300">Options</span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={wheelConfig.pointerOnCap}
                        onChange={(e) => onUpdateWheel({ ...wheelConfig, pointerOnCap: e.target.checked })}
                        className="rounded accent-amber-500"
                      />
                      <span>Pointer on cap</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={wheelConfig.reflection}
                        onChange={(e) => onUpdateWheel({ ...wheelConfig, reflection: e.target.checked })}
                        className="rounded accent-amber-500"
                      />
                      <span>Reflection</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={wheelConfig.fillRuler}
                        onChange={(e) => onUpdateWheel({ ...wheelConfig, fillRuler: e.target.checked })}
                        className="rounded accent-amber-500"
                      />
                      <span>Fill ruler</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={wheelConfig.snapRuler}
                        onChange={(e) => onUpdateWheel({ ...wheelConfig, snapRuler: e.target.checked })}
                        className="rounded accent-amber-500"
                      />
                      <span>Snap ruler</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={wheelConfig.fillRail}
                        onChange={(e) => onUpdateWheel({ ...wheelConfig, fillRail: e.target.checked })}
                        className="rounded accent-amber-500"
                      />
                      <span>Fill rail</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={wheelConfig.snapHandle}
                        onChange={(e) => onUpdateWheel({ ...wheelConfig, snapHandle: e.target.checked })}
                        className="rounded accent-amber-500"
                      />
                      <span>Snap handle</span>
                    </label>
                  </div>
                </div>

                {/* 5. Cap Box */}
                <div className="bg-[#222A30] border border-[#2D3840] rounded p-2.5 flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-slate-300">Cap</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Style</span>
                      <select
                        value={wheelConfig.capStyle}
                        onChange={(e) =>
                          onUpdateWheel({ ...wheelConfig, capStyle: e.target.value as WheelCapStyle })
                        }
                        className="bg-[#15191D] border border-[#2F3A43] text-slate-200 text-[11px] px-1.5 py-0.5 rounded w-24"
                      >
                        <option value="Bevelled">Bevelled</option>
                        <option value="Flat">Flat</option>
                        <option value="Convex">Convex</option>
                        <option value="Dome">Dome</option>
                        <option value="MilledRim">MilledRim</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Color</span>
                      <input
                        type="color"
                        value={wheelConfig.capColor.length === 7 ? wheelConfig.capColor : '#3F484D'}
                        onChange={(e) => onUpdateWheel({ ...wheelConfig, capColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border border-[#3A4550] bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <MiniRotaryDial
                      label="Size"
                      value={wheelConfig.capSize}
                      min={0.4}
                      max={1.0}
                      step={0.01}
                      onChange={(v) => onUpdateWheel({ ...wheelConfig, capSize: v })}
                    />
                    <MiniRotaryDial
                      label="Shadow size"
                      value={wheelConfig.capShadowSize}
                      min={0}
                      max={1.0}
                      step={0.01}
                      onChange={(v) => onUpdateWheel({ ...wheelConfig, capShadowSize: v })}
                    />
                  </div>
                </div>
              </>
            ) : (
              /* SLIDER INSPECTOR */
              <>
                {/* 1. Handle Box */}
                <div className="bg-[#222A30] border border-[#2D3840] rounded p-2.5 flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-slate-300">Handle</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Style</span>
                    <select
                      value={sliderConfig.handleStyle}
                      onChange={(e) =>
                        onUpdateSlider({ ...sliderConfig, handleStyle: e.target.value as SliderHandleStyle })
                      }
                      className="bg-[#15191D] border border-[#2F3A43] text-slate-200 text-[11px] px-1.5 py-0.5 rounded w-32"
                    >
                      <option value="Classic">Classic</option>
                      <option value="FaderCap">FaderCap</option>
                      <option value="Knurled">Knurled</option>
                      <option value="Slim">Slim</option>
                      <option value="ConsoleFader">ConsoleFader</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Color</span>
                      <input
                        type="color"
                        value={sliderConfig.handleColor.length === 7 ? sliderConfig.handleColor : '#8B8E97'}
                        onChange={(e) => onUpdateSlider({ ...sliderConfig, handleColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border border-[#3A4550] bg-transparent"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Pressed</span>
                      <input
                        type="color"
                        value={sliderConfig.handlePressedColor.length === 7 ? sliderConfig.handlePressedColor : '#93969F'}
                        onChange={(e) => onUpdateSlider({ ...sliderConfig, handlePressedColor: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border border-[#3A4550] bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <MiniRotaryDial
                      label="Corner size"
                      value={sliderConfig.cornerSize}
                      min={0}
                      max={1}
                      step={0.05}
                      onChange={(v) => onUpdateSlider({ ...sliderConfig, cornerSize: v })}
                    />
                    <MiniRotaryDial
                      label="Corner aspect"
                      value={sliderConfig.cornerAspect}
                      min={0}
                      max={2}
                      step={0.05}
                      onChange={(v) => onUpdateSlider({ ...sliderConfig, cornerAspect: v })}
                    />
                    <MiniRotaryDial
                      label="Pinch"
                      value={sliderConfig.pinch}
                      min={0}
                      max={1}
                      step={0.02}
                      onChange={(v) => onUpdateSlider({ ...sliderConfig, pinch: v })}
                    />
                    <MiniRotaryDial
                      label="Middle"
                      value={sliderConfig.middle}
                      min={0}
                      max={1}
                      step={0.05}
                      onChange={(v) => onUpdateSlider({ ...sliderConfig, middle: v })}
                    />
                    <MiniRotaryDial
                      label="Size"
                      value={sliderConfig.handleSize}
                      min={16}
                      max={60}
                      step={1}
                      format={(v) => Math.round(v).toString()}
                      onChange={(v) => onUpdateSlider({ ...sliderConfig, handleSize: Math.round(v) })}
                    />
                    <MiniRotaryDial
                      label="Size aspect"
                      value={sliderConfig.sizeAspect}
                      min={0.2}
                      max={1.5}
                      step={0.02}
                      onChange={(v) => onUpdateSlider({ ...sliderConfig, sizeAspect: v })}
                    />
                  </div>
                </div>

                {/* 2. Rail Box */}
                <div className="bg-[#222A30] border border-[#2D3840] rounded p-2.5 flex flex-col gap-2">
                  <span className="text-[11px] font-semibold text-slate-300">Rail</span>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Style</span>
                    <select
                      value={sliderConfig.railStyle}
                      onChange={(e) =>
                        onUpdateSlider({ ...sliderConfig, railStyle: e.target.value as SliderRailStyle })
                      }
                      className="bg-[#15191D] border border-[#2F3A43] text-slate-200 text-[11px] px-1.5 py-0.5 rounded w-32"
                    >
                      <option value="Line">Line</option>
                      <option value="Slot">Slot</option>
                      <option value="Groove">Groove</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Color</span>
                    <input
                      type="color"
                      value={sliderConfig.railColor.length === 7 ? sliderConfig.railColor : '#000000'}
                      onChange={(e) => onUpdateSlider({ ...sliderConfig, railColor: e.target.value })}
                      className="w-5 h-5 rounded cursor-pointer border border-[#3A4550] bg-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <MiniRotaryDial
                      label="Size"
                      value={sliderConfig.railSize}
                      min={1}
                      max={12}
                      step={1}
                      format={(v) => Math.round(v).toString()}
                      onChange={(v) => onUpdateSlider({ ...sliderConfig, railSize: Math.round(v) })}
                    />
                    <MiniRotaryDial
                      label="Outline"
                      value={sliderConfig.outline}
                      min={0}
                      max={3}
                      step={0.1}
                      onChange={(v) => onUpdateSlider({ ...sliderConfig, outline: v })}
                    />
                  </div>
                </div>

                {/* 3. Ruler & Options */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#222A30] border border-[#2D3840] rounded p-2 flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-300">Ruler</span>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Style</span>
                      <select
                        value={sliderConfig.rulerStyle}
                        onChange={(e) =>
                          onUpdateSlider({ ...sliderConfig, rulerStyle: e.target.value as SliderRulerStyle })
                        }
                        className="bg-[#15191D] border border-[#2F3A43] text-slate-200 text-[10px] px-1 py-0.5 rounded w-20"
                      >
                        <option value="RulerOut">RulerOut</option>
                        <option value="RulerIn">RulerIn</option>
                        <option value="Bilateral">Bilateral</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                    <MiniRotaryDial
                      label="Pan"
                      value={sliderConfig.pan}
                      min={-1}
                      max={1}
                      step={0.05}
                      onChange={(v) => onUpdateSlider({ ...sliderConfig, pan: v })}
                    />
                  </div>

                  <div className="bg-[#222A30] border border-[#2D3840] rounded p-2 flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-300">Options</span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={sliderConfig.snapRuler}
                        onChange={(e) => onUpdateSlider({ ...sliderConfig, snapRuler: e.target.checked })}
                        className="rounded accent-amber-500"
                      />
                      <span>Snap ruler</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={sliderConfig.fillRail}
                        onChange={(e) => onUpdateSlider({ ...sliderConfig, fillRail: e.target.checked })}
                        className="rounded accent-amber-500"
                      />
                      <span>Fill rail</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-300">
                      <input
                        type="checkbox"
                        checked={sliderConfig.snapHandle}
                        onChange={(e) => onUpdateSlider({ ...sliderConfig, snapHandle: e.target.checked })}
                        className="rounded accent-amber-500"
                      />
                      <span>Snap handle</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CENTER: Multi-Size Live Previews Area */}
          <div className="flex-1 bg-[#151B20] p-4 flex flex-col justify-between overflow-hidden relative">
            {activeTab === 'wheel' ? (
              <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* 3 Knob Preview Showcase with Generous Spacing */}
                <div className="w-full max-w-[460px] min-h-[340px] relative flex flex-col items-center justify-between py-2 gap-4">
                  {/* Top Row: Compact and Standard knobs */}
                  <div className="w-full flex items-center justify-between px-8">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-mono text-white">Compact (48px)</span>
                      <WheelRenderer
                        config={wheelConfig}
                        value={previewValue}
                        size={48}
                        onChange={setPreviewValue}
                      />
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-mono text-white">Standard (68px)</span>
                      <WheelRenderer
                        config={wheelConfig}
                        value={previewValue}
                        size={68}
                        onChange={setPreviewValue}
                      />
                    </div>
                  </div>

                  {/* Center-bottom large primary hero dial */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-mono text-white font-bold uppercase tracking-wider">
                      Master Dial (140px)
                    </span>
                    <WheelRenderer
                      config={wheelConfig}
                      value={previewValue}
                      size={140}
                      onChange={setPreviewValue}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Slider Previews Showcase matching screenshot 2 */
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                {/* Staggered Vertical Faders Grid */}
                <div className="flex items-center justify-center gap-8 h-56">
                  {[0.75, 0.55, 0.35, 0.85].map((val, idx) => (
                    <SliderPreviewTrack
                      key={idx}
                      config={sliderConfig}
                      value={isAnimating ? previewValue : val}
                      height={190}
                    />
                  ))}
                </div>

                {/* Horizontal Fader */}
                <div className="w-64">
                  <HorizontalSliderPreviewTrack
                    config={sliderConfig}
                    value={previewValue}
                    width={240}
                  />
                </div>
              </div>
            )}

            {/* Bottom Bar: Animate Toggle & Value Readout */}
            <div className="h-9 border-t border-[#2C353D] flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isAnimating}
                  onChange={(e) => setIsAnimating(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <span>Animate</span>
              </label>

              <div className="font-mono text-xs text-slate-400">
                VALUE: <span className="text-amber-400 font-bold">{(previewValue * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Presets Thumbnail Gallery matching screenshot */}
          {presetsActive && (
            <div className="w-64 border-l border-[#2C353D] bg-[#1A2026] flex flex-col overflow-hidden">
              <div className="p-2 border-b border-[#2C353D] text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Presets Gallery</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {activeTab === 'wheel' ? WHEEL_CREATOR_PRESETS.length : SLIDER_CREATOR_PRESETS.length} STYLES
                </span>
              </div>

              <div className="flex-1 p-2 overflow-y-auto grid grid-cols-2 gap-2">
                {activeTab === 'wheel'
                  ? WHEEL_CREATOR_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onUpdateWheel(p.config)}
                        className="bg-[#20272F] hover:bg-[#2A343E] border border-[#2F3A44] hover:border-amber-500/60 rounded p-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 flex items-center justify-center pointer-events-none">
                          <WheelRenderer config={p.config} value={0.65} size={42} />
                        </div>
                        <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center group-hover:text-amber-300">
                          {p.name}
                        </span>
                      </button>
                    ))
                  : SLIDER_CREATOR_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onUpdateSlider(p.config)}
                        className="bg-[#20272F] hover:bg-[#2A343E] border border-[#2F3A44] hover:border-amber-500/60 rounded p-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-16 flex items-center justify-center pointer-events-none">
                          <SliderPreviewTrack config={p.config} value={0.6} height={50} />
                        </div>
                        <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center group-hover:text-amber-300">
                          {p.name}
                        </span>
                      </button>
                    ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Dedicated Interactive SVG Wheel Renderer for Control Creator
 */
function WheelRenderer({
  config,
  value,
  size = 80,
  onChange
}: {
  config: WheelCreatorConfig;
  value: number;
  size?: number;
  onChange?: (val: number) => void;
}) {
  const safeConfig = { ...DEFAULT_WHEEL_CONFIG, ...config };
  const uid = React.useId().replace(/:/g, '_');
  const capGradId = `capGrad_${uid}_${size}`;
  const bezelGradId = `bezelGrad_${uid}_${size}`;

  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef(0);
  const startValRef = useRef(value);

  const startAngle = -135;
  const endAngle = 135;
  const clampedVal = Math.max(0, Math.min(1, typeof value === 'number' && !isNaN(value) ? value : 0));
  const currentAngle = startAngle + clampedVal * (endAngle - startAngle);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onChange) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    startValRef.current = clampedVal;
  };

  useEffect(() => {
    if (!isDragging || !onChange) return;
    const handleMove = (e: MouseEvent) => {
      const dy = dragStartYRef.current - e.clientY;
      const delta = dy / 160;
      let next = Math.max(0, Math.min(1, startValRef.current + delta));

      // Optional Snapping based on pauseStep
      if (safeConfig.pauseStep === 'Snap12') {
        next = Math.round(next * 12) / 12;
      } else if (safeConfig.pauseStep === 'Snap24') {
        next = Math.round(next * 24) / 24;
      } else if (safeConfig.pauseStep === 'InRuler' && safeConfig.rulerSmallSteps > 0) {
        next = Math.round(next * safeConfig.rulerSmallSteps) / safeConfig.rulerSmallSteps;
      }

      onChange(Number(next.toFixed(3)));
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, onChange, safeConfig.pauseStep, safeConfig.rulerSmallSteps]);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = (size / 2) * 0.94;
  const railR = outerR * 0.88;

  // Polar to Cartesian with 0° at 12 o'clock, clockwise positive
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad)
    };
  };

  // Rail Track Arc (-135° to +135°, total 270° sweep)
  const trackStart = polarToCartesian(cx, cy, railR, startAngle);
  const trackEnd = polarToCartesian(cx, cy, railR, endAngle);
  const trackPath = `M ${trackStart.x.toFixed(2)} ${trackStart.y.toFixed(2)} A ${railR.toFixed(2)} ${railR.toFixed(2)} 0 1 1 ${trackEnd.x.toFixed(2)} ${trackEnd.y.toFixed(2)}`;

  // Active Fill Gauge Arc (-135° to currentAngle)
  const angleSweep = Math.max(1, currentAngle - startAngle);
  const largeArcFlag = angleSweep > 180 ? 1 : 0;
  const fillEnd = polarToCartesian(cx, cy, railR, startAngle + angleSweep);
  const fillPath = `M ${trackStart.x.toFixed(2)} ${trackStart.y.toFixed(2)} A ${railR.toFixed(2)} ${railR.toFixed(2)} 0 ${largeArcFlag} 1 ${fillEnd.x.toFixed(2)} ${fillEnd.y.toFixed(2)}`;

  // Cap geometry
  const capRadius = railR * Math.min(0.92, Math.max(0.45, safeConfig.capSize || 0.72));
  const pointerLength = capRadius * (safeConfig.pointerOnCap ? 0.82 : 1.12);
  const pointerEnd = polarToCartesian(cx, cy, pointerLength, currentAngle);
  const pointerStart = polarToCartesian(cx, cy, capRadius * 0.18, currentAngle);

  // Ruler ticks count
  const bigTicks = Math.max(3, Math.min(17, safeConfig.rulerBigSteps || 7));

  return (
    <div
      className={`relative cursor-ns-resize flex flex-col items-center select-none ${
        isDragging ? 'scale-105' : ''
      } transition-transform`}
      style={{ width: size }}
      onMouseDown={handleMouseDown}
      title="Click & drag vertically to rotate dial"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          {/* Radial Metallic Cap Gradient */}
          <radialGradient id={capGradId} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={safeConfig.capStyle === 'Dome' ? '0.45' : '0.25'} />
            <stop offset="45%" stopColor={safeConfig.capColor || '#E2E8F0'} stopOpacity="1" />
            <stop offset="95%" stopColor="#0B0E11" stopOpacity="1" />
          </radialGradient>

          {/* Outer Bezel Rim Gradient */}
          <linearGradient id={bezelGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3A4652" />
            <stop offset="50%" stopColor="#1C2329" />
            <stop offset="100%" stopColor="#0D1115" />
          </linearGradient>
        </defs>

        {/* 1. Outer Chassis Well */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill={`url(#${bezelGradId})`}
          stroke="#0F1317"
          strokeWidth={size > 60 ? 2 : 1.2}
        />

        {/* 2. Arc Gauge Track */}
        {safeConfig.railStyle === 'ArcRing' ? (
          <>
            <path
              d={trackPath}
              fill="none"
              stroke={safeConfig.railColor || '#323F4B'}
              strokeWidth={size > 70 ? 4 : 2.5}
              strokeLinecap="round"
              opacity={0.5}
            />
            <circle
              cx={cx}
              cy={cy}
              r={railR * 0.94}
              fill="none"
              stroke={safeConfig.railColor || '#323F4B'}
              strokeWidth={1}
              opacity={0.3}
            />
          </>
        ) : safeConfig.railStyle === 'Dots' ? (
          <path
            d={trackPath}
            fill="none"
            stroke={safeConfig.railColor || '#323F4B'}
            strokeWidth={size > 70 ? 3.5 : 2}
            strokeDasharray="2.5 5"
            strokeLinecap="round"
            opacity={0.7}
          />
        ) : safeConfig.railStyle !== 'None' ? (
          <path
            d={trackPath}
            fill="none"
            stroke={safeConfig.railColor || '#323F4B'}
            strokeWidth={size > 70 ? 4 : 2.5}
            strokeLinecap="round"
            opacity={0.5}
          />
        ) : null}

        {/* 3. Ruler Ticks (Major) */}
        {safeConfig.railStyle !== 'None' &&
          Array.from({ length: bigTicks }).map((_, i) => {
            const tickDeg = startAngle + (i / (bigTicks - 1)) * (endAngle - startAngle);
            const isLit = safeConfig.fillRuler && tickDeg <= currentAngle;
            const p1 = polarToCartesian(cx, cy, railR + (size > 60 ? 3 : 2), tickDeg);
            const p2 = polarToCartesian(cx, cy, railR + (size > 60 ? 7 : 4), tickDeg);
            return (
              <line
                key={`bt-${i}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isLit ? safeConfig.fillColor : safeConfig.railColor || '#627D98'}
                strokeWidth={size > 60 ? 1.8 : 1.2}
                strokeLinecap="round"
                opacity={isLit ? 1 : 0.65}
              />
            );
          })}

        {/* 4. Active Illuminated Fill Arc */}
        {clampedVal > 0.005 && safeConfig.railStyle !== 'None' && (
          <path
            d={fillPath}
            fill="none"
            stroke={safeConfig.fillColor || '#F59E0B'}
            strokeWidth={size > 70 ? 4.5 : 2.8}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 ${size > 60 ? 4 : 2}px ${safeConfig.fillColor || '#F59E0B'}99)`
            }}
          />
        )}

        {/* 5. Knurled Gear Dent Teeth (Rotating with Dial) */}
        {safeConfig.gearStyle !== 'None' &&
          Array.from({ length: Math.max(6, safeConfig.dentCount || 18) }).map((_, i) => {
            const count = Math.max(6, safeConfig.dentCount || 18);
            const notchAngle = (i / count) * 360 + currentAngle;
            const toothInner = capRadius * 0.94;
            const toothOuter = capRadius * (1.0 + (safeConfig.dentSize || 0.12) * 0.35);
            const p1 = polarToCartesian(cx, cy, toothInner, notchAngle);
            const p2 = polarToCartesian(cx, cy, toothOuter, notchAngle);
            return (
              <line
                key={`dent-${i}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={safeConfig.gearColor || '#9AA5B1'}
                strokeWidth={size > 60 ? 2 : 1.3}
                strokeLinecap="round"
                opacity={0.8}
              />
            );
          })}

        {/* 6. Cap Body with Bevel and Shadow */}
        <circle
          cx={cx}
          cy={cy}
          r={capRadius}
          fill={`url(#${capGradId})`}
          stroke="#11161B"
          strokeWidth={size > 60 ? 2.5 : 1.5}
          style={{
            filter: `drop-shadow(0 ${size * 0.04 * (safeConfig.capShadowSize || 0.5)}px ${
              size * 0.08 * (safeConfig.capShadowSize || 0.5)
            }px rgba(0,0,0,0.85))`
          }}
        />

        {/* Optional Milled Rim concentric rings */}
        {safeConfig.capStyle === 'MilledRim' && (
          <circle
            cx={cx}
            cy={cy}
            r={capRadius * 0.85}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        )}

        {/* 7. Center Dimple / Inner Metal Core */}
        <circle
          cx={cx}
          cy={cy}
          r={capRadius * 0.28}
          fill="#13171B"
          stroke="#2A3540"
          strokeWidth={size > 60 ? 1.5 : 1}
        />

        {/* 8. Specular Reflection Sheen */}
        {safeConfig.reflection && (
          <ellipse
            cx={cx}
            cy={cy - capRadius * 0.38}
            rx={capRadius * 0.62}
            ry={capRadius * 0.28}
            fill="rgba(255, 255, 255, 0.22)"
          />
        )}

        {/* 9. Pointer Indicator (Needle, Line, Dot, Triangle, or Carved) */}
        {safeConfig.pointer === 'NotchDot' ? (
          <circle
            cx={pointerEnd.x}
            cy={pointerEnd.y}
            r={size > 60 ? 3.5 : 2.2}
            fill="#FFFFFF"
            stroke={safeConfig.fillColor || '#F59E0B'}
            strokeWidth={size > 60 ? 2 : 1.4}
            style={{
              filter: `drop-shadow(0 0 3px ${safeConfig.fillColor || '#F59E0B'})`
            }}
          />
        ) : safeConfig.pointer === 'Needle' ? (
          <polygon
            points={(() => {
              const tip = polarToCartesian(cx, cy, pointerLength, currentAngle);
              const b1 = polarToCartesian(cx, cy, capRadius * 0.22, currentAngle - 18);
              const b2 = polarToCartesian(cx, cy, capRadius * 0.22, currentAngle + 18);
              return `${tip.x.toFixed(1)},${tip.y.toFixed(1)} ${b1.x.toFixed(1)},${b1.y.toFixed(1)} ${b2.x.toFixed(1)},${b2.y.toFixed(1)}`;
            })()}
            fill={safeConfig.fillColor || '#ED94FF'}
            stroke="#FFFFFF"
            strokeWidth="0.8"
            style={{
              filter: `drop-shadow(0 0 3px ${safeConfig.fillColor || '#ED94FF'})`
            }}
          />
        ) : safeConfig.pointer === 'Triangle' ? (
          <polygon
            points={(() => {
              const tip = polarToCartesian(cx, cy, pointerLength, currentAngle);
              const baseR = capRadius * (safeConfig.pointerOnCap ? 0.45 : 0.85);
              const b1 = polarToCartesian(cx, cy, baseR, currentAngle - 14);
              const b2 = polarToCartesian(cx, cy, baseR, currentAngle + 14);
              return `${tip.x.toFixed(1)},${tip.y.toFixed(1)} ${b1.x.toFixed(1)},${b1.y.toFixed(1)} ${b2.x.toFixed(1)},${b2.y.toFixed(1)}`;
            })()}
            fill={safeConfig.fillColor || '#F59E0B'}
            stroke="#FFFFFF"
            strokeWidth="0.8"
            style={{
              filter: `drop-shadow(0 0 3px ${safeConfig.fillColor || '#F59E0B'})`
            }}
          />
        ) : safeConfig.pointer === 'CarvedLine' ? (
          <>
            {/* Inset shadow line */}
            <line
              x1={pointerStart.x}
              y1={pointerStart.y}
              x2={pointerEnd.x}
              y2={pointerEnd.y}
              stroke="#000000"
              strokeWidth={size > 60 ? 3.5 : 2.5}
              strokeLinecap="round"
              opacity={0.8}
            />
            {/* Illuminated inner line */}
            <line
              x1={pointerStart.x}
              y1={pointerStart.y}
              x2={pointerEnd.x}
              y2={pointerEnd.y}
              stroke={safeConfig.fillColor || '#F59E0B'}
              strokeWidth={size > 60 ? 2 : 1.4}
              strokeLinecap="round"
            />
          </>
        ) : (
          <line
            x1={pointerStart.x}
            y1={pointerStart.y}
            x2={pointerEnd.x}
            y2={pointerEnd.y}
            stroke={safeConfig.fillColor || '#F59E0B'}
            strokeWidth={size > 60 ? Math.max(2, 4 * (safeConfig.pointerDentSize || 0.4)) : 2.2}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 3px ${safeConfig.fillColor || '#F59E0B'})`
            }}
          />
        )}
      </svg>

      {/* Readout label for large center preview */}
      {size > 100 && (
        <div className="mt-1 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-mono text-white">
          {Math.round(clampedVal * 100)}% • {Math.round(currentAngle)}°
        </div>
      )}
    </div>
  );
}

/**
 * Vertical Fader Preview Track
 */
function SliderPreviewTrack({
  config,
  value,
  height = 160
}: {
  config: SliderCreatorConfig;
  value: number;
  height?: number;
}) {
  const thumbY = height * (1 - value);

  return (
    <div className="flex items-center gap-2 select-none" style={{ height }}>
      {/* Left Ruler Out Ticks */}
      {config.rulerStyle !== 'None' && (
        <div className="flex flex-col justify-between h-full py-1 text-[7px] text-slate-500 font-mono pr-1 border-r border-slate-700/60">
          <span>+6</span>
          <span>0</span>
          <span>-6</span>
          <span>-18</span>
          <span>-∞</span>
        </div>
      )}

      {/* Rail Slot */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 24,
          height
        }}
      >
        {/* Track Line */}
        <div
          className="absolute rounded-full"
          style={{
            width: config.railSize,
            height: '100%',
            backgroundColor: config.railColor,
            border: `${config.outline}px solid rgba(255,255,255,0.12)`
          }}
        />

        {/* Fader Cap Handle */}
        <div
          className="absolute z-10 rounded transition-transform"
          style={{
            top: thumbY - config.handleSize / 2,
            width: config.handleSize * config.sizeAspect + 10,
            height: config.handleSize,
            backgroundColor: config.handleColor,
            borderRadius: `${config.cornerSize * 8}px`,
            border: `${config.border}px solid #20272E`,
            boxShadow: `0 ${config.shadowSize * 8}px ${config.shadowSize * 14}px rgba(0,0,0,0.85)`
          }}
        >
          {/* Fader Notch Center Pointer Line */}
          <div
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px]"
            style={{ backgroundColor: config.fillColor }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Horizontal Fader Preview Track
 */
function HorizontalSliderPreviewTrack({
  config,
  value,
  width = 200
}: {
  config: SliderCreatorConfig;
  value: number;
  width?: number;
}) {
  const thumbX = width * value;

  return (
    <div className="flex flex-col gap-1 items-center select-none" style={{ width }}>
      <div
        className="relative flex items-center justify-center"
        style={{
          width,
          height: 28
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            height: config.railSize,
            width: '100%',
            backgroundColor: config.railColor,
            border: `${config.outline}px solid rgba(255,255,255,0.12)`
          }}
        />

        <div
          className="absolute z-10 rounded transition-transform"
          style={{
            left: thumbX - (config.handleSize * config.sizeAspect + 10) / 2,
            width: config.handleSize * config.sizeAspect + 10,
            height: config.handleSize * 0.7,
            backgroundColor: config.handleColor,
            borderRadius: `${config.cornerSize * 6}px`,
            boxShadow: `0 ${config.shadowSize * 6}px ${config.shadowSize * 10}px rgba(0,0,0,0.8)`
          }}
        >
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px]"
            style={{ backgroundColor: config.fillColor }}
          />
        </div>
      </div>

      {config.rulerStyle !== 'None' && (
        <div className="flex justify-between w-full px-1 text-[7px] text-slate-500 font-mono">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}
