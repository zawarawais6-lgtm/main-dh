import { DesignTheme, SkinDefinition } from '../types/skin';
import { textureArchetypes1000 } from '../data/textureArchetypes1000';
import { knobArchitect1000 } from '../data/knobArchitect1000';
import { sliderArchitect1000 } from '../data/sliderArchitect1000';
import { lfoVisualPresets } from '../data/lfoVisualPresets';

export function themeToSkinDefinition(theme: DesignTheme): SkinDefinition {
  const skin = theme.skin;
  return {
    id: typeof skin.id === 'number' ? skin.id : 1,
    name: theme.name,
    category: (theme.category as any) || 'Wada Sanzo Classic',
    panelDark: skin.panelDark || '#181A1F',
    panelDarker: skin.panelDarker || '#111317',
    cream: skin.cream || '#DCD6CD',
    amber: theme.accentColor || skin.amber || '#F59E0B',
    ledRed: skin.ledRed || '#EF4444',
    ledOff: skin.ledOff || '#374151',
    knobStyle: theme.knob?.style || skin.knobStyle || 'ChunkyPointer',
    panelTexture: theme.texture?.baseModel || skin.panelTexture || 'GrittyTexture',
    decorativeDots: true,
    textColor: theme.customization?.textColor || skin.cream || '#E2E8F0',
    headerTextColor: theme.customization?.headerTextColor || theme.accentColor || '#F59E0B',
    valueTextColor: theme.customization?.valueTextColor || theme.accentColor || '#F59E0B',
    knobGlowEnabled: theme.customization?.knobGlowEnabled ?? true,
    glowIntensity: theme.customization?.knobGlowIntensity ?? 0.5,
    textureArchetype: theme.texture,
    knobPreset: theme.knob,
    sliderPreset: theme.slider,
    lfoPreset: theme.lfo
  };
}

export function generateProceduralTheme(seedInput: number | string = 0): DesignTheme {
  let seedNum: number;
  if (typeof seedInput === 'number') {
    seedNum = Math.abs(Math.floor(seedInput));
  } else {
    let hash = 0;
    for (let i = 0; i < seedInput.length; i++) {
      hash = (hash << 5) - hash + seedInput.charCodeAt(i);
      hash |= 0;
    }
    seedNum = Math.abs(hash);
  }
  const seed = seedNum;
  const texture = textureArchetypes1000[seed % textureArchetypes1000.length];
  const knob = knobArchitect1000[seed % knobArchitect1000.length];
  const slider = sliderArchitect1000[seed % sliderArchitect1000.length];
  const lfo = lfoVisualPresets[seed % lfoVisualPresets.length];

  return {
    id: `theme_${seed}`,
    name: `${texture.name} Matrix`,
    category: texture.category,
    mood: seed % 2 === 0 ? 'Dark Precision' : 'Radiant Cyber',
    accentColor: knob.accentColor,
    description: `Coherent procedural audio theme pairing ${knob.name} with ${texture.name}.`,
    tags: ['Procedural', knob.style, texture.baseModel],
    skin: {
      id: seed + 1000,
      panelDark: texture.primaryTint,
      panelDarker: texture.secondaryTint,
      cream: knob.bodyColor,
      amber: knob.accentColor,
      ledRed: knob.pointerColor,
      ledOff: '#1E252C'
    },
    texture,
    knob,
    slider,
    lfo,
    customization: {
      knobSize: 66,
      knobGlowEnabled: true,
      knobGlowIntensity: knob.glowIntensity,
      textColor: '#FFFFFF',
      headerTextColor: '#FFFFFF',
      valueTextColor: '#FFFFFF'
    }
  };
}

import { NEW_300_DESIGN_THEMES } from '../data/new300Presets';

const baseThemes: DesignTheme[] = Array.from(
  { length: 3000 },
  (_, i) => generateProceduralTheme(i)
);

export const PROCEDURAL_DESIGN_THEMES_1000: DesignTheme[] = [
  ...baseThemes,
  ...NEW_300_DESIGN_THEMES
];
export const PROCEDURAL_DESIGN_THEMES_3000 = PROCEDURAL_DESIGN_THEMES_1000;
export const NEW_300_THEMES: DesignTheme[] = NEW_300_DESIGN_THEMES;
