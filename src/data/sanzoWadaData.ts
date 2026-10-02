export interface SanzoWadaPalette {
  id: number | string;
  name: string;
  colors: string[];
  category?: string;
}

export interface CyberPalette {
  name: string;
  colors: string[];
}

export const BASE_HISTORICAL_PALETTES: { name: string; colors: string[]; category: string }[] = [
  // Sanzo Wada Set 1 (dh2.1)
  {
    name: 'Sumi Soot & Gold Leaf',
    colors: ['#121316', '#2A2D34', '#D4AF37', '#E8A13A', '#F7F4EB'],
    category: 'Classical Wada Sanzo'
  },
  {
    name: 'Asagi Celadon & Indigo',
    colors: ['#0F171E', '#1F3A4B', '#4EAE8D', '#9CD9C2', '#E8F5F1'],
    category: 'Classical Wada Sanzo'
  },
  {
    name: 'Beni Lacquer & Vermilion',
    colors: ['#181014', '#38161D', '#E63946', '#F4A261', '#FDF0ED'],
    category: 'Classical Wada Sanzo'
  },
  {
    name: 'Kariyasu Ochre & Tea',
    colors: ['#1A1713', '#3B3326', '#C89D42', '#E5C07B', '#F8F5EE'],
    category: 'Classical Wada Sanzo'
  },
  {
    name: 'Kurotsurubami Slate Soot',
    colors: ['#14171A', '#262D35', '#6C7A89', '#95A5A6', '#ECEFF1'],
    category: 'Classical Wada Sanzo'
  },
  {
    name: 'Rikyucha Wasabi & Moss',
    colors: ['#131913', '#2D3A2C', '#588157', '#A3B18A', '#DAD7CD'],
    category: 'Classical Wada Sanzo'
  },
  {
    name: 'Ebi-iro Wild Grape Plum',
    colors: ['#19121E', '#3A2445', '#7B2CBF', '#C77DFF', '#F3E8FF'],
    category: 'Classical Wada Sanzo'
  },
  {
    name: 'Akane Madder Root Dusk',
    colors: ['#1A1315', '#3C1B23', '#9D0208', '#D00000', '#FCEADE'],
    category: 'Classical Wada Sanzo'
  },
  {
    name: 'Toki Pink & Charcoal',
    colors: ['#15171C', '#282E3A', '#EE969A', '#F6C1C4', '#FDF2F4'],
    category: 'Classical Wada Sanzo'
  },
  {
    name: 'Shinbashi Cyan River',
    colors: ['#0D1920', '#183848', '#00A896', '#028090', '#F0FDF4'],
    category: 'Classical Wada Sanzo'
  },
  // Sanzo Wada Set 2 (dh2.2)
  {
    name: 'Vermilion & Silver Pine',
    colors: ['#1C2321', '#2F3E3A', '#92A298', '#E07A5F', '#F4F1DE'],
    category: 'Showa Era Harmonies'
  },
  {
    name: 'Ultramarine & Amber Ochre',
    colors: ['#141E28', '#203A43', '#E8A13A', '#2C5364', '#F7F4EB'],
    category: 'Showa Era Harmonies'
  },
  {
    name: 'Kyoto Moss & Persimmon',
    colors: ['#1B221E', '#3D5A47', '#E05A47', '#D1CCB9', '#FAF7EE'],
    category: 'Showa Era Harmonies'
  },
  {
    name: 'Sumi Ink & Gold Leaf',
    colors: ['#121315', '#242528', '#CBA135', '#E6C875', '#E8E8E8'],
    category: 'Showa Era Harmonies'
  },
  {
    name: 'Indigo Dye & Pale Iris',
    colors: ['#0E1726', '#1E2D4A', '#7289DA', '#D4DEF2', '#FFFFFF'],
    category: 'Showa Era Harmonies'
  },
  {
    name: 'Uji Matcha & Azuki Bean',
    colors: ['#192318', '#384E33', '#8B4546', '#D6CEBE', '#F9F6F0'],
    category: 'Showa Era Harmonies'
  },
  {
    name: 'Cerulean Tide & Coral Sand',
    colors: ['#0E202B', '#1E4861', '#E87A5D', '#64B5F6', '#F5EBE6'],
    category: 'Showa Era Harmonies'
  },
  {
    name: 'Charcoal & Cherry Blossom',
    colors: ['#18191B', '#2C2D31', '#F48FB1', '#E0E0E0', '#FFFFFF'],
    category: 'Showa Era Harmonies'
  },
  {
    name: 'Smoky Topaz & Citron',
    colors: ['#221A15', '#4A3B32', '#D4B830', '#B09A7A', '#F7F3E8'],
    category: 'Showa Era Harmonies'
  },
  {
    name: 'Deep Wisteria & Jade',
    colors: ['#1A162B', '#372E54', '#4EAE8D', '#B3A5D4', '#F4F2F9'],
    category: 'Showa Era Harmonies'
  },
  // Cyber & Futuristic Palettes (from dh2.1 & dh2.2)
  {
    name: 'Cyberpunk Neon 2077',
    colors: ['#0B0E14', '#05070B', '#F1F5F9', '#00E5FF', '#FF007F'],
    category: 'Cyberpunk Neon'
  },
  {
    name: 'Synthwave Sunset Overdrive',
    colors: ['#13091F', '#090410', '#FDE047', '#FF7A00', '#F43F5E'],
    category: 'Cyberpunk Neon'
  },
  {
    name: 'Matrix Digital Phosphor',
    colors: ['#061008', '#020603', '#E6FFE6', '#00FF66', '#00E5FF'],
    category: 'Cyberpunk Neon'
  },
  {
    name: 'Deep Oceanic Obsidian',
    colors: ['#080E18', '#03060A', '#E0F2FE', '#38BDF8', '#818CF8'],
    category: 'Cyberpunk Neon'
  },
  {
    name: 'Solarized Aerospace Monolith',
    colors: ['#12161A', '#0A0C0E', '#F8FAFC', '#F59E0B', '#EF4444'],
    category: 'Cyberpunk Neon'
  },
  {
    name: 'Neo-Tokyo Cyber',
    colors: ['#080A10', '#101422', '#DDF5FF', '#00E5FF', '#FF2BD6'],
    category: 'Futuristic Synthetic'
  },
  {
    name: 'Quantum Void',
    colors: ['#0A0612', '#140D26', '#EBDCFF', '#B347FF', '#00FF9D'],
    category: 'Futuristic Synthetic'
  },
  {
    name: 'Tachyon Solar',
    colors: ['#120B04', '#26170B', '#FFF0D4', '#FF9900', '#FF3B30'],
    category: 'Futuristic Synthetic'
  },
  {
    name: 'Hyper Matrix',
    colors: ['#040D07', '#0A2012', '#D6FFE3', '#00FF66', '#00B4D8'],
    category: 'Futuristic Synthetic'
  },
  {
    name: 'Vaporwave Sunset',
    colors: ['#150A21', '#28113F', '#FFE3F7', '#FF71CE', '#01CDFE'],
    category: 'Futuristic Synthetic'
  }
];

export const FUTURISTIC_CYBER_PALETTES: CyberPalette[] = [
  {
    name: 'Cyberpunk Neon 2077',
    colors: ['#0B0E14', '#05070B', '#F1F5F9', '#00E5FF', '#FF007F', '#1F0B18']
  },
  {
    name: 'Synthwave Sunset Overdrive',
    colors: ['#13091F', '#090410', '#FDE047', '#FF7A00', '#F43F5E', '#25081A']
  },
  {
    name: 'Matrix Digital Phosphor',
    colors: ['#061008', '#020603', '#E6FFE6', '#00FF66', '#00E5FF', '#081C0D']
  },
  {
    name: 'Deep Oceanic Obsidian',
    colors: ['#080E18', '#03060A', '#E0F2FE', '#38BDF8', '#818CF8', '#0D1B2A']
  },
  {
    name: 'Solarized Aerospace Monolith',
    colors: ['#12161A', '#0A0C0E', '#F8FAFC', '#F59E0B', '#EF4444', '#1F1410']
  },
  {
    name: 'Neo-Tokyo Cyber',
    colors: ['#080A10', '#101422', '#DDF5FF', '#00E5FF', '#FF2BD6', '#26122C']
  },
  {
    name: 'Quantum Void',
    colors: ['#0A0612', '#140D26', '#EBDCFF', '#B347FF', '#00FF9D', '#1B2420']
  },
  {
    name: 'Tachyon Solar',
    colors: ['#120B04', '#26170B', '#FFF0D4', '#FF9900', '#FF3B30', '#2B1214']
  },
  {
    name: 'Hyper Matrix',
    colors: ['#040D07', '#0A2012', '#D6FFE3', '#00FF66', '#00B4D8', '#07242B']
  },
  {
    name: 'Vaporwave Sunset',
    colors: ['#150A21', '#28113F', '#FFE3F7', '#FF71CE', '#01CDFE', '#002E42']
  }
];

const HARMONY_MODIFIERS = [
  'Harmonic', 'Muted', 'Vivid', 'Deep Tone', 'Pastel Shift', 'Dark Room',
  'Solarized', 'Phosphor', 'Specular', 'Anodized', 'Vintage Wash', 'Sumi Infused'
];

/**
 * 3,000 Combined Wada Sanzo & Studio Color Palettes
 */
export const SANZO_WADA_PALETTES: SanzoWadaPalette[] = Array.from({ length: 3000 }, (_, i) => {
  const base = BASE_HISTORICAL_PALETTES[i % BASE_HISTORICAL_PALETTES.length];
  const mod = HARMONY_MODIFIERS[Math.floor(i / BASE_HISTORICAL_PALETTES.length) % HARMONY_MODIFIERS.length];
  const id = i + 1;

  // Systematic slight harmonic hue and lightness variation for unique palettes
  const colorShift = (hex: string, step: number) => {
    if (!hex.startsWith('#') || hex.length < 7) return hex;
    const num = parseInt(hex.slice(1), 16);
    let r = (num >> 16) + ((step * 3) % 18) - 9;
    let g = ((num >> 8) & 0x00FF) + ((step * 5) % 18) - 9;
    let b = (num & 0x0000FF) + ((step * 7) % 18) - 9;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const colors = i < BASE_HISTORICAL_PALETTES.length
    ? base.colors
    : base.colors.map((c, cIdx) => colorShift(c, i + cIdx));

  return {
    id,
    name: i < BASE_HISTORICAL_PALETTES.length
      ? `${base.name}`
      : `${base.name} (${mod} #${String(id).padStart(4, '0')})`,
    colors,
    category: base.category
  };
});
