import { LfoVisualPreset } from '../types/skin';

const GRID_STYLES = [
  'fine-mesh',
  'crosshair',
  'polar-radial',
  'dot-matrix',
  'logarithmic',
  'reticle-hud',
  'isometric',
  'harmonic-rings',
  'constellation'
] as const;

const CATEGORIES = [
  'Cathode Ray & Vector LFO',
  'Oscilloscope Phosphor',
  'Vector Beam HUD',
  'Matrix Glitch Scan',
  'Cosmic Polar Ray',
  'Audio Spectrum CRT',
  'Sonar Radar Scope',
  'Sub-Zero Pulse',
  'Analog Tube Glow'
];

const PHOSPHORS = [
  '#00FF66', // P1 Classic Green
  '#E8A13A', // P3 Warm Amber
  '#00E5FF', // Cyan Vector
  '#FF2BD6', // Plasma Magenta
  '#38BDF8', // Sky CRT
  '#FFCC00', // Gold Ray
  '#A855F7', // Violet Beam
  '#F43F5E', // Ruby Phosphor
  '#4EAE8D', // Celadon Seafoam
  '#FF007F', // Vivid Pink
  '#00FF9D'  // Cyber Mint
];

const LFO_NAMES = [
  'Tektronix Analog Sine 1.0Hz',
  'Oscilloscope Dual Lissajous',
  'Sub-Audio Triangle Flutter',
  'Exponential Sawtooth Beam',
  'Random Sample & Hold Glitch',
  'Harmonic Square Wave Pulse',
  'Logarithmic Sweep Horizon',
  'Polar Vector Radar Scope',
  'P1 Phosphor Vector',
  'Cathode Ray Scope',
  'Sonar Pulse Sweep',
  'Quantum Phase Beam',
  'Plasma Ion Tracer',
  'Analog Vacuum Tube',
  'Matrix Raster Oscilloscope',
  'Reticle HUD Visualizer',
  'Polar Graticule Wave',
  'Sub-Zero Cryo Trace',
  'Logarithmic Audio Mesh',
  'Solarized Glow Arc'
];

const TRACE_MODES = [
  'Interferometer', 'Phase Portrait', 'Orbital Echo', 'Spectral Memory',
  'Vector Bloom', 'Harmonic Halo', 'Ion Persistence', 'Synchroscope',
  'Ribbon Scope', 'Constellation Trace', 'Resonant Survey', 'Pulse Cartography'
];

import { NEW_300_LFO_PRESETS } from './new300Presets';

const baseLfos: LfoVisualPreset[] = Array.from({ length: 3000 }, (_, i) => {
  const id = i + 1;
  const phosphorColor = PHOSPHORS[i % PHOSPHORS.length];
  const gridStyle = GRID_STYLES[i % GRID_STYLES.length];
  const category = CATEGORIES[i % CATEGORIES.length];
  const baseName = LFO_NAMES[i % LFO_NAMES.length];
  const traceMode = TRACE_MODES[(i * 5) % TRACE_MODES.length];

  const waveThickness = parseFloat((1.2 + ((i * 17) % 35) / 10).toFixed(1));
  const glowRadius = 4 + (i % 18);
  const scanlineIntensity = parseFloat((0.1 + ((i * 23) % 60) / 100).toFixed(2));
  const persistenceTrail = parseFloat((0.15 + ((i * 31) % 65) / 100).toFixed(2));
  const fillGradient = i % 2 === 0;
  const harmonics = 1 + (i % 4);

  return {
    id,
    name: `${traceMode} · ${baseName} #${String(id).padStart(4, '0')}`,
    category: `${category} · ${traceMode}`,
    phosphorColor,
    beamGlowColor: `${phosphorColor}88`,
    gridColor: `${phosphorColor}25`,
    gridStyle,
    waveThickness,
    glowRadius,
    scanlineIntensity,
    persistenceTrail,
    fillGradient,
    harmonics: 1 + ((harmonics + Math.floor(i / 7)) % 8),
    description: `${traceMode} CRT study featuring a ${gridStyle} graticule, ${glowRadius}px electron bloom, and ${
      persistenceTrail > 0.4 ? 'high' : 'low'
    } phosphor persistence with layered harmonic memory.`
  };
});

export const lfoVisualPresets: LfoVisualPreset[] = [
  ...baseLfos,
  ...NEW_300_LFO_PRESETS
];

export const NEW_300_LFOS: LfoVisualPreset[] = NEW_300_LFO_PRESETS;
