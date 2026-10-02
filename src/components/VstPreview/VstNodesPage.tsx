import React, { useState, useRef } from 'react';
import { SkinDefinition, UiCustomizationState } from '../../types/skin';
import { TextLabelConfig } from '../../types/controlCreator';
import { getFaceplateStyle, getTypefaceClass } from '../../utils/faceplateText';
import { Cpu, Plus, Sparkles, Volume2, ShieldAlert } from 'lucide-react';

interface NodeItem {
  id: string;
  name: string;
  kind: 'Plugin' | 'Feedback' | 'TapIn' | 'TapOut' | 'Utility';
  x: number;
  y: number;
  width: number;
  height: number;
  bypassed?: boolean;
  mix?: number;
  pan?: number;
}

interface CableConnection {
  id: string;
  sourceId: string;
  targetId: string;
}

interface VstNodesPageProps {
  skin: SkinDefinition;
  customization?: UiCustomizationState;
  customTexts?: Record<string, Partial<TextLabelConfig>>;
  isTextEditMode?: boolean;
  isCustomizeMode?: boolean;
  onOpenTextInspector?: (key: string) => void;
}

export const VstNodesPage: React.FC<VstNodesPageProps> = ({
  skin,
  customization,
  customTexts,
  isTextEditMode = false,
  isCustomizeMode = false,
  onOpenTextInspector
}) => {
  const accentColor = customization?.knobAccentColor || skin.amber;
  const textColor = customization?.textColor || skin.textColor || skin.cream;

  // Nodes setup with clean layout inside the glass box
  const [nodes, setNodes] = useState<NodeItem[]>([
    {
      id: 'node_tap_in',
      name: 'INPUT TAP',
      kind: 'TapIn',
      x: 30,
      y: 110,
      width: 120,
      height: 90
    },
    {
      id: 'node_filter',
      name: 'ANALOG BBD FILTER',
      kind: 'Plugin',
      x: 210,
      y: 60,
      width: 155,
      height: 110,
      bypassed: false,
      mix: 100
    },
    {
      id: 'node_tape_sat',
      name: 'TAPE DRIVE',
      kind: 'Plugin',
      x: 420,
      y: 140,
      width: 155,
      height: 110,
      bypassed: false,
      mix: 85
    },
    {
      id: 'node_tap_out',
      name: 'MASTER OUT',
      kind: 'TapOut',
      x: 640,
      y: 110,
      width: 120,
      height: 90
    }
  ]);

  const [cables, setCables] = useState<CableConnection[]>([
    { id: 'cable_1', sourceId: 'node_tap_in', targetId: 'node_filter' },
    { id: 'cable_2', sourceId: 'node_filter', targetId: 'node_tape_sat' },
    { id: 'cable_3', sourceId: 'node_tape_sat', targetId: 'node_tap_out' }
  ]);

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === id);
    if (!node || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDraggingNodeId(id);
    dragOffsetRef.current = {
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nextX = Math.max(10, Math.min(rect.width - 160, e.clientX - rect.left - dragOffsetRef.current.x));
    const nextY = Math.max(10, Math.min(rect.height - 120, e.clientY - rect.top - dragOffsetRef.current.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: Math.round(nextX), y: Math.round(nextY) } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const addNode = (kind: NodeItem['kind'], name: string) => {
    const newId = `node_${Date.now()}`;
    const newNode: NodeItem = {
      id: newId,
      name,
      kind,
      x: 230 + (nodes.length % 3) * 30,
      y: 180 + (nodes.length % 2) * 40,
      width: 155,
      height: 110,
      bypassed: false,
      mix: 100,
      pan: 0
    };
    setNodes((prev) => [...prev, newNode]);
  };

  // Precise Jack Port Coordinates
  const getPortPos = (nodeId: string, isOutput: boolean) => {
    const n = nodes.find((item) => item.id === nodeId);
    if (!n) return { x: 0, y: 0 };
    return {
      x: isOutput ? n.x + n.width : n.x,
      y: n.y + n.height / 2
    };
  };

  const titleConfig = customTexts?.['nodes:title'];
  const subtitleConfig = customTexts?.['nodes:subtitle'];

  return (
    <div
      className="p-4 flex flex-col gap-3 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!titleConfig?.hidden && (
            <span
              onClick={() => onOpenTextInspector?.('nodes:title')}
              className={`font-bold tracking-widest uppercase cursor-pointer transition-all ${
                isTextEditMode ? 'ring-1 ring-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded text-cyan-200 shadow' : 'hover:underline'
              } ${getTypefaceClass(titleConfig?.typeface)}`}
              style={getFaceplateStyle(titleConfig, accentColor)}
              title={isTextEditMode ? 'Click to edit title typography' : 'Hold Alt or click Edit Text to customize'}
            >
              {titleConfig?.text || 'MODULAR ROUTING MATRIX'}
            </span>
          )}
          <span className="text-[10px] text-slate-500 font-mono">
            {cables.length} ACTIVE SIGNAL BUSSES
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => addNode('Plugin', 'Digital Shifter')}
            className="px-2.5 py-1 font-semibold rounded text-[11px] cursor-pointer transition-colors shadow-sm"
            style={{
              backgroundColor: `${skin.panelDarker}`,
              color: textColor,
              border: `1px solid ${accentColor}40`
            }}
          >
            + Add FX Node
          </button>
          <button
            type="button"
            onClick={() => addNode('Feedback', 'Feedback Tap')}
            className="px-2.5 py-1 font-semibold rounded text-[11px] cursor-pointer transition-colors shadow-sm"
            style={{
              backgroundColor: `${skin.panelDarker}`,
              color: textColor,
              border: `1px solid ${accentColor}40`
            }}
          >
            + Feedback Bus
          </button>
        </div>
      </div>

      {/* CLEAN DARK GLASS CONTAINER BOX WITH AUDIO ROUTING GRID */}
      <div
        ref={containerRef}
        className="w-full h-[400px] rounded-xl border relative overflow-hidden shadow-2xl backdrop-blur-md"
        style={{
          backgroundColor: '#0A0D12E6',
          borderColor: `${accentColor}30`,
          boxShadow: `inset 0 0 40px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.8), 0 0 1px ${accentColor}40`
        }}
      >
        {/* Audio Routing Grid Background Matrix */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle, ${accentColor} 1px, transparent 1px),
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 24px 24px, 24px 24px'
          }}
        />

        {/* SVG Cable Patch Layer (EXACT PIXEL-PERFECT ALIGNMENT WITH PORTS) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="cableGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.9" />
            </linearGradient>
            <filter id="cableShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.9" />
            </filter>
          </defs>

          {cables.map((c) => {
            const p1 = getPortPos(c.sourceId, true);
            const p2 = getPortPos(c.targetId, false);
            const dx = Math.max(40, Math.abs(p2.x - p1.x) * 0.5);
            const pathD = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g key={c.id}>
                {/* Cable Drop Shadow */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="6"
                  opacity="0.7"
                />
                {/* Outer Cable Shield */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="3.5"
                  opacity="0.8"
                />
                {/* Luminous Inner Core */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  opacity="0.75"
                />
                {/* Center Audio Signal Pulse Indicator */}
                <circle
                  cx={midX}
                  cy={midY}
                  r="6"
                  fill="#182026"
                  stroke={accentColor}
                  strokeWidth="2"
                />
                <circle
                  cx={midX}
                  cy={midY}
                  r="2.5"
                  fill="#FFFFFF"
                />
              </g>
            );
          })}
        </svg>

        {/* Modular Node Cards */}
        {nodes.map((node) => {
          const isTap = node.kind === 'TapIn' || node.kind === 'TapOut';

          return (
            <div
              key={node.id}
              style={{
                left: node.x,
                top: node.y,
                width: node.width,
                height: node.height,
                backgroundColor: isTap ? '#121820F2' : '#171E26FA',
                borderColor: isTap ? `${accentColor}70` : `${accentColor}40`
              }}
              onMouseDown={(e) => handleMouseDownNode(e, node.id)}
              className="absolute rounded-lg border shadow-xl cursor-grab active:cursor-grabbing flex flex-col p-2.5 select-none z-10 transition-shadow hover:shadow-2xl hover:border-amber-400/80 backdrop-blur-md"
            >
              {/* Card Header Bar */}
              <div
                className="flex items-center justify-between border-b pb-1 mb-1.5"
                style={{ borderColor: `${accentColor}25` }}
              >
                <span
                  onClick={() => onOpenTextInspector?.(`nodes:${node.id}`)}
                  className={`font-bold text-[10px] tracking-wider truncate font-mono cursor-pointer transition-all ${
                    isTextEditMode
                      ? 'ring-1 ring-cyan-400 bg-cyan-950/80 px-1 py-0.5 rounded text-cyan-200 shadow'
                      : 'hover:text-amber-300'
                  } ${getTypefaceClass(customTexts?.[`nodes:${node.id}`]?.typeface)}`}
                  style={{
                    color: isTap ? accentColor : textColor,
                    ...getFaceplateStyle(customTexts?.[`nodes:${node.id}`], isTap ? accentColor : textColor)
                  }}
                  title={isTextEditMode ? 'Click to customize node label & typography' : 'Hold Alt or click Edit Text to customize'}
                >
                  {customTexts?.[`nodes:${node.id}`]?.text || node.name}
                </span>

                {!isTap && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNodes((prev) => prev.filter((n) => n.id !== node.id));
                      setCables((prev) =>
                        prev.filter((c) => c.sourceId !== node.id && c.targetId !== node.id)
                      );
                    }}
                    className="text-[9px] px-1 rounded hover:bg-red-500/30 text-red-300 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Node Body */}
              {!isTap ? (
                <div className="flex flex-col gap-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Dry / Wet</span>
                    <span className="font-mono font-bold" style={{ color: accentColor }}>
                      {node.mix ?? 100}%
                    </span>
                  </div>

                  <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${node.mix ?? 100}%`, backgroundColor: accentColor }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNodes((prev) =>
                          prev.map((n) => (n.id === node.id ? { ...n, bypassed: !n.bypassed } : n))
                        );
                      }}
                      className="px-2 py-0.5 rounded text-[9px] font-bold transition-colors"
                      style={{
                        backgroundColor: node.bypassed ? `${skin.ledRed}25` : '#1E2730',
                        color: node.bypassed ? skin.ledRed : '#94A3B8',
                        border: `1px solid ${node.bypassed ? skin.ledRed : '#2D3844'}`
                      }}
                    >
                      {node.bypassed ? 'BYPASS' : 'ACTIVE'}
                    </button>
                    <span className="text-[9px] font-mono text-slate-400">
                      BUS {node.kind === 'Feedback' ? 'FB' : 'DSP'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Tap In and Tap Out: Removed 'delay feed' and 'wet out' as requested */
                <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shadow-inner border border-white/10"
                    style={{ backgroundColor: '#0B0F14' }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 border-black"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 tracking-wider">
                    {node.kind === 'TapIn' ? 'PRIMARY INPUT' : 'AUDIO OUTPUT'}
                  </span>
                </div>
              )}

              {/* Input Jack Port (Left Anchor) */}
              {node.kind !== 'TapIn' && (
                <div
                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-black shadow flex items-center justify-center pointer-events-none"
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
              )}

              {/* Output Jack Port (Right Anchor) */}
              {node.kind !== 'TapOut' && (
                <div
                  className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-black shadow flex items-center justify-center pointer-events-none"
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
