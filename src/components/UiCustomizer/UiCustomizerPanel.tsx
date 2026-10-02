import React from 'react';
import { SkinDefinition, UiCustomizationState } from '../../types/skin';

export const defaultUiCustomization = (skin?: SkinDefinition): UiCustomizationState => ({
  knobStyleOverride: skin?.knobPreset?.style ?? skin?.knobStyle ?? 'ChunkyPointer',
  knobSize: 66,
  knobBodyColor: skin?.knobPreset?.bodyColor ?? skin?.knobBodyColor ?? skin?.cream ?? '#DCD6CD',
  knobAccentColor: skin?.knobPreset?.accentColor ?? skin?.knobAccentColor ?? skin?.amber ?? '#E5A93C',
  knobPointerColor: skin?.knobPreset?.pointerColor ?? skin?.knobPointerColor ?? skin?.ledRed ?? '#D94A38',
  knobGlowEnabled: skin?.knobGlowEnabled ?? true,
  knobGlowIntensity: skin?.glowIntensity ?? 0.5,
  knobHorizontalSpacing: 16,
  knobVerticalOffset: 0,

  textColor: skin?.textColor ?? skin?.cream ?? '#E6E1D8',
  headerTextColor: skin?.headerTextColor ?? skin?.amber ?? '#E5A93C',
  valueTextColor: skin?.valueTextColor ?? skin?.amber ?? '#E5A93C',

  sliderThumbStyleOverride: skin?.sliderPreset?.thumbStyle ?? 'brushed-metal',
  sliderTrackStyleOverride: skin?.sliderPreset?.trackStyle ?? 'recessed-groove',
  sliderTrackHeight: skin?.sliderPreset?.trackHeight ?? 140,
  sliderThumbWidth: skin?.sliderPreset?.thumbWidth ?? 36,
  sliderThumbHeight: skin?.sliderPreset?.thumbHeight ?? 18,
  sliderTrackColor: skin?.sliderPreset?.trackColor ?? skin?.panelDarker ?? '#141A20',
  sliderThumbColor: skin?.sliderPreset?.thumbColor ?? skin?.cream ?? '#DCD6CD',
  sliderAccentColor: skin?.sliderPreset?.accentColor ?? skin?.amber ?? '#E5A93C',
  sliderGlowIntensity: skin?.sliderPreset?.glowIntensity ?? 0.4,
  sliderVerticalOffset: 0,

  panelBezelRadius: 10,
  accentGlowSpread: 8
});

export const UiCustomizerPanel: React.FC<any> = () => {
  return null;
};
