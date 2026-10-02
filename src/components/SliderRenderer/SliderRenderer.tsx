import React, { useRef, useState, useCallback, useLayoutEffect } from "react"
import {
  SliderArchitectPreset,
  SliderTrackStyle,
  SliderThumbStyle,
} from "../../types/skin"

interface SliderRendererProps {
  preset?: SliderArchitectPreset
  value: number // 0.0 to 1.0
  onChange?: (val: number) => void
  label?: string
  suffix?: string
  min?: number
  max?: number
  width?: number | string
  height?: number
  disabled?: boolean
  // Customization Overrides
  customTrackHeight?: number
  customThumbWidth?: number
  customThumbHeight?: number
  customTrackColor?: string
  customThumbColor?: string
  customAccentColor?: string
  customGlow?: number
  customThumbStyle?: SliderThumbStyle
  customTrackStyle?: SliderTrackStyle
  customTextColor?: string
  customValueColor?: string
  customOffsetY?: number
}

export const SliderRenderer: React.FC<SliderRendererProps> = ({
  preset,
  value,
  onChange,
  label,
  suffix = "",
  min = 0,
  max = 1,
  width = "100%",
  height = 36,
  disabled = false,
  customTrackHeight,
  customThumbWidth,
  customThumbHeight,
  customTrackColor,
  customThumbColor,
  customAccentColor,
  customGlow,
  customThumbStyle,
  customTrackStyle,
  customTextColor,
  customValueColor,
  customOffsetY = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [railWidth, setRailWidth] = useState(Infinity)

  useLayoutEffect(() => {
    const rail = containerRef.current
    if (!rail) return
    const measure = () => setRailWidth(rail.getBoundingClientRect().width)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [])

  // Fallbacks if no specific preset is provided
  const trackStyle = customTrackStyle ?? preset?.trackStyle ?? "recessed-groove"
  const thumbStyle = customThumbStyle ?? preset?.thumbStyle ?? "brushed-metal"
  const rawTrackHeight = customTrackHeight ?? preset?.trackHeight ?? 6
  // Saved presets and creator overrides must fit a horizontal preview rail.
  const trackHeight = Math.max(
    1,
    Math.min(rawTrackHeight, Math.max(1, height - 10)),
  )
  const requestedThumbWidth = Math.max(
    1,
    customThumbWidth ?? preset?.thumbWidth ?? 12,
  )
  const thumbWidth = Math.min(requestedThumbWidth, railWidth / (2 * 1.08))
  const thumbHeight = Math.max(
    1,
    customThumbHeight ?? preset?.thumbHeight ?? 22,
  )
  const showCenterDetent = preset?.showCenterDetent ?? true
  const tickCount = preset?.tickMarksCount ?? 5
  const trackColor = customTrackColor ?? preset?.trackColor ?? "#171615"
  const thumbColor = customThumbColor ?? preset?.thumbColor ?? "#e8dfc8"
  const accentColor = customAccentColor ?? preset?.accentColor ?? "#e8a13a"
  const glow = customGlow ?? preset?.glowIntensity ?? 0.4
  const cornerRadius = preset?.cornerRadius ?? 2

  const updateFromPointer = useCallback(
    (clientX: number) => {
      if (!containerRef.current || disabled) return
      const rect = containerRef.current.getBoundingClientRect()
      const margin = Math.min(requestedThumbWidth * 1.08, rect.width / 2) / 2
      const effectiveWidth = rect.width - margin * 2
      if (effectiveWidth <= 0) return
      const clickX = clientX - rect.left - margin
      const clamped = Math.max(0, Math.min(1, clickX / effectiveWidth))
      onChange?.(clamped)
    },
    [disabled, onChange, requestedThumbWidth],
  )

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    updateFromPointer(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateFromPointer(e.clientX)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const normalizedValue = Number.isFinite(value)
    ? Math.max(0, Math.min(1, value))
    : 0
  const displayVal = min + normalizedValue * (max - min)
  const formattedVal =
    displayVal < 10 && displayVal > -10
      ? displayVal.toFixed(1)
      : Math.round(displayVal).toString()

  const thumbInset = (thumbWidth * 1.08) / 2
  const thumbLeft = `calc(${normalizedValue * 100}% + ${(1 - normalizedValue * 2) * thumbInset}px)`
  const containerHeight = Math.max(
    height,
    thumbHeight * 1.08 + 10,
    trackHeight + 10,
  )

  return (
    <div
      className="flex flex-col gap-1 w-full min-w-0 select-none transition-transform"
      style={{
        maxWidth: width,
        transform: `translateY(${customOffsetY}px)`,
      }}
    >
      {label && (
        <div className="flex items-center justify-between gap-2 text-[11px] font-mono leading-none px-0.5 min-w-0">
          <span
            className="min-w-0 truncate transition-colors"
            style={{ color: customTextColor || "#a1a1aa" }}
          >
            {label}
          </span>
          <span
            className="shrink-0 font-bold tabular-nums transition-colors"
            style={{ color: customValueColor || accentColor }}
          >
            {formattedVal}
            {suffix}
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={() => setIsDragging(false)}
        className={`relative flex items-center cursor-pointer touch-none ${
          disabled ? "opacity-40 pointer-events-none" : ""
        }`}
        style={{ height: containerHeight }}
      >
        {/* Track Container */}
        <div
          className="relative w-full overflow-visible transition-all"
          style={{
            height: trackHeight,
            backgroundColor: trackColor,
            borderRadius: cornerRadius,
            boxShadow:
              trackStyle === "cyber-glow"
                ? `0 0 ${Math.round(glow * 14)}px ${accentColor}88, inset 0 1px 3px rgba(0,0,0,0.8)`
                : glow > 0.3
                  ? `0 0 ${Math.round(glow * 8)}px ${accentColor}44, inset 0 1px 2px rgba(0,0,0,0.7)`
                  : "inset 0 1px 2px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Active Fill Segment (from 0 to current) */}
          <div
            className="absolute top-0 bottom-0 left-0"
            style={{
              width: thumbLeft,
              backgroundColor: accentColor,
              borderRadius: Math.max(1, cornerRadius - 1),
              opacity: trackStyle === "liquid-tube" ? 0.75 : 0.45,
              filter:
                glow > 0.4 ? `drop-shadow(0 0 4px ${accentColor})` : undefined,
            }}
          />

          {/* Center Detent Tick */}
          {showCenterDetent && (
            <div
              className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0.5 pointer-events-none"
              style={{
                height: trackHeight + 6,
                backgroundColor: `${accentColor}99`,
              }}
            />
          )}

          {/* Tick Scale Marks */}
          {tickCount > 1 && (
            <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
              {Array.from({ length: tickCount }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-px bg-white/20"
                  style={{
                    height:
                      idx === 0 || idx === tickCount - 1
                        ? trackHeight + 4
                        : trackHeight + 1,
                    opacity:
                      idx === Math.floor(tickCount / 2) && showCenterDetent
                        ? 0
                        : 0.4,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumb */}
        <div
          className="absolute top-1/2 transition-transform shadow-md pointer-events-none"
          style={{
            left: thumbLeft,
            width: thumbWidth,
            height: thumbHeight,
            transform: `translate(-50%, -50%) scale(${
              isDragging ? 1.08 : 1.0
            })`,
          }}
        >
          {thumbStyle === "brushed-metal" && (
            <div
              className="w-full h-full rounded-[2px] border border-black/60 flex items-center justify-center relative overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${thumbColor} 0%, #7d776d 100%)`,
                boxShadow: isDragging
                  ? `0 0 10px ${accentColor}88`
                  : "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              <div className="w-0.5 h-3/4 bg-black/40 rounded-full" />
            </div>
          )}

          {thumbStyle === "glowing-pill" && (
            <div
              className="w-full h-full rounded-full border border-white/40 flex items-center justify-center"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 ${Math.max(4, Math.round(glow * 12))}px ${accentColor}`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
            </div>
          )}

          {thumbStyle === "reticle-cross" && (
            <div className="w-full h-full flex items-center justify-center relative">
              <div
                className="absolute inset-0 border-2 rounded-sm"
                style={{ borderColor: accentColor }}
              />
              <div
                className="w-full h-0.5"
                style={{ backgroundColor: accentColor }}
              />
              <div
                className="h-full w-0.5 absolute"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          )}

          {thumbStyle === "vintage-bakelite" && (
            <div
              className="w-full h-full rounded-sm border-2 border-black/80 flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: "#2b1a14",
                background: "linear-gradient(135deg, #44261d 0%, #1a0f0b 100%)",
              }}
            >
              <div
                className="w-1 h-3/4 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          )}

          {thumbStyle === "diamond-wedge" && (
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="w-3/4 h-3/4 rotate-45 border border-black/70 shadow-sm"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          )}

          {thumbStyle === "knurled-slug" && (
            <div
              className="w-full h-full rounded-[3px] border border-black/70 flex flex-col justify-evenly py-1 px-0.5 shadow-sm"
              style={{ backgroundColor: thumbColor }}
            >
              <div className="w-full h-0.5 bg-black/30" />
              <div className="w-full h-0.5 bg-black/50" />
              <div className="w-full h-0.5 bg-black/30" />
            </div>
          )}

          {thumbStyle === "laser-dot" && (
            <div className="w-full h-full flex items-center justify-center">
              <div
                className="w-3 h-3 rounded-full bg-white shadow-lg animate-pulse"
                style={{
                  boxShadow: `0 0 10px ${accentColor}, 0 0 4px ${accentColor}`,
                }}
              />
            </div>
          )}

          {thumbStyle === "flat-tab" && (
            <div
              className="w-full h-full rounded-sm border border-black/40 shadow-sm"
              style={{ backgroundColor: thumbColor }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default SliderRenderer
