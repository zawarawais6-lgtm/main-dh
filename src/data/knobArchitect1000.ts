import { KnobArchitectPreset, KnobStyle } from '../types/skin';

const STYLES: KnobStyle[] = [
  'ChunkyPointer',
  'ArcIndicator',
  'BoldBlock',
  'CyberRing',
  'LiquidGauge',
  'SteppedWedge',
  'GroovedCap',
  'NeonRim',
  'MinimalDot',
  'VintageFluted',
  'OrbitalEncoder',
  'PrismRotor',
  'ConcentricConsole'
];

const CATEGORIES = [
  'Precision Industrial',
  'Cyberpunk Glowing',
  'Vintage Bakelite',
  'Studio Anodized',
  'Minimalist Bauhaus',
  'Aerospace Dial',
  'Analog Console',
  'Futuristic HUD',
  'Analog Hardware',
  'Liquid Organic',
  'Cyber Minimal',
  'Vintage Classic',
  'Industrial Machined',
  'Optical Precision',
  'Boutique Studio'
];

const KNOB_PALETTES = [
  { body: '#242832', accent: '#E8A13A', pointer: '#E63946' },
  { body: '#161922', accent: '#00E5FF', pointer: '#FF007F' },
  { body: '#2B2622', accent: '#D4AF37', pointer: '#E05A47' },
  { body: '#181C16', accent: '#00FF9D', pointer: '#FFCC00' },
  { body: '#1F1714', accent: '#E07A5F', pointer: '#E65100' },
  { body: '#1A1824', accent: '#B347FF', pointer: '#00F0FF' },
  { body: '#1F2228', accent: '#38BDF8', pointer: '#F43F5E' },
  { body: '#141416', accent: '#A3B18A', pointer: '#D4AF37' },
  { body: '#EAE6DF', accent: '#FF2BD6', pointer: '#E6402B' },
  { body: '#CBD5E1', accent: '#F59E0B', pointer: '#00FF66' },
  { body: '#D4D4D8', accent: '#E8A13A', pointer: '#FF3366' },
  { body: '#F5E7CC', accent: '#38BDF8', pointer: '#FF9900' },
  { body: '#FAF5EB', accent: '#D4AF37', pointer: '#38BDF8' }
];

const KNOB_NAMES = [
  'Master Level', 'Filter Cutoff', 'Resonance Peak', 'Drive Saturation',
  'Mix Balance', 'Time Constant', 'Feedback Loop', 'Modulation Depth',
  'Tape Flutter', 'Harmonic Shape', 'Pre-Delay', 'Color Dispersion',
  'High Damping', 'Low Contour', 'Spatial Spread', 'Decay Envelope',
  'Rotary Precision Dial', 'HUD Segmented Ring', 'Boutique Fluted Cap',
  'Obsidian Stepped Rotor', 'Quantum Arc Indexer', 'Vintage Bakelite Pot',
  'Milled Aerospace Lathe', 'Liquid Core Indicator', 'Laser Bevel Potentiometer',
  'Anodized Billet Wheel', 'Minimalist Specular Dot', 'Studio Gold Master'
];

const KNOB_FINISHES = [
  'Cerakote', 'Black Nickel', 'Satin Titanium', 'Smoked Chrome',
  'Pearl Enamel', 'Oxidized Brass', 'Frosted Acrylic', 'Anodized Cobalt',
  'Graphite PVD', 'Champagne Alloy', 'Obsidian Glass', 'Ivory Bakelite'
];

const KNOB_PROFILES = [
  'Low-Profile', 'Deep Dish', 'Turbine', 'Coin Edge', 'Floating Bezel',
  'Reactor Core', 'Micro-Knurled', 'Lens Cap', 'Architectural', 'Instrument Grade'
];

import { NEW_300_KNOB_PRESETS } from './new300Presets';

const baseKnobs: KnobArchitectPreset[] = Array.from({ length: 3000 }, (_, i) => {
  const id = i + 1;
  const style = STYLES[i % STYLES.length];
  const category = CATEGORIES[i % CATEGORIES.length];
  const pal = KNOB_PALETTES[i % KNOB_PALETTES.length];
  const baseName = KNOB_NAMES[i % KNOB_NAMES.length];
  const finish = KNOB_FINISHES[(i * 5) % KNOB_FINISHES.length];
  const profile = KNOB_PROFILES[(i * 7) % KNOB_PROFILES.length];

  const bezelWidth = parseFloat((1.0 + ((i * 17 + Math.floor(i / 13)) % 35) / 10).toFixed(1));
  const tickCount = style === 'MinimalDot' ? 0 : 5 + ((i * 7 + Math.floor(i / 9)) % 31);
  const tickSpread = 210 + ((i * 13 + Math.floor(i / 7)) % 105);
  const pointerThickness = parseFloat((1.6 + ((i * 19 + Math.floor(i / 11)) % 42) / 10).toFixed(1));
  const pointerLengthRatio = parseFloat((0.48 + ((i * 23 + Math.floor(i / 5)) % 49) / 100).toFixed(2));
  const centerCapRatio = parseFloat((0.16 + ((i * 29 + Math.floor(i / 17)) % 44) / 100).toFixed(2));
  const glowIntensity = parseFloat((0.12 + ((i * 31 + Math.floor(i / 19)) % 88) / 100).toFixed(2));
  const shadowDepth = parseFloat((2.0 + ((i * 11 + Math.floor(i / 23)) % 16)).toFixed(1));
  const metalRoughness = parseFloat((0.12 + ((i * 47 + Math.floor(i / 29)) % 82) / 100).toFixed(2));

  return {
    id,
    name: `${finish} ${profile} ${baseName} #${String(id).padStart(4, '0')}`,
    category: `${category} · ${finish}`,
    style,
    bodyColor: pal.body,
    accentColor: pal.accent,
    pointerColor: pal.pointer,
    bezelWidth,
    tickCount,
    tickSpread,
    pointerThickness,
    pointerLengthRatio,
    centerCapRatio,
    glowIntensity,
    shadowDepth,
    metalRoughness,
    description: `${finish} ${profile.toLowerCase()} rotary dial featuring ${style} geometry with calibrated ${
      tickCount > 0 ? `${tickCount} ticks` : 'smooth travel'
    }, a ${Math.round(tickSpread)}° throw, and ${category.toLowerCase()} ergonomics.`
  };
});

export const knobArchitect1000: KnobArchitectPreset[] = [
  ...baseKnobs,
  ...NEW_300_KNOB_PRESETS
];

export const NEW_300_KNOBS: KnobArchitectPreset[] = NEW_300_KNOB_PRESETS;
