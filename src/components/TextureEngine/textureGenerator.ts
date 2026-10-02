import { SkinDefinition, TextureArchetype } from '../../types/skin';
import { renderNew300Pattern } from './new300Patterns';

// Seeded pseudorandom generator for deterministic texture replication
function createRng(seed: number) {
  let s = Math.abs(seed) || 123456789;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function renderCatalogSignature(
  ctx: CanvasRenderingContext2D,
  signature: string,
  width: number,
  height: number,
  accent: string,
  midColor: string,
  seed: number
) {
  if (!signature) return;

  const family = Math.abs(seed) % 8;
  const detail = 5 + (Math.abs(seed) % 11);
  const rotation = ((seed * 37) % 360) * (Math.PI / 180);

  ctx.save();
  ctx.globalCompositeOperation = family % 3 === 0 ? 'screen' : 'soft-light';
  ctx.globalAlpha = 0.2 + (Math.abs(seed) % 18) / 100;
  ctx.translate(width / 2, height / 2);
  ctx.rotate(rotation);
  ctx.translate(-width / 2, -height / 2);

  if (family === 0) {
    for (let i = -detail; i <= detail; i++) {
      const x = width / 2 + i * (width / detail);
      ctx.strokeStyle = i % 3 === 0 ? accent : midColor;
      ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.6;
      ctx.beginPath();
      ctx.moveTo(x, -height * 0.3);
      ctx.bezierCurveTo(x - width * 0.18, height * 0.25, x + width * 0.18, height * 0.75, x, height * 1.3);
      ctx.stroke();
    }
  } else if (family === 1) {
    const spacing = Math.max(24, Math.min(width, height) / detail);
    for (let y = -spacing; y < height + spacing; y += spacing) {
      for (let x = -spacing; x < width + spacing; x += spacing) {
        const radius = spacing * (0.12 + ((x + y + seed) % 5) * 0.025);
        ctx.strokeStyle = (x / spacing + y / spacing) % 2 === 0 ? accent : midColor;
        ctx.beginPath();
        ctx.arc(x, y, Math.abs(radius), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  } else if (family === 2) {
    for (let i = 0; i < detail * 2; i++) {
      const inset = i * (Math.min(width, height) / (detail * 4));
      ctx.strokeStyle = i % 4 === 0 ? accent : midColor;
      ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);
    }
  } else if (family === 3) {
    const cx = width * (0.3 + ((seed % 31) / 100));
    const cy = height * (0.35 + ((seed % 23) / 100));
    for (let i = 1; i <= detail * 2; i++) {
      ctx.strokeStyle = i % 3 === 0 ? accent : midColor;
      ctx.beginPath();
      ctx.ellipse(cx, cy, i * width * 0.035, i * height * 0.022, rotation, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (family === 4) {
    const step = Math.max(20, width / (detail * 1.4));
    for (let x = -height; x < width + height; x += step) {
      ctx.strokeStyle = x % (step * 4) === 0 ? accent : midColor;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
      ctx.stroke();
    }
  } else if (family === 5) {
    for (let i = 0; i < detail; i++) {
      const y = ((i + 0.5) / detail) * height;
      ctx.strokeStyle = i % 2 === 0 ? accent : midColor;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 10) {
        const wave = Math.sin(x * 0.018 + i * 1.7 + seed) * (8 + i * 1.5);
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
  } else if (family === 6) {
    const sides = 5 + (Math.abs(seed) % 4);
    for (let ring = 1; ring <= detail; ring++) {
      const radius = (ring / detail) * Math.min(width, height) * 0.7;
      ctx.strokeStyle = ring % 3 === 0 ? accent : midColor;
      ctx.beginPath();
      for (let p = 0; p <= sides; p++) {
        const angle = (p / sides) * Math.PI * 2 + ring * 0.08;
        const x = width / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle) * radius;
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else {
    const cells = detail + 4;
    for (let i = 0; i < cells; i++) {
      const x = ((i * 0.61803398875 + (seed % 13) / 13) % 1) * width;
      const y = ((i * 0.41421356237 + (seed % 17) / 17) % 1) * height;
      const radius = 18 + ((i * seed) % 90);
      const halo = ctx.createRadialGradient(x, y, 0, x, y, Math.abs(radius));
      halo.addColorStop(0, `${accent}99`);
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
  }

  ctx.restore();
}

export function renderTextureToCanvas(
  canvas: HTMLCanvasElement,
  skin: SkinDefinition,
  width: number,
  height: number,
  archetype?: TextureArchetype
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const baseColor = archetype?.secondaryTint || skin.panelDarker || '#090B10';
  const midColor = archetype?.primaryTint || skin.panelDark || '#121620';
  const accent = archetype?.accentTint || skin.amber || '#E8A13A';
  const contrast = archetype?.contrast ?? skin.textureContrast ?? 1.0;
  const roughness = archetype?.roughness ?? skin.textureRoughness ?? 0.5;
  const vignette = archetype?.vignette ?? skin.vignetteStrength ?? 0.35;
  const flowAngle = archetype?.liquidAngle ?? skin.liquidFlowAngle ?? 45;
  const octaves = archetype?.noiseOctaves ?? skin.noiseOctaves ?? 4;
  const density = archetype?.grainDensity ?? skin.grainDensity ?? 0.65;
  const seed = archetype?.seed ?? skin.id ?? 42;
  const model = archetype?.baseModel || skin.panelTexture || 'GrittyTexture';
  const patternSignature = archetype?.patternType || skin.patternType || '';
  const [pattern, catalogSignature = ''] = patternSignature.split('--');

  const rng = createRng(seed);

  // 1. BASE BACKGROUND PASS
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, width, height);

  // 2. TEXTURE-SPECIFIC PROCEDURAL PROCEDURES
  ctx.save();

  // --- NEW 300 PRESETS (SHADERS.COM, BOOK OF SHAPES, MOTION DEV, CODESANDBOX, FFFUEL) ---
  if (renderNew300Pattern(ctx, model, pattern, width, height, baseColor, midColor, accent, flowAngle, seed, rng)) {
    // Handled by new 300 pattern renderer
  }

  // --- REACT BITS: AERO SHARDS ---
  else if (model === 'AeroShards' || pattern === 'aero-shards') {
    const shardCount = 14;
    for (let i = 0; i < shardCount; i++) {
      ctx.save();
      const x1 = rng() * width;
      const y1 = rng() * height;
      const angle = (rng() * 45 + flowAngle) * (Math.PI / 180);
      const len = 120 + rng() * 240;
      const w = 20 + rng() * 60;

      ctx.translate(x1, y1);
      ctx.rotate(angle);

      const shardGrad = ctx.createLinearGradient(0, 0, len, w);
      shardGrad.addColorStop(0, `${accent}66`);
      shardGrad.addColorStop(0.5, `${midColor}AA`);
      shardGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = shardGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(len, w * 0.5);
      ctx.lineTo(len * 0.8, -w * 0.5);
      ctx.closePath();
      ctx.fill();

      // Sharp specular edge
      ctx.strokeStyle = `${accent}CC`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- REACT BITS: GHOST FIBERS ---
  else if (model === 'GhostFibers' || pattern === 'ghost-fibers') {
    const fiberCount = 28;
    for (let i = 0; i < fiberCount; i++) {
      ctx.save();
      ctx.strokeStyle = i % 2 === 0 ? `${accent}88` : `${midColor}CC`;
      ctx.lineWidth = 0.8 + rng() * 1.5;
      ctx.globalAlpha = 0.25 + rng() * 0.55;

      ctx.beginPath();
      let startX = rng() * width;
      let startY = 0;
      ctx.moveTo(startX, startY);

      for (let y = 0; y < height; y += 40) {
        const xOffset = Math.sin((y + seed * 10) * 0.02 + i) * 60;
        ctx.lineTo(startX + xOffset, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- REACT BITS: WEB THREADS ---
  else if (model === 'WebThreads' || pattern === 'web-threads') {
    const nodeCount = 35;
    const nodes: { x: number; y: number }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({ x: rng() * width, y: rng() * height });
    }

    ctx.strokeStyle = `${accent}44`;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      // Node particle
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- REACT BITS: LASER SCANNER ---
  else if (model === 'LaserScanner' || pattern === 'laser-scanner') {
    const beamY = height * 0.45;
    const scanGrad = ctx.createLinearGradient(0, beamY - 60, 0, beamY + 60);
    scanGrad.addColorStop(0, 'transparent');
    scanGrad.addColorStop(0.4, `${accent}44`);
    scanGrad.addColorStop(0.5, '#FFFFFF');
    scanGrad.addColorStop(0.6, `${accent}44`);
    scanGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, beamY - 60, width, 120);

    // Raster scanlines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // --- REACT BITS: PRISM SPECTRUM ---
  else if (model === 'PrismSpectrum' || pattern === 'prism-spectrum') {
    const prismGrad = ctx.createLinearGradient(0, 0, width, height);
    prismGrad.addColorStop(0, `${baseColor}`);
    prismGrad.addColorStop(0.3, '#E6394666');
    prismGrad.addColorStop(0.45, '#F59E0B66');
    prismGrad.addColorStop(0.6, '#10B98166');
    prismGrad.addColorStop(0.75, '#38BDF866');
    prismGrad.addColorStop(0.9, '#8B5CF666');
    prismGrad.addColorStop(1, `${baseColor}`);

    ctx.fillStyle = prismGrad;
    ctx.fillRect(0, 0, width, height);

    // Diagonal dispersion light rays
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let r = 0; r < 5; r++) {
      ctx.fillStyle = `${accent}33`;
      ctx.beginPath();
      ctx.moveTo(width * 0.1 * r, 0);
      ctx.lineTo(width * (0.3 + 0.1 * r), height);
      ctx.lineTo(width * (0.35 + 0.1 * r), height);
      ctx.lineTo(width * (0.15 * r), 0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // --- REACT BITS: DARK VEIL ---
  else if (model === 'DarkVeil' || pattern === 'dark-veil') {
    const veilGrad = ctx.createRadialGradient(width * 0.5, height * 0.4, 40, width * 0.5, height * 0.5, width * 0.8);
    veilGrad.addColorStop(0, midColor);
    veilGrad.addColorStop(0.7, baseColor);
    veilGrad.addColorStop(1, '#020305');
    ctx.fillStyle = veilGrad;
    ctx.fillRect(0, 0, width, height);

    // Deep brooding silk folds
    for (let f = 0; f < 5; f++) {
      ctx.save();
      ctx.strokeStyle = `${accent}33`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const startX = width * (0.15 + f * 0.18);
      ctx.moveTo(startX, 0);
      ctx.bezierCurveTo(
        startX + 80, height * 0.35,
        startX - 80, height * 0.7,
        startX + 30, height
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- REACT BITS: LIGHT PILLAR ---
  else if (model === 'LightPillar' || pattern === 'light-pillar') {
    const pillarGrad = ctx.createLinearGradient(0, height, 0, 0);
    pillarGrad.addColorStop(0, `${accent}CC`);
    pillarGrad.addColorStop(0.3, `${accent}55`);
    pillarGrad.addColorStop(0.8, `${midColor}22`);
    pillarGrad.addColorStop(1, 'transparent');

    const px = width * 0.5;
    const pw = width * 0.35;
    ctx.fillStyle = pillarGrad;
    ctx.beginPath();
    ctx.moveTo(px - pw * 0.5, height);
    ctx.lineTo(px + pw * 0.5, height);
    ctx.lineTo(px + pw * 0.15, 0);
    ctx.lineTo(px - pw * 0.15, 0);
    ctx.closePath();
    ctx.fill();

    // Core beam
    const coreGrad = ctx.createLinearGradient(0, height, 0, 0);
    coreGrad.addColorStop(0, '#FFFFFF');
    coreGrad.addColorStop(0.5, `${accent}AA`);
    coreGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGrad;
    ctx.fillRect(px - 6, 0, 12, height);
  }

  // --- REACT BITS: SILK / SILK FABRIC ---
  else if (model === 'SilkFabric' || pattern === 'silk-fabric') {
    const rad = (flowAngle * Math.PI) / 180;
    const waveCount = 10;
    for (let w = 0; w < waveCount; w++) {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, w % 2 === 0 ? midColor : baseColor);
      grad.addColorStop(0.5, `${accent}44`);
      grad.addColorStop(1, midColor);
      ctx.fillStyle = grad;

      ctx.beginPath();
      const baseY = height * (w / waveCount);
      ctx.moveTo(0, baseY);
      ctx.bezierCurveTo(
        width * 0.33, baseY - 40 * Math.sin(w + rad),
        width * 0.66, baseY + 40 * Math.cos(w + rad),
        width, baseY
      );
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
    }
  }

  // --- REACT BITS: FLOATING LINES ---
  else if (model === 'FloatingLines' || pattern === 'floating-lines') {
    const lineCount = 18;
    for (let i = 0; i < lineCount; i++) {
      ctx.strokeStyle = i % 3 === 0 ? accent : `${midColor}EE`;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.3 + (i / lineCount) * 0.5;

      ctx.beginPath();
      const yBase = (height / lineCount) * i;
      ctx.moveTo(0, yBase);
      for (let x = 0; x <= width; x += 20) {
        const y = yBase + Math.sin(x * 0.015 + i * 0.4) * 22;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  // --- REACT BITS: COLOR BENDS ---
  else if (model === 'ColorBends' || pattern === 'color-bends') {
    const bends = [
      { col: accent, offset: 0 },
      { col: midColor, offset: 60 },
      { col: '#00E5FF', offset: 120 },
      { col: '#B347FF', offset: 180 }
    ];

    bends.forEach((b, idx) => {
      ctx.save();
      ctx.strokeStyle = `${b.col}66`;
      ctx.lineWidth = 18 + idx * 6;
      ctx.beginPath();
      ctx.moveTo(-50, height * 0.2 + idx * 30);
      ctx.bezierCurveTo(
        width * 0.3, height * 0.8 + idx * 20,
        width * 0.7, -height * 0.1,
        width + 50, height * 0.7
      );
      ctx.stroke();
      ctx.restore();
    });
  }

  // --- REACT BITS: GRADIENT BLINDS ---
  else if (model === 'GradientBlinds' || pattern === 'gradient-blinds') {
    const slatCount = 16;
    const slatH = height / slatCount;
    for (let i = 0; i < slatCount; i++) {
      const slatGrad = ctx.createLinearGradient(0, i * slatH, 0, (i + 1) * slatH);
      slatGrad.addColorStop(0, midColor);
      slatGrad.addColorStop(0.7, `${accent}44`);
      slatGrad.addColorStop(1, baseColor);
      ctx.fillStyle = slatGrad;
      ctx.fillRect(0, i * slatH, width, slatH - 2);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, (i + 1) * slatH - 2, width, 2);
    }
  }

  // --- ACETERNITY UI: LAMP EFFECT ---
  else if (model === 'AceternityLamp' || pattern === 'aceternity-lamp') {
    const lampX = width * 0.5;
    const lampGrad = ctx.createRadialGradient(lampX, 0, 10, lampX, height * 0.6, width * 0.6);
    lampGrad.addColorStop(0, '#FFFFFF');
    lampGrad.addColorStop(0.2, `${accent}CC`);
    lampGrad.addColorStop(0.5, `${accent}33`);
    lampGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = lampGrad;
    ctx.beginPath();
    ctx.moveTo(lampX - width * 0.45, height);
    ctx.lineTo(lampX + width * 0.45, height);
    ctx.lineTo(lampX + width * 0.15, 0);
    ctx.lineTo(lampX - width * 0.15, 0);
    ctx.closePath();
    ctx.fill();

    // Top shelf glow horizon
    ctx.fillStyle = accent;
    ctx.fillRect(lampX - width * 0.25, 0, width * 0.5, 4);
  }

  // --- ACETERNITY UI: GLOWING PERIMETER ---
  else if (model === 'GlowingPerimeter' || pattern === 'glowing-perimeter') {
    const perimGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.3, width * 0.5, height * 0.5, width * 0.6);
    perimGrad.addColorStop(0, baseColor);
    perimGrad.addColorStop(0.85, baseColor);
    perimGrad.addColorStop(1, `${accent}AA`);

    ctx.fillStyle = perimGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, width - 12, height - 12);
  }

  // --- 21ST.DEV: SPECTRAL RIBBON ---
  else if (model === 'SpectralRibbon' || pattern === 'spectral-ribbon') {
    for (let i = 0; i < 8; i++) {
      ctx.save();
      const ribbonGrad = ctx.createLinearGradient(0, 0, width, height);
      ribbonGrad.addColorStop(0, accent);
      ribbonGrad.addColorStop(0.5, '#00E5FF');
      ribbonGrad.addColorStop(1, '#FF2BD6');

      ctx.strokeStyle = ribbonGrad;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.3 + (i / 8) * 0.6;

      ctx.beginPath();
      ctx.moveTo(0, height * 0.3 + i * 15);
      ctx.bezierCurveTo(
        width * 0.25, height * 0.8 - i * 10,
        width * 0.75, height * 0.1 + i * 20,
        width, height * 0.6 + i * 10
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- 21ST.DEV: CORAL GLOOM ---
  else if (model === 'CoralGloom' || pattern === 'coral-gloom') {
    const gloomGrad = ctx.createRadialGradient(width * 0.35, height * 0.45, 20, width * 0.5, height * 0.5, width * 0.7);
    gloomGrad.addColorStop(0, '#FF6B6B88');
    gloomGrad.addColorStop(0.4, '#C92A2A44');
    gloomGrad.addColorStop(0.8, baseColor);
    gloomGrad.addColorStop(1, '#07090C');

    ctx.fillStyle = gloomGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // --- 21ST.DEV: MESH GRADIENT ---
  else if (model === 'MeshGradient' || pattern === 'mesh-gradient-3') {
    const points = [
      { x: width * 0.2, y: height * 0.3, c: accent },
      { x: width * 0.8, y: height * 0.2, c: '#00E5FF' },
      { x: width * 0.3, y: height * 0.8, c: '#FF2BD6' },
      { x: width * 0.7, y: height * 0.7, c: midColor }
    ];

    points.forEach((p) => {
      const g = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, width * 0.45);
      g.addColorStop(0, `${p.c}77`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    });
  }

  // --- 21ST.DEV: RED IN BLACK ---
  else if (model === 'RedInBlack' || pattern === 'red-in-black') {
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, width, height);

    const redGrad = ctx.createRadialGradient(width * 0.5, height * 0.65, 30, width * 0.5, height * 0.65, width * 0.5);
    redGrad.addColorStop(0, '#FF1744AA');
    redGrad.addColorStop(0.4, '#D5000044');
    redGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = redGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // --- 21ST.DEV: BLUE MESHY ---
  else if (model === 'BlueMeshy' || pattern === 'blue-meshy') {
    const blueGrad = ctx.createRadialGradient(width * 0.4, height * 0.35, 40, width * 0.5, height * 0.5, width * 0.65);
    blueGrad.addColorStop(0, '#00F0FF88');
    blueGrad.addColorStop(0.35, '#0066FF55');
    blueGrad.addColorStop(0.8, baseColor);
    blueGrad.addColorStop(1, '#050B14');

    ctx.fillStyle = blueGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // --- 21ST.DEV: BACKGROUND CIRCLES ---
  else if (model === 'BackgroundCircles' || pattern === 'background-circles') {
    const cx = width * 0.5;
    const cy = height * 0.5;
    const ringCount = 7;
    for (let r = 1; r <= ringCount; r++) {
      const radius = r * 45;
      ctx.strokeStyle = `${accent}33`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Node on ring
      const angle = (seed * 0.5 + r * 1.2);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- 21ST.DEV: DIMENSIONAL FIELD ---
  else if (model === 'DimensionalField' || pattern === 'dimensional-field') {
    const step = 28;
    ctx.strokeStyle = `${accent}33`;
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x * 1.2 - width * 0.1, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step * 0.6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // --- KOKONUTUI: FLOW FIELD ---
  else if (model === 'FlowField' || pattern === 'flow-field') {
    const cols = 20;
    const rows = 12;
    const colStep = width / cols;
    const rowStep = height / rows;

    ctx.strokeStyle = `${accent}55`;
    ctx.lineWidth = 1.2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * colStep;
        const y = r * rowStep;
        const angle = Math.sin(c * 0.2) + Math.cos(r * 0.2) + (flowAngle * Math.PI) / 180;
        const len = 16;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
        ctx.stroke();
      }
    }
  }

  // --- LIGHTSWIND: WAVY RIPPLE ---
  else if (model === 'WavyRipple' || pattern === 'wavy-ripple') {
    const cx = width * 0.5;
    const cy = height * 0.5;
    for (let r = 20; r < width * 0.7; r += 32) {
      ctx.strokeStyle = `${accent}33`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // --- ORIGINKIT: REFLECT SHADER ---
  else if (model === 'ReflectShader' || pattern === 'reflect-specular') {
    const horizon = height * 0.5;
    const reflectGrad = ctx.createLinearGradient(0, 0, 0, height);
    reflectGrad.addColorStop(0, midColor);
    reflectGrad.addColorStop(0.48, `${accent}44`);
    reflectGrad.addColorStop(0.5, '#FFFFFF');
    reflectGrad.addColorStop(0.52, `${accent}44`);
    reflectGrad.addColorStop(1, baseColor);

    ctx.fillStyle = reflectGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(width, horizon);
    ctx.stroke();
  }

  // --- ORIGINKIT: WIRE THROAT ---
  else if (model === 'WireThroat' || pattern === 'wire-throat') {
    const cx = width * 0.5;
    const cy = height * 0.5;
    for (let i = 1; i <= 10; i++) {
      const rad = Math.pow(i / 10, 1.6) * (width * 0.45);
      ctx.strokeStyle = `${accent}44`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rad, rad * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * (width * 0.5), cy + Math.sin(a) * (height * 0.5));
      ctx.stroke();
    }
  }

  // --- ORIGINKIT: BEYOND HORIZON ---
  else if (model === 'BeyondHorizon' || pattern === 'beyond-horizon') {
    const horizon = height * 0.4;
    const sunGrad = ctx.createRadialGradient(width * 0.5, horizon, 10, width * 0.5, horizon, 120);
    sunGrad.addColorStop(0, '#FFFFFF');
    sunGrad.addColorStop(0.3, `${accent}CC`);
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, width, horizon);

    // Perspective floor lines
    ctx.strokeStyle = `${accent}44`;
    ctx.lineWidth = 1;
    for (let x = -width; x < width * 2; x += 40) {
      ctx.beginPath();
      ctx.moveTo(width * 0.5, horizon);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  }

  // --- ORIGINKIT: HALFTONE BLOOM ---
  else if (model === 'HalftoneBloom' || pattern === 'halftone-bloom') {
    const step = 14;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const dist = Math.hypot(x - width * 0.5, y - height * 0.5);
        const radius = Math.max(0.5, (1 - dist / (width * 0.55)) * 5);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.2 + (radius / 5) * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  }

  // --- ORIGINKIT: PRISM FILM ---
  else if (model === 'PrismFilm' || pattern === 'prism-film') {
    const filmGrad = ctx.createLinearGradient(0, 0, width, height);
    filmGrad.addColorStop(0, '#00F0FF44');
    filmGrad.addColorStop(0.33, '#FF007A44');
    filmGrad.addColorStop(0.66, '#FFE60044');
    filmGrad.addColorStop(1, '#00F0FF44');

    ctx.fillStyle = filmGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // --- ORIGINKIT: DITHER BURN ---
  else if (model === 'DitherBurn' || pattern === 'dither-burn') {
    const step = 6;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if ((x + y + Math.floor(rng() * 4)) % 8 === 0) {
          ctx.fillStyle = accent;
          ctx.globalAlpha = 0.55;
          ctx.fillRect(x, y, step, step);
        }
      }
    }
    ctx.globalAlpha = 1.0;
  }

  // --- BEHANCE: LIQUID GRAINY GRADIENTS ---
  else if (model === 'LiquidGrainGradient' || pattern === 'liquid-grain-gradient') {
    const rad = (flowAngle * Math.PI) / 180;
    const cx = width / 2;
    const cy = height / 2;

    const x1 = cx - Math.cos(rad) * cx;
    const y1 = cy - Math.sin(rad) * cy;
    const x2 = cx + Math.cos(rad) * cx;
    const y2 = cy + Math.sin(rad) * cy;

    const liquidGrad = ctx.createLinearGradient(x1, y1, x2, y2);
    liquidGrad.addColorStop(0, midColor);
    liquidGrad.addColorStop(0.35, `${accent}55`);
    liquidGrad.addColorStop(0.65, `${baseColor}DD`);
    liquidGrad.addColorStop(1, midColor);
    ctx.fillStyle = liquidGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1.5;
    for (let l = 0; l < 6; l++) {
      ctx.strokeStyle = `${l % 2 === 0 ? accent : '#FFFFFF'}25`;
      ctx.beginPath();
      const startY = height * (0.15 + l * 0.15);
      ctx.moveTo(0, startY);
      ctx.bezierCurveTo(
        width * 0.3, startY - 60 + rng() * 120,
        width * 0.7, startY + 60 - rng() * 120,
        width, startY + 20
      );
      ctx.stroke();
    }
  }

  // --- BEHANCE: DEEP LAYERS VOLUME 1 ---
  else if (model === 'DeepLayers' || pattern === 'deep-layers-strata') {
    const tierCount = 5;
    for (let t = 0; t < tierCount; t++) {
      const progress = t / tierCount;
      const baseY = height * (0.2 + progress * 0.7);

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 10;

      ctx.beginPath();
      ctx.moveTo(0, baseY);
      ctx.bezierCurveTo(
        width * 0.28, baseY - 45 + ((t * 23) % 40),
        width * 0.65, baseY + 40 - ((t * 19) % 50),
        width, baseY - 10
      );
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const tierGrad = ctx.createLinearGradient(0, baseY - 30, 0, height);
      tierGrad.addColorStop(0, midColor);
      tierGrad.addColorStop(1, baseColor);
      ctx.fillStyle = tierGrad;
      ctx.fill();
      ctx.restore();
    }
  }

  // --- BEHANCE: 90 DARK GRAINY TEXTURES ---
  else if (model === 'DarkGrainyGrit' || pattern === 'dark-grainy-obsidian') {
    const darkGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 50, width * 0.5, height * 0.5, Math.max(width, height) * 0.7);
    darkGrad.addColorStop(0, midColor);
    darkGrad.addColorStop(0.6, baseColor);
    darkGrad.addColorStop(1, '#050608');
    ctx.fillStyle = darkGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FFFFFF';
    const starCount = Math.floor(280 * roughness);
    for (let s = 0; s < starCount; s++) {
      const sx = rng() * width;
      const sy = rng() * height;
      const sr = rng() < 0.9 ? 0.75 : 1.5;
      ctx.globalAlpha = 0.2 + rng() * 0.65;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- ADOBE STOCK: GRITTY CONCRETE ---
  else if (model === 'GrittyTexture' || pattern === 'gritty-concrete-distress') {
    const pitCount = Math.floor(350 * roughness * contrast);
    for (let p = 0; p < pitCount; p++) {
      const px = rng() * width;
      const py = rng() * height;
      const size = 0.8 + rng() * 2.5;
      const isDark = rng() > 0.4;
      ctx.fillStyle = isDark ? '#000000' : `${accent}88`;
      ctx.globalAlpha = 0.25 + rng() * 0.55;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- MAGNIFIC: FINE MINERAL GRIT ---
  else if (model === 'FineMineralGrit' || pattern === 'fine-mineral-grit') {
    const sandCount = Math.floor(600 * roughness);
    for (let s = 0; s < sandCount; s++) {
      const sx = rng() * width;
      const sy = rng() * height;
      const isAccent = rng() < 0.25;
      ctx.fillStyle = isAccent ? accent : '#FFFFFF';
      ctx.globalAlpha = 0.15 + rng() * 0.45;
      ctx.fillRect(sx, sy, 1.2, 1.2);
    }
  }

  // --- TEXTURELABS: XEROX PHOTOCOPY TONER BURN ---
  else if (model === 'TexturelabsPhotocopy' || pattern === 'texturelabs-photocopy-grunge') {
    // 1. High contrast paper ground with toner gradient
    const paperGrad = ctx.createLinearGradient(0, 0, width, height);
    paperGrad.addColorStop(0, midColor);
    paperGrad.addColorStop(0.5, baseColor);
    paperGrad.addColorStop(1, '#050608');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Horizontal photocopy drum/roller streaks
    const rollerCount = 12;
    for (let r = 0; r < rollerCount; r++) {
      const y = (height / rollerCount) * r + rng() * 20;
      const bandHeight = 4 + rng() * 18;
      ctx.fillStyle = rng() > 0.5 ? '#000000' : `${accent}33`;
      ctx.globalAlpha = 0.18 + rng() * 0.35;
      ctx.fillRect(0, y, width, bandHeight);
    }

    // 3. Dense toner speckles and threshold splatter
    const tonerCount = Math.floor(450 * roughness * contrast);
    for (let t = 0; t < tonerCount; t++) {
      const tx = rng() * width;
      const ty = rng() * height;
      const tSize = rng() < 0.8 ? 1.0 + rng() * 1.5 : 2.5 + rng() * 3.5;
      const isBurn = rng() > 0.3;
      ctx.fillStyle = isBurn ? '#000000' : `${accent}CC`;
      ctx.globalAlpha = 0.3 + rng() * 0.6;
      ctx.beginPath();
      ctx.arc(tx, ty, tSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Edge photocopy margin burn
    const edgeGrad = ctx.createLinearGradient(0, 0, 40, 0);
    edgeGrad.addColorStop(0, 'rgba(0,0,0,0.7)');
    edgeGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, 40, height);
    ctx.globalAlpha = 1.0;
  }

  // --- TEXTURELABS & UNSPLASH: 35MM FILM DUST, SCRATCHES & CHEMICAL BLOOM ---
  else if (model === 'TexturelabsFilmDust' || pattern === 'texturelabs-film-dust' || pattern === 'unsplash-film-emulsion') {
    // Atmospheric darkroom base
    const filmGrad = ctx.createLinearGradient(0, 0, width, height);
    filmGrad.addColorStop(0, midColor);
    filmGrad.addColorStop(0.7, baseColor);
    filmGrad.addColorStop(1, '#08080C');
    ctx.fillStyle = filmGrad;
    ctx.fillRect(0, 0, width, height);

    // Warm vintage optical light leak (chemical flare in corner)
    const leakX = width * 0.9;
    const leakY = height * 0.15;
    const leakGrad = ctx.createRadialGradient(leakX, leakY, 10, leakX, leakY, width * 0.65);
    leakGrad.addColorStop(0, 'rgba(255, 170, 70, 0.45)');
    leakGrad.addColorStop(0.4, `${accent}33`);
    leakGrad.addColorStop(0.8, 'rgba(244, 63, 94, 0.15)');
    leakGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = leakGrad;
    ctx.fillRect(0, 0, width, height);

    // Emulsion hairline scratches (vertical drag lines)
    const scratchCount = 7;
    for (let s = 0; s < scratchCount; s++) {
      const sx = rng() * width;
      ctx.strokeStyle = rng() > 0.4 ? 'rgba(255, 255, 255, 0.4)' : `${accent}66`;
      ctx.lineWidth = 0.75 + rng() * 0.75;
      ctx.globalAlpha = 0.3 + rng() * 0.5;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx + (rng() - 0.5) * 15, height);
      ctx.stroke();
    }

    // Micro film fibers / dust hairs (curly bézier strands)
    const fiberCount = 14;
    for (let f = 0; f < fiberCount; f++) {
      const fx = rng() * width;
      const fy = rng() * height;
      ctx.strokeStyle = rng() > 0.5 ? '#FFFFFF' : '#111115';
      ctx.lineWidth = 0.8 + rng() * 0.6;
      ctx.globalAlpha = 0.4 + rng() * 0.5;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.bezierCurveTo(
        fx + (rng() - 0.5) * 30, fy + (rng() - 0.5) * 30,
        fx + (rng() - 0.5) * 40, fy + (rng() - 0.5) * 40,
        fx + (rng() - 0.5) * 50, fy + (rng() - 0.5) * 50
      );
      ctx.stroke();
    }

    // Small dust flecks
    const dustCount = Math.floor(320 * roughness);
    for (let d = 0; d < dustCount; d++) {
      ctx.fillStyle = rng() > 0.6 ? '#FFFFFF' : `${accent}99`;
      ctx.globalAlpha = 0.2 + rng() * 0.6;
      ctx.beginPath();
      ctx.arc(rng() * width, rng() * height, rng() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  // --- TEXTURELABS: MACHINED ANODIZED AEROSPACE ALLOY ---
  else if (model === 'TexturelabsBrushedAlloy' || pattern === 'texturelabs-brushed-alloy' || model === 'BrushedMetal') {
    // Metallic gradient base
    const metalGrad = ctx.createLinearGradient(0, 0, width, height);
    metalGrad.addColorStop(0, midColor);
    metalGrad.addColorStop(0.35, '#2D3442');
    metalGrad.addColorStop(0.5, '#454E5E');
    metalGrad.addColorStop(0.65, '#2D3442');
    metalGrad.addColorStop(1, baseColor);
    ctx.fillStyle = metalGrad;
    ctx.fillRect(0, 0, width, height);

    // Fine horizontal lathe micro-brush lines
    const lineStep = 2;
    for (let y = 0; y < height; y += lineStep) {
      const isHighlight = (y + Math.floor(rng() * 4)) % 6 === 0;
      ctx.strokeStyle = isHighlight ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Diagonal anisotropic specular sheen ray
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    const sheenGrad = ctx.createLinearGradient(0, 0, width, height);
    sheenGrad.addColorStop(0, 'transparent');
    sheenGrad.addColorStop(0.42, `${accent}22`);
    sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
    sheenGrad.addColorStop(0.58, `${accent}22`);
    sheenGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // --- TEXTURELABS: DISTRESSED VINTAGE HARDWARE PATINA & OXIDATION ---
  else if (model === 'TexturelabsOxidizedPatina' || pattern === 'texturelabs-oxidized-patina' || model === 'SteampunkBrass') {
    // Base weathered metal
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // Organic patina blotches (verdigris / brass oxidation clusters)
    const clusterCount = 14;
    for (let c = 0; c < clusterCount; c++) {
      const cx = rng() * width;
      const cy = rng() * height;
      const radius = 30 + rng() * 90;
      const isVerdigris = c % 2 === 0;

      const clusterGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius);
      clusterGrad.addColorStop(0, isVerdigris ? 'rgba(34, 197, 94, 0.35)' : `${accent}44`);
      clusterGrad.addColorStop(0.6, isVerdigris ? 'rgba(16, 185, 129, 0.18)' : 'rgba(180, 83, 9, 0.2)');
      clusterGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = clusterGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pitted corrosion flecks and enamel chip marks
    const chipCount = Math.floor(280 * roughness);
    for (let p = 0; p < chipCount; p++) {
      const px = rng() * width;
      const py = rng() * height;
      const pSize = 1.0 + rng() * 2.8;
      ctx.fillStyle = rng() > 0.4 ? '#05070A' : '#10B981';
      ctx.globalAlpha = 0.3 + rng() * 0.5;
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  // --- VECTEEZY: REEL-TO-REEL MAGNETIC TAPE OXIDE GRAIN ---
  else if (model === 'AnalogMagneticTape' || pattern === 'vecteezy-magnetic-tape') {
    const tapeGrad = ctx.createLinearGradient(0, 0, width, 0);
    tapeGrad.addColorStop(0, baseColor);
    tapeGrad.addColorStop(0.2, '#181210');
    tapeGrad.addColorStop(0.5, midColor);
    tapeGrad.addColorStop(0.8, '#181210');
    tapeGrad.addColorStop(1, baseColor);
    ctx.fillStyle = tapeGrad;
    ctx.fillRect(0, 0, width, height);

    // Magnetic oxide drag streaks
    for (let y = 0; y < height; y += 3) {
      ctx.strokeStyle = rng() > 0.5 ? `${accent}25` : 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Subtle audio waveform frequency bias ribbon
    ctx.save();
    ctx.strokeStyle = `${accent}40`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const midY = height * 0.5;
    for (let x = 0; x < width; x += 10) {
      const wy = midY + Math.sin(x * 0.04) * 28 + Math.cos(x * 0.08) * 14;
      if (x === 0) ctx.moveTo(x, wy);
      else ctx.lineTo(x, wy);
    }
    ctx.stroke();
    ctx.restore();
  }

  // --- ISTOCK: CRT PHOSPHOR TRIAD & INTERLACED SCANLINES ---
  else if (model === 'AnalogCrtPhosphor' || pattern === 'istock-crt-phosphor' || model === 'CRTPhosphor') {
    // Deep dark curved tube glass
    ctx.fillStyle = '#06080B';
    ctx.fillRect(0, 0, width, height);

    // Center electron-gun phosphor glow
    const tubeGlow = ctx.createRadialGradient(width * 0.5, height * 0.5, 20, width * 0.5, height * 0.5, width * 0.65);
    tubeGlow.addColorStop(0, `${accent}45`);
    tubeGlow.addColorStop(0.5, `${midColor}66`);
    tubeGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = tubeGlow;
    ctx.fillRect(0, 0, width, height);

    // Interlaced horizontal raster scanlines
    for (let y = 0; y < height; y += 3) {
      ctx.fillStyle = y % 6 === 0 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, y, width, 1.5);
    }

    // RGB Phosphor subpixel triad columns
    const triadStep = 6;
    for (let x = 0; x < width; x += triadStep) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)'; // Red
      ctx.fillRect(x, 0, 1.5, height);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.08)'; // Green
      ctx.fillRect(x + 2, 0, 1.5, height);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.08)'; // Blue
      ctx.fillRect(x + 4, 0, 1.5, height);
    }
  }

  // --- VECTEEZY: DUAL-TONE RISOGRAPH INK STIPPLE ---
  else if (model === 'AnalogRisographStipple' || pattern === 'vecteezy-risograph-stipple') {
    // Porous riso paper base
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // Dual-tone stipple pattern: primary ink pass + accent ink pass
    const stippleCount = Math.floor(800 * roughness * contrast);
    for (let i = 0; i < stippleCount; i++) {
      const sx = rng() * width;
      const sy = rng() * height;
      const isPrimary = i % 2 === 0;

      // Misregistration offset simulation
      const offsetX = isPrimary ? 0 : 2.5;
      const offsetY = isPrimary ? 0 : -2;

      ctx.fillStyle = isPrimary ? midColor : accent;
      ctx.globalAlpha = 0.35 + rng() * 0.55;
      ctx.fillRect(sx + offsetX, sy + offsetY, 1.6, 1.6);
    }
    ctx.globalAlpha = 1.0;
  }

  // --- FIGMA COMMUNITY: BENTO NOISE MESH GRADIENT ---
  else if (model === 'FigmaNoiseMesh' || pattern === 'figma-noise-mesh') {
    // Smooth modern multi-stop gradient mesh blobs
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    const blobs = [
      { x: width * 0.25, y: height * 0.3, r: width * 0.45, color: accent },
      { x: width * 0.8, y: height * 0.2, r: width * 0.4, color: midColor },
      { x: width * 0.65, y: height * 0.85, r: width * 0.5, color: '#3B82F6' },
      { x: width * 0.15, y: height * 0.75, r: width * 0.35, color: '#8B5CF6' }
    ];

    blobs.forEach((b) => {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, `${b.color}55`);
      g.addColorStop(0.6, `${b.color}15`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    });
  }

  // --- FIGMA COMMUNITY: PRISMATIC IRIDESCENT HOLOGRAPHIC FOIL ---
  else if (model === 'FigmaHoloFoil' || pattern === 'figma-holo-foil' || model === 'HolographicFoil') {
    // Rainbow dispersion gradient angled at 45 deg
    const rad = (45 * Math.PI) / 180;
    const holoGrad = ctx.createLinearGradient(0, 0, width, height);
    holoGrad.addColorStop(0, '#00F0FF55');
    holoGrad.addColorStop(0.2, '#3B82F644');
    holoGrad.addColorStop(0.4, '#8B5CF655');
    holoGrad.addColorStop(0.6, '#EC489955');
    holoGrad.addColorStop(0.8, '#F59E0B44');
    holoGrad.addColorStop(1, '#10B98155');

    ctx.fillStyle = midColor;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.fillStyle = holoGrad;
    ctx.fillRect(0, 0, width, height);

    // Specular iridescent diagonal facet bars
    ctx.globalCompositeOperation = 'lighter';
    for (let f = 0; f < 8; f++) {
      const fx = (width / 7) * f;
      ctx.strokeStyle = `${accent}33`;
      ctx.lineWidth = 14 + (f % 3) * 8;
      ctx.beginPath();
      ctx.moveTo(fx - 80, 0);
      ctx.lineTo(fx + 80, height);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- UNSPLASH: WEATHERED VENETIAN PLASTER & LIME WASH ---
  else if (model === 'UnsplashWeatheredPlaster' || pattern === 'unsplash-weathered-plaster') {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // Trowel stroke sweeps
    for (let t = 0; t < 12; t++) {
      const ty = (height / 11) * t;
      const trowelGrad = ctx.createLinearGradient(0, ty, width, ty + 40);
      trowelGrad.addColorStop(0, `${midColor}AA`);
      trowelGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
      trowelGrad.addColorStop(1, `${baseColor}AA`);

      ctx.fillStyle = trowelGrad;
      ctx.beginPath();
      ctx.moveTo(0, ty);
      ctx.bezierCurveTo(width * 0.35, ty - 25, width * 0.65, ty + 25, width, ty);
      ctx.lineTo(width, ty + 35);
      ctx.lineTo(0, ty + 35);
      ctx.closePath();
      ctx.fill();
    }

    // Micro-fissure hairline cracks
    for (let c = 0; c < 5; c++) {
      let cx = rng() * width;
      let cy = rng() * height;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      for (let s = 0; s < 6; s++) {
        cx += (rng() - 0.5) * 45;
        cy += rng() * 35;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }
  }

  // --- UNSPLASH: NATURAL CLEFT OBSIDIAN SLATE STONE ---
  else if (model === 'UnsplashSlateStone' || pattern === 'unsplash-slate-stone' || model === 'MarbleStone') {
    // Dark slate strata base
    const slateGrad = ctx.createLinearGradient(0, 0, 0, height);
    slateGrad.addColorStop(0, midColor);
    slateGrad.addColorStop(0.5, baseColor);
    slateGrad.addColorStop(1, '#080A0E');
    ctx.fillStyle = slateGrad;
    ctx.fillRect(0, 0, width, height);

    // Directional mineral cleft lines
    for (let l = 0; l < 18; l++) {
      const ly = (height / 17) * l + (rng() - 0.5) * 15;
      ctx.strokeStyle = l % 3 === 0 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1 + rng() * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, ly);
      for (let x = 0; x < width; x += 50) {
        ctx.lineTo(x, ly + (rng() - 0.5) * 8);
      }
      ctx.stroke();
    }

    // Reflective mica flecks
    const micaCount = Math.floor(220 * roughness);
    for (let m = 0; m < micaCount; m++) {
      ctx.fillStyle = rng() > 0.5 ? '#FFFFFF' : accent;
      ctx.globalAlpha = 0.3 + rng() * 0.6;
      ctx.fillRect(rng() * width, rng() * height, 1.5, 1.5);
    }
    ctx.globalAlpha = 1.0;
  }

  // --- ALLISON PERRY ART: MIXED MEDIA TORN PAPER & GOUACHE WASH ---
  else if (model === 'AllisonPerryMixedMedia' || pattern === 'allison-perry-mixed-media') {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // Layered torn paper blocks with deckled edges
    const blocks = [
      { x: width * 0.1, y: height * 0.15, w: width * 0.8, h: height * 0.7, col: midColor },
      { x: width * 0.25, y: height * 0.3, w: width * 0.5, h: height * 0.45, col: `${accent}33` }
    ];

    blocks.forEach((b) => {
      ctx.save();
      ctx.fillStyle = b.col;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      // Rough deckled top edge
      for (let x = b.x; x < b.x + b.w; x += 15) {
        ctx.lineTo(x, b.y + (rng() - 0.5) * 6);
      }
      // Right edge
      for (let y = b.y; y < b.y + b.h; y += 15) {
        ctx.lineTo(b.x + b.w + (rng() - 0.5) * 6, y);
      }
      // Bottom edge
      for (let x = b.x + b.w; x > b.x; x -= 15) {
        ctx.lineTo(x, b.y + b.h + (rng() - 0.5) * 6);
      }
      // Left edge
      for (let y = b.y + b.h; y > b.y; y -= 15) {
        ctx.lineTo(b.x + (rng() - 0.5) * 6, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Dry-brush gouache paint streaks
    ctx.strokeStyle = `${accent}44`;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.45);
    ctx.bezierCurveTo(width * 0.4, height * 0.35, width * 0.6, height * 0.55, width * 0.85, height * 0.48);
    ctx.stroke();
  }

  // --- ISTOCK: THERMIONIC VACUUM TUBE AMBER GLOW ---
  else if (model === 'RetroVacuumTubeGlow' || pattern === 'istock-vacuum-tube-glow') {
    // Dark chassis background
    ctx.fillStyle = '#07090D';
    ctx.fillRect(0, 0, width, height);

    // Glowing thermionic heater filament
    const fx = width * 0.5;
    const fy = height * 0.5;
    const filamentGlow = ctx.createRadialGradient(fx, fy, 8, fx, fy, width * 0.45);
    filamentGlow.addColorStop(0, '#FFFFFF');
    filamentGlow.addColorStop(0.15, '#FFB703');
    filamentGlow.addColorStop(0.4, '#FB8500');
    filamentGlow.addColorStop(0.7, `${accent}44`);
    filamentGlow.addColorStop(1, 'transparent');

    ctx.fillStyle = filamentGlow;
    ctx.fillRect(0, 0, width, height);

    // Vacuum tube internal getter mirror sheen & glass cylinder outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width * 0.25, height * 0.15, width * 0.5, height * 0.7);
  }

  // --- PINTEREST: LO-FI VINYL RECORD MICROGROOVES & CRACKLE ---
  else if (model === 'VinylMicrogroove' || pattern === 'pinterest-vinyl-microgroove') {
    // Deep vinyl black
    ctx.fillStyle = '#090B0F';
    ctx.fillRect(0, 0, width, height);

    // Concentric sound microgroove arcs
    const cx = width * 0.5;
    const cy = height * 0.5;
    for (let r = 30; r < width * 0.8; r += 4) {
      ctx.strokeStyle = r % 16 === 0 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radial hourglass light reflection
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const flare = ctx.createRadialGradient(cx, cy, 20, cx, cy, width * 0.6);
    flare.addColorStop(0, `${accent}44`);
    flare.addColorStop(0.5, `${accent}11`);
    flare.addColorStop(1, 'transparent');
    ctx.fillStyle = flare;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // --- PEXELS: PRISMATIC OPTICAL DISPERSION & HALATION ---
  else if (model === 'PexelsPrismDispersion' || pattern === 'pexels-prism-dispersion') {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // Chromatic dispersion offset lines (red and cyan channel split)
    for (let i = 0; i < 7; i++) {
      const y = (height / 6) * i;
      // Red shifted channel
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, y - 3);
      ctx.lineTo(width, y - 3);
      ctx.stroke();

      // Cyan shifted channel
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, y + 3);
      ctx.lineTo(width, y + 3);
      ctx.stroke();
    }
  }

  // --- GETTY: MACHINED VINTAGE STUDIO FACEPLATE ---
  else if (model === 'GettyVintageFaceplate' || pattern === 'getty-vintage-faceplate') {
    // Industrial matte powder-coat
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // Calibration tick hairline grid
    ctx.strokeStyle = `${accent}25`;
    ctx.lineWidth = 0.8;
    for (let x = 40; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 15);
      ctx.lineTo(x, 25);
      ctx.stroke();
    }
  }

  // --- DEFAULT FALLBACK ---
  else {
    const defaultGrad = ctx.createLinearGradient(0, 0, width, height);
    defaultGrad.addColorStop(0, midColor);
    defaultGrad.addColorStop(0.5, baseColor);
    defaultGrad.addColorStop(1, midColor);
    ctx.fillStyle = defaultGrad;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();

  // 3. CATALOG-UNIQUE STRUCTURAL SIGNATURE
  // This is deliberately separate from the reference renderer so each preset
  // has its own visual construction rather than being a palette-only duplicate.
  renderCatalogSignature(ctx, catalogSignature || patternSignature, width, height, accent, midColor, seed);

  // 4. UNIVERSAL MULTI-OCTAVE PROCEDURAL GRAIN PASS
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const grainAmount = Math.floor(roughness * 28 * contrast);

  if (grainAmount > 1) {
    const numOctaves = Math.max(1, Math.min(8, Math.round(octaves)));
    const targetDensity = Math.max(0.1, Math.min(1.0, density));

    for (let i = 0; i < data.length; i += 4) {
      // Stochastic probability thresholding according to grain density
      if (targetDensity < 0.98) {
        const pHash = ((Math.sin(i * 7.1828 + seed) * 43758.5453) % 1 + 1) % 1;
        if (pHash > targetDensity) continue;
      }

      // Multi-octave frequency harmonic noise summation
      let n = 0;
      let amp = 1.0;
      let freq = 12.9898;
      let totalAmp = 0;

      for (let o = 0; o < numOctaves; o++) {
        const octaveVal = ((Math.sin((i + o * 137) * freq + seed * (o + 1)) * 43758.5453) % 1 + 1) % 1;
        n += octaveVal * amp;
        totalAmp += amp;
        amp *= 0.52;
        freq *= 2.19;
      }
      n = n / totalAmp;

      const delta = (n - 0.5) * grainAmount;
      data[i] = Math.min(255, Math.max(0, data[i] + delta));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + delta));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + delta));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // 5. CALIBRATED VIGNETTE OVERLAY
  if (vignette > 0.05) {
    const vigGrad = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.25,
      width / 2, height / 2, width * 0.72
    );
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(1, `rgba(0, 0, 0, ${Math.min(0.85, vignette * 1.1)})`);
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, width, height);
  }
}

export function exportTextureAsPng(
  skin: SkinDefinition,
  arg2?: number | TextureArchetype,
  arg3?: number,
  arg4?: TextureArchetype | number
): string {
  if (typeof document === 'undefined') return '';
  let width = 1000;
  let height = 760;
  let archetype: TextureArchetype | undefined;

  if (typeof arg2 === 'object' && arg2 !== null) {
    archetype = arg2 as TextureArchetype;
    if (typeof arg3 === 'number') width = arg3;
    if (typeof arg4 === 'number') height = arg4;
  } else if (typeof arg2 === 'number') {
    width = arg2;
    if (typeof arg3 === 'number') height = arg3;
    if (typeof arg4 === 'object' && arg4 !== null) archetype = arg4 as TextureArchetype;
  }

  const canvas = document.createElement('canvas');
  renderTextureToCanvas(canvas, skin, width, height, archetype);
  return canvas.toDataURL('image/png');
}

export function exportTextureAsSvg(
  skin: SkinDefinition,
  arg2?: number | TextureArchetype,
  arg3?: number,
  arg4?: TextureArchetype | number
): string {
  let width = 1000;
  let height = 760;
  let archetype: TextureArchetype | undefined;

  if (typeof arg2 === 'object' && arg2 !== null) {
    archetype = arg2 as TextureArchetype;
    if (typeof arg3 === 'number') width = arg3;
    if (typeof arg4 === 'number') height = arg4;
  } else if (typeof arg2 === 'number') {
    width = arg2;
    if (typeof arg3 === 'number') height = arg3;
    if (typeof arg4 === 'object' && arg4 !== null) archetype = arg4 as TextureArchetype;
  }

  const p = archetype?.primaryTint || skin.panelDark;
  const s = archetype?.secondaryTint || skin.panelDarker;
  const a = archetype?.accentTint || skin.amber;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p}" />
      <stop offset="50%" stop-color="${s}" />
      <stop offset="100%" stop-color="${p}" />
    </linearGradient>
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feBlend mode="overlay" in="SourceGraphic"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGrad)" />
  <rect width="100%" height="100%" fill="url(#bgGrad)" filter="url(#noiseFilter)" opacity="0.45" />
  <rect width="100%" height="100%" fill="none" stroke="${a}" stroke-width="2" opacity="0.3" />
</svg>`;
}
