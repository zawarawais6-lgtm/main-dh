import React, { useState, useMemo } from 'react';
import {
  SkinDefinition,
  FrameworkTarget,
  SliderArchitectPreset,
  LfoVisualPreset,
  UiCustomizationState,
  TextureArchetype,
  KnobArchitectPreset
} from '../../types/skin';
import { exportTextureAsPng, exportTextureAsSvg } from '../TextureEngine/textureGenerator';
import { generateJuceSuite, hexToJuceColour } from '../../services/juceCodeGenerator';
import { exportJuceZipBundle } from '../../services/juceZipExporter';
import { Download, Copy, Check, FileCode, Layers, Code, Sparkles, Archive } from 'lucide-react';

interface CodeExporterProps {
  skin: SkinDefinition;
  knobPreset?: KnobArchitectPreset;
  textureArchetype?: TextureArchetype;
  sliderPreset?: SliderArchitectPreset;
  lfoVisualPreset?: LfoVisualPreset;
  customization?: UiCustomizationState;
}

function hexToYupColor(hex: string, alphaHex: string = 'ff'): string {
  const clean = hex.replace('#', '').toLowerCase();
  return `yup::Color::fromRgba (0x${clean}${alphaHex})`;
}

export const CodeExporter: React.FC<CodeExporterProps> = ({
  skin,
  knobPreset,
  textureArchetype,
  sliderPreset,
  lfoVisualPreset,
  customization
}) => {
  const [framework, setFramework] = useState<FrameworkTarget>('juce');
  const [juceTab, setJuceTab] = useState<'lookAndFeelH' | 'lookAndFeelCpp' | 'xmlLayout' | 'coloursH' | 'editorH' | 'editorCpp' | 'json'>('lookAndFeelH');
  const [cmajorTab, setCmajorTab] = useState<'viewJs' | 'cmajorPatch' | 'cmajorDsp' | 'json'>('viewJs');
  const [yupTab, setYupTab] = useState<'yupHeader' | 'yupDrawing' | 'sliderCode' | 'lfoCode' | 'cmake' | 'json'>('yupHeader');
  const [copied, setCopied] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);

  const handleExportZip = async () => {
    try {
      setIsExportingZip(true);
      await exportJuceZipBundle({
        skin,
        knobPreset,
        sliderPreset,
        textureArchetype,
        lfoVisualPreset,
        customization
      });
    } catch (err) {
      console.error('Failed to export JUCE ZIP', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  const activeTexture = textureArchetype ?? skin.textureArchetype;
  const activeKnob = knobPreset ?? skin.knobPreset;
  const activeSlider = sliderPreset ?? skin.sliderPreset;

  const juceSuite = useMemo(() => {
    return generateJuceSuite(skin, activeKnob, activeTexture, activeSlider, lfoVisualPreset, customization);
  }, [skin, activeKnob, activeTexture, activeSlider, lfoVisualPreset, customization]);

  const jsonSnippet = useMemo(() => {
    return JSON.stringify(
      {
        ...skin,
        textureArchetype: activeTexture ?? null,
        knobArchitecture: activeKnob ?? null,
        sliderArchitecture: activeSlider ?? null,
        lfoVisualizer: lfoVisualPreset ?? skin.lfoPreset ?? null,
        uiCustomization: customization ?? null
      },
      null,
      2
    );
  }, [skin, activeTexture, activeKnob, activeSlider, lfoVisualPreset, customization]);

  const cmajorViewJs = `// view.js — Amorph & Cmajor Audio Plugin Web GUI Runtime
export default function createPatchView(patchConnection) {
    const root = document.createElement('div');
    root.id = 'delayhost-vst-root';
    root.style.cssText = 'width: 100%; height: 100%; position: relative; background: ${skin.panelDark}; color: ${customization?.textColor ?? skin.cream}; font-family: sans-serif; user-select: none;';

    const canvas = document.createElement('canvas');
    canvas.width = 880;
    canvas.height = 720;
    canvas.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;';
    root.appendChild(canvas);

    let currentTheme = {
        name: "${skin.name}",
        panelDark: "${skin.panelDark}",
        panelDarker: "${skin.panelDarker}",
        cream: "${customization?.knobBodyColor ?? skin.cream}",
        amber: "${customization?.knobAccentColor ?? skin.amber}",
        ledRed: "${customization?.knobPointerColor ?? skin.ledRed}",
        textColor: "${customization?.textColor ?? skin.cream}",
        headerTextColor: "${customization?.headerTextColor ?? skin.amber}",
        knobStyle: "${customization?.knobStyleOverride ?? skin.knobStyle}",
        knobGlowEnabled: ${customization?.knobGlowEnabled ?? true},
        panelTexture: "${skin.panelTexture}",
        patternType: "${skin.patternType ?? 'cyber-pcb-traces'}"
    };

    return root;
}
`;

  const yupSkinHeader = `// YupSkin.hpp — Generated for kunitoki/yup modern C++20 audio framework
#pragma once
#include <yup_gui/yup_gui.h>
#include <yup_graphics/yup_graphics.h>
#include <string_view>

namespace DelayHost
{
    struct YupSkinDefinition
    {
        std::string_view name;
        yup::Color panelDark;
        yup::Color panelDarker;
        yup::Color cream;
        yup::Color amber;
        yup::Color ledRed;
        yup::Color ledOff;
        yup::Color textColor;
        yup::Color headerTextColor;
        bool knobGlowEnabled = ${customization?.knobGlowEnabled ?? true};
        float knobSize = ${(customization?.knobSize ?? 68).toFixed(1)}f;
    };

    inline constexpr YupSkinDefinition CURRENT_ACTIVE_SKIN = {
        .name = "${skin.name}",
        .panelDark = ${hexToYupColor(activeTexture?.primaryTint ?? skin.panelDark)},
        .panelDarker = ${hexToYupColor(activeTexture?.secondaryTint ?? skin.panelDarker)},
        .cream = ${hexToYupColor(customization?.knobBodyColor ?? activeKnob?.bodyColor ?? skin.cream)},
        .amber = ${hexToYupColor(customization?.knobAccentColor ?? activeTexture?.accentTint ?? skin.amber)},
        .ledRed = ${hexToYupColor(customization?.knobPointerColor ?? activeKnob?.pointerColor ?? skin.ledRed)},
        .ledOff = ${hexToYupColor(skin.ledOff)},
        .textColor = ${hexToYupColor(customization?.textColor ?? skin.cream)},
        .headerTextColor = ${hexToYupColor(customization?.headerTextColor ?? skin.amber)}
    };
}
`;

  const getActiveCode = (): string => {
    if (framework === 'juce') {
      switch (juceTab) {
        case 'lookAndFeelH':
          return juceSuite.headerCode;
        case 'lookAndFeelCpp':
          return juceSuite.cppCode;
        case 'xmlLayout':
          return juceSuite.xmlLayout;
        case 'coloursH':
          return juceSuite.colourConstants;
        case 'editorH':
          return juceSuite.editorHeader;
        case 'editorCpp':
          return juceSuite.editorCpp;
        case 'json':
          return jsonSnippet;
      }
    } else if (framework === 'cmajor') {
      switch (cmajorTab) {
        case 'viewJs':
          return cmajorViewJs;
        case 'cmajorPatch':
          return '{\n  "CmajorVersion": 1,\n  "name": "DelayHost",\n  "description": "Stereo Tape Delay DSP & GUI"\n}';
        case 'cmajorDsp':
          return `// DelayHost.cmajor — DSP Audio Processor Graph
graph DelayHost [[ main ]]
{
    input stream float<2> audioIn;
    output stream float<2> audioOut;

    input event float delayTimeLeft   [[ name: "Time Left", min: 1.0, max: 2000.0, init: 375.0, unit: "ms" ]];
    input event float delayTimeRight  [[ name: "Time Right", min: 1.0, max: 2000.0, init: 500.0, unit: "ms" ]];
    input event float feedback        [[ name: "Feedback", min: 0.0, max: 1.15, init: 0.45 ]];
    input event float mix             [[ name: "Dry/Wet", min: 0.0, max: 1.0, init: 0.35 ]];

    node delayL = std::delays::Delay(48000 * 2);
    node delayR = std::delays::Delay(48000 * 2);

    connection
    {
        audioIn[0] -> delayL.in;
        audioIn[1] -> delayR.in;
        delayL.out -> audioOut[0];
        delayR.out -> audioOut[1];
    }
}`;
        case 'json':
          return jsonSnippet;
      }
    } else {
      switch (yupTab) {
        case 'yupHeader':
          return yupSkinHeader;
        case 'yupDrawing':
          return `// YupDrawing.cpp — Modern GPU Drawing
#include "YupSkin.hpp"

void drawKnob(yup::Graphics& g, const yup::Rectangle<float>& bounds, float normalizedValue)
{
    const auto& s = DelayHost::CURRENT_ACTIVE_SKIN;
    g.setColor(s.panelDarker);
    g.fillEllipse(bounds);
    g.setColor(s.cream);
    g.drawEllipse(bounds, 1.5f);
}`;
        case 'sliderCode':
          return `// YupSlider.hpp
#pragma once
#include <yup_gui/yup_gui.h>

class TactileFader : public yup::Slider
{
public:
    TactileFader() { setSliderStyle(yup::Slider::LinearVertical); }
};`;
        case 'lfoCode':
          return `// YupLfoScope.hpp
#pragma once
#include <yup_gui/yup_gui.h>

class LfoScope : public yup::Component
{
    void paint(yup::Graphics& g) override
    {
        g.setColor(yup::Color::fromRgba(0x06b6d4ff));
        // Waveform path rendering
    }
};`;
        case 'cmake':
          return `cmake_minimum_required(VERSION 3.22)
project(DelayHostAudioPlugin LANGUAGES CXX)
find_package(yup REQUIRED)
yup_add_plugin(DelayHostPlugin
    SOURCES Source/PluginProcessor.cpp Source/PluginEditor.cpp
)`;
        case 'json':
          return jsonSnippet;
      }
    }
  };

  const getActiveFilename = (): string => {
    if (framework === 'juce') {
      switch (juceTab) {
        case 'lookAndFeelH': return 'DelayHostLookAndFeel.h';
        case 'lookAndFeelCpp': return 'DelayHostLookAndFeel.cpp';
        case 'xmlLayout': return 'DelayHostLayout.xml';
        case 'coloursH': return 'DelayHostColours.h';
        case 'editorH': return 'PluginEditor.h';
        case 'editorCpp': return 'PluginEditor.cpp';
        case 'json': return 'SkinTokens.json';
      }
    }
    return `${skin.name.toLowerCase().replace(/\s+/g, '_')}_code.txt`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadActiveFile = () => {
    const content = getActiveCode();
    const filename = getActiveFilename();
    const mimeType = filename.endsWith('.xml')
      ? 'application/xml;charset=utf-8'
      : filename.endsWith('.json')
      ? 'application/json;charset=utf-8'
      : 'text/plain;charset=utf-8';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#10141D] border border-white/10 rounded-2xl p-5 flex flex-col gap-4 text-xs shadow-2xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="font-bold text-base text-white tracking-tight">Audio Plugin Code & Layout Exporter</h3>
          </div>
          <p className="text-[12px] text-slate-400 mt-1">
            Production-ready <span className="text-amber-300 font-semibold">JUCE 7 / 8 C++</span> graphics code, XML layout hierarchy, and texture assets for <span className="text-white font-medium">{skin.name}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              const dataUrl = exportTextureAsPng(skin, activeTexture, 2000, 1520);
              const link = document.createElement('a');
              link.download = `${skin.name.toLowerCase().replace(/\s+/g, '_')}_texture.png`;
              link.href = dataUrl;
              link.click();
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm text-xs"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Texture PNG</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const svgContent = exportTextureAsSvg(skin, activeTexture, 2000, 1520);
              const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = `${skin.name.toLowerCase().replace(/\s+/g, '_')}_texture.svg`;
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm text-xs"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Texture SVG</span>
          </button>
        </div>
      </div>

      {/* Target Framework Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Framework:</span>
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setFramework('juce')}
              className={`px-3 py-1.5 font-bold text-xs rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                framework === 'juce'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>JUCE 7 / 8 (C++ & XML)</span>
            </button>
            <button
              type="button"
              onClick={() => setFramework('cmajor')}
              className={`px-3 py-1.5 font-bold text-xs rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                framework === 'cmajor'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cmajor & Amorph JS</span>
            </button>
            <button
              type="button"
              onClick={() => setFramework('yup')}
              className={`px-3 py-1.5 font-bold text-xs rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                framework === 'yup'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>YUP (C++20 GPU)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {framework === 'juce' && (
            <button
              type="button"
              onClick={handleExportZip}
              disabled={isExportingZip}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-lg transition-all cursor-pointer shadow-md shadow-amber-500/20 flex items-center gap-1.5 text-xs disabled:opacity-50"
              title="Download all JUCE C++ headers, implementation files, XML layout, and README in a single .zip"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{isExportingZip ? 'Bundling ZIP...' : 'Download All JUCE Files (.ZIP)'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleDownloadActiveFile}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all cursor-pointer border border-white/15 flex items-center gap-1.5 text-xs shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download {getActiveFilename()}</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={`px-4 py-1.5 font-bold rounded-lg transition-all cursor-pointer shadow text-xs flex items-center gap-1.5 ${
              copied
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs for JUCE */}
      {framework === 'juce' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-white/10">
          <button
            type="button"
            onClick={() => setJuceTab('lookAndFeelH')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              juceTab === 'lookAndFeelH'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>DelayHostLookAndFeel.h</span>
          </button>
          <button
            type="button"
            onClick={() => setJuceTab('lookAndFeelCpp')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              juceTab === 'lookAndFeelCpp'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>DelayHostLookAndFeel.cpp</span>
          </button>
          <button
            type="button"
            onClick={() => setJuceTab('xmlLayout')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              juceTab === 'xmlLayout'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>DelayHostLayout.xml</span>
          </button>
          <button
            type="button"
            onClick={() => setJuceTab('coloursH')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              juceTab === 'coloursH'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>DelayHostColours.h</span>
          </button>
          <button
            type="button"
            onClick={() => setJuceTab('editorH')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              juceTab === 'editorH'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>PluginEditor.h</span>
          </button>
          <button
            type="button"
            onClick={() => setJuceTab('editorCpp')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              juceTab === 'editorCpp'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>PluginEditor.cpp</span>
          </button>
          <button
            type="button"
            onClick={() => setJuceTab('json')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              juceTab === 'json'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>SkinTokens.json</span>
          </button>
        </div>
      )}

      {/* Sub-tabs for Cmajor */}
      {framework === 'cmajor' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-white/10">
          <button
            type="button"
            onClick={() => setCmajorTab('viewJs')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              cmajorTab === 'viewJs' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'bg-white/5 text-slate-400'
            }`}
          >
            view.js (Web GUI)
          </button>
          <button
            type="button"
            onClick={() => setCmajorTab('cmajorDsp')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              cmajorTab === 'cmajorDsp' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'bg-white/5 text-slate-400'
            }`}
          >
            DelayHost.cmajor (DSP)
          </button>
          <button
            type="button"
            onClick={() => setCmajorTab('cmajorPatch')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              cmajorTab === 'cmajorPatch' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'bg-white/5 text-slate-400'
            }`}
          >
            cmajorpatch (Manifest)
          </button>
          <button
            type="button"
            onClick={() => setCmajorTab('json')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              cmajorTab === 'json' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'bg-white/5 text-slate-400'
            }`}
          >
            Tokens JSON
          </button>
        </div>
      )}

      {/* Sub-tabs for YUP */}
      {framework === 'yup' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-white/10">
          <button
            type="button"
            onClick={() => setYupTab('yupHeader')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              yupTab === 'yupHeader' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-slate-400'
            }`}
          >
            YupSkin.hpp
          </button>
          <button
            type="button"
            onClick={() => setYupTab('yupDrawing')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              yupTab === 'yupDrawing' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-slate-400'
            }`}
          >
            YupDrawing.cpp
          </button>
          <button
            type="button"
            onClick={() => setYupTab('sliderCode')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              yupTab === 'sliderCode' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-slate-400'
            }`}
          >
            TactileFader.hpp
          </button>
          <button
            type="button"
            onClick={() => setYupTab('cmake')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              yupTab === 'cmake' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-slate-400'
            }`}
          >
            CMakeLists.txt
          </button>
          <button
            type="button"
            onClick={() => setYupTab('json')}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
              yupTab === 'json' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-slate-400'
            }`}
          >
            Tokens JSON
          </button>
        </div>
      )}

      {/* Code Display Area */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#07090E]">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-300/90 font-medium">
            <FileCode className="w-3.5 h-3.5" />
            {getActiveFilename()}
          </span>
          <span className="text-slate-500 text-[10px]">
            {framework === 'juce' && juceTab === 'xmlLayout' ? 'JUCE GUI XML Document' : 'C++ / Header Source'}
          </span>
        </div>
        <pre className="p-4 text-[12px] font-mono text-emerald-400 overflow-x-auto max-h-[460px] leading-relaxed selection:bg-amber-400/30 selection:text-white">
          <code>{getActiveCode()}</code>
        </pre>
      </div>
    </div>
  );
};
