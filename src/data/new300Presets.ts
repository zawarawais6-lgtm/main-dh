import {
  TextureArchetype,
  TextureArchetypeCategory,
  PanelTexture,
  SkinDefinition,
  KnobArchitectPreset,
  SliderArchitectPreset,
  LfoVisualPreset,
  DesignTheme,
  KnobStyle,
  PresetCategory
} from '../types/skin';

export interface InspirationLinkDefinition {
  id: string;
  title: string;
  link: string;
  badge: string;
  category: TextureArchetypeCategory;
  model: PanelTexture;
  pattern: string;
  description: string;
}

export const NEW_INSPIRATION_LINKS: InspirationLinkDefinition[] = [
  // 1. Motion Dev Three.js Shader Topography
  {
    id: 'shader-topography',
    title: 'Motion Dev — Three.js Shader Topography',
    link: 'https://motion.dev/examples/js-three-shader-topography',
    badge: 'Motion Dev',
    category: 'Shader Topography & Meshes',
    model: 'ShaderTopography',
    pattern: 'motion-shader-topography',
    description: 'Layered 3D elevation contours with procedural isoline altitude stepping and chromatic depth glow.'
  },
  // 2. CodeSandbox Exkei Three.js Liquid Shader
  {
    id: 'exkei-liquid',
    title: 'CodeSandbox — Exkei Three.js Liquid Warp',
    link: 'https://codesandbox.io/p/sandbox/exkei?file=%2Fsrc%2FApp.tsx',
    badge: 'CodeSandbox',
    category: 'Kinetic Chromatic Waveforms',
    model: 'ExkeiLiquidWarp',
    pattern: 'exkei-liquid-warp',
    description: 'Vertex-displaced viscous liquid mesh with chromatic refraction and fluid surface ripples.'
  },
  // 3. CodeSandbox Ggyzkv Generative GLSL Canvas
  {
    id: 'ggyzkv-kinetic',
    title: 'CodeSandbox — Ggyzkv Kinetic GLSL Mesh',
    link: 'https://codesandbox.io/p/sandbox/ggyzkv',
    badge: 'CodeSandbox',
    category: 'Kinetic Chromatic Waveforms',
    model: 'GgyzkvKineticMesh',
    pattern: 'ggyzkv-kinetic-mesh',
    description: 'Algorithmic geometric kinetic lattice with intersecting sinusoidal chords and glowing vertices.'
  },
  // 4-21. Book of Shapes Patterns
  {
    id: 'bos-flow-poles',
    title: 'Book of Shapes — Flow Poles Vector Field',
    link: 'https://bookofshapes.com/patterns/flow_poles#H4sIAGJSvmoAA6tWylOyio420DGP1Yk21DE0NgDSRjog0ljHQM_YFMgwATIMzYAMUx1DE0uQQjMdM4vYWB2lEqDe2FoAKlj7y0QAAAA',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'FlowPoles',
    pattern: 'flow-poles',
    description: 'Dual magnetic pole streamlines tracing dipole vector potential curves in high-tension fields.'
  },
  {
    id: 'bos-flow-lines',
    title: 'Book of Shapes — Flow Lines Laminar Drift',
    link: 'https://bookofshapes.com/patterns/flow_lines',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'FlowLines',
    pattern: 'flow-lines',
    description: 'Curvilinear laminar flow streamlets sweeping across multi-frequency divergence gradients.'
  },
  {
    id: 'bos-flow-dots',
    title: 'Book of Shapes — Flow Dots Particle Swarm',
    link: 'https://bookofshapes.com/patterns/flow_dots',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'FlowDots',
    pattern: 'flow-dots',
    description: 'Velocity-weighted vector dot matrix dispersed through non-linear fluid vortexes.'
  },
  {
    id: 'bos-spiral-morph',
    title: 'Book of Shapes — Spiral Morph Geometry',
    link: 'https://bookofshapes.com/patterns/spiral_morph',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'SpiralMorph',
    pattern: 'spiral-morph',
    description: 'Morphing Archimedean and logarithmic spiral coils undulated by harmonic phase shifts.'
  },
  {
    id: 'bos-brockmann-arcs',
    title: 'Book of Shapes — Brockmann Modernist Arcs',
    link: 'https://bookofshapes.com/patterns/brockmann_arcs',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'BrockmannArcs',
    pattern: 'brockmann-arcs',
    description: 'Swiss modernist concentric arc compositions inspired by Josef Müller-Brockmann graphic systems.'
  },
  {
    id: 'bos-wavy-lines',
    title: 'Book of Shapes — Wavy Lines Converging',
    link: 'https://bookofshapes.com/patterns/wavy_lines_converging',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'WavyLinesConverging',
    pattern: 'wavy-lines-converging',
    description: 'Dense wave packets with modulating spatial frequency converging into vanishing focal horizons.'
  },
  {
    id: 'bos-chaos-circles',
    title: 'Book of Shapes — Chaos Circles Orbit',
    link: 'https://bookofshapes.com/patterns/chaos_circles',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'ChaosCircles',
    pattern: 'chaos-circles',
    description: 'Eccentric nested circular contours perturbed by low-frequency noise displacement.'
  },
  {
    id: 'bos-concentric-rings',
    title: 'Book of Shapes — Concentric Noise Rings',
    link: 'https://bookofshapes.com/patterns/concentric_noise_rings',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'ConcentricNoiseRings',
    pattern: 'concentric-noise-rings',
    description: 'Pulsing radial acoustic rings modulated by spatial turbulence and wave ripples.'
  },
  {
    id: 'bos-halftone-sphere',
    title: 'Book of Shapes — Halftone Sphere 3D Raster',
    link: 'https://bookofshapes.com/patterns/halftone_sphere',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'HalftoneSphere',
    pattern: 'halftone-sphere',
    description: 'Volumetric sphere mapped with variable-aperture halftone dots creating illusion of depth.'
  },
  {
    id: 'bos-lissajous-field',
    title: 'Book of Shapes — Lissajous Resonance Field',
    link: 'https://bookofshapes.com/patterns/lissajous_field',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'LissajousField',
    pattern: 'lissajous-field',
    description: 'Harmonically tuned orthogonal sinusoid figures forming delicate oscilloscope bow-tie traces.'
  },
  {
    id: 'bos-modular-circle',
    title: 'Book of Shapes — Modular Circle Multiplication',
    link: 'https://bookofshapes.com/patterns/modular_circle',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'ModularCircle',
    pattern: 'modular-circle',
    description: 'Modulo multiplication circle chords tracing cardioid and nephroid envelope caustics.'
  },
  {
    id: 'bos-phyllotaxis-bloom',
    title: 'Book of Shapes — Phyllotaxis Golden Bloom',
    link: 'https://bookofshapes.com/patterns/phyllotaxis-bloom',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'PhyllotaxisBloom',
    pattern: 'phyllotaxis-bloom',
    description: 'Golden angle (137.508°) sunflower spiral packing with radiating point divergence.'
  },
  {
    id: 'bos-noise-landscape',
    title: 'Book of Shapes — Noise Landscape Terrain',
    link: 'https://bookofshapes.com/patterns/noise_landscape_1',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'NoiseLandscape',
    pattern: 'noise-landscape',
    description: 'Isometric wireframe terrain ribbons with algorithmic Perlin height ridges.'
  },
  {
    id: 'bos-noise-circle',
    title: 'Book of Shapes — Noise Circle Amoeba',
    link: 'https://bookofshapes.com/patterns/noise_circle_1',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'NoiseCircle',
    pattern: 'noise-circle',
    description: 'Organic undulating perimeter with multi-octave radial displacement waves.'
  },
  {
    id: 'bos-radial-spokes',
    title: 'Book of Shapes — Radial Spokes Calibrator',
    link: 'https://bookofshapes.com/patterns/radial_spokes',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'RadialSpokes',
    pattern: 'radial-spokes',
    description: 'High-density radial azimuth graduation marks with optical strobe frequency bars.'
  },
  {
    id: 'bos-polar-mesh',
    title: 'Book of Shapes — Polar Mesh Grid',
    link: 'https://bookofshapes.com/patterns/polar_mesh',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'PolarMesh',
    pattern: 'polar-mesh',
    description: 'Coordinated polar graticule web with circular range rings and radial bearing rays.'
  },
  {
    id: 'bos-resonance-field',
    title: 'Book of Shapes — Chladni Resonance Field',
    link: 'https://bookofshapes.com/patterns/resonance_field',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'ResonanceField',
    pattern: 'resonance-field',
    description: 'Acoustic standing-wave nodal patterns inspired by vibrating Chladni resonance plates.'
  },
  {
    id: 'bos-spiral-dot-field',
    title: 'Book of Shapes — Fermat Spiral Dot Field',
    link: 'https://bookofshapes.com/patterns/spiral_dot_field',
    badge: 'Book of Shapes',
    category: 'Book of Shapes Algorithmic',
    model: 'SpiralDotField',
    pattern: 'spiral-dot-field',
    description: 'Fermat spiral point matrix expanding outward with calibrated particle decay.'
  },

  // 22-23. Fffuel Tools
  {
    id: 'fffuel-abstract',
    title: 'Fffuel — Aaabstract Organic Gradients',
    link: 'https://www.fffuel.co/aaabstract/',
    badge: 'fffuel.co',
    category: 'Fffuel Generative Vectors',
    model: 'FffuelAbstract',
    pattern: 'fffuel-aaabstract',
    description: 'Multi-layered organic metaball silhouettes filled with lush multi-stop color transitions.'
  },
  {
    id: 'fffuel-texture',
    title: 'Fffuel — Tttexture Procedural Micro-Grid',
    link: 'https://www.fffuel.co/tttexture/',
    badge: 'fffuel.co',
    category: 'Fffuel Generative Vectors',
    model: 'FffuelTexture',
    pattern: 'fffuel-tttexture',
    description: 'Procedural geometric stipple, crosshatch micro-dither, and grain texture patterns.'
  },

  // 24-60. Shaders.com Curated Collection
  {
    id: 'shader-shifted-swirls',
    title: 'Shaders.com — Shifted Swirls Vortex',
    link: 'https://shaders.com/collection/shifted-swirls/55664157-fb7f-4f14-a9a8-295e1a5e46fc',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'ShiftedSwirls',
    pattern: 'shifted-swirls',
    description: 'Domain-warped multi-layer rotational curl turbulence with chromatic shear.'
  },
  {
    id: 'shader-vibrant-waves-1',
    title: 'Shaders.com — Vibrant Waves Neon',
    link: 'https://shaders.com/collection/vibrant-waves/10fbf73f-de94-4b11-85b1-b0af2a710720',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'VibrantWaves',
    pattern: 'vibrant-waves-1',
    description: 'Electric neon wave interference patterns with radiant standing crests.'
  },
  {
    id: 'shader-swirling-gradient',
    title: 'Shaders.com — Swirling Gradient Abyss',
    link: 'https://shaders.com/collection/swirling-gradient/92640acb-4d6f-4565-97e8-da5065ae7f11',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'SwirlingGradient',
    pattern: 'swirling-gradient',
    description: 'Viscous color whirlpool with velvety smooth gradient bands spiraling inward.'
  },
  {
    id: 'shader-radial-overlap-1',
    title: 'Shaders.com — Radial Overlap Moiré',
    link: 'https://shaders.com/collection/radial-overlap/7d1a41d8-bb94-4057-941c-c0e5c61acd5f',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'RadialOverlap',
    pattern: 'radial-overlap-1',
    description: 'Intersecting semi-transparent circular lenses generating optical chromatic moiré.'
  },
  {
    id: 'shader-holographic-waves',
    title: 'Shaders.com — Holographic Prismatic Waves',
    link: 'https://shaders.com/collection/holographic-waves/de475050-83af-4379-bff7-a2580ac2cf63',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'HolographicWaves',
    pattern: 'holographic-waves',
    description: 'Diffraction grating iridescent ripples shimmering with holographic spectral flares.'
  },
  {
    id: 'shader-fringe',
    title: 'Shaders.com — Fringe Thin-Film Interference',
    link: 'https://shaders.com/collection/fringe/9ede5a1a-2585-445a-a287-cb07cd53abba',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'FringeShader',
    pattern: 'fringe-shader',
    description: 'Thin-film optical interference fringes creating rainbow Newton ring bands.'
  },
  {
    id: 'shader-traced-paths',
    title: 'Shaders.com — Traced Laser Paths',
    link: 'https://shaders.com/collection/traced-paths/97852ffc-0e68-4b5e-ac28-2bfd8741b03e',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'TracedPaths',
    pattern: 'traced-paths',
    description: 'Laser light beam vectors tracing intricate curvilinear circuit pathways.'
  },
  {
    id: 'shader-ember-drift',
    title: 'Shaders.com — Ember Drift Incandescence',
    link: 'https://shaders.com/collection/ember-drift/8e67e22f-0434-4520-b083-94a1359e0147',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'EmberDrift',
    pattern: 'ember-drift',
    description: 'Thermal glowing ember motes drifting upward through turbulent thermal convection.'
  },
  {
    id: 'shader-floating-glass',
    title: 'Shaders.com — Floating Glass Prism Caustics',
    link: 'https://shaders.com/collection/floating-glass/a82021b6-12cf-458e-98d3-9391063a9c2f',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'FloatingGlass',
    pattern: 'floating-glass',
    description: 'Refractive geometric glass tiles with internal optical caustics and edge bevel reflections.'
  },
  {
    id: 'shader-isotopes',
    title: 'Shaders.com — Isotopes Quantum Orbitals',
    link: 'https://shaders.com/collection/isotopes/7e81e58a-efb5-4b89-b958-42c3d971b5a1',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'IsotopesShader',
    pattern: 'isotopes-shader',
    description: 'Quantum atomic orbital probability clouds orbiting resonant harmonic nuclei.'
  },
  {
    id: 'shader-lost-rays',
    title: 'Shaders.com — Lost Crepuscular Rays',
    link: 'https://shaders.com/collection/lost-rays/a42e21a8-0420-45ab-bd12-f097a20278ee',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'LostRays',
    pattern: 'lost-rays',
    description: 'Volumetric god-rays piercing through dark atmospheric haze and mist.'
  },
  {
    id: 'shader-magnetic-shimmer',
    title: 'Shaders.com — Magnetic Shimmer Ferrofluid',
    link: 'https://shaders.com/collection/magnetic-shimmer/5d34ce82-bd18-40ed-902e-79f4e5fc7a04',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'MagneticShimmer',
    pattern: 'magnetic-shimmer',
    description: 'Anisotropic metallic sheen reflecting off magnetic field spikes.'
  },
  {
    id: 'shader-synthesis-1',
    title: 'Shaders.com — Synthesis Audio Waves I',
    link: 'https://shaders.com/collection/synthesis/d420b313-1031-4afb-810b-8704c3fa0a9f',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'SynthesisShader',
    pattern: 'synthesis-shader-1',
    description: 'Additive harmonic waveforms mapped onto 2D heat surfaces with phosphor trace lines.'
  },
  {
    id: 'shader-synthesis-2',
    title: 'Shaders.com — Synthesis Resonant Spectrum II',
    link: 'https://shaders.com/collection/synthesis/afe9e395-7e52-4aad-97b8-c75a94770e19',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'SynthesisShader',
    pattern: 'synthesis-shader-2',
    description: 'Multi-band audio frequency waterfall visualized in chromatic radiant ribbons.'
  },
  {
    id: 'shader-synthesis-3',
    title: 'Shaders.com — Synthesis Polyphonic Phase III',
    link: 'https://shaders.com/collection/synthesis/9e67d9be-1d83-4a8c-b642-c48206dcf650',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'SynthesisShader',
    pattern: 'synthesis-shader-3',
    description: 'Polyphonic oscillator phase alignment visualized with interference grids.'
  },
  {
    id: 'shader-synthesis-4',
    title: 'Shaders.com — Synthesis Spectral Core IV',
    link: 'https://shaders.com/collection/synthesis/eeec37bb-1628-456b-9c32-a6b2dc10cfbb',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'SynthesisShader',
    pattern: 'synthesis-shader-4',
    description: 'Dense FM synthesis carrier-modulator wavefolding represented in gradient topologies.'
  },
  {
    id: 'shader-synthesis-5',
    title: 'Shaders.com — Synthesis Modular Flux V',
    link: 'https://shaders.com/collection/synthesis/c91ae513-d656-4f32-933f-fdcd579495e2',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'SynthesisShader',
    pattern: 'synthesis-shader-5',
    description: 'Oscillating voltage-controlled waves weaving into intricate vector matrices.'
  },
  {
    id: 'shader-spectral-bloom',
    title: 'Shaders.com — Spectral Bloom Flare',
    link: 'https://shaders.com/collection/spectral-bloom/40631d2a-357c-4944-8ca7-b61db29304e3',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'SpectralBloom',
    pattern: 'spectral-bloom',
    description: 'Soft-focus optical anamorphic flare with spectral chromatic abberation halo.'
  },
  {
    id: 'shader-saturn-rings',
    title: 'Shaders.com — Saturn Rings Planetary Arc',
    link: 'https://shaders.com/collection/saturn/028efb84-acac-4d5e-b40b-0bd97152ca39',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'SaturnRings',
    pattern: 'saturn-rings',
    description: 'Precision astronomical planetary rings with fine particulate ice track divisions.'
  },
  {
    id: 'shader-dither-wave',
    title: 'Shaders.com — Dither Wave Retro Matrix',
    link: 'https://shaders.com/collection/dither-wave/07e4047a-b425-4674-a135-62b9a5943414',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'DitherWave',
    pattern: 'dither-wave',
    description: 'Ordered Bayer 8-bit dither gradients undulating in rhythmic sine sweeps.'
  },
  {
    id: 'shader-drifting-contours',
    title: 'Shaders.com — Drifting Topo Contours',
    link: 'https://shaders.com/collection/drifting-contours/b6ba4cba-229f-4f26-8638-545fe75de6a4',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'DriftingContours',
    pattern: 'drifting-contours',
    description: 'Fluid elevation ribbons gently warping like deep oceanic strata.'
  },
  {
    id: 'shader-heatwave',
    title: 'Shaders.com — Heatwave Thermal Mirage',
    link: 'https://shaders.com/collection/heatwave/215ebb4a-32ef-4f08-8ebd-874d23bc5f4b',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'HeatwaveShader',
    pattern: 'heatwave-shader',
    description: 'Convective heat shimmer distorting background grids with liquid optical refraction.'
  },
  {
    id: 'shader-soft-register',
    title: 'Shaders.com — Soft Register Print Bleed',
    link: 'https://shaders.com/collection/soft-register/88eaca3d-065a-4c8d-a379-0bd859a9ad2b',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'SoftRegister',
    pattern: 'soft-register',
    description: 'Subtle CMYK print plate misalignment with organic optical halation and ink bleed.'
  },
  {
    id: 'shader-geogrid',
    title: 'Shaders.com — Geogrid Survey Lattice',
    link: 'https://shaders.com/collection/geogrid/9ab7f8be-b7ae-4260-8688-7b8770074fdf',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'GeogridShader',
    pattern: 'geogrid-shader',
    description: 'Isometric polygonal geodetic mesh with glowing vertex elevations.'
  },
  {
    id: 'shader-heated-shapes-1',
    title: 'Shaders.com — Heated Shapes Infrared I',
    link: 'https://shaders.com/collection/heated-shapes/3f3e121c-33e3-4b03-b80c-67d4f526a886',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'HeatedShapes',
    pattern: 'heated-shapes-1',
    description: 'False-color thermal radiometry contours highlighting thermal energy gradients.'
  },
  {
    id: 'shader-heated-shapes-2',
    title: 'Shaders.com — Heated Shapes Plasma II',
    link: 'https://shaders.com/collection/heated-shapes/fe5006bb-7f9d-4f7d-9ca5-fc9e592e9d05',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'HeatedShapes',
    pattern: 'heated-shapes-2',
    description: 'High-temperature plasma isotherms radiating intense molten chromatic blooms.'
  },
  {
    id: 'shader-heated-shapes-3',
    title: 'Shaders.com — Heated Shapes Thermograph III',
    link: 'https://shaders.com/collection/heated-shapes/f95245a8-ace0-49ae-b95a-b9e0fc68c1ab',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'HeatedShapes',
    pattern: 'heated-shapes-3',
    description: 'Geometric polygon tessellations shaded with kinetic thermal convection.'
  },
  {
    id: 'shader-heated-shapes-4',
    title: 'Shaders.com — Heated Shapes Kinetic IV',
    link: 'https://shaders.com/collection/heated-shapes/51ebc1c3-2a00-4a7e-84ce-bca7099614e0',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'HeatedShapes',
    pattern: 'heated-shapes-4',
    description: 'Thermodynamic heat envelope polygons pulsating in response to acoustic energy.'
  },
  {
    id: 'shader-magnified-pixels',
    title: 'Shaders.com — Magnified Subpixel Raster',
    link: 'https://shaders.com/collection/magnified-pixels/1ffb7c12-c305-4346-b80a-780628e6b286',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'MagnifiedPixels',
    pattern: 'magnified-pixels',
    description: 'High-magnification CRT aperture grille triad subpixels glowing with electron beam excitation.'
  },
  {
    id: 'shader-vibrant-waves-2',
    title: 'Shaders.com — Vibrant Waves Harmonic II',
    link: 'https://shaders.com/collection/vibrant-waves/1e632306-ecf2-484b-81b9-3d46d2ac2b1f',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'VibrantWaves',
    pattern: 'vibrant-waves-2',
    description: 'Complex multi-tone standing wave harmonics with saturated chromatic ridges.'
  },
  {
    id: 'shader-outshine',
    title: 'Shaders.com — Outshine Solar Corona',
    link: 'https://shaders.com/collection/outshine/5fee175f-3b41-4dda-a692-756d928ea902',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'OutshineShader',
    pattern: 'outshine-shader',
    description: 'Radiant coronal mass flare with blinding center and sweeping incandescent streamers.'
  },
  {
    id: 'shader-undertones-1',
    title: 'Shaders.com — Undertones Deep Obsidian I',
    link: 'https://shaders.com/collection/undertones/71aa34a1-e7db-4a5d-a6e8-03cec2d71771',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'UndertonesShader',
    pattern: 'undertones-shader-1',
    description: 'Subterranean dark basalt tones with low-key ambient luminescence.'
  },
  {
    id: 'shader-undertones-2',
    title: 'Shaders.com — Undertones Amber Basalt II',
    link: 'https://shaders.com/collection/undertones/6a65f88c-c0d2-4eb2-99a1-80ddaeaa99c7',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'UndertonesShader',
    pattern: 'undertones-shader-2',
    description: 'Warm magma undertones radiating subtly from underneath dark mineral crust.'
  },
  {
    id: 'shader-undertones-3',
    title: 'Shaders.com — Undertones Indigo Slate III',
    link: 'https://shaders.com/collection/undertones/dd87173f-d236-4b7e-8cf6-605126302ccb',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'UndertonesShader',
    pattern: 'undertones-shader-3',
    description: 'Deep midnight indigo undertones beneath fine matte anodized surface layer.'
  },
  {
    id: 'shader-undertones-4',
    title: 'Shaders.com — Undertones Emerald Moss IV',
    link: 'https://shaders.com/collection/undertones/506bebb9-0936-4ed5-b54c-ece840020325',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'UndertonesShader',
    pattern: 'undertones-shader-4',
    description: 'Rich deep-forest moss undertones with glowing mineral veining.'
  },
  {
    id: 'shader-color-eclipse',
    title: 'Shaders.com — Color Eclipse Diamond Corona',
    link: 'https://shaders.com/collection/color-eclipse/f4573441-4eb5-4535-8996-3595494748ab',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'ColorEclipse',
    pattern: 'color-eclipse',
    description: 'Total solar eclipse rim illumination with chromatic diamond ring diffraction spike.'
  },
  {
    id: 'shader-radial-overlap-2',
    title: 'Shaders.com — Radial Overlap Chromatic II',
    link: 'https://shaders.com/collection/radial-overlap/410b517f-358a-4838-8551-21c1774f6cf3',
    badge: 'shaders.com',
    category: 'Shaders.com Visual FX',
    model: 'RadialOverlap',
    pattern: 'radial-overlap-2',
    description: 'Complex multi-ring radial interference creating intricate geometric rosette lattices.'
  }
];

const VARIANT_NAMES = [
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon',
  'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
  'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron',
  'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon'
];

const COLOR_THEMES = [
  { p: '#0D1117', s: '#05070A', a: '#00F0FF', c: '#E2F7FF', l: '#FF007F' }, // Cyber Cyan
  { p: '#141416', s: '#0A0A0C', a: '#D4AF37', c: '#FAF5EB', l: '#E05A47' }, // Kyoto Gold
  { p: '#161922', s: '#0C0E14', a: '#E8A13A', c: '#E0E6ED', l: '#E63946' }, // Amber Anodized
  { p: '#1A1522', s: '#0D0914', a: '#B347FF', c: '#EDE9FE', l: '#00FF9D' }, // Violet Plasma
  { p: '#151E1A', s: '#0A110D', a: '#00FF66', c: '#E2E8DF', l: '#FFCC00' }, // Phosphor P1
  { p: '#1F1714', s: '#100B09', a: '#E07A5F', c: '#F5EBE6', l: '#FF2BD6' }, // Terracotta Warmth
  { p: '#13191F', s: '#090D12', a: '#38BDF8', c: '#E0F2FE', l: '#F43F5E' }, // Sky Blue
  { p: '#20161C', s: '#12090F', a: '#FF2BD6', c: '#FCE7F3', l: '#00F0FF' }, // Neon Magenta
  { p: '#181C16', s: '#0B0F09', a: '#4EAE8D', c: '#E2E8DF', l: '#E8A13A' }, // Celadon Sage
  { p: '#191D24', s: '#101318', a: '#06B6D4', c: '#CBD5E1', l: '#F59E0B' }, // Industrial Steel
  { p: '#0A1813', s: '#050E0B', a: '#10B981', c: '#D1FAE5', l: '#34D399' }, // Emerald Laser
  { p: '#221115', s: '#12080A', a: '#F43F5E', c: '#FFE4E6', l: '#FB7185' }, // Ruby Matrix
  { p: '#241B0E', s: '#140E06', a: '#F59E0B', c: '#FEF3C7', l: '#FBBF24' }, // Solar Flare
  { p: '#111215', s: '#08080A', a: '#94A3B8', c: '#F8FAFC', l: '#38BDF8' }, // Deep Obsidian
  { p: '#0E1A24', s: '#070F16', a: '#38BDF8', c: '#E0F2FE', l: '#0284C7' }, // Arctic Ice
  { p: '#11162B', s: '#080C1A', a: '#6366F1', c: '#E0E7FF', l: '#818CF8' }, // Cobalt Horizon
  { p: '#23141C', s: '#13080F', a: '#EC4899', c: '#FCE7F3', l: '#F472B6' }, // Quartz Rose
  { p: '#241610', s: '#130A07', a: '#EA580C', c: '#FFEDD5', l: '#FB923C' }, // Copper Forge
  { p: '#141E0D', s: '#0A1106', a: '#84CC16', c: '#ECFCCB', l: '#A3E635' }, // Electric Lime
  { p: '#1B1E22', s: '#0E1012', a: '#E2E8F0', c: '#FFFFFF', l: '#94A3B8' }  // Titanium Smoke
];

// Generate exactly 1,000 new texture archetypes (300 original + 700 more)
export const NEW_1000_TEXTURE_ARCHETYPES: TextureArchetype[] = Array.from({ length: 1000 }, (_, i) => {
  const id = 3001 + i;
  const refIndex = Math.floor(i / VARIANT_NAMES.length) % NEW_INSPIRATION_LINKS.length;
  const variantIndex = i % VARIANT_NAMES.length;
  const ref = NEW_INSPIRATION_LINKS[refIndex];
  const pal = COLOR_THEMES[i % COLOR_THEMES.length];
  const variantTag = VARIANT_NAMES[variantIndex];

  const roughness = parseFloat((0.15 + ((i * 31) % 70) / 100).toFixed(2));
  const contrast = parseFloat((0.85 + ((i * 47) % 95) / 100).toFixed(2));
  const grainDensity = parseFloat((0.18 + ((i * 59) % 68) / 100).toFixed(2));
  const noiseOctaves = 2 + (i % 6);
  const liquidAngle = (i * 37) % 360;
  const vignette = parseFloat((0.15 + ((i * 23) % 65) / 100).toFixed(2));

  return {
    id,
    name: `${ref.title.split('—')[1]?.trim() || ref.title} ${variantTag} #${String(id).padStart(4, '0')}`,
    category: ref.category,
    patternType: `${ref.pattern}-${variantTag.toLowerCase()}`,
    baseModel: ref.model,
    primaryTint: pal.p,
    secondaryTint: pal.s,
    accentTint: pal.a,
    roughness,
    contrast,
    grainDensity,
    noiseOctaves,
    blendMode: (['overlay', 'soft-light', 'screen', 'multiply'] as const)[i % 4],
    vignette,
    liquidAngle,
    seed: (i * 2026 + 777) % 99999,
    description: `${ref.description} Handcrafted variant ${variantTag} with calibrated optical density and spectral response.`,
    inspirationTitle: ref.title,
    inspirationLink: ref.link
  };
});

export const NEW_300_TEXTURE_ARCHETYPES = NEW_1000_TEXTURE_ARCHETYPES;

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

// Generate exactly 1,000 corresponding Knob presets
export const NEW_1000_KNOB_PRESETS: KnobArchitectPreset[] = Array.from({ length: 1000 }, (_, i) => {
  const id = 3001 + i;
  const tex = NEW_1000_TEXTURE_ARCHETYPES[i];
  const style = KNOB_STYLES[i % KNOB_STYLES.length];
  const pal = COLOR_THEMES[i % COLOR_THEMES.length];

  return {
    id,
    name: `${tex.name.split('#')[0].trim()} Knob #${String(id).padStart(4, '0')}`,
    category: tex.category,
    style,
    bodyColor: pal.c,
    accentColor: pal.a,
    pointerColor: pal.l,
    bezelWidth: parseFloat((1.5 + (i % 30) / 10).toFixed(1)),
    tickCount: style === 'MinimalDot' ? 0 : 7 + (i % 21),
    tickSpread: 240 + (i % 60),
    pointerThickness: parseFloat((2.0 + (i % 25) / 10).toFixed(1)),
    pointerLengthRatio: parseFloat((0.6 + (i % 30) / 100).toFixed(2)),
    centerCapRatio: parseFloat((0.25 + (i % 25) / 100).toFixed(2)),
    glowIntensity: parseFloat((0.4 + (i % 55) / 100).toFixed(2)),
    shadowDepth: parseFloat((3.0 + (i % 10)).toFixed(1)),
    metalRoughness: parseFloat((0.2 + (i % 60) / 100).toFixed(2)),
    description: `Precision rotary dial styled for ${tex.name} with ${style} geometry and calibrated acoustics.`
  };
});

export const NEW_300_KNOB_PRESETS = NEW_1000_KNOB_PRESETS;

// Generate exactly 1,000 corresponding Slider presets
export const NEW_1000_SLIDER_PRESETS: SliderArchitectPreset[] = Array.from({ length: 1000 }, (_, i) => {
  const id = 3001 + i;
  const tex = NEW_1000_TEXTURE_ARCHETYPES[i];
  const pal = COLOR_THEMES[i % COLOR_THEMES.length];

  return {
    id,
    name: `${tex.name.split('#')[0].trim()} Slider #${String(id).padStart(4, '0')}`,
    category: tex.category,
    trackStyle: (['cyber-glow', 'recessed-groove', 'liquid-tube', 'dual-rail'] as const)[i % 4],
    thumbStyle: (['glowing-pill', 'brushed-metal', 'diamond-wedge', 'reticle-cross'] as const)[i % 4],
    trackHeight: 5 + (i % 8),
    thumbWidth: 16 + (i % 16),
    thumbHeight: 14 + (i % 14),
    cornerRadius: 2 + (i % 6),
    showCenterDetent: i % 2 === 0,
    tickMarksCount: 7 + (i % 15),
    trackColor: pal.s,
    thumbColor: pal.c,
    accentColor: pal.a,
    glowIntensity: parseFloat((0.35 + (i % 60) / 100).toFixed(2)),
    description: `Precision throw fader matching ${tex.name} with custom track damping.`
  };
});

export const NEW_300_SLIDER_PRESETS = NEW_1000_SLIDER_PRESETS;

// Generate exactly 1,000 corresponding LFO presets
export const NEW_1000_LFO_PRESETS: LfoVisualPreset[] = Array.from({ length: 1000 }, (_, i) => {
  const id = 3001 + i;
  const tex = NEW_1000_TEXTURE_ARCHETYPES[i];
  const pal = COLOR_THEMES[i % COLOR_THEMES.length];

  return {
    id,
    name: `${tex.name.split('#')[0].trim()} LFO #${String(id).padStart(4, '0')}`,
    category: tex.category,
    phosphorColor: pal.a,
    beamGlowColor: `${pal.a}88`,
    gridColor: `${pal.a}25`,
    gridStyle: ([
      'polar-radial',
      'fine-mesh',
      'reticle-hud',
      'dot-matrix',
      'isometric',
      'harmonic-rings',
      'constellation'
    ] as const)[i % 7],
    waveThickness: parseFloat((1.5 + (i % 25) / 10).toFixed(1)),
    glowRadius: 6 + (i % 16),
    scanlineIntensity: parseFloat((0.2 + (i % 50) / 100).toFixed(2)),
    persistenceTrail: parseFloat((0.25 + (i % 55) / 100).toFixed(2)),
    fillGradient: i % 2 === 0,
    harmonics: 1 + (i % 5),
    description: `Vector beam CRT simulation with electron bloom tuned to ${tex.name}.`
  };
});

export const NEW_300_LFO_PRESETS = NEW_1000_LFO_PRESETS;

// Generate exactly 1,000 full Skin presets
export const NEW_1000_SKINS: SkinDefinition[] = Array.from({ length: 1000 }, (_, i) => {
  const id = 3001 + i;
  const tex = NEW_1000_TEXTURE_ARCHETYPES[i];
  const knob = NEW_1000_KNOB_PRESETS[i];
  const slider = NEW_1000_SLIDER_PRESETS[i];
  const lfo = NEW_1000_LFO_PRESETS[i];

  return {
    id,
    name: tex.name,
    category: tex.category as PresetCategory,
    panelDark: tex.primaryTint,
    panelDarker: tex.secondaryTint,
    cream: knob.bodyColor,
    amber: tex.accentTint,
    ledRed: knob.pointerColor,
    ledOff: '#1A212A',
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

export const NEW_300_SKINS = NEW_1000_SKINS;

// Generate exactly 1,000 Design Themes for Design Lab
export const NEW_1000_DESIGN_THEMES: DesignTheme[] = Array.from({ length: 1000 }, (_, i) => {
  const id = `new_theme_${3001 + i}`;
  const skin = NEW_1000_SKINS[i];
  const tex = NEW_1000_TEXTURE_ARCHETYPES[i];
  const knob = NEW_1000_KNOB_PRESETS[i];
  const slider = NEW_1000_SLIDER_PRESETS[i];
  const lfo = NEW_1000_LFO_PRESETS[i];

  return {
    id,
    name: skin.name,
    category: tex.category,
    mood: `${tex.category} — ${tex.inspirationTitle || 'Procedural'}`,
    accentColor: tex.accentTint,
    description: `Complete hardware rig aesthetic built from ${tex.inspirationTitle}. Features ${tex.baseModel} panel with ${knob.style} rotaries.`,
    tags: ['NewPresets', 'ShaderSeries', tex.category, tex.baseModel, knob.style],
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

export const NEW_300_DESIGN_THEMES = NEW_1000_DESIGN_THEMES;
