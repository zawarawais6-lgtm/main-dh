import React, { useRef, useEffect } from "react"
import { TextureArchetype } from "../../types/skin"
import { PRESETS_1000 } from "../../data/presets1000"
import { renderTextureToCanvas } from "./textureGenerator"

interface TexturePatternPreviewProps {
  archetype: TextureArchetype
  height?: number
}

export const TexturePatternPreview: React.FC<TexturePatternPreviewProps> = ({
  archetype,
  height = 112,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    renderTextureToCanvas(
      canvasRef.current,
      PRESETS_1000[0],
      480,
      height * 2,
      archetype,
    )
  }, [archetype, height])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-cover"
      role="img"
      aria-label={`Texture preview: ${archetype.name}`}
    />
  )
}

export default TexturePatternPreview
