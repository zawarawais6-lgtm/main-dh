import { SkinDefinition, PresetCategory, KnobStyle, PanelTexture } from '../types/skin';
import { knobArchitect1000 } from './knobArchitect1000';
import { sliderArchitect1000 } from './sliderArchitect1000';
import { textureArchetypes1000 } from './textureArchetypes1000';
import { lfoVisualPresets } from './lfoVisualPresets';

const CATEGORIES: PresetCategory[] = [
  'Wada Sanzo Classic',
  'Liquid Gritty',
  'Cyber HUD',
  'Deep Layers',
  'Futuristic Neon',
  'Dark Grit',
  'Pop Halftone',
  'Studio Minimal',
  'Vintage Brass',
  'Holographic Vapor',
  'Analog & Texturelabs',
  'Figma Modern',
  'Mixed Media & Print'
];

const KNOB_STYLES: KnobStyle[] = [
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

const PANEL_TEXTURES: PanelTexture[] = [
  'GrittyTexture',
  'FineMineralGrit',
  'LiquidGrainGradient',
  'DeepLayers',
  'DarkGrainyGrit',
  'BrushedMetal',
  'GridOverlay',
  'CyberCircuit',
  'FlatMatte',
  'CarbonFiber',
  'MarbleStone',
  'CRTPhosphor',
  'SteampunkBrass',
  'TexturelabsPhotocopy',
  'TexturelabsFilmDust',
  'TexturelabsBrushedAlloy',
  'TexturelabsOxidizedPatina',
  'AnalogMagneticTape',
  'AnalogCrtPhosphor',
  'AnalogRisographStipple',
  'FigmaNoiseMesh',
  'FigmaHoloFoil',
  'UnsplashWeatheredPlaster',
  'UnsplashSlateStone',
  'AllisonPerryMixedMedia'
];

const COLOR_PAIRS = [
  { dark: '#181A1F', darker: '#111317', amber: '#F59E0B', cream: '#E2E8F0', led: '#EF4444' },
  { dark: '#151E28', darker: '#0E151E', amber: '#06B6D4', cream: '#CBD5E1', led: '#06B6D4' },
  { dark: '#241B26', darker: '#19111C', amber: '#EC4899', cream: '#F1F5F9', led: '#F43F5E' },
  { dark: '#1A241E', darker: '#101913', amber: '#10B981', cream: '#E2E8F0', led: '#10B981' },
  { dark: '#231F1B', darker: '#181410', amber: '#EAB308', cream: '#FEF08A', led: '#F97316' },
  { dark: '#1C1924', darker: '#13101C', amber: '#A855F7', cream: '#EDE9FE', led: '#D946EF' },
  { dark: '#191D24', darker: '#101318', amber: '#38BDF8', cream: '#E0F2FE', led: '#0EA5E9' },
  { dark: '#141416', darker: '#0A0A0C', amber: '#E2E8F0', cream: '#FFFFFF', led: '#EF4444' },
  { dark: '#181C16', darker: '#0B0F09', amber: '#00FF9D', cream: '#E2E8DF', led: '#FFCC00' },
  { dark: '#1F1714', darker: '#100B09', amber: '#E07A5F', cream: '#F5EBE6', led: '#E65100' },
  { dark: '#191522', darker: '#0C0814', amber: '#B347FF', cream: '#EAE2F8', led: '#00FF9D' },
  { dark: '#141E28', darker: '#0A1017', amber: '#38BDF8', cream: '#E0F2FE', led: '#F43F5E' }
];

const PREFIXES = [
  'Obsidian', 'Solarized', 'Quantum', 'Kintsugi', 'Machined', 'Cyber', 'Sumi', 'Topographic',
  'Damascus', 'Phosphor', 'Titanium', 'Aether', 'Neon', 'Boutique', 'Vortex', 'Risograph',
  'Hydraulic', 'Aerospace', 'Sub-Zero', 'Vintage', 'Harmonic', 'Cosmic', 'Monolith', 'Apex',
  'Amorph Classic', 'Midnight Cyber', 'Wada Sanzo Gold', 'Emerald Phosphor', 'Deep Space Violet'
];

const SUFFIXES = [
  'Studio Master', 'Console Rig', 'Audio Core', 'Synthesizer Desk', 'Analog Host',
  'Precision Unit', 'Channel Strip', 'Tape Vault', 'Cathode Frame', 'Vector Station',
  'Harmonic Lathe', 'Matrix Bed', 'Aero Console', 'Pulse Engine'
];

import { NEW_300_SKINS } from './new300Presets';

function generateSkins(): SkinDefinition[] {
  const skins: SkinDefinition[] = [];

  for (let i = 1; i <= 3000; i++) {
    const category = CATEGORIES[(i - 1) % CATEGORIES.length];
    const knobStyle = KNOB_STYLES[(i - 1) % KNOB_STYLES.length];
    const panelTexture = PANEL_TEXTURES[(i - 1) % PANEL_TEXTURES.length];
    const colors = COLOR_PAIRS[(i - 1) % COLOR_PAIRS.length];
    const prefix = PREFIXES[(i - 1) % PREFIXES.length];
    const suffix = SUFFIXES[((i - 1) * 3) % SUFFIXES.length];

    const textureArch = textureArchetypes1000[(i - 1) % textureArchetypes1000.length];
    const knobPreset = knobArchitect1000[(i - 1) % knobArchitect1000.length];
    const sliderPreset = sliderArchitect1000[(i - 1) % sliderArchitect1000.length];
    const lfoPreset = lfoVisualPresets[(i - 1) % lfoVisualPresets.length];

    skins.push({
      id: i,
      name: `${prefix} ${suffix} #${String(i).padStart(4, '0')}`,
      category,
      panelDark: textureArch.primaryTint || colors.dark,
      panelDarker: textureArch.secondaryTint || colors.darker,
      cream: knobPreset.bodyColor || colors.cream,
      amber: knobPreset.accentColor || colors.amber,
      ledRed: knobPreset.pointerColor || colors.led,
      ledOff: '#2D3748',
      knobStyle,
      panelTexture: textureArch.baseModel || panelTexture,
      decorativeDots: i % 3 === 0,
      textColor: '#FFFFFF',
      headerTextColor: '#FFFFFF',
      valueTextColor: '#FFFFFF',
      glowIntensity: knobPreset.glowIntensity || 0.5,
      knobGlowEnabled: true,
      patternType: textureArch.patternType,
      textureRoughness: textureArch.roughness,
      textureContrast: textureArch.contrast,
      grainDensity: textureArch.grainDensity,
      noiseOctaves: textureArch.noiseOctaves,
      blendMode: textureArch.blendMode,
      vignetteStrength: textureArch.vignette,
      liquidFlowAngle: textureArch.liquidAngle,
      bezelWidth: knobPreset.bezelWidth,
      tickCount: knobPreset.tickCount,
      tickSpread: knobPreset.tickSpread,
      pointerThickness: knobPreset.pointerThickness,
      pointerLengthRatio: knobPreset.pointerLengthRatio,
      centerCapRatio: knobPreset.centerCapRatio,
      shadowDepth: knobPreset.shadowDepth,
      metalRoughness: knobPreset.metalRoughness,
      textureArchetype: textureArch,
      knobPreset,
      sliderPreset,
      lfoPreset
    });
  }
  return skins;
}

export const PRESETS_1000: SkinDefinition[] = [...generateSkins(), ...NEW_300_SKINS];
export const PRESETS_3000: SkinDefinition[] = PRESETS_1000;
export const NEW_300_PRESETS: SkinDefinition[] = NEW_300_SKINS;
