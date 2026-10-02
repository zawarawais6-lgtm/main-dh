import React from 'react';
import { TextLabelConfig, FaceplateEffect, LabelTypeface } from '../../types/controlCreator';
import { getFaceplateStyle, getTypefaceClass } from '../../utils/faceplateText';
import { X, Type, Eye, EyeOff, Sparkles, RotateCcw } from 'lucide-react';

export interface EditableTextTarget {
  key: string;
  page: 'main' | 'macros' | 'lfos' | 'nodes';
  defaultText: string;
  label: string;
}

export const ALL_EDITABLE_TEXTS: EditableTextTarget[] = [
  // Main Page
  { key: 'main:title', page: 'main', defaultText: 'E N G I N E  //  D E L A Y', label: 'Main Header Title' },
  { key: 'main:label_delay', page: 'main', defaultText: 'Delay Time', label: 'Main: Delay Time Label' },
  { key: 'main:label_glide', page: 'main', defaultText: 'Glide', label: 'Main: Glide Time Label' },
  { key: 'main:label_feedback', page: 'main', defaultText: 'Feedback', label: 'Main: Feedback Label' },
  { key: 'main:label_mix', page: 'main', defaultText: 'Mix', label: 'Main: Mix Label' },
  { key: 'main:label_input', page: 'main', defaultText: 'Input Gain', label: 'Main: Input Gain Label' },
  { key: 'main:label_output', page: 'main', defaultText: 'Output Gain', label: 'Main: Output Gain Label' },
  { key: 'main:label_width', page: 'main', defaultText: 'Stereo Width', label: 'Main: Width Label' },
  { key: 'main:label_asym', page: 'main', defaultText: 'Delay Asym', label: 'Main: Asym Label' },
  { key: 'main:label_duck', page: 'main', defaultText: 'Ducking', label: 'Main: Ducking Label' },
  { key: 'main:label_input_stage', page: 'main', defaultText: 'Input Stage', label: 'Main: Input Stage Title' },
  { key: 'main:label_master_section', page: 'main', defaultText: 'Output & Master Section', label: 'Main: Master Section Title' },
  // Macros Page
  { key: 'macros:title', page: 'macros', defaultText: 'HARDWARE MACRO CONTROLS', label: 'Macros Page Title' },
  { key: 'macros:subtitle', page: 'macros', defaultText: '16 Assignable Hardware Knobs', label: 'Macros Subtitle' },
  ...Array.from({ length: 16 }, (_, i) => ({
    key: `macros:macro_${i}`,
    page: 'macros' as const,
    defaultText: `Macro ${i + 1}`,
    label: `Macro ${i + 1} Name`
  })),
  // LFOs Page
  { key: 'lfos:title', page: 'lfos', defaultText: 'LFO & MODULATION ENGINE', label: 'LFOs Page Title' },
  { key: 'lfos:lfo1_name', page: 'lfos', defaultText: 'LFO 1 — Filter Sweep', label: 'LFO 1 Card Header' },
  { key: 'lfos:lfo2_name', page: 'lfos', defaultText: 'LFO 2 — Tremolo Drift', label: 'LFO 2 Card Header' },
  { key: 'lfos:label_rate', page: 'lfos', defaultText: 'Rate', label: 'LFOs: Rate Slider Label' },
  { key: 'lfos:label_depth', page: 'lfos', defaultText: 'Depth', label: 'LFOs: Depth Slider Label' },
  { key: 'lfos:label_phase', page: 'lfos', defaultText: 'Phase Offset', label: 'LFOs: Phase Slider Label' },
  // Nodes Page
  { key: 'nodes:title', page: 'nodes', defaultText: 'MODULAR ROUTING MATRIX', label: 'Nodes Title' },
  { key: 'nodes:subtitle', page: 'nodes', defaultText: 'Drag node headers to re-route audio signal paths', label: 'Nodes Subtitle' },
  { key: 'nodes:node_tap_in', page: 'nodes', defaultText: 'INPUT TAP', label: 'Node: Input Tap' },
  { key: 'nodes:node_filter', page: 'nodes', defaultText: 'ANALOG BBD FILTER', label: 'Node: Filter' },
  { key: 'nodes:node_tape_sat', page: 'nodes', defaultText: 'TAPE DRIVE', label: 'Node: Tape Saturation' },
  { key: 'nodes:node_tap_out', page: 'nodes', defaultText: 'MASTER OUT', label: 'Node: Master Out' }
];

interface TextInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeKey: string;
  onSelectKey: (key: string) => void;
  customTexts: Record<string, Partial<TextLabelConfig>>;
  onUpdateText: (key: string, config: Partial<TextLabelConfig>) => void;
}

export const TextInspectorDrawer: React.FC<TextInspectorDrawerProps> = ({
  isOpen,
  onClose,
  activeKey,
  onSelectKey,
  customTexts,
  onUpdateText
}) => {
  if (!isOpen) return null;

  const currentTarget = ALL_EDITABLE_TEXTS.find((t) => t.key === activeKey) || ALL_EDITABLE_TEXTS[0];
  const activeConfig = customTexts[currentTarget.key] || {};
  const currentText = activeConfig.text !== undefined ? activeConfig.text : currentTarget.defaultText;
  const currentEffect: FaceplateEffect = activeConfig.effect || 'plain';
  const currentTypeface: LabelTypeface = activeConfig.typeface || 'sans';
  const currentSize = activeConfig.fontSize || 13;
  const isHidden = activeConfig.hidden || false;

  const handleChange = (partial: Partial<TextLabelConfig>) => {
    onUpdateText(currentTarget.key, {
      ...activeConfig,
      ...partial
    });
  };

  const handleReset = () => {
    onUpdateText(currentTarget.key, {
      text: currentTarget.defaultText,
      fontSize: undefined,
      typeface: 'sans',
      effect: 'plain',
      color: undefined,
      hidden: false,
      uppercase: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-xl bg-[#1A2026] border border-[#2D3842] rounded-lg shadow-2xl flex flex-col overflow-hidden text-slate-200 text-xs">
        {/* Header */}
        <div className="h-10 bg-[#141A1F] border-b border-[#2D3842] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type size={16} className="text-amber-400" />
            <span className="font-bold text-slate-200">Faceplate & Text Customizer</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Target Selector */}
        <div className="p-3 bg-[#1F272F] border-b border-[#2D3842] flex items-center justify-between">
          <span className="text-slate-400 font-medium">Select Label to Edit:</span>
          <select
            value={currentTarget.key}
            onChange={(e) => onSelectKey(e.target.value)}
            className="bg-[#12161A] text-amber-300 font-semibold text-xs px-2.5 py-1 rounded border border-[#354350] outline-none max-w-xs truncate"
          >
            {ALL_EDITABLE_TEXTS.map((t) => (
              <option key={t.key} value={t.key}>
                [{t.page.toUpperCase()}] {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 bg-[#11161B] border-b border-[#2D3842] flex flex-col items-center justify-center min-h-[90px]">
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mb-1.5">
            Faceplate Surface Preview
          </span>
          <div className="p-3 bg-[#182026] rounded border border-[#26323D] w-full text-center flex items-center justify-center">
            {!isHidden ? (
              <span
                className={getTypefaceClass(currentTypeface)}
                style={getFaceplateStyle({
                  ...activeConfig,
                  text: currentText,
                  fontSize: currentSize,
                  effect: currentEffect,
                  typeface: currentTypeface
                })}
              >
                {currentText || '(empty text)'}
              </span>
            ) : (
              <span className="text-red-400 italic text-xs flex items-center gap-1.5">
                <EyeOff size={14} /> Label is currently removed / hidden
              </span>
            )}
          </div>
        </div>

        {/* Controls Body */}
        <div className="p-4 flex flex-col gap-3.5 max-h-[50vh] overflow-y-auto">
          {/* Text String Input */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Custom Text Content:</span>
              <button
                type="button"
                onClick={() => handleChange({ hidden: !isHidden })}
                className={`text-[11px] px-2 py-0.5 rounded font-semibold flex items-center gap-1 transition-colors ${
                  isHidden
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                {isHidden ? 'Hidden (Click to Show)' : 'Visible (Click to Hide)'}
              </button>
            </div>
            <input
              type="text"
              value={currentText}
              disabled={isHidden}
              onChange={(e) => handleChange({ text: e.target.value })}
              placeholder="Enter custom text label..."
              className="bg-[#12161A] border border-[#2D3842] text-white px-3 py-1.5 rounded outline-none focus:border-amber-500 transition-colors disabled:opacity-40"
            />
          </div>

          {/* Faceplate Effect Picker */}
          <div className="flex flex-col gap-1.5">
            <span className="text-slate-400 font-semibold">Surface & Faceplate Effect:</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'plain', name: 'Plain Neutral' },
                { id: 'engraved', name: 'Engraved / Debossed' },
                { id: 'embossed', name: 'Embossed / Raised' },
                { id: 'silkscreen', name: 'Silk-Screen Printed' },
                { id: 'backlitLed', name: 'Backlit LED Glow' },
                { id: 'milledMetal', name: 'Milled Metal Plate' }
              ].map((eff) => (
                <button
                  key={eff.id}
                  type="button"
                  onClick={() => handleChange({ effect: eff.id as FaceplateEffect })}
                  className={`p-2 rounded border text-left transition-all ${
                    currentEffect === eff.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                      : 'bg-[#182026] border-[#2B353F] text-slate-300 hover:bg-[#202B33]'
                  }`}
                >
                  <span className="text-[11px] block">{eff.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typeface & Font Size */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 font-semibold">Typeface:</span>
              <select
                value={currentTypeface}
                onChange={(e) => handleChange({ typeface: e.target.value as LabelTypeface })}
                className="bg-[#12161A] border border-[#2D3842] text-slate-200 px-2.5 py-1.5 rounded outline-none"
              >
                <option value="sans">Clean Sans (Modern Pro)</option>
                <option value="mono">Monospace Tabular (Hardware Data)</option>
                <option value="display">Display Bold (Vintage Console)</option>
                <option value="serif">Editorial Serif (Tube Preamp)</option>
                <option value="stencil">Industrial Stencil</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Font Size:</span>
                <span className="font-mono text-amber-400">{currentSize} px</span>
              </div>
              <input
                type="range"
                min="8"
                max="26"
                step="1"
                value={currentSize}
                onChange={(e) => handleChange({ fontSize: parseInt(e.target.value, 10) })}
                className="accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Color & Styling Options */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center justify-between bg-[#141A1F] p-2 rounded border border-[#26313C]">
              <span className="text-slate-400">Custom Text Color:</span>
              <input
                type="color"
                value={activeConfig.color || '#E2E8F0'}
                onChange={(e) => handleChange({ color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent"
              />
            </div>

            <div className="flex items-center gap-3 bg-[#141A1F] p-2 rounded border border-[#26313C]">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={activeConfig.uppercase || false}
                  onChange={(e) => handleChange({ uppercase: e.target.checked })}
                  className="rounded accent-amber-500"
                />
                <span>ALL CAPS</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-11 bg-[#141A1F] border-t border-[#2D3842] px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-xs transition-colors"
          >
            <RotateCcw size={13} />
            Reset to Default
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
