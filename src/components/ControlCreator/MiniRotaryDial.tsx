import React, { useState, useRef, useEffect } from 'react';

interface MiniRotaryDialProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  format?: (val: number) => string;
}

export const MiniRotaryDial: React.FC<MiniRotaryDialProps> = ({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
  format
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(value);

  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  // Map to angle from -135deg to +135deg
  const startAngle = -135;
  const endAngle = 135;
  const currentAngle = startAngle + normalized * (endAngle - startAngle);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = value;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startYRef.current - e.clientY;
      const range = max - min;
      const change = (deltaY / 120) * range;
      let nextVal = startValRef.current + change;
      if (step) {
        nextVal = Math.round(nextVal / step) * step;
      }
      nextVal = Math.max(min, Math.min(max, nextVal));
      onChange(Number(nextVal.toFixed(3)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, step, onChange]);

  // Compute SVG arc points for the orange indicator track
  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  const pStart = polarToCartesian(14, 14, 11, startAngle);
  const pCurrent = polarToCartesian(14, 14, 11, currentAngle);
  const largeArcFlag = currentAngle - startAngle <= 180 ? 0 : 1;
  const arcPath = `M ${pStart.x} ${pStart.y} A 11 11 0 ${largeArcFlag} 1 ${pCurrent.x} ${pCurrent.y}`;

  const displayVal = format ? format(value) : value.toFixed(2);

  return (
    <div className="flex items-center gap-2 select-none">
      {label && <span className="text-[11px] text-slate-300 w-16 truncate">{label}</span>}
      <div
        className="relative w-7 h-7 cursor-ns-resize flex items-center justify-center group"
        onMouseDown={handleMouseDown}
        title="Drag up/down to adjust"
      >
        <svg className="w-7 h-7" viewBox="0 0 28 28">
          {/* Outer bezel track */}
          <circle
            cx="14"
            cy="14"
            r="11"
            fill="none"
            stroke="#1E262C"
            strokeWidth="2.5"
          />
          {/* Active orange arc indicator */}
          {normalized > 0.01 && (
            <path
              d={arcPath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          {/* Center dark cap */}
          <circle
            cx="14"
            cy="14"
            r="8"
            fill="url(#dialBevelGrad)"
            stroke="#12181C"
            strokeWidth="1"
          />
          {/* Indicator notch */}
          <line
            x1="14"
            y1="14"
            x2={polarToCartesian(14, 14, 7, currentAngle).x}
            y2={polarToCartesian(14, 14, 7, currentAngle).y}
            stroke="#F59E0B"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="dialBevelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3F484D" />
              <stop offset="100%" stopColor="#1E252A" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-[10px] font-mono text-slate-300 min-w-[2.2rem] text-right">
        {displayVal}
      </span>
    </div>
  );
};
