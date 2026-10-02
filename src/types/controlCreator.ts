/**
 * Control Creator & Individual Customization Types
 * Corresponds to hardware control creator specs and faceplate styling
 */

export type FaceplateEffect =
  | 'plain'
  | 'engraved'
  | 'embossed'
  | 'silkscreen'
  | 'backlitLed'
  | 'milledMetal';

export type LabelTypeface = 'mono' | 'sans' | 'display' | 'serif' | 'stencil';

export interface TextLabelConfig {
  text: string;
  fontSize?: number; // in px
  typeface?: LabelTypeface;
  effect?: FaceplateEffect;
  color?: string;
  glowColor?: string;
  hidden?: boolean;
  letterSpacing?: number; // em
  uppercase?: boolean;
}

export type WheelGearStyle = 'None' | 'Notched' | 'Milled' | 'VintageTeeth' | 'Segmented';
export type WheelGearTexture = 'Glow' | 'Brushed' | 'Matte' | 'Glossy' | 'Metallic';
export type WheelPauseStep = 'InRuler' | 'Continuous' | 'Snap12' | 'Snap24';
export type WheelPointerStyle = 'BevelledLine' | 'CarvedLine' | 'NotchDot' | 'Needle' | 'Triangle';
export type WheelRailStyle = 'FlatGauge' | 'ArcRing' | 'Dots' | 'RadialNotches' | 'None';
export type WheelCapStyle = 'Bevelled' | 'Flat' | 'Convex' | 'Dome' | 'MilledRim';

export interface WheelCreatorConfig {
  // Gear
  gearStyle: WheelGearStyle;
  gearTexture: WheelGearTexture;
  gearColor: string;
  gearSize: number; // 0.5 - 1.5
  gearShadowSize: number; // 0 - 1

  // Dent
  dentCount: number; // 0 - 36
  dentGap: number; // -1.0 to 1.0
  dentSize: number; // 0.01 to 0.5

  // Fill
  fillColor: string;
  pressedColor: string;

  // Various
  pauseStep: WheelPauseStep;
  pointer: WheelPointerStyle;
  pointerDentSize: number; // 0 - 1

  // Rail
  railStyle: WheelRailStyle;
  railColor: string;
  rulerBigSteps: number;
  rulerSmallSteps: number;

  // Options
  pointerOnCap: boolean;
  reflection: boolean;
  fillRuler: boolean;
  snapRuler: boolean;
  fillRail: boolean;
  snapHandle: boolean;

  // Cap
  capStyle: WheelCapStyle;
  capColor: string;
  capSize: number; // 0.5 - 1.0
  capShadowSize: number; // 0 - 1
}

export type SliderHandleStyle = 'Classic' | 'FaderCap' | 'Knurled' | 'Slim' | 'ConsoleFader';
export type SliderPauseStep = 'Dot' | 'Continuous';
export type SliderPointerStyle = 'CarvedLine' | 'RaisedBar' | 'NotchLine';
export type SliderRulerStyle = 'RulerOut' | 'RulerIn' | 'Bilateral' | 'None';
export type SliderRailStyle = 'Line' | 'Slot' | 'Groove';

export interface SliderCreatorConfig {
  // Handle
  handleStyle: SliderHandleStyle;
  handleColor: string;
  handlePressedColor: string;
  cornerSize: number;
  cornerAspect: number;
  pinch: number;
  middle: number;
  handleSize: number;
  sizeAspect: number;
  border: number;

  // Fill
  fillColor: string;
  pressedColor: string;

  // Various
  pauseStep: SliderPauseStep;
  pointer: SliderPointerStyle;
  shadowSize: number;

  // Ruler
  rulerStyle: SliderRulerStyle;
  pan: number;

  // Options
  pointerOnCap: boolean;
  reflection: boolean;
  fillRuler: boolean;
  snapRuler: boolean;
  fillRail: boolean;
  snapHandle: boolean;

  // Rail
  railStyle: SliderRailStyle;
  railColor: string;
  railSize: number;
  pressedSize: number;
  outline: number;
}

export interface ControlCustomizationState {
  // Map of controlId -> custom override
  customKnobs: Record<string, Partial<WheelCreatorConfig>>;
  customSliders: Record<string, Partial<SliderCreatorConfig>>;
  // Map of `${pageId}:${elementId}` -> text customization
  customTexts: Record<string, Partial<TextLabelConfig>>;
}

export const DEFAULT_WHEEL_CONFIG: WheelCreatorConfig = {
  gearStyle: 'None',
  gearTexture: 'Glow',
  gearColor: '#3F484D',
  gearSize: 1.0,
  gearShadowSize: 0.86,
  dentCount: 10,
  dentGap: -0.54,
  dentSize: 0.03,
  fillColor: '#7D3986',
  pressedColor: '#ED94FF',
  pauseStep: 'InRuler',
  pointer: 'BevelledLine',
  pointerDentSize: 0.42,
  railStyle: 'FlatGauge',
  railColor: '#3F484D',
  rulerBigSteps: 0,
  rulerSmallSteps: 8,
  pointerOnCap: true,
  reflection: false,
  fillRuler: false,
  snapRuler: false,
  fillRail: false,
  snapHandle: false,
  capStyle: 'Bevelled',
  capColor: '#3F484D',
  capSize: 0.86,
  capShadowSize: 0.2
};

export const DEFAULT_SLIDER_CONFIG: SliderCreatorConfig = {
  handleStyle: 'Classic',
  handleColor: '#8B8E97',
  handlePressedColor: '#93969F',
  cornerSize: 0.0,
  cornerAspect: 1.0,
  pinch: 0.0,
  middle: 0.7,
  handleSize: 31,
  sizeAspect: 0.6,
  border: 0.0,
  fillColor: '#FFFFFF',
  pressedColor: '#FFFFFF',
  pauseStep: 'Dot',
  pointer: 'CarvedLine',
  shadowSize: 0.2,
  rulerStyle: 'RulerOut',
  pan: 0.0,
  pointerOnCap: false,
  reflection: false,
  fillRuler: false,
  snapRuler: true,
  fillRail: true,
  snapHandle: true,
  railStyle: 'Line',
  railColor: '#000000',
  railSize: 2,
  pressedSize: 2,
  outline: 1.0
};
