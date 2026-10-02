import JSZip from 'jszip';
import {
  SkinDefinition,
  KnobArchitectPreset,
  SliderArchitectPreset,
  TextureArchetype,
  LfoVisualPreset,
  UiCustomizationState
} from '../types/skin';
import { generateJuceSuite } from './juceCodeGenerator';

interface ExportZipParams {
  skin: SkinDefinition;
  knobPreset?: KnobArchitectPreset;
  sliderPreset?: SliderArchitectPreset;
  textureArchetype?: TextureArchetype;
  lfoVisualPreset?: LfoVisualPreset;
  customization?: UiCustomizationState;
}

/**
 * Bundles all JUCE C++ LookAndFeel, XML layout, and metadata files into a single downloadable .zip archive.
 */
export async function exportJuceZipBundle({
  skin,
  knobPreset,
  sliderPreset,
  textureArchetype,
  lfoVisualPreset,
  customization
}: ExportZipParams): Promise<void> {
  const zip = new JSZip();

  const activeKnob = knobPreset ?? skin.knobPreset;
  const activeSlider = sliderPreset ?? skin.sliderPreset;
  const activeTexture = textureArchetype ?? skin.textureArchetype;

  // 1. Generate All JUCE Source Files via generateJuceSuite
  const suite = generateJuceSuite(
    skin,
    activeKnob,
    activeTexture,
    activeSlider,
    lfoVisualPreset,
    customization
  );

  // 2. Add files to JUCE directory structure in the zip
  const juceFolder = zip.folder('Source') || zip;
  juceFolder.file('DelayHostLookAndFeel.h', suite.headerCode);
  juceFolder.file('DelayHostLookAndFeel.cpp', suite.cppCode);
  juceFolder.file('DelayHostColours.h', suite.colourConstants);
  juceFolder.file('PluginEditor.h', suite.editorHeader);
  juceFolder.file('PluginEditor.cpp', suite.editorCpp);

  const resourcesFolder = zip.folder('Resources') || zip;
  resourcesFolder.file('DelayHostLayout.xml', suite.xmlLayout);

  // 3. JSON Skin Tokens
  const skinJson = JSON.stringify(
    {
      skin,
      activeKnob,
      activeSlider,
      activeTexture,
      lfoVisualPreset,
      customization,
      exportedAt: new Date().toISOString(),
      generator: 'DelayHost 2 JUCE Exporter'
    },
    null,
    2
  );
  zip.file('DelayHostSkinTokens.json', skinJson);

  // 4. Detailed README instructions for JUCE CMake and Projucer developers
  const readmeContent = `# DelayHost 2 — JUCE Audio Plugin Bundle
Generated on: ${new Date().toUTCString()}
Theme: ${skin.name} (${skin.category})

## Package Contents
- \`Source/DelayHostLookAndFeel.h\` : Complete custom LookAndFeel_V4 class with custom Rotary & Linear Slider drawing.
- \`Source/DelayHostLookAndFeel.cpp\` : Vector graphics rendering implementation with bevels, LED arcs, and metallic textures.
- \`Source/DelayHostColours.h\` : Type-safe \`juce::Colour\` palette constants matching your skin.
- \`Source/PluginEditor.h\` & \`.cpp\` : AudioProcessorEditor boilerplate wired with the custom LookAndFeel.
- \`Resources/DelayHostLayout.xml\` : Projucer/JUCE component hierarchy definition and coordinate layout.
- \`DelayHostSkinTokens.json\` : Normalized web design tokens and archetype parameters.

## Integration Instructions

### 1. CMake Integration
Copy the \`Source/\` files into your project's \`Source/\` folder and add them to \`target_sources\`:
\`\`\`cmake
target_sources(DelayHost PRIVATE
    Source/DelayHostLookAndFeel.h
    Source/DelayHostLookAndFeel.cpp
    Source/DelayHostColours.h
    Source/PluginEditor.h
    Source/PluginEditor.cpp
)
\`\`\`

### 2. Setting the Custom LookAndFeel
In your \`PluginEditor.cpp\`:
\`\`\`cpp
#include "DelayHostLookAndFeel.h"

AudioPluginAudioProcessorEditor::AudioPluginAudioProcessorEditor (AudioPluginAudioProcessor& p)
    : AudioProcessorEditor (&p), audioProcessor (p)
{
    // Apply custom DelayHost LookAndFeel
    setLookAndFeel (&customLookAndFeel);
    setSize (880, 720);
}

AudioPluginAudioProcessorEditor::~AudioPluginAudioProcessorEditor()
{
    setLookAndFeel (nullptr);
}
\`\`\`
`;
  zip.file('README.md', readmeContent);

  // 5. Generate zip blob and trigger direct download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const filename = `${skin.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_juce_bundle.zip`;
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
