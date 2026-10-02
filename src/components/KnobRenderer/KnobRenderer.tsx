import React, { useState, useRef, useEffect, useCallback } from 'react';
import { KnobStyle, SkinDefinition, KnobArchitectPreset } from '../../types/skin';

interface KnobProps {
  value: number; // 0.0 to 1.0 (or mapped)
  min?: number;
  max?: number;
  defaultValue?: number;
  label?: string;
  suffix?: string;
  size?: number;
  skin: SkinDefinition;
  preset?: KnobArchitectPreset;
  knobStyleOverride?: KnobStyle;
  onChange?: (val: number) => void;
  disabled?: boolean;
  // Customization Overrides
  customSize?: number;
  customGlow?: number;
  customGlowEnabled?: boolean;
  customBodyColor?: string;
  customAccentColor?: string;
  customPointerColor?: string;
  customTextColor?: string;
  customValueColor?: string;
  customOffsetX?: number;
  customOffsetY?: number;
  // Customization & Faceplate Text hooks
  onCustomize?: () => void;
  isCustomizeMode?: boolean;
  onLabelClick?: () => void;
  isTextEditMode?: boolean;
  faceplateStyle?: React.CSSProperties;
  typefaceClass?: string;
}

export const KnobRenderer: React.FC<KnobProps> = ({
  value,
  min = 0,
  max = 1,
  defaultValue = 0.5,
  label,
  suffix = '',
  size = 68,
  skin,
  preset,
  knobStyleOverride,
  onChange,
  disabled = false,
  customSize,
  customGlow,
  customGlowEnabled,
  customBodyColor,
  customAccentColor,
  customPointerColor,
  customTextColor,
  customValueColor,
  customOffsetX = 0,
  customOffsetY = 0,
  onCustomize,
  isCustomizeMode = false,
  onLabelClick,
  isTextEditMode = false,
  faceplateStyle,
  typefaceClass
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartY = useRef(0);
  const startVal = useRef(value);

  const activePreset = preset ?? skin.knobPreset;

  const effectiveSize = customSize ?? size;
  const style = knobStyleOverride || activePreset?.style || skin.knobStyle || 'ChunkyPointer';

  const bodyColor = customBodyColor || activePreset?.bodyColor || skin.knobPreset?.bodyColor || skin.knobBodyColor || skin.cream;
  const accentColor = customAccentColor || activePreset?.accentColor || skin.knobPreset?.accentColor || skin.knobAccentColor || skin.amber;
  const pointerColor = customPointerColor || activePreset?.pointerColor || skin.knobPreset?.pointerColor || skin.knobPointerColor || skin.ledRed;

  // Glow Toggle & Intensity
  const glowEnabled = customGlowEnabled ?? (skin.knobGlowEnabled ?? true);
  const rawGlow = customGlow ?? (activePreset?.glowIntensity ?? skin.glowIntensity ?? 0.5);
  const glow = glowEnabled ? rawGlow : 0;

  // Architectural geometry parameters
  const bezelWidth = activePreset?.bezelWidth ?? 1.5;
  const tickCount = activePreset?.tickCount ?? (style === 'MinimalDot' ? 0 : 11);
  const tickSpread = activePreset?.tickSpread ?? 270;
  const pointerThickness = activePreset?.pointerThickness ?? (style === 'MinimalDot' ? 2.5 : 3.6);
  const pointerLengthRatio = activePreset?.pointerLengthRatio ?? 0.72;
  const centerCapRatio = activePreset?.centerCapRatio ?? 0.24;
  const shadowDepth = activePreset?.shadowDepth ?? 2.0;
  const metalRoughness = activePreset?.metalRoughness ?? 0.4;

  // Rotation angles
  const normVal = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const tickStartAngle = -tickSpread / 2;
  const tickEndAngle = tickSpread / 2;
  const currentAngle = tickStartAngle + normVal * (tickEndAngle - tickStartAngle);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    setShowTooltip(true);
    dragStartY.current = e.clientY;
    startVal.current = value;
    e.preventDefault();
  };

  const handleDoubleClick = () => {
    if (disabled || onChange === undefined) return;
    onChange(defaultValue);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || onChange === undefined) return;
    const dy = dragStartY.current - e.clientY;
    const sensitivity = e.shiftKey ? 400 : 150;
    const delta = (dy / sensitivity) * (max - min);
    const next = Math.min(max, Math.max(min, startVal.current + delta));
    onChange(next);
  }, [isDragging, max, min, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setShowTooltip(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const polarToCart = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngleDeg: number, endAngleDeg: number) => {
    const start = polarToCart(x, y, radius, endAngleDeg);
    const end = polarToCart(x, y, radius, startAngleDeg);
    const largeArc = endAngleDeg - startAngleDeg <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const cx = effectiveSize / 2;
  const cy = effectiveSize / 2;
  const radius = effectiveSize * 0.44;
  const bodyR = Math.max(radius * 0.45, radius - bezelWidth);
  const capR = radius * Math.min(0.55, Math.max(0.12, centerCapRatio));
  const ptrLen = radius * Math.min(0.95, Math.max(0.35, pointerLengthRatio));
  const ptrThick = Math.max(1, pointerThickness);

  const displayVal = Number.isInteger(max) && max > 20
    ? Math.round(value)
    : value < 10 && value > -10
    ? value.toFixed(1)
    : Math.round(value);

  // Optical Glow Filter - toggled dynamically
  const glowFilter = glowEnabled && glow > 0.05
    ? `drop-shadow(0 ${shadowDepth}px ${Math.round(shadowDepth * 1.5 + glow * 10)}px ${accentColor})`
    : shadowDepth > 0
    ? `drop-shadow(0 ${shadowDepth}px ${Math.round(shadowDepth * 2)}px rgba(0,0,0,0.65))`
    : undefined;

  // Knob text must stay white only (never change with skins or themes)
  const textColor = '#FFFFFF';
  const valueColor = '#FFFFFF';

  return (
    <div
      className="flex flex-col items-center select-none group relative transition-transform"
      style={{
        transform: `translate(${customOffsetX}px, ${customOffsetY}px)`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick Customize Badge */}
      {onCustomize && (isCustomizeMode || isHovered) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCustomize();
          }}
          className="absolute -top-2 -right-2 z-40 w-5 h-5 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer border border-black/40"
          title="Customize this control in Control Creator"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
            <path d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        </button>
      )}

      {/* Active Value Bubble Tooltip */}
      {showTooltip && (
        <div
          className="absolute -top-7 px-2 py-0.5 text-[11px] font-mono font-bold rounded shadow-md z-30 pointer-events-none whitespace-nowrap backdrop-blur-md"
          style={{
            backgroundColor: `${skin.panelDarker}EE`,
            color: valueColor,
            border: `1px solid ${accentColor}66`
          }}
        >
          {displayVal}{suffix}
        </div>
      )}

      {/* Interactive Knob SVG */}
      <div
        className={`relative cursor-ns-resize transition-transform duration-75 ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
        } ${
          isCustomizeMode
            ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black/70 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)] cursor-pointer'
            : ''
        }`}
        style={{ width: effectiveSize, height: effectiveSize }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => {
          if (onCustomize) {
            e.preventDefault();
            e.stopPropagation();
            onCustomize();
          }
        }}
        title={
          onCustomize
            ? isCustomizeMode
              ? 'Click or right-click to customize this knob in Control Creator'
              : 'Right-click to customize this knob in Control Creator'
            : undefined
        }
      >
        <svg
          width={effectiveSize}
          height={effectiveSize}
          viewBox={`0 0 ${effectiveSize} ${effectiveSize}`}
          style={{ filter: glowFilter }}
        >
          {/* 1. CHUNKY POINTER */}
          {style === 'ChunkyPointer' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill={skin.panelDarker} stroke="#000000" strokeWidth={bezelWidth} />
              {tickCount > 0 && Array.from({ length: tickCount }).map((_, i) => {
                const angle = tickCount === 1 ? 0 : tickStartAngle + (i / (tickCount - 1)) * tickSpread;
                const p1 = polarToCart(cx, cy, radius * 0.9, angle);
                const p2 = polarToCart(cx, cy, radius * (0.9 + 0.15 * (1 - metalRoughness * 0.4)), angle);
                const isMain = i === 0 || i === tickCount - 1 || i === Math.floor(tickCount / 2);
                return (
                  <line
                    key={i}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isMain ? accentColor : `${bodyColor}40`}
                    strokeWidth={isMain ? Math.max(1.2, ptrThick * 0.45) : Math.max(0.8, ptrThick * 0.3)}
                  />
                );
              })}
              <circle
                cx={cx}
                cy={cy}
                r={bodyR * 0.88}
                fill={bodyColor}
                stroke={skin.panelDarker}
                strokeWidth={bezelWidth}
              />
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <rect
                  x={cx - ptrThick / 2}
                  y={cy - ptrLen}
                  width={ptrThick}
                  height={Math.max(4, ptrLen - capR * 0.6)}
                  rx={ptrThick * 0.3}
                  fill={pointerColor}
                />
              </g>
              <circle cx={cx} cy={cy} r={capR} fill={skin.panelDarker} stroke="#000000" strokeWidth={shadowDepth * 0.4} />
            </>
          )}

          {/* 2. ARC INDICATOR */}
          {style === 'ArcIndicator' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill={skin.panelDarker} stroke={`${bodyColor}15`} strokeWidth={bezelWidth} />
              <path
                d={describeArc(cx, cy, radius * 0.76, tickStartAngle, tickEndAngle)}
                fill="none"
                stroke={`${bodyColor}20`}
                strokeWidth={ptrThick * 1.8}
                strokeLinecap="round"
              />
              {normVal > 0.01 && (
                <path
                  d={describeArc(cx, cy, radius * 0.76, tickStartAngle, currentAngle)}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={ptrThick * 1.8}
                  strokeLinecap="round"
                  opacity={0.9}
                />
              )}
              {(() => {
                const tip = polarToCart(cx, cy, radius * 0.76, currentAngle);
                return (
                  <>
                    <circle cx={tip.x} cy={tip.y} r={ptrThick * 1.2} fill={accentColor} opacity={0.4} />
                    <circle cx={tip.x} cy={tip.y} r={ptrThick * 0.7} fill="#FFFFFF" />
                  </>
                );
              })()}
              <circle cx={cx} cy={cy} r={capR * 1.4} fill={skin.panelDark} stroke={`${accentColor}40`} strokeWidth={bezelWidth} />
            </>
          )}

          {/* 3. BOLD BLOCK */}
          {style === 'BoldBlock' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill="#000000" stroke="#000000" strokeWidth={bezelWidth * 1.3} />
              <circle cx={cx} cy={cy} r={bodyR * 0.9} fill={accentColor} stroke="#000000" strokeWidth={bezelWidth * 1.5} />
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <polygon
                  points={`${cx},${cy - ptrLen} ${cx - ptrThick * 1.4},${cy - 2} ${cx + ptrThick * 1.4},${cy - 2}`}
                  fill="#000000"
                />
                <polygon
                  points={`${cx},${cy - ptrLen * 0.9} ${cx - ptrThick * 0.7},${cy - 6} ${cx + ptrThick * 0.7},${cy - 6}`}
                  fill={pointerColor}
                />
              </g>
              <circle cx={cx} cy={cy} r={capR * 1.2} fill="#000000" />
              <circle cx={cx} cy={cy} r={capR * 0.6} fill={bodyColor} />
            </>
          )}

          {/* 4. CYBER RING */}
          {style === 'CyberRing' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill="#080B10" stroke={`${accentColor}33`} strokeWidth={bezelWidth} />
              {(() => {
                const ringTicks = tickCount > 0 ? tickCount : 18;
                return Array.from({ length: ringTicks }).map((_, i) => {
                  const tickAngle = ringTicks === 1 ? 0 : tickStartAngle + (i / (ringTicks - 1)) * tickSpread;
                  const isActive = tickAngle <= currentAngle;
                  const p1 = polarToCart(cx, cy, radius * 0.82, tickAngle);
                  const p2 = polarToCart(cx, cy, radius * 0.98, tickAngle);
                  return (
                    <line
                      key={i}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isActive ? accentColor : `${skin.panelDarker}88`}
                      strokeWidth={isActive ? Math.max(1.5, ptrThick * 0.6) : Math.max(0.8, ptrThick * 0.3)}
                    />
                  );
                });
              })()}
              <circle cx={cx} cy={cy} r={bodyR * 0.75} fill={skin.panelDark} stroke={`${accentColor}60`} strokeWidth={bezelWidth} />
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <line x1={cx} y1={cy} x2={cx} y2={cy - ptrLen} stroke={pointerColor} strokeWidth={ptrThick * 0.8} />
                <circle cx={cx} cy={cy - ptrLen * 0.9} r={Math.max(1.5, ptrThick * 0.6)} fill={accentColor} />
              </g>
              <circle cx={cx} cy={cy} r={capR} fill={accentColor} />
            </>
          )}

          {/* 5. LIQUID GAUGE */}
          {style === 'LiquidGauge' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill={skin.panelDarker} stroke="#000000" strokeWidth={bezelWidth} />
              <path
                d={describeArc(cx, cy, radius * 0.74, tickStartAngle, tickEndAngle)}
                fill="none"
                stroke={`${skin.panelDark}80`}
                strokeWidth={ptrThick * 2.2}
                strokeLinecap="round"
              />
              {normVal > 0.02 && (
                <path
                  d={describeArc(cx, cy, radius * 0.74, tickStartAngle, currentAngle)}
                  fill="none"
                  stroke={pointerColor}
                  strokeWidth={ptrThick * 2.2}
                  strokeLinecap="round"
                />
              )}
              <circle cx={cx} cy={cy} r={bodyR * 0.65} fill={skin.panelDark} stroke={accentColor} strokeWidth={bezelWidth} />
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <circle cx={cx} cy={cy - ptrLen * 0.55} r={capR * 0.7} fill={accentColor} />
              </g>
            </>
          )}

          {/* 6. STEPPED WEDGE */}
          {style === 'SteppedWedge' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill={skin.panelDarker} stroke="#1A1A1A" strokeWidth={bezelWidth} />
              {(() => {
                const notchCount = tickCount > 0 ? tickCount : 24;
                return Array.from({ length: notchCount }).map((_, i) => {
                  const a = (i / notchCount) * 360;
                  const p1 = polarToCart(cx, cy, radius * 0.88, a);
                  const p2 = polarToCart(cx, cy, radius * 0.98, a);
                  return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#000000" strokeWidth={Math.max(1, bezelWidth)} />;
                });
              })()}
              <circle cx={cx} cy={cy} r={bodyR * 0.85} fill={bodyColor} stroke={skin.panelDarker} strokeWidth={bezelWidth} />
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <rect x={cx - ptrThick * 0.8} y={cy - ptrLen} width={ptrThick * 1.6} height={ptrLen} fill={skin.panelDarker} />
                <rect x={cx - ptrThick * 0.4} y={cy - ptrLen * 0.95} width={ptrThick * 0.8} height={ptrLen * 0.9} fill={accentColor} />
              </g>
              <circle cx={cx} cy={cy} r={capR} fill={skin.panelDarker} />
            </>
          )}

          {/* 7. GROOVED CAP */}
          {style === 'GroovedCap' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill={skin.panelDarker} stroke="#000000" strokeWidth={bezelWidth} />
              <circle cx={cx} cy={cy} r={bodyR * 0.92} fill={skin.panelDark} stroke={`${bodyColor}33`} strokeWidth={bezelWidth * 0.8} />
              <circle cx={cx} cy={cy} r={bodyR * 0.7} fill="none" stroke={`${bodyColor}20`} strokeWidth={1 + metalRoughness} />
              <circle cx={cx} cy={cy} r={bodyR * 0.48} fill="none" stroke={`${bodyColor}15`} strokeWidth={1 + metalRoughness * 0.5} />
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <line
                  x1={cx}
                  y1={cy - ptrLen}
                  x2={cx}
                  y2={cy - capR * 0.8}
                  stroke={accentColor}
                  strokeWidth={ptrThick}
                  strokeLinecap="round"
                />
              </g>
              <circle cx={cx} cy={cy} r={capR} fill={skin.panelDarker} />
            </>
          )}

          {/* 8. NEON RIM */}
          {style === 'NeonRim' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill={skin.panelDarker} stroke={pointerColor} strokeWidth={bezelWidth * 1.2} />
              <circle cx={cx} cy={cy} r={bodyR * 0.85} fill={skin.panelDark} stroke={`${accentColor}40`} strokeWidth={bezelWidth * 0.7} />
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <line x1={cx} y1={cy - ptrLen} x2={cx} y2={cy} stroke={accentColor} strokeWidth={ptrThick} />
                <circle cx={cx} cy={cy - ptrLen} r={Math.max(2, ptrThick * 0.8)} fill="#FFFFFF" />
              </g>
              <circle cx={cx} cy={cy} r={capR} fill={skin.panelDarker} stroke={pointerColor} strokeWidth={bezelWidth * 0.7} />
            </>
          )}

          {/* 9. MINIMAL DOT */}
          {style === 'MinimalDot' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill={skin.panelDarker} stroke={`${bodyColor}25`} strokeWidth={bezelWidth} />
              <circle cx={cx} cy={cy} r={bodyR * 0.88} fill={skin.panelDark} />
              {(() => {
                const pt = polarToCart(cx, cy, ptrLen, currentAngle);
                return (
                  <>
                    <circle cx={pt.x} cy={pt.y} r={ptrThick * 1.2} fill={accentColor} />
                    <circle cx={pt.x} cy={pt.y} r={ptrThick * 0.55} fill="#FFFFFF" />
                  </>
                );
              })()}
              <circle cx={cx} cy={cy} r={capR} fill={`${bodyColor}40`} />
            </>
          )}

          {/* 10. VINTAGE FLUTED */}
          {style === 'VintageFluted' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill="#141414" stroke="#000000" strokeWidth={bezelWidth * 1.2} />
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <path
                  d={`M ${cx - ptrThick * 1.4} ${cy} L ${cx - ptrThick * 0.6} ${cy - ptrLen} Q ${cx} ${cy - ptrLen * 1.08} ${cx + ptrThick * 0.6} ${cy - ptrLen} L ${cx + ptrThick * 1.4} ${cy} Z`}
                  fill={skin.panelDark}
                  stroke="#000000"
                  strokeWidth={bezelWidth}
                />
                <line x1={cx} y1={cy - ptrLen} x2={cx} y2={cy - capR * 0.6} stroke={bodyColor} strokeWidth={ptrThick * 0.6} />
              </g>
              <circle cx={cx} cy={cy} r={capR * 1.3} fill={skin.panelDarker} stroke="#000000" strokeWidth={bezelWidth} />
              <circle cx={cx} cy={cy} r={capR * 0.65} fill={accentColor} />
            </>
          )}

          {/* 11. ORBITAL ENCODER */}
          {style === 'OrbitalEncoder' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill="#07090D" stroke={`${accentColor}55`} strokeWidth={bezelWidth} />
              <circle
                cx={cx}
                cy={cy}
                r={bodyR * 0.83}
                fill={skin.panelDark}
                stroke={`${bodyColor}50`}
                strokeWidth={Math.max(1, bezelWidth * 0.7)}
              />
              {[0.96, 0.7, 0.48].map((scale, index) => (
                <path
                  key={scale}
                  d={describeArc(cx, cy, radius * scale, tickStartAngle + index * 18, currentAngle)}
                  fill="none"
                  stroke={index === 1 ? pointerColor : accentColor}
                  strokeWidth={Math.max(1, ptrThick * (0.65 - index * 0.1))}
                  strokeLinecap="round"
                  opacity={0.95 - index * 0.2}
                />
              ))}
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <circle cx={cx} cy={cy - ptrLen * 0.84} r={Math.max(2, ptrThick)} fill="#FFFFFF" />
                <circle cx={cx} cy={cy - ptrLen * 0.84} r={Math.max(1, ptrThick * 0.45)} fill={pointerColor} />
              </g>
              <circle cx={cx} cy={cy} r={capR * 0.72} fill={accentColor} />
            </>
          )}

          {/* 12. PRISM ROTOR */}
          {style === 'PrismRotor' && (
            <>
              <defs>
                <linearGradient id={`prism-${effectiveSize}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={bodyColor} />
                  <stop offset="48%" stopColor={skin.panelDark} />
                  <stop offset="100%" stopColor={accentColor} />
                </linearGradient>
              </defs>
              <circle cx={cx} cy={cy} r={radius} fill="#090B10" stroke={`${pointerColor}66`} strokeWidth={bezelWidth} />
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <polygon
                  points={`${cx},${cy - bodyR} ${cx + bodyR * 0.82},${cy - bodyR * 0.2} ${cx + bodyR * 0.5},${cy + bodyR * 0.8} ${cx - bodyR * 0.5},${cy + bodyR * 0.8} ${cx - bodyR * 0.82},${cy - bodyR * 0.2}`}
                  fill={`url(#prism-${effectiveSize})`}
                  stroke={accentColor}
                  strokeWidth={Math.max(1, bezelWidth * 0.7)}
                />
                <line x1={cx} y1={cy - ptrLen} x2={cx} y2={cy - capR} stroke="#FFFFFF" strokeWidth={ptrThick} />
              </g>
              <circle cx={cx} cy={cy} r={capR} fill={skin.panelDarker} stroke={pointerColor} strokeWidth={bezelWidth * 0.55} />
            </>
          )}

          {/* 13. CONCENTRIC CONSOLE */}
          {style === 'ConcentricConsole' && (
            <>
              <circle cx={cx} cy={cy} r={radius} fill={skin.panelDarker} stroke="#000000" strokeWidth={bezelWidth} />
              {[0.9, 0.72, 0.54].map((scale, index) => (
                <circle
                  key={scale}
                  cx={cx}
                  cy={cy}
                  r={bodyR * scale}
                  fill={index === 2 ? skin.panelDark : 'none'}
                  stroke={index === 1 ? accentColor : `${bodyColor}${index === 0 ? '55' : '30'}`}
                  strokeWidth={Math.max(0.8, bezelWidth * (0.8 - index * 0.12))}
                />
              ))}
              <g transform={`rotate(${currentAngle}, ${cx}, ${cy})`}>
                <rect
                  x={cx - ptrThick * 0.55}
                  y={cy - ptrLen}
                  width={ptrThick * 1.1}
                  height={ptrLen - capR * 0.5}
                  rx={ptrThick * 0.5}
                  fill={pointerColor}
                />
                <circle cx={cx} cy={cy - ptrLen} r={ptrThick * 0.8} fill="#FFFFFF" />
              </g>
              <circle cx={cx} cy={cy} r={capR * 1.1} fill={bodyColor} stroke={accentColor} strokeWidth={bezelWidth * 0.5} />
            </>
          )}
        </svg>
      </div>

      {/* Label and Value Text below */}
      {label && (
        <span
          onClick={(e) => {
            if (onLabelClick) {
              e.stopPropagation();
              onLabelClick();
            }
          }}
          className={`mt-1 text-[11px] font-semibold tracking-wide truncate max-w-[90px] text-center transition-all text-white ${
            typefaceClass || ''
          } ${onLabelClick ? 'cursor-pointer hover:opacity-100' : ''} ${
            isTextEditMode
              ? 'ring-1 ring-cyan-400 bg-cyan-950/70 px-1.5 py-0.5 rounded text-white shadow-sm'
              : ''
          }`}
          style={{
            ...faceplateStyle,
            color: '#FFFFFF'
          }}
          title={
            onLabelClick
              ? isTextEditMode
                ? 'Click to edit label text & typography'
                : 'Hold Alt or click Edit Text to customize'
              : undefined
          }
        >
          {label}
        </span>
      )}
    </div>
  );
};
