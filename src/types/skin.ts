export type KnobStyle =
  | 'ChunkyPointer'
  | 'ArcIndicator'
  | 'BoldBlock'
  | 'CyberRing'
  | 'LiquidGauge'
  | 'SteppedWedge'
  | 'GroovedCap'
  | 'NeonRim'
  | 'MinimalDot'
  | 'VintageFluted'
  | 'OrbitalEncoder'
  | 'PrismRotor'
  | 'ConcentricConsole';

export type PanelTexture =
  | 'GrittyTexture'
  | 'FineMineralGrit'
  | 'LiquidGrainGradient'
  | 'DeepLayers'
  | 'DarkGrainyGrit'
  | 'AeroShards'
  | 'GhostFibers'
  | 'WebThreads'
  | 'LaserScanner'
  | 'PrismSpectrum'
  | 'DarkVeil'
  | 'LightPillar'
  | 'SilkFabric'
  | 'FloatingLines'
  | 'ColorBends'
  | 'GradientBlinds'
  | 'AceternityLamp'
  | 'GlowingPerimeter'
  | 'SpectralRibbon'
  | 'CoralGloom'
  | 'MeshGradient'
  | 'RedInBlack'
  | 'BlueMeshy'
  | 'BackgroundCircles'
  | 'DimensionalField'
  | 'FlowField'
  | 'WavyRipple'
  | 'ReflectShader'
  | 'WireThroat'
  | 'BeyondHorizon'
  | 'HalftoneBloom'
  | 'PrismFilm'
  | 'DitherBurn'
  | 'HalftoneDotPattern'
  | 'BrushedMetal'
  | 'GridOverlay'
  | 'CyberCircuit'
  | 'SolarizedFilm'
  | 'FlatMatte'
  | 'CarbonFiber'
  | 'MarbleStone'
  | 'HolographicFoil'
  | 'CRTPhosphor'
  | 'SteampunkBrass'
  // Newly Added Verified Reference Models
  | 'TexturelabsPhotocopy'
  | 'TexturelabsFilmDust'
  | 'TexturelabsBrushedAlloy'
  | 'TexturelabsOxidizedPatina'
  | 'AnalogMagneticTape'
  | 'AnalogCrtPhosphor'
  | 'AnalogRisographStipple'
  | 'FigmaNoiseMesh'
  | 'FigmaHoloFoil'
  | 'UnsplashWeatheredPlaster'
  | 'UnsplashSlateStone'
  | 'AllisonPerryMixedMedia'
  | 'RetroVacuumTubeGlow'
  | 'VinylMicrogroove'
  | 'PexelsPrismDispersion'
  | 'GettyVintageFaceplate'
  // 300 New Shader, Algorithmic & Shape Models
  | 'ShaderTopography'
  | 'ExkeiLiquidWarp'
  | 'GgyzkvKineticMesh'
  | 'FlowPoles'
  | 'FlowLines'
  | 'FlowDots'
  | 'SpiralMorph'
  | 'BrockmannArcs'
  | 'WavyLinesConverging'
  | 'ChaosCircles'
  | 'ConcentricNoiseRings'
  | 'HalftoneSphere'
  | 'LissajousField'
  | 'ModularCircle'
  | 'PhyllotaxisBloom'
  | 'NoiseLandscape'
  | 'NoiseCircle'
  | 'RadialSpokes'
  | 'PolarMesh'
  | 'ResonanceField'
  | 'SpiralDotField'
  | 'FffuelAbstract'
  | 'FffuelTexture'
  | 'ShiftedSwirls'
  | 'VibrantWaves'
  | 'SwirlingGradient'
  | 'RadialOverlap'
  | 'HolographicWaves'
  | 'FringeShader'
  | 'TracedPaths'
  | 'EmberDrift'
  | 'FloatingGlass'
  | 'IsotopesShader'
  | 'LostRays'
  | 'MagneticShimmer'
  | 'SynthesisShader'
  | 'SpectralBloom'
  | 'SaturnRings'
  | 'DitherWave'
  | 'DriftingContours'
  | 'HeatwaveShader'
  | 'SoftRegister'
  | 'GeogridShader'
  | 'HeatedShapes'
  | 'MagnifiedPixels'
  | 'OutshineShader'
  | 'UndertonesShader'
  | 'ColorEclipse'
  // Colir Atmospheric Reference Models
  | 'ColirSolarFilmBurn'
  | 'ColirAuroraCosmicDrift'
  | 'ColirMoltenMagmaSwirl';

export type PresetCategory =
  | 'Wada Sanzo Classic'
  | 'Liquid Gritty'
  | 'Cyber HUD'
  | 'Deep Layers'
  | 'Futuristic Neon'
  | 'Dark Grit'
  | 'Pop Halftone'
  | 'Studio Minimal'
  | 'Vintage Brass'
  | 'Holographic Vapor'
  | 'Analog & Texturelabs'
  | 'Figma Modern'
  | 'Mixed Media & Print'
  | 'Shader Topography & Meshes'
  | 'Book of Shapes Algorithmic'
  | 'Shaders.com Visual FX'
  | 'Fffuel Generative Vectors'
  | 'Kinetic Chromatic Waveforms'
  | 'Optical Film Burn & Light Leaks'
  | 'Aurora Borealis & Cosmic Dust'
  | 'Molten Magma & Viscous Marbling';

export type TextureArchetypeCategory =
  | 'React Bits Dynamic'
  | 'Aceternity & Luminescence'
  | '21st.dev Meshes & Gradients'
  | 'OriginKit Shaders & Horizons'
  | 'Flow Fields & Ripples'
  | 'Gritty Dust & Grain'
  | 'Liquid Grain Flow'
  | 'Deep Topographic Layers'
  | 'Dark Obsidian Grit'
  | 'Texturelabs Film & Grunge'
  | 'Analog Tape & CRT Hardware'
  | 'Analog Grain & Darkroom'
  | 'Risograph & Print Media'
  | 'Figma Modern Noise & Foil'
  | 'Architectural & Stone Surfaces'
  | 'Allison Perry Mixed Media'
  | 'Halftone Printing Matrix'
  | 'Brushed Aerospace Alloys'
  | 'Cyberpunk Grid & Circuit'
  | 'Solarized Film & Vintage'
  | 'Carbon & Composite Weave'
  | 'Holographic & Iridescent'
  | 'Shader Topography & Meshes'
  | 'Book of Shapes Algorithmic'
  | 'Shaders.com Visual FX'
  | 'Fffuel Generative Vectors'
  | 'Kinetic Chromatic Waveforms'
  | 'Optical Film Burn & Light Leaks'
  | 'Aurora Borealis & Cosmic Dust'
  | 'Molten Magma & Viscous Marbling';

export type SliderTrackStyle =
  | 'recessed-groove'
  | 'cyber-glow'
  | 'liquid-tube'
  | 'vintage-slot'
  | 'stepped-ladder'
  | 'dual-rail'
  | 'minimal-line';

export type SliderThumbStyle =
  | 'brushed-metal'
  | 'glowing-pill'
  | 'reticle-cross'
  | 'vintage-bakelite'
  | 'diamond-wedge'
  | 'knurled-slug'
  | 'laser-dot'
  | 'flat-tab';

export type FrameworkTarget = 'cmajor' | 'yup' | 'juce';

export interface TextureArchetype {
  id: number;
  name: string;
  category: TextureArchetypeCategory;
  patternType: string;
  baseModel: PanelTexture;
  primaryTint: string;
  secondaryTint: string;
  accentTint: string;
  roughness: number;
  contrast: number;
  grainDensity: number;
  noiseOctaves: number;
  blendMode: 'overlay' | 'multiply' | 'screen' | 'soft-light' | 'color-dodge';
  vignette: number;
  liquidAngle: number;
  seed: number;
  description: string;
  inspirationLink?: string;
  inspirationTitle?: string;
}

export interface KnobArchitectPreset {
  id: number;
  name: string;
  category: string;
  style: KnobStyle;
  bodyColor: string;
  accentColor: string;
  pointerColor: string;
  bezelWidth: number;
  tickCount: number;
  tickSpread: number;
  pointerThickness: number;
  pointerLengthRatio: number;
  centerCapRatio: number;
  glowIntensity: number;
  shadowDepth: number;
  metalRoughness: number;
  capRadius?: number;
  description: string;
}

export interface SliderArchitectPreset {
  id: number;
  name: string;
  category: string;
  trackStyle: SliderTrackStyle;
  thumbStyle: SliderThumbStyle;
  trackHeight: number;
  thumbWidth: number;
  thumbHeight: number;
  cornerRadius: number;
  showCenterDetent: boolean;
  tickMarksCount: number;
  trackColor: string;
  thumbColor: string;
  accentColor: string;
  glowIntensity: number;
  description: string;
}

export interface LfoVisualPreset {
  id: number;
  name: string;
  category: string;
  phosphorColor: string;
  beamGlowColor: string;
  gridColor: string;
  gridStyle:
    | 'fine-mesh'
    | 'crosshair'
    | 'polar-radial'
    | 'dot-matrix'
    | 'logarithmic'
    | 'reticle-hud'
    | 'isometric'
    | 'harmonic-rings'
    | 'constellation';
  waveThickness: number;
  glowRadius: number;
  scanlineIntensity: number;
  persistenceTrail: number;
  fillGradient: boolean;
  harmonics: number;
  description: string;
}

export interface SkinDefinition {
  id: number;
  name: string;
  category: PresetCategory;
  panelDark: string;
  panelDarker: string;
  panelLight?: string;
  cream: string;
  amber: string;
  ledRed: string;
  ledOff: string;
  knobStyle: KnobStyle;
  panelTexture: PanelTexture;
  decorativeDots: boolean;

  // Custom text colors
  textColor?: string;
  headerTextColor?: string;
  valueTextColor?: string;

  // Knob custom colors
  knobBodyColor?: string;
  knobAccentColor?: string;
  knobPointerColor?: string;
  knobGlowEnabled?: boolean;
  glowIntensity?: number;

  // Slider custom colors
  sliderTrackColor?: string;
  sliderThumbColor?: string;
  sliderAccentColor?: string;
  secondaryAccent?: string;

  // Pattern & procedural texture parameters
  patternType?: string;
  textureRoughness?: number;
  textureContrast?: number;
  grainDensity?: number;
  noiseOctaves?: number;
  blendMode?: string;
  vignetteStrength?: number;
  liquidFlowAngle?: number;

  // Knob architecture geometry parameters
  bezelWidth?: number;
  tickCount?: number;
  tickSpread?: number;
  pointerThickness?: number;
  pointerLengthRatio?: number;
  centerCapRatio?: number;
  shadowDepth?: number;
  metalRoughness?: number;

  // Associated presets
  textureArchetype?: TextureArchetype;
  knobPreset?: KnobArchitectPreset;
  sliderPreset?: SliderArchitectPreset;
  lfoPreset?: LfoVisualPreset;
}

export interface UiCustomizationState {
  // Knob customization
  knobStyleOverride?: KnobStyle;
  knobSize: number;
  knobBodyColor: string;
  knobAccentColor: string;
  knobPointerColor: string;
  knobGlowEnabled: boolean;
  knobGlowIntensity: number;
  knobHorizontalSpacing: number;
  knobVerticalOffset: number;

  // Text color customization
  textColor: string;
  headerTextColor: string;
  valueTextColor: string;

  // Slider customization
  sliderThumbStyleOverride?: SliderThumbStyle;
  sliderTrackStyleOverride?: SliderTrackStyle;
  sliderTrackHeight: number;
  sliderThumbWidth: number;
  sliderThumbHeight: number;
  sliderTrackColor: string;
  sliderThumbColor: string;
  sliderAccentColor: string;
  sliderGlowIntensity: number;
  sliderVerticalOffset: number;

  // Global layout
  panelBezelRadius: number;
  accentGlowSpread: number;
}

export interface DesignTheme {
  id: string;
  name: string;
  category: string;
  mood: string;
  accentColor: string;
  description: string;
  tags: string[];
  skin: Partial<SkinDefinition> & {
    panelDark: string;
    panelDarker: string;
    cream?: string;
    amber?: string;
    ledRed?: string;
    ledOff?: string;
    id?: number;
  };
  texture: TextureArchetype;
  knob: KnobArchitectPreset;
  slider: SliderArchitectPreset;
  lfo: LfoVisualPreset;
  customization: Partial<UiCustomizationState>;
}
