import {
  TextureArchetype,
  SkinDefinition,
  KnobArchitectPreset,
  SliderArchitectPreset,
  LfoVisualPreset,
  DesignTheme,
  KnobStyle,
  PresetCategory
} from '../types/skin';

// 3 Archetypes grounded in the 3 uploaded images
export const COLIR_REFERENCES = [
  {
    id: 'colir-solar-burn',
    title: 'Colir — Solar Flare Optical Film Burn',
    link: 'colir_1600x900_noise-6_feather-18_colors-1b1a1a-c0392b-d35400-f4d03f_x-0.20,0.30,0.32,0.49,0.73,1.00_y-0.01,0.08.webp',
    badge: 'Colir Solar Burn',
    category: 'Optical Film Burn & Light Leaks' as const,
    model: 'ColirSolarFilmBurn' as const,
    pattern: 'colir-solar-burn',
    description: 'Analog photochemical light leak with intense incandescent slit flare, feathered ambient burn, and warm emulsion grain.'
  },
  {
    id: 'colir-aurora-drift',
    title: 'Colir — Aurora Borealis Cosmic Starfield',
    link: 'colir_1500x800_noise-3_feather-18_colors-05070a-002147-228b22-98ff98-40e0d0-ff51be-4b0082_x-0.01,0.26,0.49,0.91,1.00_y-0.00,0.50,1.00.webp',
    badge: 'Colir Aurora',
    category: 'Aurora Borealis & Cosmic Dust' as const,
    model: 'ColirAuroraCosmicDrift' as const,
    pattern: 'colir-aurora-drift',
    description: 'Luminous undulating northern light curtains rising into midnight cosmos with twinkling chromatic micro-stardust.'
  },
  {
    id: 'colir-molten-magma',
    title: 'Colir — Molten Magma Viscous Fluid Swirl',
    link: 'colir_1596x906_noise-8_feather-18_colors-1f0f21-fd1a3a-f88405_x-0.00,0.27,0.72,0.75,1.00_y-0.00,0.50,1.00.webp',
    badge: 'Colir Magma',
    category: 'Molten Magma & Viscous Marbling' as const,
    model: 'ColirMoltenMagmaSwirl' as const,
    pattern: 'colir-molten-magma',
    description: 'Viscous high-temperature lava folds, domain-warped marbling lobes, and glossy liquid crests with stipple noise.'
  }
];

// Rich, diverse color schemes calibrated for the 3 visual families
const SOLAR_PALETTES = [
  { p: '#1B1A1A', s: '#0E0D0D', a: '#F4D03F', m: '#D35400', c: '#FFF8E7', l: '#C0392B' }, // Exact Image 1 Reference
  { p: '#24140E', s: '#120A07', a: '#FFA726', m: '#E65100', c: '#FFF3E0', l: '#FF3D00' }, // Blazing Amber
  { p: '#1F1215', s: '#10080B', a: '#FF7043', m: '#C2185B', c: '#FCE4EC', l: '#FF1744' }, // Ruby Sunset
  { p: '#1A1814', s: '#0D0C0A', a: '#FFD54F', m: '#FF6F00', c: '#FFFDE7', l: '#FFAB00' }, // Incandescent Slit
  { p: '#231B15', s: '#130E0B', a: '#F59E0B', m: '#B45309', c: '#FEF3C7', l: '#DC2626' }, // Sepia Photochemical
  { p: '#211019', s: '#11070C', a: '#FF4081', m: '#D81B60', c: '#F8BBD0', l: '#FF0055' }, // Neon Flare Leak
  { p: '#1C1917', s: '#0C0A09', a: '#FB923C', m: '#C2410C', c: '#FFEDD5', l: '#EF4444' }, // Kodachrome Emulsion
  { p: '#191816', s: '#0C0C0B', a: '#FBBF24', m: '#EA580C', c: '#FEF9C3', l: '#B91C1C' }, // Solar Corona
  { p: '#261712', s: '#140B08', a: '#FB7185', m: '#E11D48', c: '#FFE4E6', l: '#BE123C' }, // Infrared Halation
  { p: '#1A1412', s: '#0C0908', a: '#FDBA74', m: '#9A3412', c: '#FFEDD5', l: '#7C2D12' }  // Darkroom Exposure
];

const AURORA_PALETTES = [
  { p: '#05070A', s: '#002147', a: '#98FF98', m: '#40E0D0', c: '#E2F7FF', l: '#FF51BE' }, // Exact Image 2 Reference
  { p: '#060B14', s: '#02050A', a: '#00FF9D', m: '#00B4D8', c: '#E0F2FE', l: '#7209B7' }, // Polar Emerald
  { p: '#0A0818', s: '#04030D', a: '#38BDF8', m: '#818CF8', c: '#EDE9FE', l: '#C084FC' }, // Arctic Twilight
  { p: '#051214', s: '#02090A', a: '#2DD4BF', m: '#0D9488', c: '#CCFBF1', l: '#06B6D4' }, // Glacier Cyan
  { p: '#080D1A', s: '#03060E', a: '#4ADE80', m: '#22C55E', c: '#DCFCE7', l: '#E879F9' }, // Solar Storm Curtain
  { p: '#0E091A', s: '#06030D', a: '#A855F7', m: '#6366F1', c: '#F3E8FF', l: '#F43F5E' }, // Deep Ionosphere
  { p: '#041017', s: '#01080D', a: '#22D3EE', m: '#0284C7', c: '#CFFAFE', l: '#10B981' }, // Celestial Borealis
  { p: '#0C0617', s: '#05020B', a: '#F472B6', m: '#9333EA', c: '#FCE7F3', l: '#38BDF8' }, // Starlight Magenta
  { p: '#051410', s: '#020A08', a: '#34D399', m: '#059669', c: '#D1FAE5', l: '#6EE7B7' }, // Verdant Curtain
  { p: '#080E1C', s: '#03070F', a: '#60A5FA', m: '#3B82F6', c: '#DBEAFE', l: '#A78BFA' }  // Midnight Graticule
];

const MAGMA_PALETTES = [
  { p: '#1F0F21', s: '#0F0611', a: '#FD1A3A', m: '#F88405', c: '#FFF5EB', l: '#FF007F' }, // Exact Image 3 Reference
  { p: '#260B18', s: '#13040B', a: '#F43F5E', m: '#FB923C', c: '#FFE4E6', l: '#E11D48' }, // Molten Ruby
  { p: '#1D1022', s: '#0D0611', a: '#EA580C', m: '#D946EF', c: '#FAE8FF', l: '#FF0055' }, // Cyber Lava
  { p: '#250D11', s: '#120507', a: '#FF3366', m: '#FF9900', c: '#FFF0F5', l: '#FFCC00' }, // Volcanic Core
  { p: '#1A0E24', s: '#0B0512', a: '#EC4899', m: '#8B5CF6', c: '#FDF4FF', l: '#06B6D4' }, // Viscous Orchid
  { p: '#28130B', s: '#140804', a: '#F97316', m: '#DC2626', c: '#FFEDD5', l: '#FBBF24' }, // Basalt Magma
  { p: '#171124', s: '#0A0713', a: '#E11D48', m: '#A855F7', c: '#F3E8FF', l: '#F43F5E' }, // Amethyst Crucible
  { p: '#220E15', s: '#100509', a: '#FF2BD6', m: '#FFA500', c: '#FFF1F2', l: '#00F0FF' }, // Hot Fluid Swirl
  { p: '#1E140C', s: '#0E0905', a: '#F59E0B', m: '#B91C1C', c: '#FEF3C7', l: '#F97316' }, // Molten Marbling
  { p: '#230B1C', s: '#10030C', a: '#FF007A', m: '#FF5E00', c: '#FFE5EC', l: '#D4AF37' }  // Gilded Lava
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
  'VintageFluted'
];

const SHAPE_NAMES = [
  'Slit Flare', 'Anamorphic Bar', 'Optical Leak', 'Incandescent Core', 'Diffused Bleed',
  'Curtain Arc', 'Cosmic Ribbon', 'Borealis Wave', 'Magnetic Drapery', 'Stardust Veil',
  'Viscous Lobe', 'Magma Marbling', 'Molten Fold', 'Fluid Crevasse', 'Hydraulic Swirl'
];

// Generate exactly 300 presets (100 for each of the 3 reference image archetypes)
export const COLIR_300_TEXTURE_ARCHETYPES: TextureArchetype[] = Array.from({ length: 300 }, (_, i) => {
  const id = 4001 + i;
  const refIndex = Math.floor(i / 100); // 0: Solar, 1: Aurora, 2: Magma
  const localIndex = i % 100;
  const ref = COLIR_REFERENCES[refIndex];

  let pal: { p: string; s: string; a: string; m: string; c: string; l: string };
  if (refIndex === 0) {
    pal = SOLAR_PALETTES[localIndex % SOLAR_PALETTES.length];
  } else if (refIndex === 1) {
    pal = AURORA_PALETTES[localIndex % AURORA_PALETTES.length];
  } else {
    pal = MAGMA_PALETTES[localIndex % MAGMA_PALETTES.length];
  }

  const shapeTag = SHAPE_NAMES[(refIndex * 5 + (localIndex % 5)) % SHAPE_NAMES.length];
  const roughness = parseFloat((0.18 + ((localIndex * 29) % 65) / 100).toFixed(2));
  const contrast = parseFloat((0.92 + ((localIndex * 37) % 90) / 100).toFixed(2));
  const grainDensity = parseFloat((0.25 + ((localIndex * 43) % 60) / 100).toFixed(2));
  const noiseOctaves = 3 + (localIndex % 5);
  const liquidAngle = (localIndex * 43) % 360;
  const vignette = parseFloat((0.2 + ((localIndex * 19) % 60) / 100).toFixed(2));

  return {
    id,
    name: `${ref.badge} ${shapeTag} #${String(id).padStart(4, '0')}`,
    category: ref.category,
    patternType: `${ref.pattern}-${String(localIndex + 1).padStart(3, '0')}`,
    baseModel: ref.model,
    primaryTint: pal.p,
    secondaryTint: pal.s,
    accentTint: pal.a,
    roughness,
    contrast,
    grainDensity,
    noiseOctaves,
    blendMode: (['screen', 'overlay', 'soft-light', 'multiply'] as const)[localIndex % 4],
    vignette,
    liquidAngle,
    seed: (i * 31415 + 999) % 99999,
    description: `${ref.description} Featuring ${shapeTag} geometry with ${pal.a} radiance and ${ref.title.split('—')[1]?.trim()}.`,
    inspirationTitle: ref.title,
    inspirationLink: ref.link
  };
});

// Generate 300 corresponding Knob presets
export const COLIR_300_KNOB_PRESETS: KnobArchitectPreset[] = Array.from({ length: 300 }, (_, i) => {
  const id = 4001 + i;
  const tex = COLIR_300_TEXTURE_ARCHETYPES[i];
  const style = KNOB_STYLES[i % KNOB_STYLES.length];
  const refIndex = Math.floor(i / 100);
  const localIndex = i % 100;

  const pal = refIndex === 0
    ? SOLAR_PALETTES[localIndex % SOLAR_PALETTES.length]
    : refIndex === 1
    ? AURORA_PALETTES[localIndex % AURORA_PALETTES.length]
    : MAGMA_PALETTES[localIndex % MAGMA_PALETTES.length];

  return {
    id,
    name: `${tex.name.split('#')[0].trim()} Knob #${String(id).padStart(4, '0')}`,
    category: tex.category,
    style,
    bodyColor: pal.c,
    accentColor: pal.a,
    pointerColor: pal.l,
    bezelWidth: parseFloat((1.6 + (i % 28) / 10).toFixed(1)),
    tickCount: style === 'MinimalDot' ? 0 : 8 + (i % 20),
    tickSpread: 235 + (i % 65),
    pointerThickness: parseFloat((2.0 + (i % 24) / 10).toFixed(1)),
    pointerLengthRatio: parseFloat((0.62 + (i % 28) / 100).toFixed(2)),
    centerCapRatio: parseFloat((0.26 + (i % 24) / 100).toFixed(2)),
    glowIntensity: parseFloat((0.45 + (i % 50) / 100).toFixed(2)),
    shadowDepth: parseFloat((3.2 + (i % 10)).toFixed(1)),
    metalRoughness: parseFloat((0.22 + (i % 55) / 100).toFixed(2)),
    description: `Precision rotary potentiometer configured for ${tex.name} with ${style} dial aesthetics.`
  };
});

// Generate 300 corresponding Slider presets
export const COLIR_300_SLIDER_PRESETS: SliderArchitectPreset[] = Array.from({ length: 300 }, (_, i) => {
  const id = 4001 + i;
  const tex = COLIR_300_TEXTURE_ARCHETYPES[i];
  const refIndex = Math.floor(i / 100);
  const localIndex = i % 100;

  const pal = refIndex === 0
    ? SOLAR_PALETTES[localIndex % SOLAR_PALETTES.length]
    : refIndex === 1
    ? AURORA_PALETTES[localIndex % AURORA_PALETTES.length]
    : MAGMA_PALETTES[localIndex % MAGMA_PALETTES.length];

  return {
    id,
    name: `${tex.name.split('#')[0].trim()} Slider #${String(id).padStart(4, '0')}`,
    category: tex.category,
    trackStyle: (['liquid-tube', 'cyber-glow', 'recessed-groove', 'dual-rail'] as const)[i % 4],
    thumbStyle: (['glowing-pill', 'diamond-wedge', 'brushed-metal', 'reticle-cross'] as const)[i % 4],
    trackHeight: 125 + (i % 55),
    thumbWidth: 16 + (i % 14),
    thumbHeight: 14 + (i % 14),
    cornerRadius: 3 + (i % 5),
    showCenterDetent: i % 2 === 0,
    tickMarksCount: 9 + (i % 13),
    trackColor: pal.s,
    thumbColor: pal.c,
    accentColor: pal.a,
    glowIntensity: parseFloat((0.4 + (i % 55) / 100).toFixed(2)),
    description: `Smooth throw fader tuned to ${tex.name} with tactile dampening.`
  };
});

// Generate 300 corresponding LFO presets
export const COLIR_300_LFO_PRESETS: LfoVisualPreset[] = Array.from({ length: 300 }, (_, i) => {
  const id = 4001 + i;
  const tex = COLIR_300_TEXTURE_ARCHETYPES[i];
  const refIndex = Math.floor(i / 100);
  const localIndex = i % 100;

  const pal = refIndex === 0
    ? SOLAR_PALETTES[localIndex % SOLAR_PALETTES.length]
    : refIndex === 1
    ? AURORA_PALETTES[localIndex % AURORA_PALETTES.length]
    : MAGMA_PALETTES[localIndex % MAGMA_PALETTES.length];

  return {
    id,
    name: `${tex.name.split('#')[0].trim()} LFO #${String(id).padStart(4, '0')}`,
    category: tex.category,
    phosphorColor: pal.a,
    beamGlowColor: `${pal.a}99`,
    gridColor: `${pal.a}25`,
    gridStyle: (['reticle-hud', 'polar-radial', 'fine-mesh', 'dot-matrix'] as const)[i % 4],
    waveThickness: parseFloat((1.6 + (i % 24) / 10).toFixed(1)),
    glowRadius: 7 + (i % 15),
    scanlineIntensity: parseFloat((0.25 + (i % 45) / 100).toFixed(2)),
    persistenceTrail: parseFloat((0.3 + (i % 50) / 100).toFixed(2)),
    fillGradient: i % 2 === 0,
    harmonics: 1 + (i % 4),
    description: `Calibrated oscilloscope vector trace with ${pal.a} electron beam excitation.`
  };
});

// Generate 300 full Skin presets
export const COLIR_300_SKINS: SkinDefinition[] = Array.from({ length: 300 }, (_, i) => {
  const id = 4001 + i;
  const tex = COLIR_300_TEXTURE_ARCHETYPES[i];
  const knob = COLIR_300_KNOB_PRESETS[i];
  const slider = COLIR_300_SLIDER_PRESETS[i];
  const lfo = COLIR_300_LFO_PRESETS[i];

  return {
    id,
    name: tex.name,
    category: tex.category as PresetCategory,
    panelDark: tex.primaryTint,
    panelDarker: tex.secondaryTint,
    cream: knob.bodyColor,
    amber: tex.accentTint,
    ledRed: knob.pointerColor,
    ledOff: '#171D24',
    knobStyle: knob.style,
    panelTexture: tex.baseModel,
    decorativeDots: i % 2 === 0,
    // Universal white knob text constraint strictly enforced
    textColor: '#FFFFFF',
    headerTextColor: '#FFFFFF',
    valueTextColor: '#FFFFFF',
    glowIntensity: knob.glowIntensity,
    knobGlowEnabled: true,
    patternType: tex.patternType,
    textureRoughness: tex.roughness,
    textureContrast: tex.contrast,
    grainDensity: tex.grainDensity,
    noiseOctaves: tex.noiseOctaves,
    blendMode: tex.blendMode,
    vignetteStrength: tex.vignette,
    liquidFlowAngle: tex.liquidAngle,
    bezelWidth: knob.bezelWidth,
    tickCount: knob.tickCount,
    tickSpread: knob.tickSpread,
    pointerThickness: knob.pointerThickness,
    pointerLengthRatio: knob.pointerLengthRatio,
    centerCapRatio: knob.centerCapRatio,
    shadowDepth: knob.shadowDepth,
    metalRoughness: knob.metalRoughness,
    textureArchetype: tex,
    knobPreset: knob,
    sliderPreset: slider,
    lfoPreset: lfo
  };
});

// Generate 300 Design Themes for Design Lab
export const COLIR_300_DESIGN_THEMES: DesignTheme[] = Array.from({ length: 300 }, (_, i) => {
  const id = `colir_theme_${4001 + i}`;
  const skin = COLIR_300_SKINS[i];
  const tex = COLIR_300_TEXTURE_ARCHETYPES[i];
  const knob = COLIR_300_KNOB_PRESETS[i];
  const slider = COLIR_300_SLIDER_PRESETS[i];
  const lfo = COLIR_300_LFO_PRESETS[i];

  return {
    id,
    name: skin.name,
    category: tex.category,
    mood: `${tex.category} — ${tex.inspirationTitle || 'Atmospheric Visual'}`,
    accentColor: tex.accentTint,
    description: `Complete hardware rig aesthetic grounded in ${tex.inspirationTitle}. Features ${tex.baseModel} panel with ${knob.style} rotaries.`,
    tags: ['ColirSeries', 'NewPresets', tex.category, tex.baseModel, knob.style],
    skin,
    texture: tex,
    knob,
    slider,
    lfo,
    customization: {
      knobSize: 68,
      knobGlowEnabled: true,
      knobGlowIntensity: knob.glowIntensity,
      textColor: '#FFFFFF',
      headerTextColor: '#FFFFFF',
      valueTextColor: '#FFFFFF',
      panelBezelRadius: 10,
      accentGlowSpread: 10
    }
  };
});
