import { SliderArchitectPreset, SliderTrackStyle, SliderThumbStyle } from '../types/skin';

const TRACK_STYLES: SliderTrackStyle[] = [
  'recessed-groove',
  'cyber-glow',
  'liquid-tube',
  'vintage-slot',
  'stepped-ladder',
  'dual-rail',
  'minimal-line'
];

const THUMB_STYLES: SliderThumbStyle[] = [
  'brushed-metal',
  'glowing-pill',
  'reticle-cross',
  'vintage-bakelite',
  'diamond-wedge',
  'knurled-slug',
  'laser-dot',
  'flat-tab'
];

const CATEGORIES = [
  'Studio Console',
  'Cyber Fader',
  'Vintage Mechanical',
  'Precision Linear',
  'Optical Glowing',
  'Minimalist Rail',
  'Aerospace Slider',
  'Modular Synth',
  'Precision Hardware',
  'Cyberpunk Glow',
  'Liquid Chamber',
  'Vintage Console',
  'Broadcast Mixing',
  'Mastering Fader'
];

const SLIDER_PALETTES = [
  { track: '#0C0F14', thumb: '#E0E6ED', accent: '#E8A13A' },
  { track: '#080C14', thumb: '#F1F5F9', accent: '#00E5FF' },
  { track: '#120F0D', thumb: '#EDE8DF', accent: '#D4AF37' },
  { track: '#0B120E', thumb: '#E2E8DF', accent: '#00FF9D' },
  { track: '#140D0B', thumb: '#F5EBE6', accent: '#E07A5F' },
  { track: '#120C18', thumb: '#EAE2F8', accent: '#B347FF' },
  { track: '#0F141C', thumb: '#F8FAFC', accent: '#38BDF8' },
  { track: '#171615', thumb: '#E8DFC8', accent: '#FF2BD6' },
  { track: '#0E1117', thumb: '#CBD5E1', accent: '#00FF9D' },
  { track: '#141822', thumb: '#E2E8F0', accent: '#F59E0B' },
  { track: '#181412', thumb: '#F5E7CC', accent: '#38BDF8' },
  { track: '#12161A', thumb: '#FAF5EB', accent: '#E63946' },
  { track: '#1C1917', thumb: '#D1D5DB', accent: '#D4AF37' }
];

const SLIDER_NAMES = [
  'Channel Gain', 'Wet/Dry Blend', 'Feedback Gain', 'Output Level',
  'Crossfade Matrix', 'Reverb Density', 'Pitch Modulation', 'Tape Saturation',
  'Filter Frequency', 'Spatial Width', 'Dynamic Threshold', 'Envelope Attack',
  'Console Linear Fader', 'Precision Studio Throw', 'Recessed Chamber Rail',
  'Cyber Fluorescent Glide', 'Broadcast Attenuator', 'Milled Brass Slider',
  'Liquid Gauge Track', 'Optical Feather Fader', 'Tactile Notched Slider',
  'Bakelite Vintage Throw', 'Aero Composite Rail', 'Mastering Desk Fader'
];

import { NEW_300_SLIDER_PRESETS } from './new300Presets';

const baseSliders: SliderArchitectPreset[] = Array.from({ length: 3000 }, (_, i) => {
  const id = i + 1;
  const trackStyle = TRACK_STYLES[i % TRACK_STYLES.length];
  const thumbStyle = THUMB_STYLES[i % THUMB_STYLES.length];
  const category = CATEGORIES[i % CATEGORIES.length];
  const pal = SLIDER_PALETTES[i % SLIDER_PALETTES.length];
  const baseName = SLIDER_NAMES[i % SLIDER_NAMES.length];

  const trackHeight = 4 + ((i * 7) % 10);
  const thumbWidth = 14 + (i % 22);
  const thumbHeight = 12 + ((i * 3) % 20);
  const cornerRadius = 1 + (i % 7);
  const showCenterDetent = i % 2 === 0;
  const tickMarksCount = 5 + ((i * 2) % 17);
  const glowIntensity = parseFloat((0.15 + ((i * 19) % 85) / 100).toFixed(2));

  return {
    id,
    name: `${baseName} ${thumbStyle} #${String(id).padStart(4, '0')}`,
    category,
    trackStyle,
    thumbStyle,
    trackHeight,
    thumbWidth,
    thumbHeight,
    cornerRadius,
    showCenterDetent,
    tickMarksCount,
    trackColor: pal.track,
    thumbColor: pal.thumb,
    accentColor: pal.accent,
    glowIntensity,
    description: `Precision ${trackStyle} slider rail with ${thumbStyle} cap and ${tickMarksCount} tick positions.`
  };
});

export const sliderArchitect1000: SliderArchitectPreset[] = [
  ...baseSliders,
  ...NEW_300_SLIDER_PRESETS
];

export const NEW_300_SLIDERS: SliderArchitectPreset[] = NEW_300_SLIDER_PRESETS;
