import React, { useState } from 'react';
import { SkinDefinition, SliderArchitectPreset, UiCustomizationState, KnobArchitectPreset } from '../../types/skin';
import { TextLabelConfig, WheelCreatorConfig } from '../../types/controlCreator';
import { KnobRenderer } from '../KnobRenderer/KnobRenderer';
import { getFaceplateStyle, getTypefaceClass } from '../../utils/faceplateText';
import { Clock, Sliders, Volume2 } from 'lucide-react';

interface VstMainPageProps {
  skin: SkinDefinition;
  knobPreset?: KnobArchitectPreset;
  sliderPreset?: SliderArchitectPreset;
  customization?: UiCustomizationState;
  customKnobs?: Record<string, Partial<WheelCreatorConfig>>;
  customTexts?: Record<string, Partial<TextLabelConfig>>;
  isTextEditMode?: boolean;
  isCustomizeMode?: boolean;
  onOpenControlCreator?: (controlId: string) => void;
  onOpenTextInspector?: (key: string) => void;
}

export const VstMainPage: React.FC<VstMainPageProps> = ({
  skin,
  knobPreset,
  sliderPreset,
  customization,
  customKnobs,
  customTexts,
  isTextEditMode = false,
  isCustomizeMode = false,
  onOpenControlCreator,
  onOpenTextInspector
}) => {
  // Knobs state
  const [delayTime, setDelayTime] = useState(350);
  const [glideTime, setGlideTime] = useState(0);
  const [feedback, setFeedback] = useState(35);
  const [mix, setMix] = useState(35);
  const [inputGain, setInputGain] = useState(0);
  const [outputGain, setOutputGain] = useState(0);
  const [width, setWidth] = useState(100);
  const [delayAsym, setDelayAsym] = useState(0);
  const [duckAmount, setDuckAmount] = useState(15);

  // Modes & Sync
  const [pingPong, setPingPong] = useState(true);
  const [analogWarmth, setAnalogWarmth] = useState(true);
  const [tempoSync, setTempoSync] = useState(true);
  const [syncDivision, setSyncDivision] = useState('1/4');

  const SYNC_DIVISIONS = [
    '1/1', '1/2.', '1/2', '1/2T', '1/4.', '1/4', '1/4T',
    '1/8.', '1/8', '1/8T', '1/16.', '1/16', '1/16T', '1/32'
  ];

  // Division to milliseconds at 120 BPM
  const divisionToMs: Record<string, number> = {
    '1/1': 2000,
    '1/2.': 1500,
    '1/2': 1000,
    '1/2T': 667,
    '1/4.': 750,
    '1/4': 500,
    '1/4T': 333,
    '1/8.': 375,
    '1/8': 250,
    '1/8T': 167,
    '1/16.': 188,
    '1/16': 125,
    '1/16T': 83,
    '1/32': 62.5
  };

  // Customization overrides
  const knobSize = customization?.knobSize ?? 66;
  const knobGlow = customization?.knobGlowIntensity;
  const knobGlowEnabled = customization?.knobGlowEnabled ?? skin.knobGlowEnabled ?? true;
  const knobBody = customization?.knobBodyColor;
  const knobAccent = customization?.knobAccentColor;
  const knobPointer = customization?.knobPointerColor;
  const knobOffset = customization?.knobVerticalOffset ?? 0;
  const knobStyleOverride = customization?.knobStyleOverride;

  const textColor = customization?.textColor || skin.textColor || knobBody || skin.cream;
  const headerTextColor = customization?.headerTextColor || skin.headerTextColor || knobAccent || skin.amber;
  const valueTextColor = customization?.valueTextColor || skin.valueTextColor || knobAccent || skin.amber;

  // Text configs
  const titleConfig = customTexts?.['main:title'];
  const getLabel = (key: string, def: string) => {
    const cfg = customTexts?.[key];
    if (cfg?.hidden) return '';
    return cfg?.text || def;
  };

  const getCustomSkin = (controlId: string) => {
    const custom = customKnobs?.[controlId];
    if (!custom) return skin;
    return {
      ...skin,
      amber: custom.fillColor || skin.amber,
      cream: custom.capColor || skin.cream,
      ledRed: custom.fillColor || skin.ledRed
    };
  };

  const getKnobColors = (controlId: string) => {
    const custom = customKnobs?.[controlId];
    return {
      accentColor: custom?.fillColor || knobAccent,
      bodyColor: custom?.capColor || knobBody,
      pointerColor: custom?.fillColor || knobPointer,
      glowIntensity: custom?.gearShadowSize !== undefined ? custom.gearShadowSize * 2 : knobGlow,
      styleOverride: custom?.pointer === 'NotchDot' ? ('MinimalDot' as const) : knobStyleOverride
    };
  };

  return (
    <div className="p-4 flex flex-col gap-4 text-xs select-none">
      {/* 1. DEDICATED TEMPO SYNC BAR ACROSS TOP OF DELAY SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md shadow-inner">
        <div className="flex items-center gap-2">
          {!titleConfig?.hidden && (
            <span
              onClick={() => onOpenTextInspector?.('main:title')}
              className={`font-black tracking-widest uppercase cursor-pointer transition-all ${
                isTextEditMode ? 'ring-1 ring-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded text-cyan-200 shadow' : 'hover:underline'
              } ${getTypefaceClass(titleConfig?.typeface)}`}
              style={getFaceplateStyle(titleConfig, headerTextColor)}
              title={isTextEditMode ? 'Click to edit title typography' : 'Hold Alt or click Edit Text to customize'}
            >
              {titleConfig?.text || 'E N G I N E  //  D E L A Y'}
            </span>
          )}
        </div>

        {/* Sync Mode Toggle & Dropdown Menu */}
        <div className="flex items-center gap-2">
          {/* Mode Toggle Button */}
          <div className="flex items-center rounded-md bg-[#161B22] p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setTempoSync(false);
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                !tempoSync
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FREE TIME
            </button>
            <button
              type="button"
              onClick={() => {
                setTempoSync(true);
                setDelayTime(divisionToMs[syncDivision] || 500);
              }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer flex items-center gap-1 ${
                tempoSync
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock size={11} />
              <span>TEMPO SYNC</span>
            </button>
          </div>

          {/* Restored Sync Time Dropdown Menu */}
          {tempoSync ? (
            <div className="flex items-center gap-1.5 bg-[#12161D] border border-amber-500/50 rounded-md px-2 py-1 shadow-sm">
              <span className="text-[10px] font-mono text-amber-400 font-bold">BEAT:</span>
              <select
                value={syncDivision}
                onChange={(e) => {
                  const div = e.target.value;
                  setSyncDivision(div);
                  setDelayTime(divisionToMs[div] || 500);
                }}
                className="bg-transparent text-amber-300 font-mono font-bold text-xs outline-none cursor-pointer pr-1"
                title="Select Host Tempo Sync Division"
              >
                {SYNC_DIVISIONS.map((div) => (
                  <option key={div} value={div} className="bg-[#182026] text-amber-300">
                    {div} ({divisionToMs[div]} ms)
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#12161D] border border-white/10 rounded-md px-2 py-1 font-mono text-[11px] text-slate-300">
              <span className="text-slate-500">TIME:</span>
              <span className="font-bold text-amber-400">{Math.round(delayTime)} ms</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 px-2 py-1 rounded bg-black/30 border border-white/5">
            <span>HOST BPM:</span>
            <span className="font-bold text-white">120.0</span>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY DELAY ROTARIES ROW (Delay, Glide, Feedback, Mix) */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 justify-items-center p-3 rounded-lg bg-black/20 border border-white/5 transition-transform"
        style={{ transform: `translateY(${knobOffset}px)` }}
      >
        {/* Delay Time */}
        <KnobRenderer
          label={getLabel('main:label_delay', 'Delay Time')}
          value={delayTime}
          min={1}
          max={4000}
          defaultValue={350}
          suffix=" ms"
          skin={getCustomSkin('main_delay')}
          preset={knobPreset}
          knobStyleOverride={getKnobColors('main_delay').styleOverride}
          customSize={knobSize}
          customGlowEnabled={knobGlowEnabled}
          customGlow={getKnobColors('main_delay').glowIntensity}
          customBodyColor={getKnobColors('main_delay').bodyColor}
          customAccentColor={getKnobColors('main_delay').accentColor}
          customPointerColor={getKnobColors('main_delay').pointerColor}
          customTextColor="#FFFFFF"
          customValueColor="#FFFFFF"
          onChange={setDelayTime}
          onCustomize={() => onOpenControlCreator?.('main_delay')}
          isCustomizeMode={isCustomizeMode}
          onLabelClick={() => onOpenTextInspector?.('main:label_delay')}
          isTextEditMode={isTextEditMode}
          faceplateStyle={{ ...getFaceplateStyle(customTexts?.['main:label_delay'], '#FFFFFF'), color: '#FFFFFF' }}
          typefaceClass={getTypefaceClass(customTexts?.['main:label_delay']?.typeface)}
        />

        {/* Glide */}
        <KnobRenderer
          label={getLabel('main:label_glide', 'Glide')}
          value={glideTime}
          min={0}
          max={2000}
          defaultValue={0}
          suffix=" ms"
          skin={getCustomSkin('main_glide')}
          preset={knobPreset}
          knobStyleOverride={getKnobColors('main_glide').styleOverride}
          customSize={knobSize}
          customGlowEnabled={knobGlowEnabled}
          customGlow={getKnobColors('main_glide').glowIntensity}
          customBodyColor={getKnobColors('main_glide').bodyColor}
          customAccentColor={getKnobColors('main_glide').accentColor}
          customPointerColor={getKnobColors('main_glide').pointerColor}
          customTextColor="#FFFFFF"
          customValueColor="#FFFFFF"
          onChange={setGlideTime}
          onCustomize={() => onOpenControlCreator?.('main_glide')}
          isCustomizeMode={isCustomizeMode}
          onLabelClick={() => onOpenTextInspector?.('main:label_glide')}
          isTextEditMode={isTextEditMode}
          faceplateStyle={{ ...getFaceplateStyle(customTexts?.['main:label_glide'], '#FFFFFF'), color: '#FFFFFF' }}
          typefaceClass={getTypefaceClass(customTexts?.['main:label_glide']?.typeface)}
        />

        {/* Feedback */}
        <KnobRenderer
          label={getLabel('main:label_feedback', 'Feedback')}
          value={feedback}
          min={0}
          max={98}
          defaultValue={35}
          suffix="%"
          skin={getCustomSkin('main_feedback')}
          preset={knobPreset}
          knobStyleOverride={getKnobColors('main_feedback').styleOverride}
          customSize={knobSize}
          customGlowEnabled={knobGlowEnabled}
          customGlow={getKnobColors('main_feedback').glowIntensity}
          customBodyColor={getKnobColors('main_feedback').bodyColor}
          customAccentColor={getKnobColors('main_feedback').accentColor}
          customPointerColor={getKnobColors('main_feedback').pointerColor}
          customTextColor="#FFFFFF"
          customValueColor="#FFFFFF"
          onChange={setFeedback}
          onCustomize={() => onOpenControlCreator?.('main_feedback')}
          isCustomizeMode={isCustomizeMode}
          onLabelClick={() => onOpenTextInspector?.('main:label_feedback')}
          isTextEditMode={isTextEditMode}
          faceplateStyle={{ ...getFaceplateStyle(customTexts?.['main:label_feedback'], '#FFFFFF'), color: '#FFFFFF' }}
          typefaceClass={getTypefaceClass(customTexts?.['main:label_feedback']?.typeface)}
        />

        {/* Mix */}
        <KnobRenderer
          label={getLabel('main:label_mix', 'Mix')}
          value={mix}
          min={0}
          max={100}
          defaultValue={35}
          suffix="%"
          skin={getCustomSkin('main_mix')}
          preset={knobPreset}
          knobStyleOverride={getKnobColors('main_mix').styleOverride}
          customSize={knobSize}
          customGlowEnabled={knobGlowEnabled}
          customGlow={getKnobColors('main_mix').glowIntensity}
          customBodyColor={getKnobColors('main_mix').bodyColor}
          customAccentColor={getKnobColors('main_mix').accentColor}
          customPointerColor={getKnobColors('main_mix').pointerColor}
          customTextColor="#FFFFFF"
          customValueColor="#FFFFFF"
          onChange={setMix}
          onCustomize={() => onOpenControlCreator?.('main_mix')}
          isCustomizeMode={isCustomizeMode}
          onLabelClick={() => onOpenTextInspector?.('main:label_mix')}
          isTextEditMode={isTextEditMode}
          faceplateStyle={{ ...getFaceplateStyle(customTexts?.['main:label_mix'], '#FFFFFF'), color: '#FFFFFF' }}
          typefaceClass={getTypefaceClass(customTexts?.['main:label_mix']?.typeface)}
        />
      </div>

      {/* 3. ROW 2: INPUT SHAPING (LEFT) & OUTPUT / MASTER SECTION (RIGHT) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Left Column: Input Drive & Conditioning */}
        <div className="p-3 rounded-lg bg-black/25 border border-white/5 flex flex-col justify-between items-center gap-2">
          <div className="w-full flex items-center justify-between pb-1 border-b border-white/5">
            <span
              onClick={() => onOpenTextInspector?.('main:label_input_stage')}
              className={`text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                isTextEditMode ? 'ring-1 ring-cyan-400 bg-cyan-950/70 px-1 rounded text-cyan-200 shadow' : 'text-slate-400 hover:text-white'
              }`}
              style={getFaceplateStyle(customTexts?.['main:label_input_stage'], '#94A3B8')}
              title={isTextEditMode ? 'Click to customize section title' : 'Hold Alt or click Edit Text to customize'}
            >
              {getLabel('main:label_input_stage', 'Input Stage')}
            </span>
            <span className="text-[9px] font-mono text-slate-500">PRE-DELAY</span>
          </div>

          <div className="my-auto">
            <KnobRenderer
              label={getLabel('main:label_input', 'Input Gain')}
              value={inputGain}
              min={-24}
              max={24}
              defaultValue={0}
              suffix=" dB"
              skin={getCustomSkin('main_input_gain')}
              preset={knobPreset}
              knobStyleOverride={getKnobColors('main_input_gain').styleOverride}
              customSize={knobSize * 0.88}
              customGlowEnabled={knobGlowEnabled}
              customGlow={getKnobColors('main_input_gain').glowIntensity}
              customBodyColor={getKnobColors('main_input_gain').bodyColor}
              customAccentColor={getKnobColors('main_input_gain').accentColor}
              customPointerColor={getKnobColors('main_input_gain').pointerColor}
              customTextColor="#FFFFFF"
              customValueColor="#FFFFFF"
              onChange={setInputGain}
              onCustomize={() => onOpenControlCreator?.('main_input_gain')}
              isCustomizeMode={isCustomizeMode}
              onLabelClick={() => onOpenTextInspector?.('main:label_input')}
              isTextEditMode={isTextEditMode}
              faceplateStyle={{ ...getFaceplateStyle(customTexts?.['main:label_input'], '#FFFFFF'), color: '#FFFFFF' }}
              typefaceClass={getTypefaceClass(customTexts?.['main:label_input']?.typeface)}
            />
          </div>
        </div>

        {/* Right Columns (Spanning 2 Cols): OUTPUT & MASTER SECTION (Ducking, Delay Asym, Output Gain, Width) */}
        <div className="md:col-span-2 p-3 rounded-lg bg-black/30 border border-white/10 flex flex-col gap-2">
          <div className="w-full flex items-center justify-between pb-1 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <Volume2 size={13} className="text-amber-400" />
              <span
                onClick={() => onOpenTextInspector?.('main:label_master_section')}
                className={`text-[11px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                  isTextEditMode ? 'ring-1 ring-cyan-400 bg-cyan-950/70 px-1 rounded text-cyan-200 shadow' : 'text-amber-300 hover:text-white'
                }`}
                style={getFaceplateStyle(customTexts?.['main:label_master_section'], '#FCD34D')}
                title={isTextEditMode ? 'Click to customize section title' : 'Hold Alt or click Edit Text to customize'}
              >
                {getLabel('main:label_master_section', 'Output & Master Section')}
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-400">DYNAMICS & STEREO FIELD</span>
          </div>

          {/* 4 Knobs Grid: Ducking, Delay Asym, Output Gain, Stereo Width */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 justify-items-center pt-1">
            {/* 1. Ducking */}
            <KnobRenderer
              label={getLabel('main:label_duck', 'Ducking')}
              value={duckAmount}
              min={0}
              max={100}
              defaultValue={0}
              suffix="%"
              skin={getCustomSkin('main_duck')}
              preset={knobPreset}
              knobStyleOverride={getKnobColors('main_duck').styleOverride}
              customSize={knobSize * 0.82}
              customGlowEnabled={knobGlowEnabled}
              customGlow={getKnobColors('main_duck').glowIntensity}
              customBodyColor={getKnobColors('main_duck').bodyColor}
              customAccentColor={getKnobColors('main_duck').accentColor}
              customPointerColor={getKnobColors('main_duck').pointerColor}
              customTextColor="#FFFFFF"
              customValueColor="#FFFFFF"
              onChange={setDuckAmount}
              onCustomize={() => onOpenControlCreator?.('main_duck')}
              isCustomizeMode={isCustomizeMode}
              onLabelClick={() => onOpenTextInspector?.('main:label_duck')}
              isTextEditMode={isTextEditMode}
              faceplateStyle={{ ...getFaceplateStyle(customTexts?.['main:label_duck'], '#FFFFFF'), color: '#FFFFFF' }}
              typefaceClass={getTypefaceClass(customTexts?.['main:label_duck']?.typeface)}
            />

            {/* 2. Delay Asym */}
            <KnobRenderer
              label={getLabel('main:label_asym', 'Delay Asym')}
              value={delayAsym}
              min={-50}
              max={50}
              defaultValue={0}
              suffix="%"
              skin={getCustomSkin('main_asym')}
              preset={knobPreset}
              knobStyleOverride={getKnobColors('main_asym').styleOverride}
              customSize={knobSize * 0.82}
              customGlowEnabled={knobGlowEnabled}
              customGlow={getKnobColors('main_asym').glowIntensity}
              customBodyColor={getKnobColors('main_asym').bodyColor}
              customAccentColor={getKnobColors('main_asym').accentColor}
              customPointerColor={getKnobColors('main_asym').pointerColor}
              customTextColor="#FFFFFF"
              customValueColor="#FFFFFF"
              onChange={setDelayAsym}
              onCustomize={() => onOpenControlCreator?.('main_asym')}
              isCustomizeMode={isCustomizeMode}
              onLabelClick={() => onOpenTextInspector?.('main:label_asym')}
              isTextEditMode={isTextEditMode}
              faceplateStyle={{ ...getFaceplateStyle(customTexts?.['main:label_asym'], '#FFFFFF'), color: '#FFFFFF' }}
              typefaceClass={getTypefaceClass(customTexts?.['main:label_asym']?.typeface)}
            />

            {/* 3. Output Gain */}
            <KnobRenderer
              label={getLabel('main:label_output', 'Output Gain')}
              value={outputGain}
              min={-24}
              max={24}
              defaultValue={0}
              suffix=" dB"
              skin={getCustomSkin('main_output_gain')}
              preset={knobPreset}
              knobStyleOverride={getKnobColors('main_output_gain').styleOverride}
              customSize={knobSize * 0.82}
              customGlowEnabled={knobGlowEnabled}
              customGlow={getKnobColors('main_output_gain').glowIntensity}
              customBodyColor={getKnobColors('main_output_gain').bodyColor}
              customAccentColor={getKnobColors('main_output_gain').accentColor}
              customPointerColor={getKnobColors('main_output_gain').pointerColor}
              customTextColor="#FFFFFF"
              customValueColor="#FFFFFF"
              onChange={setOutputGain}
              onCustomize={() => onOpenControlCreator?.('main_output_gain')}
              isCustomizeMode={isCustomizeMode}
              onLabelClick={() => onOpenTextInspector?.('main:label_output')}
              isTextEditMode={isTextEditMode}
              faceplateStyle={{ ...getFaceplateStyle(customTexts?.['main:label_output'], '#FFFFFF'), color: '#FFFFFF' }}
              typefaceClass={getTypefaceClass(customTexts?.['main:label_output']?.typeface)}
            />

            {/* 4. Stereo Width */}
            <KnobRenderer
              label={getLabel('main:label_width', 'Stereo Width')}
              value={width}
              min={0}
              max={200}
              defaultValue={100}
              suffix="%"
              skin={getCustomSkin('main_width')}
              preset={knobPreset}
              knobStyleOverride={getKnobColors('main_width').styleOverride}
              customSize={knobSize * 0.82}
              customGlowEnabled={knobGlowEnabled}
              customGlow={getKnobColors('main_width').glowIntensity}
              customBodyColor={getKnobColors('main_width').bodyColor}
              customAccentColor={getKnobColors('main_width').accentColor}
              customPointerColor={getKnobColors('main_width').pointerColor}
              customTextColor="#FFFFFF"
              customValueColor="#FFFFFF"
              onChange={setWidth}
              onCustomize={() => onOpenControlCreator?.('main_width')}
              isCustomizeMode={isCustomizeMode}
              onLabelClick={() => onOpenTextInspector?.('main:label_width')}
              isTextEditMode={isTextEditMode}
              faceplateStyle={{ ...getFaceplateStyle(customTexts?.['main:label_width'], '#FFFFFF'), color: '#FFFFFF' }}
              typefaceClass={getTypefaceClass(customTexts?.['main:label_width']?.typeface)}
            />
          </div>
        </div>
      </div>

      {/* 4. HARDWARE SWITCHES & ANALOG TAPE WARMTH */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
        <div className="flex items-center gap-3">
          {/* Switch 1: Ping Pong */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/25 border border-white/5">
            <span className="text-[11px] text-slate-300 font-semibold">Ping Pong</span>
            <button
              type="button"
              onClick={() => setPingPong(!pingPong)}
              className="px-3 py-0.5 rounded text-[10px] font-bold font-mono transition-all cursor-pointer"
              style={{
                backgroundColor: pingPong ? `${skin.amber}30` : '#182026',
                color: pingPong ? skin.amber : '#94A3B8',
                border: `1px solid ${pingPong ? skin.amber : '#2D3844'}`
              }}
            >
              {pingPong ? 'ENABLED' : 'OFF'}
            </button>
          </div>

          {/* Switch 2: Analog Warmth */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/25 border border-white/5">
            <span className="text-[11px] text-slate-300 font-semibold">Analog Saturation</span>
            <button
              type="button"
              onClick={() => setAnalogWarmth(!analogWarmth)}
              className="px-3 py-0.5 rounded text-[10px] font-bold font-mono transition-all cursor-pointer"
              style={{
                backgroundColor: analogWarmth ? `${skin.amber}30` : '#182026',
                color: analogWarmth ? skin.amber : '#94A3B8',
                border: `1px solid ${analogWarmth ? skin.amber : '#2D3844'}`
              }}
            >
              {analogWarmth ? 'TAPE WARMTH' : 'CLEAN DSP'}
            </button>
          </div>
        </div>

        {/* Status Cue */}
        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>DSP ENGINE ONLINE • 64-BIT PRECISION</span>
        </div>
      </div>
    </div>
  );
};
