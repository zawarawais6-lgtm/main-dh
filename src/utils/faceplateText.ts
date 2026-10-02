import React from 'react';
import { TextLabelConfig, FaceplateEffect, LabelTypeface } from '../types/controlCreator';

export function getFaceplateStyle(
  config?: Partial<TextLabelConfig>,
  defaultColor: string = '#E2E8F0'
): React.CSSProperties {
  const effect: FaceplateEffect = config?.effect || 'plain';
  const color = config?.color || defaultColor;
  const glow = config?.glowColor || color;
  const letterSpacing = config?.letterSpacing !== undefined ? `${config.letterSpacing}em` : undefined;
  const fontSize = config?.fontSize ? `${config.fontSize}px` : undefined;

  const baseStyle: React.CSSProperties = {
    color,
    fontSize,
    letterSpacing,
    textTransform: config?.uppercase ? 'uppercase' : undefined,
    transition: 'all 0.15s ease'
  };

  switch (effect) {
    case 'engraved':
      return {
        ...baseStyle,
        color: `${color}D0`,
        textShadow: `0px -1px 0px rgba(0, 0, 0, 0.85), 0px 1px 0px rgba(255, 255, 255, 0.18)`
      };
    case 'embossed':
      return {
        ...baseStyle,
        color: `${color}`,
        textShadow: `0px 1px 1px rgba(0, 0, 0, 0.9), 0px -1px 0.5px rgba(255, 255, 255, 0.35)`
      };
    case 'silkscreen':
      return {
        ...baseStyle,
        color,
        fontWeight: 700,
        filter: 'contrast(120%)'
      };
    case 'backlitLed':
      return {
        ...baseStyle,
        color: '#FFFFFF',
        textShadow: `0 0 4px ${glow}, 0 0 10px ${glow}, 0 0 18px ${glow}80`
      };
    case 'milledMetal':
      return {
        ...baseStyle,
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #A0AAB8 50%, #4A5568 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))'
      };
    case 'plain':
    default:
      return baseStyle;
  }
}

export function getTypefaceClass(typeface?: LabelTypeface): string {
  switch (typeface) {
    case 'mono':
      return 'font-mono tabular-nums';
    case 'display':
      return 'font-extrabold tracking-wider';
    case 'serif':
      return 'font-serif tracking-normal';
    case 'stencil':
      return 'font-mono uppercase tracking-widest font-black';
    case 'sans':
    default:
      return 'font-sans font-semibold';
  }
}
