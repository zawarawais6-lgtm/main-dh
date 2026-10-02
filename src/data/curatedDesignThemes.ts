import { DesignTheme } from '../types/skin';
import { textureArchetypes1000 } from './textureArchetypes1000';
import { knobArchitect1000 } from './knobArchitect1000';
import { sliderArchitect1000 } from './sliderArchitect1000';
import { lfoVisualPresets } from './lfoVisualPresets';

export const CURATED_DESIGN_THEMES: DesignTheme[] = [
  {
    id: 'cyber-tokyo-neon',
    name: 'Neo-Tokyo Cyberpunk',
    category: 'Cyberpunk & High-Tech',
    mood: 'Futuristic HUD with holographic cyan bloom and neon pink accents',
    accentColor: '#00E5FF',
    description: 'An aggressive, high-contrast dark chassis with PCB traces, cyber-ring dials, and a cyan electron beam oscilloscope.',
    tags: ['cyber', 'hud', 'neon', 'tokyo', 'vector'],
    skin: {
      id: 1,
      name: 'Neo-Tokyo Cyberpunk',
      panelDark: '#0B0F17',
      panelDarker: '#06080D',
      cream: '#E2F7FF',
      amber: '#00E5FF',
      ledRed: '#FF2BD6',
      ledOff: '#240C22',
      knobStyle: 'CyberRing',
      panelTexture: 'CyberCircuit',
      patternType: 'cyber-pcb-traces'
    },
    texture: textureArchetypes1000[1],
    knob: knobArchitect1000[3],
    slider: sliderArchitect1000[1],
    lfo: lfoVisualPresets[2],
    customization: {
      knobSize: 72,
      knobGlowIntensity: 0.85,
      knobGlowEnabled: true,
      panelBezelRadius: 10,
      accentGlowSpread: 12
    }
  },
  {
    id: 'kyoto-sumi-gold',
    name: 'Kyoto Sumi & Gold Leaf',
    category: 'Japanese Traditional',
    mood: 'Deep carbon soot sumi ink with traditional Seigaiha waves and polished gold foil dials',
    accentColor: '#D4AF37',
    description: 'Harmonious analog aesthetic based on 1930s Wada Sanzo color dictionaries and Japanese lacquerware craftsmanship.',
    tags: ['wada-sanzo', 'japan', 'gold', 'sumi', 'analog'],
    skin: {
      id: 2,
      name: 'Kyoto Sumi & Gold Leaf',
      panelDark: '#141416',
      panelDarker: '#0B0B0D',
      cream: '#F7F4EB',
      amber: '#D4AF37',
      ledRed: '#E05A47',
      ledOff: '#261210',
      knobStyle: 'ChunkyPointer',
      panelTexture: 'FlatMatte',
      patternType: 'japanese-seigaiha'
    },
    texture: textureArchetypes1000[0],
    knob: knobArchitect1000[1],
    slider: sliderArchitect1000[4],
    lfo: lfoVisualPresets[1],
    customization: {
      knobSize: 66,
      knobGlowIntensity: 0.3,
      knobGlowEnabled: true,
      panelBezelRadius: 8,
      accentGlowSpread: 6
    }
  },
  {
    id: 'abbey-road-vintage',
    name: 'Abbey Road Mastering Console',
    category: 'Vintage Console',
    mood: 'Warm analog tubes, machined fluted knobs, and amber VU meter warmth',
    accentColor: '#E8A13A',
    description: 'Iconic mid-century broadcast studio aesthetic featuring heavyweight bakelite fluted dials and warm P3 CRT tube response.',
    tags: ['vintage', 'console', 'bakelite', 'tube', 'mastering'],
    skin: {
      id: 3,
      name: 'Abbey Road Mastering Console',
      panelDark: '#1E1B18',
      panelDarker: '#110F0D',
      cream: '#F5EBE1',
      amber: '#E8A13A',
      ledRed: '#E6402B',
      ledOff: '#331512',
      knobStyle: 'VintageFluted',
      panelTexture: 'BrushedMetal',
      patternType: 'diamond-speaker-grille'
    },
    texture: textureArchetypes1000[5],
    knob: knobArchitect1000[9],
    slider: sliderArchitect1000[3],
    lfo: lfoVisualPresets[1],
    customization: {
      knobSize: 70,
      knobGlowIntensity: 0.25,
      knobGlowEnabled: true,
      panelBezelRadius: 6,
      accentGlowSpread: 4
    }
  },
  {
    id: 'aerospace-titanium',
    name: 'Apollo Aerospace Titanium',
    category: 'Aerospace & Industrial',
    mood: 'Twill-weave carbon fiber with stepped dials and military grade HUD reticles',
    accentColor: '#38BDF8',
    description: 'High-rigidity lightweight flight console with milled anodized alloys, crosshair graticules, and aerospace detent tolerances.',
    tags: ['aerospace', 'titanium', 'carbon', 'industrial', 'precision'],
    skin: {
      id: 4,
      name: 'Apollo Aerospace Titanium',
      panelDark: '#11151C',
      panelDarker: '#0A0D12',
      cream: '#E2E8F0',
      amber: '#38BDF8',
      ledRed: '#EF4444',
      ledOff: '#2A1414',
      knobStyle: 'SteppedWedge',
      panelTexture: 'CarbonFiber',
      patternType: 'carbon-fiber-twill'
    },
    texture: textureArchetypes1000[4],
    knob: knobArchitect1000[5],
    slider: sliderArchitect1000[6],
    lfo: lfoVisualPresets[0],
    customization: {
      knobSize: 68,
      knobGlowIntensity: 0.4,
      knobGlowEnabled: true,
      panelBezelRadius: 4,
      accentGlowSpread: 8
    }
  },
  {
    id: 'acid-neon-synth',
    name: 'Acid 303 Neon Laser',
    category: 'Acid & Neon Synthwave',
    mood: 'Ultraviolet glow with razor sharp laser indicators and high-contrast phosphor trace',
    accentColor: '#00FF66',
    description: 'Underground electronic warehouse hardware with green CRT phosphor beam, pop graphic dials, and heavy film grit.',
    tags: ['acid', 'synthwave', 'laser', 'rave', 'phosphor'],
    skin: {
      id: 5,
      name: 'Acid 303 Neon Laser',
      panelDark: '#0A0E0A',
      panelDarker: '#050805',
      cream: '#E6FFE6',
      amber: '#00FF66',
      ledRed: '#FF0055',
      ledOff: '#280612',
      knobStyle: 'BoldBlock',
      panelTexture: 'CRTPhosphor',
      patternType: 'radar-sweep-hud'
    },
    texture: textureArchetypes1000[13],
    knob: knobArchitect1000[2],
    slider: sliderArchitect1000[1],
    lfo: lfoVisualPresets[0],
    customization: {
      knobSize: 74,
      knobGlowIntensity: 0.95,
      knobGlowEnabled: true,
      panelBezelRadius: 12,
      accentGlowSpread: 16
    }
  },
  {
    id: 'boutique-minimal-ice',
    name: 'Nordic Clean Studio Minimal',
    category: 'Boutique Minimal',
    mood: 'Pristine satin matte finish with minimal dot indicators and silent laser faders',
    accentColor: '#3B82F6',
    description: 'Architectural minimalism stripped of skeuomorphic noise. Pure functional clarity for precision mixing environments.',
    tags: ['minimal', 'studio', 'nordic', 'clean', 'modern'],
    skin: {
      id: 6,
      name: 'Nordic Clean Studio Minimal',
      panelDark: '#16181D',
      panelDarker: '#0E1014',
      cream: '#F8FAFC',
      amber: '#60A5FA',
      ledRed: '#3B82F6',
      ledOff: '#1E293B',
      knobStyle: 'MinimalDot',
      panelTexture: 'FlatMatte',
      patternType: 'bauhaus-geometry'
    },
    texture: textureArchetypes1000[9],
    knob: knobArchitect1000[8],
    slider: sliderArchitect1000[4],
    lfo: lfoVisualPresets[3],
    customization: {
      knobSize: 64,
      knobGlowIntensity: 0.15,
      knobGlowEnabled: false,
      panelBezelRadius: 8,
      accentGlowSpread: 2
    }
  },
  {
    id: 'texturelabs-xerox-burn',
    name: 'Texturelabs Xerox Toner Burn',
    category: 'Analog & Texturelabs',
    mood: 'Heavy analog photocopy grunge with high-contrast toner threshold and roller drag lines',
    accentColor: '#E8A13A',
    description: 'Inspired by Texturelabs.org darkroom techniques: degraded paper tooth, xerox burn streaks, and vintage bakelite control hardware.',
    tags: ['texturelabs', 'xerox', 'photocopy', 'grunge', 'grit', 'analog'],
    skin: {
      id: 7,
      name: 'Texturelabs Xerox Toner Burn',
      panelDark: '#171920',
      panelDarker: '#0B0D12',
      cream: '#F4EAD4',
      amber: '#E8A13A',
      ledRed: '#EF4444',
      ledOff: '#261210',
      knobStyle: 'VintageFluted',
      panelTexture: 'TexturelabsPhotocopy',
      patternType: 'texturelabs-photocopy-grunge'
    },
    texture: textureArchetypes1000.find((t) => t.baseModel === 'TexturelabsPhotocopy') || textureArchetypes1000[0],
    knob: knobArchitect1000[9] || knobArchitect1000[0],
    slider: sliderArchitect1000[3] || sliderArchitect1000[0],
    lfo: lfoVisualPresets[1] || lfoVisualPresets[0],
    customization: {
      knobSize: 70,
      knobGlowIntensity: 0.45,
      knobGlowEnabled: true,
      panelBezelRadius: 10,
      accentGlowSpread: 8
    }
  },
  {
    id: 'analog-4track-cassette',
    name: 'Vecteezy Analog 4-Track Cassette',
    category: 'Analog & Texturelabs',
    mood: 'Warm reel-to-reel magnetic tape oxide streaks with CRT phosphor raster glow',
    accentColor: '#F59E0B',
    description: 'Authentic 1980s studio tape saturation with magnetic oxide grain, CRT scanlines, and thermionic vacuum tube warmth.',
    tags: ['analog', 'tape', 'cassette', 'crt', 'vintage', 'vecteezy'],
    skin: {
      id: 8,
      name: 'Vecteezy Analog 4-Track Cassette',
      panelDark: '#1A1612',
      panelDarker: '#0F0B08',
      cream: '#FFF1E0',
      amber: '#F59E0B',
      ledRed: '#DC2626',
      ledOff: '#2B120B',
      knobStyle: 'GroovedCap',
      panelTexture: 'AnalogMagneticTape',
      patternType: 'vecteezy-magnetic-tape'
    },
    texture: textureArchetypes1000.find((t) => t.baseModel === 'AnalogMagneticTape') || textureArchetypes1000[0],
    knob: knobArchitect1000[6] || knobArchitect1000[0],
    slider: sliderArchitect1000[0],
    lfo: lfoVisualPresets[0],
    customization: {
      knobSize: 72,
      knobGlowIntensity: 0.65,
      knobGlowEnabled: true,
      panelBezelRadius: 12,
      accentGlowSpread: 10
    }
  },
  {
    id: 'figma-bento-holo',
    name: 'Figma Community Bento & Holo Foil',
    category: 'Figma Modern',
    mood: 'Frosted micro-grain noise mesh with prismatic holographic foil dispersion',
    accentColor: '#00F0FF',
    description: 'Modern Figma community UI aesthetic: subtle silky micro-grain noise meshes, pastel neon bleeds, and iridescent light facets.',
    tags: ['figma', 'mesh', 'holographic', 'foil', 'noise', 'modern'],
    skin: {
      id: 9,
      name: 'Figma Community Bento & Holo Foil',
      panelDark: '#121626',
      panelDarker: '#080A14',
      cream: '#F1F5F9',
      amber: '#00F0FF',
      ledRed: '#EC4899',
      ledOff: '#1E1B4B',
      knobStyle: 'CyberRing',
      panelTexture: 'FigmaNoiseMesh',
      patternType: 'figma-noise-mesh'
    },
    texture: textureArchetypes1000.find((t) => t.baseModel === 'FigmaNoiseMesh') || textureArchetypes1000[0],
    knob: knobArchitect1000[3] || knobArchitect1000[0],
    slider: sliderArchitect1000[1] || sliderArchitect1000[0],
    lfo: lfoVisualPresets[2] || lfoVisualPresets[0],
    customization: {
      knobSize: 68,
      knobGlowIntensity: 0.8,
      knobGlowEnabled: true,
      panelBezelRadius: 14,
      accentGlowSpread: 14
    }
  },
  {
    id: 'allison-perry-collage',
    name: 'Allison Perry Mixed Media & Gouache',
    category: 'Mixed Media & Print',
    mood: 'Tactile torn paper deckled edges, dry-brush gouache paint strokes, and handmade fiber grain',
    accentColor: '#10B981',
    description: 'Physical materiality inspired by Allison Perry Art: layered deckled paper collages, rich gouache pigment washes, and tactile riso print marks.',
    tags: ['allison-perry', 'mixed-media', 'paper', 'gouache', 'print', 'tactile'],
    skin: {
      id: 10,
      name: 'Allison Perry Mixed Media & Gouache',
      panelDark: '#151D18',
      panelDarker: '#0A120D',
      cream: '#FAF6ED',
      amber: '#10B981',
      ledRed: '#F43F5E',
      ledOff: '#19261E',
      knobStyle: 'ChunkyPointer',
      panelTexture: 'AllisonPerryMixedMedia',
      patternType: 'allison-perry-mixed-media'
    },
    texture: textureArchetypes1000.find((t) => t.baseModel === 'AllisonPerryMixedMedia') || textureArchetypes1000[0],
    knob: knobArchitect1000[0],
    slider: sliderArchitect1000[3] || sliderArchitect1000[0],
    lfo: lfoVisualPresets[1] || lfoVisualPresets[0],
    customization: {
      knobSize: 70,
      knobGlowIntensity: 0.35,
      knobGlowEnabled: true,
      panelBezelRadius: 8,
      accentGlowSpread: 6
    }
  }
];
