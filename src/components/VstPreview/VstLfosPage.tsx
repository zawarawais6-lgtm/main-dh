import React, { useState, useEffect, useRef } from "react"
import {
  SkinDefinition,
  LfoVisualPreset,
  UiCustomizationState,
  SliderArchitectPreset,
} from "../../types/skin"
import {
  SliderCreatorConfig,
  TextLabelConfig,
  DEFAULT_SLIDER_CONFIG,
} from "../../types/controlCreator"
import { SliderRenderer } from "../SliderRenderer/SliderRenderer"
import { getFaceplateStyle, getTypefaceClass } from "../../utils/faceplateText"
import { Settings } from "lucide-react"

interface LfoData {
  id: number
  name: string
  shape: string
  rateHz: number
  phaseDeg: number
  amount: number
  offset: number
  bipolar: boolean
  targetDesc: string
}

interface VstLfosPageProps {
  skin: SkinDefinition
  lfoVisualPreset?: LfoVisualPreset
  sliderPreset?: SliderArchitectPreset
  sliderConfig?: SliderCreatorConfig
  customSliders?: Record<string, Partial<SliderCreatorConfig>>
  customization?: UiCustomizationState
  customTexts?: Record<string, Partial<TextLabelConfig>>
  isTextEditMode?: boolean
  isCustomizeMode?: boolean
  onOpenControlCreator?: (controlId: string) => void
  onOpenTextInspector?: (key: string) => void
}

const LFO_SHAPES = [
  "Sine",
  "Square",
  "Saw Up",
  "Saw Down",
  "Triangle",
  "Pulse 25%",
  "Pulse 75%",
  "Trapezoid",
  "Half Sine (Bump)",
  "Stairs Up",
  "Exponential Rise",
  "Sample & Hold",
  "Smooth Random",
]

export const VstLfosPage: React.FC<VstLfosPageProps> = ({
  skin,
  lfoVisualPreset,
  sliderPreset,
  sliderConfig,
  customSliders,
  customization,
  customTexts,
  isTextEditMode = false,
  isCustomizeMode = false,
  onOpenControlCreator,
  onOpenTextInspector,
}) => {
  const [lfos, setLfos] = useState<LfoData[]>([
    {
      id: 1,
      name: "LFO 1 (Flange)",
      shape: "Sine",
      rateHz: 0.85,
      phaseDeg: 0,
      amount: 100,
      offset: 50,
      bipolar: true,
      targetDesc: "Delay Time, Width",
    },
    {
      id: 2,
      name: "LFO 2 (Random Mod)",
      shape: "Smooth Random",
      rateHz: 1.4,
      phaseDeg: 90,
      amount: 75,
      offset: 50,
      bipolar: true,
      targetDesc: "Feedback, Delay Asym",
    },
  ])

  const [phaseTime, setPhaseTime] = useState(0)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      setPhaseTime((p) => p + dt)
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  const addLfo = () => {
    if (lfos.length >= 4) return
    const newId = (lfos[lfos.length - 1]?.id ?? 0) + 1
    const newLfo: LfoData = {
      id: newId,
      name: `LFO ${newId} (Custom)`,
      shape: "Triangle",
      rateHz: 1.0,
      phaseDeg: 45,
      amount: 80,
      offset: 50,
      bipolar: true,
      targetDesc: "(unassigned)",
    }
    setLfos((prev) => [...prev, newLfo])
  }

  const removeLfo = (id: number) => {
    setLfos((prev) => prev.filter((l) => l.id !== id))
  }

  const computeWave = (phase: number, shape: string) => {
    const ph = ((phase % 1.0) + 1.0) % 1.0
    switch (shape) {
      case "Sine":
        return 0.5 + 0.5 * Math.sin(ph * Math.PI * 2)
      case "Triangle":
        return ph < 0.5 ? ph * 2 : 2 - ph * 2
      case "Saw Up":
        return ph
      case "Saw Down":
        return 1 - ph
      case "Square":
        return ph < 0.5 ? 1 : 0
      case "Pulse 25%":
        return ph < 0.25 ? 1 : 0
      case "Pulse 75%":
        return ph < 0.75 ? 1 : 0
      case "Trapezoid":
        if (ph < 0.2) return ph * 5
        if (ph < 0.5) return 1
        if (ph < 0.7) return 1 - (ph - 0.5) * 5
        return 0
      case "Half Sine (Bump)":
        return Math.sin(ph * Math.PI)
      case "Stairs Up":
        return Math.floor(ph * 4) / 3
      case "Exponential Rise":
        return Math.pow(ph, 2)
      case "Smooth Random":
        return (
          0.5 +
          0.32 * Math.sin(ph * Math.PI * 2) +
          0.12 * Math.sin(ph * Math.PI * 4 + 1.2) +
          0.06 * Math.sin(ph * Math.PI * 8 + 2.1)
        )
      default:
        return 0.5 + 0.5 * Math.sin(ph * Math.PI * 2)
    }
  }

  const phosphorColor = lfoVisualPreset?.phosphorColor ?? skin.amber
  const beamGlowColor = lfoVisualPreset?.beamGlowColor ?? skin.ledRed
  const gridColor = lfoVisualPreset?.gridColor ?? `${skin.amber}25`
  const gridStyle = lfoVisualPreset?.gridStyle ?? "fine-mesh"
  const scanlines = lfoVisualPreset?.scanlineIntensity ?? 0.2
  const persistenceTrail = lfoVisualPreset?.persistenceTrail ?? 0.25
  const harmonics = lfoVisualPreset?.harmonics ?? 1

  const textColor = customization?.textColor || skin.textColor || skin.cream

  // Text configs
  const titleTextConfig = customTexts?.["lfos:title"]
  const lfo1TextConfig = customTexts?.["lfos:lfo1_name"]
  const lfo2TextConfig = customTexts?.["lfos:lfo2_name"]

  return (
    <div className="p-4 flex flex-col gap-4 text-xs select-none">
      {/* Top Bar with Customizable Title and Add Button */}
      <div className="flex items-center justify-between pb-1 border-b border-white/10">
        <div className="flex items-center gap-2">
          {!titleTextConfig?.hidden && (
            <span
              onClick={() => onOpenTextInspector?.("lfos:title")}
              className={`font-bold tracking-widest uppercase cursor-pointer transition-all ${
                isTextEditMode
                  ? "ring-1 ring-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded text-cyan-200 shadow"
                  : "hover:underline"
              } ${getTypefaceClass(titleTextConfig?.typeface)}`}
              style={getFaceplateStyle(titleTextConfig, phosphorColor)}
              title={
                isTextEditMode
                  ? "Click to edit title typography"
                  : "Hold Alt or click Edit Text to customize"
              }
            >
              {titleTextConfig?.text || "LFO & MODULATION ENGINE"}
            </span>
          )}
          <span className="text-[10px] text-slate-500 font-mono">
            {lfos.length} ACTIVE MODULATORS
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lfos.length < 4 && (
            <button
              type="button"
              onClick={addLfo}
              className="px-2.5 py-1 text-[11px] font-semibold rounded cursor-pointer transition-colors shadow-sm"
              style={{
                backgroundColor: `${skin.panelDarker}`,
                color: phosphorColor,
                border: `1px solid ${phosphorColor}50`,
              }}
            >
              + Add LFO Generator
            </button>
          )}
        </div>
      </div>

      {/* LFO Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lfos.map((lfo, idx) => {
          const currentPh = (phaseTime * lfo.rateHz + lfo.phaseDeg / 360) % 1.0
          const playVal = computeWave(currentPh, lfo.shape)

          const cardTextConfig =
            idx === 0 ? lfo1TextConfig : idx === 1 ? lfo2TextConfig : undefined
          const cardLabel = cardTextConfig?.text || lfo.name

          return (
            <div
              key={lfo.id}
              className="flex flex-col gap-2.5 p-3 rounded-lg border backdrop-blur-sm shadow-md transition-all"
              style={{
                backgroundColor: `${skin.panelDark}E6`,
                borderColor: `${phosphorColor}35`,
              }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: beamGlowColor,
                      boxShadow: `0 0 8px ${beamGlowColor}`,
                    }}
                  />
                  {!cardTextConfig?.hidden && (
                    <span
                      onClick={() =>
                        onOpenTextInspector?.(
                          idx === 0 ? "lfos:lfo1_name" : "lfos:lfo2_name",
                        )
                      }
                      className={`font-semibold cursor-pointer transition-all ${
                        isTextEditMode
                          ? "ring-1 ring-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded text-cyan-200 shadow"
                          : "hover:underline"
                      } ${getTypefaceClass(cardTextConfig?.typeface)}`}
                      style={getFaceplateStyle(cardTextConfig, textColor)}
                      title={
                        isTextEditMode
                          ? "Click to edit card label"
                          : "Hold Alt or click Edit Text to customize"
                      }
                    >
                      {cardLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400">
                    ID: 0{lfo.id}
                  </span>
                  {lfos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLfo(lfo.id)}
                      className="text-slate-400 hover:text-red-400 text-xs px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Analytical Waveform Canvas (CRISP NON-DISTORTED VECTOR GRAPHICS) */}
              <div
                className="h-24 w-full rounded border relative overflow-hidden bg-[#06080B]"
                style={{
                  borderColor: `${phosphorColor}40`,
                  boxShadow: `inset 0 0 16px rgba(0,0,0,0.9), 0 0 8px ${phosphorColor}15`,
                }}
              >
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id={`lfoGrad-${lfo.id}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor={phosphorColor}
                        stopOpacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stopColor={phosphorColor}
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Clean Vector Grid Lines */}
                  {gridStyle === "fine-mesh" && (
                    <>
                      {[80, 160, 240, 320].map((gx) => (
                        <line
                          key={`x-${gx}`}
                          x1={gx}
                          y1="0"
                          x2={gx}
                          y2="100"
                          stroke={gridColor}
                          strokeWidth="0.8"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                      {[25, 50, 75].map((gy) => (
                        <line
                          key={`y-${gy}`}
                          x1="0"
                          y1={gy}
                          x2="400"
                          y2={gy}
                          stroke={gridColor}
                          strokeWidth="0.8"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </>
                  )}

                  {/* Center Zero-Reference Line */}
                  <line
                    x1="0"
                    y1="50"
                    x2="400"
                    y2="50"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="0.8"
                    strokeDasharray="3 3"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Persistence Trail Wave (Subtle Ghost) */}
                  {persistenceTrail > 0.05 && (
                    <path
                      d={(() => {
                        const pts: string[] = []
                        const steps = 80
                        for (let i = 0; i <= steps; i++) {
                          const x = (i / steps) * 400
                          const wave = computeWave(
                            Math.max(0, i / steps - 0.03),
                            lfo.shape,
                          )
                          const scaled =
                            0.5 +
                            (wave - 0.5) *
                              Math.min(1.0, lfo.amount / 100) *
                              0.86
                          const y = (1 - scaled) * 80 + 10
                          pts.push(
                            `${
                              i === 0 ? "M" : "L"
                            } ${x.toFixed(1)} ${y.toFixed(1)}`,
                          )
                        }
                        return pts.join(" ")
                      })()}
                      fill="none"
                      stroke={beamGlowColor}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.35"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}

                  {/* Primary Crisp Waveform Line */}
                  <path
                    d={(() => {
                      const pts: string[] = []
                      const steps = 120
                      for (let i = 0; i <= steps; i++) {
                        const x = (i / steps) * 400
                        const wave = computeWave(i / steps, lfo.shape)
                        const scaled =
                          0.5 +
                          (wave - 0.5) * Math.min(1.0, lfo.amount / 100) * 0.86
                        const y = (1 - scaled) * 80 + 10
                        pts.push(
                          `${
                            i === 0 ? "M" : "L"
                          } ${x.toFixed(1)} ${y.toFixed(1)}`,
                        )
                      }
                      return pts.join(" ")
                    })()}
                    fill="none"
                    stroke={phosphorColor}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Radar Scanning Playhead Blip (100% PERFECT CIRCLE, NO ASPECT WARPING) */}
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: `${currentPh * 100}%`,
                    top: `${(1 - (0.5 + (playVal - 0.5) * Math.min(1.0, lfo.amount / 100) * 0.86)) * 80 + 10}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white flex items-center justify-center animate-ping opacity-60"
                    style={{ borderColor: beamGlowColor }}
                  />
                  <div
                    className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shadow-lg"
                    style={{
                      borderColor: beamGlowColor,
                      backgroundColor: `${beamGlowColor}44`,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  </div>
                </div>

                {/* Scanline CRT Texture */}
                {scanlines > 0.05 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      opacity: scanlines,
                      backgroundImage:
                        "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0px, transparent 1px, transparent 2px)",
                    }}
                  />
                )}

                {/* Status Telemetry */}
                <div className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-300 bg-black/75 px-1.5 py-0.5 rounded border border-white/10 pointer-events-none">
                  PHASE: {Math.round(currentPh * 360)}° · VAL:{" "}
                  {Math.round(playVal * 100)}%
                </div>
              </div>

              {/* Wave Shape Selector */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  Waveform Shape:
                </span>
                <select
                  value={lfo.shape}
                  onChange={(e) =>
                    setLfos((prev) =>
                      prev.map((item) =>
                        item.id === lfo.id
                          ? { ...item, shape: e.target.value }
                          : item,
                      ),
                    )
                  }
                  className="px-2 py-1 rounded border text-xs font-semibold outline-none cursor-pointer flex-1 max-w-[200px]"
                  style={{
                    backgroundColor: skin.panelDarker,
                    color: textColor,
                    borderColor: `${phosphorColor}40`,
                  }}
                >
                  {LFO_SHAPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* IMPLEMENTED SLIDER PRESET: Dedicated Themed Faders */}
              <div className="flex flex-col gap-2.5 pt-1">
                {/* 1. Rate Slider */}
                <LfoThemedSlider
                  label={customTexts?.["lfos:label_rate"]?.text || "Rate"}
                  value={lfo.rateHz}
                  min={0.05}
                  max={10}
                  step={0.05}
                  unit=" Hz"
                  color={phosphorColor}
                  sliderPreset={sliderPreset}
                  sliderOverrides={customSliders?.["lfo_rate"]}
                  sliderConfig={
                    customSliders?.["lfo_rate"]
                      ? { ...sliderConfig, ...customSliders["lfo_rate"] }
                      : sliderConfig
                  }
                  isCustomizeMode={isCustomizeMode}
                  isTextEditMode={isTextEditMode}
                  onLabelClick={() => onOpenTextInspector?.("lfos:label_rate")}
                  onOpenCreator={() => onOpenControlCreator?.("lfo_rate")}
                  onChange={(val) =>
                    setLfos((prev) =>
                      prev.map((item) =>
                        item.id === lfo.id ? { ...item, rateHz: val } : item,
                      ),
                    )
                  }
                />

                {/* 2. Depth Slider */}
                <LfoThemedSlider
                  label={customTexts?.["lfos:label_depth"]?.text || "Depth"}
                  value={lfo.amount}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  color={phosphorColor}
                  sliderPreset={sliderPreset}
                  sliderOverrides={customSliders?.["lfo_depth"]}
                  sliderConfig={
                    customSliders?.["lfo_depth"]
                      ? { ...sliderConfig, ...customSliders["lfo_depth"] }
                      : sliderConfig
                  }
                  isCustomizeMode={isCustomizeMode}
                  isTextEditMode={isTextEditMode}
                  onLabelClick={() => onOpenTextInspector?.("lfos:label_depth")}
                  onOpenCreator={() => onOpenControlCreator?.("lfo_depth")}
                  onChange={(val) =>
                    setLfos((prev) =>
                      prev.map((item) =>
                        item.id === lfo.id ? { ...item, amount: val } : item,
                      ),
                    )
                  }
                />

                {/* 3. Phase Slider */}
                <LfoThemedSlider
                  label={
                    customTexts?.["lfos:label_phase"]?.text || "Phase Offset"
                  }
                  value={lfo.phaseDeg}
                  min={0}
                  max={360}
                  step={15}
                  unit="°"
                  color={phosphorColor}
                  sliderPreset={sliderPreset}
                  sliderOverrides={customSliders?.["lfo_phase"]}
                  sliderConfig={
                    customSliders?.["lfo_phase"]
                      ? { ...sliderConfig, ...customSliders["lfo_phase"] }
                      : sliderConfig
                  }
                  isCustomizeMode={isCustomizeMode}
                  isTextEditMode={isTextEditMode}
                  onLabelClick={() => onOpenTextInspector?.("lfos:label_phase")}
                  onOpenCreator={() => onOpenControlCreator?.("lfo_phase")}
                  onChange={(val) =>
                    setLfos((prev) =>
                      prev.map((item) =>
                        item.id === lfo.id ? { ...item, phaseDeg: val } : item,
                      ),
                    )
                  }
                />
              </div>

              {/* Modulation Target */}
              <div
                className="text-[10px] pt-1.5 border-t flex items-center justify-between"
                style={{ borderColor: `${phosphorColor}25` }}
              >
                <span className="text-slate-400">Target Assignment:</span>
                <span className="font-semibold font-mono text-slate-200">
                  {lfo.targetDesc}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Dedicated Themed Horizontal Slider Component for LFOs
 * Accurately implements SliderArchitect preset & Control Creator styling
 */
function LfoThemedSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  color,
  sliderPreset,
  sliderConfig,
  sliderOverrides,
  isCustomizeMode = false,
  isTextEditMode = false,
  onLabelClick,
  onOpenCreator,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  color: string
  sliderPreset?: SliderArchitectPreset
  sliderConfig?: SliderCreatorConfig | Partial<SliderCreatorConfig>
  sliderOverrides?: Partial<SliderCreatorConfig>
  isCustomizeMode?: boolean
  isTextEditMode?: boolean
  onLabelClick?: () => void
  onOpenCreator?: () => void
  onChange: (val: number) => void
}) {
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))

  // Untouched creator defaults must not hide the selected catalog preset.
  const override = <K extends keyof SliderCreatorConfig>(key: K) => {
    const configured = sliderConfig?.[key]
    return (
      sliderOverrides?.[key] ??
      (configured !== DEFAULT_SLIDER_CONFIG[key] ? configured : undefined)
    )
  }
  const handleStyle = override("handleStyle")
  const railStyle = override("railStyle")
  const handleSize = override("handleSize")
  const sizeAspect = override("sizeAspect")

  return (
    <div
      className="flex flex-col gap-1 select-none"
      onContextMenu={(e) => {
        if (onOpenCreator) {
          e.preventDefault()
          e.stopPropagation()
          onOpenCreator()
        }
      }}
    >
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <span
            onClick={onLabelClick}
            className={`font-medium cursor-pointer transition-all ${
              isTextEditMode
                ? "ring-1 ring-cyan-400 bg-cyan-950/70 px-1.5 py-0.5 rounded text-cyan-200 shadow"
                : "text-slate-300 hover:text-white"
            }`}
            title={
              isTextEditMode
                ? "Click to customize label"
                : "Hold Alt or click Edit Text to customize"
            }
          >
            {label}
          </span>
          <button
            type="button"
            onClick={onOpenCreator}
            title="Customize this slider in Control Creator (or right-click)"
            className={`p-0.5 rounded transition-all cursor-pointer ${
              isCustomizeMode
                ? "bg-amber-500/20 text-amber-300 border border-amber-400/50 scale-110"
                : "text-slate-500 hover:text-amber-400"
            }`}
          >
            <Settings
              size={12}
              className={isCustomizeMode ? "animate-spin" : ""}
            />
          </button>
        </div>
        <span className="font-mono font-bold text-amber-300">
          {value.toFixed(step < 1 ? 2 : 0)}
          {unit}
        </span>
      </div>

      <SliderRenderer
        preset={sliderPreset}
        value={normalized}
        customTrackColor={override("railColor")}
        customThumbColor={override("handleColor")}
        customAccentColor={
          override("fillColor") ?? (sliderPreset ? undefined : color)
        }
        customTrackHeight={override("railSize")}
        customThumbHeight={handleSize}
        customThumbWidth={
          handleSize !== undefined || sizeAspect !== undefined
            ? (handleSize ??
                sliderPreset?.thumbHeight ??
                DEFAULT_SLIDER_CONFIG.handleSize) *
              (sizeAspect ?? DEFAULT_SLIDER_CONFIG.sizeAspect)
            : undefined
        }
        customThumbStyle={
          handleStyle
            ? ({
                Classic: "brushed-metal",
                FaderCap: "flat-tab",
                Knurled: "knurled-slug",
                Slim: "glowing-pill",
                ConsoleFader: "vintage-bakelite",
              } as const)[handleStyle]
            : undefined
        }
        customTrackStyle={
          railStyle
            ? ({
                Line: "minimal-line",
                Slot: "recessed-groove",
                Groove: "dual-rail",
              } as const)[railStyle]
            : undefined
        }
        onChange={(ratio) => {
          const raw = min + ratio * (max - min)
          const snapped = step
            ? min + Math.round((raw - min) / step) * step
            : raw
          onChange(Number(Math.max(min, Math.min(max, snapped)).toFixed(2)))
        }}
      />
    </div>
  )
}

export default VstLfosPage
