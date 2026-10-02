import React, { useState } from 'react';
import { SkinDefinition, UiCustomizationState, KnobArchitectPreset } from '../../types/skin';
import { TextLabelConfig, WheelCreatorConfig } from '../../types/controlCreator';
import { KnobRenderer } from '../KnobRenderer/KnobRenderer';
import { getFaceplateStyle, getTypefaceClass } from '../../utils/faceplateText';
import { Sliders, Settings, Edit3 } from 'lucide-react';

interface VstMacrosPageProps {
  skin: SkinDefinition;
  knobPreset?: KnobArchitectPreset;
  customization?: UiCustomizationState;
  customKnobs?: Record<string, Partial<WheelCreatorConfig>>;
  customTexts?: Record<string, Partial<TextLabelConfig>>;
  isTextEditMode?: boolean;
  isCustomizeMode?: boolean;
  onOpenControlCreator?: (controlId: string) => void;
  onOpenTextInspector?: (key: string) => void;
}

export const VstMacrosPage: React.FC<VstMacrosPageProps> = ({
  skin,
  knobPreset,
  customization,
  customKnobs,
  customTexts,
  isTextEditMode = false,
  isCustomizeMode = false,
  onOpenControlCreator,
  onOpenTextInspector
}) => {
  // REDUCED EXACTLY TO 16 MACROS
  const [macroValues, setMacroValues] = useState<number[]>([
    0.65, 0.42, 0.88, 0.25,
    0.50, 0.72, 0.15, 0.90,
    0.33, 0.60, 0.80, 0.45,
    0.20, 0.75, 0.55, 0.10
  ]);

  const [macroNames, setMacroNames] = useState<string[]>([
    'Tape Wobble', 'Cutoff Mod', 'Resonance', 'Diffusion',
    'Space Decay', 'Bitcrush', 'Chorus Depth', 'Drive Harmonics',
    'Flutter Rate', 'Stereo Spread', 'Air Shimmer', 'Sub Bass',
    'Compression', 'Warmth Sat', 'Ping Offset', 'Dry/Wet Trim'
  ]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const accentColor = customization?.knobAccentColor || skin.amber;
  const knobBody = customization?.knobBodyColor || skin.cream;
  const knobPointer = customization?.knobPointerColor || skin.ledRed;
  const knobStyle = customization?.knobStyleOverride || skin.knobStyle;
  const knobGlowEnabled = customization?.knobGlowEnabled ?? skin.knobGlowEnabled ?? true;
  const knobGlow = customization?.knobGlowIntensity;

  const textColor = customization?.textColor || skin.textColor || knobBody || skin.cream;
  const headerTextColor = customization?.headerTextColor || skin.headerTextColor || accentColor;
  const valueTextColor = customization?.valueTextColor || skin.valueTextColor || accentColor;

  const handleValueChange = (idx: number, newVal: number) => {
    setMacroValues((prev) => {
      const copy = [...prev];
      copy[idx] = newVal;
      return copy;
    });
  };

  const handleNameChange = (idx: number, newName: string) => {
    setMacroNames((prev) => {
      const copy = [...prev];
      copy[idx] = newName;
      return copy;
    });
  };

  const titleConfig = customTexts?.['macros:title'];
  const subtitleConfig = customTexts?.['macros:subtitle'];

  return (
    <div className="p-4 flex flex-col gap-4 select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-1 border-b border-white/10">
        <div className="flex flex-col gap-0.5">
          {!titleConfig?.hidden && (
            <span
              onClick={() => onOpenTextInspector?.('macros:title')}
              className={`font-bold tracking-widest uppercase cursor-pointer hover:underline ${getTypefaceClass(
                titleConfig?.typeface
              )}`}
              style={getFaceplateStyle(titleConfig, headerTextColor)}
              title="Click to customize text style"
            >
              {titleConfig?.text || 'HARDWARE MACRO CONTROLS'}
            </span>
          )}
          {!subtitleConfig?.hidden && (
            <span
              onClick={() => onOpenTextInspector?.('macros:subtitle')}
              className={`text-[11px] text-slate-400 cursor-pointer hover:underline ${getTypefaceClass(
                subtitleConfig?.typeface
              )}`}
              style={getFaceplateStyle(subtitleConfig, '#94A3B8')}
              title="Click to customize text style"
            >
              {subtitleConfig?.text || '16 Assignable Hardware Performance Knobs'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
            MATRIX: 4 × 4 (16 KNOTS)
          </span>
        </div>
      </div>

      {/* 4x4 Balanced Macro Grid (Exactly 16 Knobs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-[#0C1015]/80 p-3.5 rounded-xl border border-white/10 shadow-xl backdrop-blur-sm">
        {macroValues.map((val, idx) => {
          const controlId = `macro_${idx}`;
          const customKnob = customKnobs?.[controlId];

          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-between p-2.5 rounded-lg bg-[#141A22]/90 border border-white/5 shadow hover:border-amber-400/40 transition-all group relative"
            >
              {/* Macro Header / Editable Name */}
              <div className="w-full flex items-center justify-between mb-1">
                <span className="font-mono text-[9px] text-slate-500">
                  M{(idx + 1).toString().padStart(2, '0')}
                </span>

                {editingIndex === idx ? (
                  <input
                    type="text"
                    value={macroNames[idx]}
                    autoFocus
                    onBlur={() => setEditingIndex(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingIndex(null)}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    className="bg-black/60 text-white text-[10px] font-semibold px-1 py-0.5 rounded outline-none border border-amber-400 max-w-[90px] text-center"
                  />
                ) : (
                  <span
                    onClick={() => {
                      if (isTextEditMode) {
                        onOpenTextInspector?.(`macros:macro_${idx}`);
                      } else {
                        setEditingIndex(idx);
                      }
                    }}
                    className={`text-[10px] font-semibold truncate cursor-pointer max-w-[90px] text-center transition-all ${
                      isTextEditMode
                        ? 'ring-1 ring-cyan-400 bg-cyan-950/80 px-1 py-0.5 rounded text-white shadow'
                        : 'text-white'
                    } ${getTypefaceClass(customTexts?.[`macros:macro_${idx}`]?.typeface)}`}
                    style={{ ...getFaceplateStyle(customTexts?.[`macros:macro_${idx}`], '#FFFFFF'), color: '#FFFFFF' }}
                    title={isTextEditMode ? 'Click to customize faceplate text' : 'Click to rename macro (or hold Alt to customize style)'}
                  >
                    {customTexts?.[`macros:macro_${idx}`]?.text || macroNames[idx]}
                  </span>
                )}

                {/* Settings icon to customize this individual knob in Control Creator */}
                <button
                  type="button"
                  onClick={() => onOpenControlCreator?.(controlId)}
                  className={`p-0.5 rounded transition-all cursor-pointer ${
                    isCustomizeMode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 scale-110'
                      : 'text-slate-500 hover:text-amber-400 opacity-60 group-hover:opacity-100'
                  }`}
                  title="Customize knob in Control Creator (or right-click)"
                >
                  <Settings size={11} className={isCustomizeMode ? 'animate-spin' : ''} />
                </button>
              </div>

              {/* Rotary Knob Renderer */}
              <div className="py-1">
                <KnobRenderer
                  label=""
                  value={Math.round(val * 100)}
                  min={0}
                  max={100}
                  defaultValue={50}
                  suffix="%"
                  size={58}
                  skin={{
                    ...skin,
                    amber: customKnob?.fillColor || accentColor,
                    cream: customKnob?.capColor || knobBody,
                    ledRed: customKnob?.fillColor || knobPointer
                  }}
                  preset={knobPreset}
                  customAccentColor={customKnob?.fillColor || accentColor}
                  customBodyColor={customKnob?.capColor || knobBody}
                  customPointerColor={customKnob?.fillColor || knobPointer}
                  customTextColor="#FFFFFF"
                  customValueColor="#FFFFFF"
                  onCustomize={() => onOpenControlCreator?.(controlId)}
                  isCustomizeMode={isCustomizeMode}
                  onChange={(v) => handleValueChange(idx, v / 100)}
                />
              </div>

              {/* Numerical Value Readout */}
              <div className="font-mono text-[10px] font-bold text-white mt-0.5">
                {Math.round(val * 100)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
