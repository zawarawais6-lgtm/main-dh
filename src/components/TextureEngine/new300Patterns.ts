// Procedural canvas renderers for all 300 new presets from the 60 inspiration references

export function renderNew300Pattern(
  ctx: CanvasRenderingContext2D,
  model: string,
  pattern: string,
  width: number,
  height: number,
  baseColor: string,
  midColor: string,
  accent: string,
  flowAngle: number,
  seed: number,
  rng: () => number
): boolean {
  // 1. MOTION DEV — THREE.JS SHADER TOPOGRAPHY
  if (model === 'ShaderTopography' || pattern.includes('shader-topography')) {
    const linesCount = 28;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < linesCount; i++) {
      const yBase = (height / linesCount) * i;
      ctx.beginPath();
      ctx.strokeStyle = i % 4 === 0 ? `${accent}DD` : `${midColor}99`;
      ctx.shadowColor = i % 4 === 0 ? accent : 'transparent';
      ctx.shadowBlur = i % 4 === 0 ? 8 : 0;

      for (let x = 0; x <= width; x += 15) {
        const nx = x * 0.008;
        const ny = (yBase + seed * 10) * 0.006;
        const elevation = Math.sin(nx * 3 + ny * 2) * 25 + Math.cos(nx * 1.5 - ny * 3) * 18;
        const y = yBase + elevation;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    return true;
  }

  // 2. CODESANDBOX — EXKEI LIQUID MESH WARP
  if (model === 'ExkeiLiquidWarp' || pattern.includes('exkei-liquid')) {
    const ripples = 8;
    for (let r = 0; r < ripples; r++) {
      const cx = width * (0.3 + (r % 3) * 0.25);
      const cy = height * (0.2 + (r % 4) * 0.2);
      const radius = 60 + r * 35;
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
      grad.addColorStop(0, `${accent}44`);
      grad.addColorStop(0.5, `${midColor}33`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Caustic chromatic ripple
      ctx.strokeStyle = r % 2 === 0 ? `${accent}88` : `${midColor}AA`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.1) {
        const distort = Math.sin(a * 6 + r + seed) * 12;
        const rx = cx + (radius + distort) * Math.cos(a);
        const ry = cy + (radius + distort) * Math.sin(a);
        if (a === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
      }
      ctx.closePath();
      ctx.stroke();
    }
    return true;
  }

  // 3. CODESANDBOX — GGYZKV KINETIC GLSL MESH
  if (model === 'GgyzkvKineticMesh' || pattern.includes('ggyzkv-kinetic')) {
    const nodes = 18;
    const points: [number, number][] = [];
    for (let i = 0; i < nodes; i++) {
      points.push([rng() * width, rng() * height]);
    }
    // Connect intersecting kinetic lattice
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = `${accent}55`;
    for (let i = 0; i < nodes; i++) {
      for (let j = i + 1; j < nodes; j++) {
        const dist = Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(points[i][0], points[i][1]);
          ctx.lineTo(points[j][0], points[j][1]);
          ctx.stroke();
        }
      }
    }
    // Glowing node vertices
    for (const [x, y] of points) {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    return true;
  }

  // 4. BOOK OF SHAPES: FLOW POLES
  if (model === 'FlowPoles' || pattern.includes('flow-poles')) {
    const pole1 = { x: width * 0.28, y: height * 0.5 };
    const pole2 = { x: width * 0.72, y: height * 0.5 };
    const streams = 36;
    ctx.lineWidth = 1.0;

    for (let i = 0; i < streams; i++) {
      const angle = (i / streams) * Math.PI * 2;
      ctx.strokeStyle = i % 2 === 0 ? `${accent}88` : `${midColor}BB`;
      ctx.beginPath();
      let curX = pole1.x + Math.cos(angle) * 15;
      let curY = pole1.y + Math.sin(angle) * 15;
      ctx.moveTo(curX, curY);

      for (let s = 0; s < 45; s++) {
        // Dipole field vector
        const d1x = curX - pole1.x;
        const d1y = curY - pole1.y;
        const r1 = Math.max(15, Math.hypot(d1x, d1y));
        const d2x = curX - pole2.x;
        const d2y = curY - pole2.y;
        const r2 = Math.max(15, Math.hypot(d2x, d2y));

        const vx = d1x / (r1 * r1 * r1) - d2x / (r2 * r2 * r2);
        const vy = d1y / (r1 * r1 * r1) - d2y / (r2 * r2 * r2);
        const vLen = Math.hypot(vx, vy) || 1;
        curX += (vx / vLen) * 18;
        curY += (vy / vLen) * 18;
        ctx.lineTo(curX, curY);
        if (r2 < 18) break;
      }
      ctx.stroke();
    }
    // Poles indicator dots
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(pole1.x, pole1.y, 4, 0, Math.PI * 2);
    ctx.arc(pole2.x, pole2.y, 4, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }

  // 5. BOOK OF SHAPES: FLOW LINES
  if (model === 'FlowLines' || pattern.includes('flow-lines')) {
    const lineCount = 38;
    ctx.lineWidth = 1.1;
    for (let i = 0; i < lineCount; i++) {
      const startY = (height / lineCount) * i;
      ctx.strokeStyle = i % 3 === 0 ? `${accent}AA` : `${midColor}88`;
      ctx.beginPath();
      ctx.moveTo(0, startY);
      for (let x = 0; x <= width; x += 20) {
        const y = startY + Math.sin(x * 0.01 + i * 0.2 + seed) * 24 + Math.cos(x * 0.005 + i * 0.1) * 15;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    return true;
  }

  // 6. BOOK OF SHAPES: FLOW DOTS
  if (model === 'FlowDots' || pattern.includes('flow-dots')) {
    const dotCount = 140;
    for (let i = 0; i < dotCount; i++) {
      const x = rng() * width;
      const y = rng() * height;
      const r = 1.0 + rng() * 2.8;
      ctx.fillStyle = i % 4 === 0 ? accent : `${midColor}CC`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      // Flow trajectory tail
      ctx.strokeStyle = `${accent}33`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(flowAngle * 0.017) * 18, y + Math.sin(flowAngle * 0.017) * 18);
      ctx.stroke();
    }
    return true;
  }

  // 7. BOOK OF SHAPES: SPIRAL MORPH
  if (model === 'SpiralMorph' || pattern.includes('spiral-morph')) {
    const cx = width / 2;
    const cy = height / 2;
    const turns = 7;
    const arms = 4;
    ctx.lineWidth = 1.3;
    for (let arm = 0; arm < arms; arm++) {
      const offsetAngle = (arm * Math.PI * 2) / arms;
      ctx.strokeStyle = arm % 2 === 0 ? `${accent}DD` : `${midColor}AA`;
      ctx.beginPath();
      for (let t = 0; t < turns * Math.PI * 2; t += 0.08) {
        const r = 8 + t * 14;
        const morph = Math.sin(t * 3 + seed) * 8;
        const a = t + offsetAngle;
        const x = cx + (r + morph) * Math.cos(a);
        const y = cy + (r + morph) * Math.sin(a);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    return true;
  }

  // 8. BOOK OF SHAPES: BROCKMANN ARCS
  if (model === 'BrockmannArcs' || pattern.includes('brockmann-arcs')) {
    const cx = width * 0.35;
    const cy = height * 0.5;
    const arcCount = 14;
    ctx.lineWidth = 1.6;
    for (let i = 1; i <= arcCount; i++) {
      const rad = i * 26;
      ctx.strokeStyle = i % 3 === 0 ? accent : `${midColor}BB`;
      ctx.beginPath();
      const startAngle = (i * 15 * Math.PI) / 180;
      const endAngle = startAngle + (120 * Math.PI) / 180;
      ctx.arc(cx, cy, rad, startAngle, endAngle);
      ctx.stroke();

      // Counter arc
      ctx.beginPath();
      ctx.arc(width - cx, cy, rad * 0.8, startAngle + Math.PI, endAngle + Math.PI);
      ctx.stroke();
    }
    return true;
  }

  // 9. BOOK OF SHAPES: WAVY LINES CONVERGING
  if (model === 'WavyLinesConverging' || pattern.includes('wavy-lines-converging')) {
    const focalX = width * 0.85;
    const focalY = height * 0.5;
    const waveCount = 26;
    ctx.lineWidth = 1.0;
    for (let i = 0; i < waveCount; i++) {
      const startY = (height / waveCount) * i;
      ctx.strokeStyle = i % 2 === 0 ? `${accent}99` : `${midColor}99`;
      ctx.beginPath();
      ctx.moveTo(0, startY);
      for (let x = 0; x <= focalX; x += 15) {
        const progress = x / focalX;
        const targetY = startY * (1 - progress) + focalY * progress;
        const wave = Math.sin(x * 0.03 + i) * 16 * (1 - progress);
        ctx.lineTo(x, targetY + wave);
      }
      ctx.stroke();
    }
    return true;
  }

  // 10. BOOK OF SHAPES: CHAOS CIRCLES
  if (model === 'ChaosCircles' || pattern.includes('chaos-circles')) {
    const cx = width / 2;
    const cy = height / 2;
    const circleCount = 18;
    ctx.lineWidth = 1.2;
    for (let i = 1; i <= circleCount; i++) {
      const baseR = i * 18;
      ctx.strokeStyle = i % 3 === 0 ? accent : `${midColor}99`;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.08) {
        const noise = Math.sin(a * 4 + i + seed) * 8 + Math.cos(a * 7 - i) * 5;
        const r = baseR + noise;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    return true;
  }

  // 11. BOOK OF SHAPES: CONCENTRIC NOISE RINGS
  if (model === 'ConcentricNoiseRings' || pattern.includes('concentric-noise-rings')) {
    const cx = width / 2;
    const cy = height / 2;
    const ringCount = 22;
    for (let i = 1; i <= ringCount; i++) {
      const r = i * 16;
      ctx.strokeStyle = i % 4 === 0 ? `${accent}DD` : `${midColor}88`;
      ctx.lineWidth = i % 4 === 0 ? 1.8 : 0.9;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.05) {
        const wobble = Math.sin(a * 8 + i * 0.5) * 4;
        const px = cx + (r + wobble) * Math.cos(a);
        const py = cy + (r + wobble) * Math.sin(a);
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
    return true;
  }

  // 12. BOOK OF SHAPES: HALFTONE SPHERE
  if (model === 'HalftoneSphere' || pattern.includes('halftone-sphere')) {
    const cx = width / 2;
    const cy = height / 2;
    const sphereRadius = Math.min(width, height) * 0.38;
    const step = 16;
    for (let y = cy - sphereRadius; y <= cy + sphereRadius; y += step) {
      for (let x = cx - sphereRadius; x <= cx + sphereRadius; x += step) {
        const dx = x - cx;
        const dy = y - cy;
        const d = Math.hypot(dx, dy);
        if (d <= sphereRadius) {
          const z = Math.sqrt(sphereRadius * sphereRadius - d * d);
          // Lambertian diffuse illumination from top-left
          const lightX = -0.577;
          const lightY = -0.577;
          const lightZ = 0.577;
          const nx = dx / sphereRadius;
          const ny = dy / sphereRadius;
          const nz = z / sphereRadius;
          const dot = Math.max(0.1, -(nx * lightX + ny * lightY + nz * lightZ));
          const dotRadius = dot * (step * 0.48);

          ctx.fillStyle = dot > 0.6 ? accent : `${midColor}DD`;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    return true;
  }

  // 13. BOOK OF SHAPES: LISSAJOUS FIELD
  if (model === 'LissajousField' || pattern.includes('lissajous-field')) {
    const cx = width / 2;
    const cy = height / 2;
    const rx = width * 0.38;
    const ry = height * 0.38;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 6;
    ctx.strokeStyle = `${accent}EE`;
    ctx.beginPath();
    const a = 3;
    const b = 4;
    const delta = Math.PI / 3;
    for (let t = 0; t <= Math.PI * 2; t += 0.01) {
      const x = cx + rx * Math.sin(a * t + delta);
      const y = cy + ry * Math.sin(b * t);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    return true;
  }

  // 14. BOOK OF SHAPES: MODULAR CIRCLE
  if (model === 'ModularCircle' || pattern.includes('modular-circle')) {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.38;
    const points = 120;
    const multiplier = 3;
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = `${accent}66`;

    for (let i = 0; i < points; i++) {
      const j = (i * multiplier) % points;
      const a1 = (i / points) * Math.PI * 2;
      const a2 = (j / points) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + r * Math.cos(a1), cy + r * Math.sin(a1));
      ctx.lineTo(cx + r * Math.cos(a2), cy + r * Math.sin(a2));
      ctx.stroke();
    }
    // Perimeter ring
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    return true;
  }

  // 15. BOOK OF SHAPES: PHYLLOTAXIS BLOOM
  if (model === 'PhyllotaxisBloom' || pattern.includes('phyllotaxis-bloom')) {
    const cx = width / 2;
    const cy = height / 2;
    const floretCount = 280;
    const c = 11;
    for (let n = 0; n < floretCount; n++) {
      const a = n * 137.508 * (Math.PI / 180);
      const r = c * Math.sqrt(n);
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      const dotSize = 1.0 + (n / floretCount) * 2.5;

      ctx.fillStyle = n % 5 === 0 ? accent : `${midColor}DD`;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
    return true;
  }

  // 16. BOOK OF SHAPES: NOISE LANDSCAPE
  if (model === 'NoiseLandscape' || pattern.includes('noise-landscape')) {
    const rows = 24;
    ctx.lineWidth = 1.1;
    for (let r = 0; r < rows; r++) {
      const baseY = height * 0.3 + (height * 0.65 / rows) * r;
      ctx.strokeStyle = r % 3 === 0 ? `${accent}BB` : `${midColor}88`;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 15) {
        const nx = x * 0.007;
        const ny = r * 0.15;
        const h = Math.sin(nx * 4 + ny) * 28 + Math.cos(nx * 2 - ny) * 14;
        const y = baseY - h;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    return true;
  }

  // 17. BOOK OF SHAPES: NOISE CIRCLE
  if (model === 'NoiseCircle' || pattern.includes('noise-circle')) {
    const cx = width / 2;
    const cy = height / 2;
    const layers = 5;
    for (let l = 1; l <= layers; l++) {
      const baseR = l * 40;
      ctx.strokeStyle = l === layers ? accent : `${midColor}88`;
      ctx.lineWidth = l === layers ? 2.0 : 1.0;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.04) {
        const offset = Math.sin(a * 5 + seed + l) * 14 + Math.cos(a * 3) * 8;
        const r = baseR + offset;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    return true;
  }

  // 18. BOOK OF SHAPES: RADIAL SPOKES
  if (model === 'RadialSpokes' || pattern.includes('radial-spokes')) {
    const cx = width / 2;
    const cy = height / 2;
    const spokeCount = 72;
    const rInner = 40;
    const rOuter = Math.min(width, height) * 0.42;
    for (let i = 0; i < spokeCount; i++) {
      const a = (i / spokeCount) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      ctx.strokeStyle = isMajor ? accent : `${midColor}77`;
      ctx.lineWidth = isMajor ? 1.8 : 0.8;
      ctx.beginPath();
      ctx.moveTo(cx + rInner * Math.cos(a), cy + rInner * Math.sin(a));
      ctx.lineTo(cx + rOuter * Math.cos(a), cy + rOuter * Math.sin(a));
      ctx.stroke();
    }
    return true;
  }

  // 19. BOOK OF SHAPES: POLAR MESH
  if (model === 'PolarMesh' || pattern.includes('polar-mesh')) {
    const cx = width / 2;
    const cy = height / 2;
    const rings = 8;
    const spokes = 24;
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = `${midColor}88`;
    // Rings
    for (let i = 1; i <= rings; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, i * 35, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Rays
    ctx.strokeStyle = `${accent}66`;
    for (let j = 0; j < spokes; j++) {
      const a = (j / spokes) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * (rings * 35), cy + Math.sin(a) * (rings * 35));
      ctx.stroke();
    }
    return true;
  }

  // 20. BOOK OF SHAPES: RESONANCE FIELD
  if (model === 'ResonanceField' || pattern.includes('resonance-field')) {
    const grid = 28;
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = `${accent}77`;
    for (let y = 20; y < height; y += grid) {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 15) {
        // Chladni modal pattern approximation: cos(n*pi*x)*cos(m*pi*y)
        const val = Math.cos((x / width) * Math.PI * 4) * Math.cos((y / height) * Math.PI * 4);
        const yOff = val * 18;
        if (x === 0) ctx.moveTo(x, y + yOff);
        else ctx.lineTo(x, y + yOff);
      }
      ctx.stroke();
    }
    return true;
  }

  // 21. BOOK OF SHAPES: SPIRAL DOT FIELD
  if (model === 'SpiralDotField' || pattern.includes('spiral-dot-field')) {
    const cx = width / 2;
    const cy = height / 2;
    const points = 320;
    for (let i = 0; i < points; i++) {
      const theta = i * 0.18;
      const r = Math.sqrt(i) * 16;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      ctx.fillStyle = i % 4 === 0 ? accent : `${midColor}CC`;
      ctx.beginPath();
      ctx.arc(x, y, 1.2 + (i / points) * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    return true;
  }

  // 22. FFFUEL: AAABSTRACT ORGANIC SVG BLOBS
  if (model === 'FffuelAbstract' || pattern.includes('fffuel-aaabstract')) {
    const blobCount = 4;
    for (let b = 0; b < blobCount; b++) {
      const bx = width * (0.25 + (b % 2) * 0.5);
      const by = height * (0.3 + Math.floor(b / 2) * 0.4);
      const br = 90 + b * 20;
      const grad = ctx.createRadialGradient(bx, by, 10, bx, by, br);
      grad.addColorStop(0, `${accent}66`);
      grad.addColorStop(0.6, `${midColor}44`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
    return true;
  }

  // 23. FFFUEL: TTTEXTURE PROCEDURAL MICRO-GRID
  if (model === 'FffuelTexture' || pattern.includes('fffuel-tttexture')) {
    const step = 8;
    ctx.strokeStyle = `${accent}22`;
    ctx.lineWidth = 0.7;
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        if ((x + y) % (step * 2) === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + step * 0.6, y + step * 0.6);
          ctx.stroke();
        }
      }
    }
    return true;
  }

  // 24. SHADERS.COM: SHIFTED SWIRLS
  if (model === 'ShiftedSwirls' || pattern.includes('shifted-swirls')) {
    const cx = width / 2;
    const cy = height / 2;
    const swirls = 16;
    ctx.lineWidth = 2.0;
    for (let i = 0; i < swirls; i++) {
      const aStart = (i / swirls) * Math.PI * 2;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, accent);
      grad.addColorStop(1, midColor);
      ctx.strokeStyle = grad;
      ctx.beginPath();
      for (let r = 10; r < Math.min(width, height) * 0.48; r += 8) {
        const a = aStart + (r * 0.015);
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (r === 10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    return true;
  }

  // 25. SHADERS.COM: VIBRANT WAVES
  if (model === 'VibrantWaves' || pattern.includes('vibrant-waves')) {
    const waveCount = 20;
    ctx.lineWidth = 1.8;
    for (let w = 0; w < waveCount; w++) {
      const y = (height / waveCount) * w;
      ctx.strokeStyle = w % 2 === 0 ? `${accent}DD` : `${midColor}BB`;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 15) {
        const wave = Math.sin(x * 0.02 + w * 0.4) * 22 + Math.cos(x * 0.01) * 12;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
    return true;
  }

  // 26. SHADERS.COM: SWIRLING GRADIENT
  if (model === 'SwirlingGradient' || pattern.includes('swirling-gradient')) {
    const grad = ctx.createConicGradient(flowAngle * (Math.PI / 180), width / 2, height / 2);
    grad.addColorStop(0, baseColor);
    grad.addColorStop(0.3, midColor);
    grad.addColorStop(0.6, accent);
    grad.addColorStop(1, baseColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return true;
  }

  // 27. SHADERS.COM: RADIAL OVERLAP
  if (model === 'RadialOverlap' || pattern.includes('radial-overlap')) {
    const c1 = { x: width * 0.38, y: height * 0.5 };
    const c2 = { x: width * 0.62, y: height * 0.5 };
    const radius = Math.min(width, height) * 0.35;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const g1 = ctx.createRadialGradient(c1.x, c1.y, 20, c1.x, c1.y, radius);
    g1.addColorStop(0, `${accent}88`);
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.arc(c1.x, c1.y, radius, 0, Math.PI * 2);
    ctx.fill();

    const g2 = ctx.createRadialGradient(c2.x, c2.y, 20, c2.x, c2.y, radius);
    g2.addColorStop(0, `${midColor}88`);
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(c2.x, c2.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return true;
  }

  // 28. SHADERS.COM: HOLOGRAPHIC WAVES
  if (model === 'HolographicWaves' || pattern.includes('holographic-waves')) {
    const ribbons = 12;
    for (let i = 0; i < ribbons; i++) {
      const y = (height / ribbons) * i;
      const grad = ctx.createLinearGradient(0, y, width, y + 40);
      grad.addColorStop(0, `${accent}AA`);
      grad.addColorStop(0.5, '#00FFFF');
      grad.addColorStop(1, `${midColor}AA`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 20) {
        const offset = Math.sin(x * 0.015 + i * 0.5) * 30;
        if (x === 0) ctx.moveTo(x, y + offset);
        else ctx.lineTo(x, y + offset);
      }
      ctx.stroke();
    }
    return true;
  }

  // 29. SHADERS.COM: FRINGE
  if (model === 'FringeShader' || pattern.includes('fringe-shader')) {
    const fringes = 24;
    for (let f = 0; f < fringes; f++) {
      const rad = 20 + f * 18;
      ctx.strokeStyle = f % 2 === 0 ? `${accent}88` : `${midColor}AA`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.5, rad, 0, Math.PI * 2);
      ctx.stroke();
    }
    return true;
  }

  // 30. SHADERS.COM: TRACED PATHS
  if (model === 'TracedPaths' || pattern.includes('traced-paths')) {
    const paths = 8;
    ctx.lineWidth = 1.5;
    for (let p = 0; p < paths; p++) {
      ctx.strokeStyle = p % 2 === 0 ? accent : `${midColor}DD`;
      ctx.beginPath();
      let x = rng() * width;
      let y = rng() * height;
      ctx.moveTo(x, y);
      for (let step = 0; step < 12; step++) {
        x += (rng() - 0.5) * 120;
        y += (rng() - 0.5) * 80;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    return true;
  }

  // 31. SHADERS.COM: EMBER DRIFT
  if (model === 'EmberDrift' || pattern.includes('ember-drift')) {
    const emberCount = 90;
    for (let i = 0; i < emberCount; i++) {
      const x = rng() * width;
      const y = rng() * height;
      const rad = 1.2 + rng() * 3.5;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, rad * 2);
      grad.addColorStop(0, accent);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, rad * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    return true;
  }

  // 32. SHADERS.COM: FLOATING GLASS
  if (model === 'FloatingGlass' || pattern.includes('floating-glass')) {
    const tiles = 6;
    for (let i = 0; i < tiles; i++) {
      const tx = width * (0.2 + (i % 3) * 0.3);
      const ty = height * (0.25 + Math.floor(i / 3) * 0.4);
      const tw = 110;
      const th = 80;
      ctx.fillStyle = `${midColor}44`;
      ctx.fillRect(tx, ty, tw, th);
      ctx.strokeStyle = `${accent}99`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tx, ty, tw, th);
    }
    return true;
  }

  // 33. SHADERS.COM: ISOTOPES
  if (model === 'IsotopesShader' || pattern.includes('isotopes-shader')) {
    const cx = width / 2;
    const cy = height / 2;
    const rings = 4;
    for (let r = 1; r <= rings; r++) {
      ctx.strokeStyle = `${accent}99`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 50, r * 25, (r * Math.PI) / rings, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Nucleus
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }

  // 34. SHADERS.COM: LOST RAYS
  if (model === 'LostRays' || pattern.includes('lost-rays')) {
    const originX = width * 0.5;
    const originY = -50;
    const rayCount = 14;
    for (let i = 0; i < rayCount; i++) {
      const xTarget = (width / rayCount) * i;
      const grad = ctx.createLinearGradient(originX, originY, xTarget, height);
      grad.addColorStop(0, `${accent}88`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(originX - 10, originY);
      ctx.lineTo(originX + 10, originY);
      ctx.lineTo(xTarget + 40, height);
      ctx.lineTo(xTarget - 40, height);
      ctx.closePath();
      ctx.fill();
    }
    return true;
  }

  // 35. SHADERS.COM: MAGNETIC SHIMMER
  if (model === 'MagneticShimmer' || pattern.includes('magnetic-shimmer')) {
    const spikeCount = 42;
    const baseY = height * 0.7;
    for (let i = 0; i < spikeCount; i++) {
      const x = (width / spikeCount) * i;
      const spikeH = 40 + Math.sin(i * 0.5 + seed) * 35;
      ctx.strokeStyle = i % 2 === 0 ? accent : midColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, baseY);
      ctx.lineTo(x, baseY - spikeH);
      ctx.stroke();
    }
    return true;
  }

  // 36. SHADERS.COM: SYNTHESIS
  if (model === 'SynthesisShader' || pattern.includes('synthesis-shader')) {
    const channels = 4;
    for (let c = 0; c < channels; c++) {
      const y = height * (0.2 + c * 0.2);
      ctx.strokeStyle = c % 2 === 0 ? accent : `${midColor}DD`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 10) {
        const wave = Math.sin(x * 0.03 * (c + 1)) * 25 * Math.cos(x * 0.005);
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
    return true;
  }

  // 37. SHADERS.COM: SPECTRAL BLOOM
  if (model === 'SpectralBloom' || pattern.includes('spectral-bloom')) {
    const cx = width / 2;
    const cy = height / 2;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(width, height) * 0.45);
    grad.addColorStop(0, `${accent}CC`);
    grad.addColorStop(0.4, `${midColor}77`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(width, height) * 0.45, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }

  // 38. SHADERS.COM: SATURN RINGS
  if (model === 'SaturnRings' || pattern.includes('saturn-rings')) {
    const cx = width / 2;
    const cy = height / 2;
    const rings = 18;
    for (let r = 1; r <= rings; r++) {
      const rx = 120 + r * 14;
      const ry = 40 + r * 5;
      ctx.strokeStyle = r === 10 ? `${baseColor}FF` : (r % 2 === 0 ? `${accent}AA` : `${midColor}88`);
      ctx.lineWidth = r === 10 ? 3 : 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, (25 * Math.PI) / 180, 0, Math.PI * 2);
      ctx.stroke();
    }
    return true;
  }

  // 39. SHADERS.COM: DITHER WAVE
  if (model === 'DitherWave' || pattern.includes('dither-wave')) {
    const step = 6;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const wave = (Math.sin(x * 0.02) + Math.cos(y * 0.02)) * 0.5 + 0.5;
        if (rng() < wave) {
          ctx.fillStyle = accent;
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
    return true;
  }

  // 40. SHADERS.COM: DRIFTING CONTOURS
  if (model === 'DriftingContours' || pattern.includes('drifting-contours')) {
    const contours = 16;
    ctx.lineWidth = 1.4;
    for (let i = 0; i < contours; i++) {
      const y = (height / contours) * i;
      ctx.strokeStyle = i % 3 === 0 ? accent : `${midColor}99`;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 15) {
        const drift = Math.sin(x * 0.01 + i * 0.6) * 32;
        if (x === 0) ctx.moveTo(x, y + drift);
        else ctx.lineTo(x, y + drift);
      }
      ctx.stroke();
    }
    return true;
  }

  // 41. SHADERS.COM: HEATWAVE
  if (model === 'HeatwaveShader' || pattern.includes('heatwave-shader')) {
    const lines = 22;
    ctx.lineWidth = 1.3;
    for (let i = 0; i < lines; i++) {
      const y = (height / lines) * i;
      ctx.strokeStyle = `${accent}99`;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const mirage = Math.sin(x * 0.04 + y * 0.02) * 12;
        if (x === 0) ctx.moveTo(x, y + mirage);
        else ctx.lineTo(x, y + mirage);
      }
      ctx.stroke();
    }
    return true;
  }

  // 42. SHADERS.COM: SOFT REGISTER
  if (model === 'SoftRegister' || pattern.includes('soft-register')) {
    ctx.fillStyle = `${midColor}66`;
    ctx.fillRect(width * 0.25, height * 0.25, width * 0.5, height * 0.5);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(width * 0.25 + 4, height * 0.25 + 4, width * 0.5, height * 0.5);
    return true;
  }

  // 43. SHADERS.COM: GEOGRID
  if (model === 'GeogridShader' || pattern.includes('geogrid-shader')) {
    const gridW = 50;
    const gridH = 30;
    ctx.strokeStyle = `${accent}44`;
    ctx.lineWidth = 0.9;
    for (let x = 0; x < width; x += gridW) {
      for (let y = 0; y < height; y += gridH) {
        ctx.strokeRect(x, y, gridW, gridH);
        ctx.fillStyle = `${accent}88`;
        ctx.fillRect(x - 1, y - 1, 3, 3);
      }
    }
    return true;
  }

  // 44. SHADERS.COM: HEATED SHAPES
  if (model === 'HeatedShapes' || pattern.includes('heated-shapes')) {
    const shapeCount = 5;
    for (let i = 0; i < shapeCount; i++) {
      const sx = width * (0.2 + (i % 3) * 0.3);
      const sy = height * (0.3 + Math.floor(i / 3) * 0.35);
      const grad = ctx.createRadialGradient(sx, sy, 5, sx, sy, 70);
      grad.addColorStop(0, '#FF4500');
      grad.addColorStop(0.5, accent);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, 70, 0, Math.PI * 2);
      ctx.fill();
    }
    return true;
  }

  // 45. SHADERS.COM: MAGNIFIED PIXELS
  if (model === 'MagnifiedPixels' || pattern.includes('magnified-pixels')) {
    const colW = 12;
    const colors = ['#FF2222', '#22FF22', '#2244FF'];
    for (let x = 0; x < width; x += colW) {
      const c = colors[Math.floor(x / colW) % 3];
      ctx.fillStyle = `${c}33`;
      ctx.fillRect(x, 0, colW - 2, height);
    }
    return true;
  }

  // 46. SHADERS.COM: OUTSHINE
  if (model === 'OutshineShader' || pattern.includes('outshine-shader')) {
    const cx = width / 2;
    const cy = height / 2;
    const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(width, height) * 0.45);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, accent);
    grad.addColorStop(0.8, `${midColor}44`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(width, height) * 0.45, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }

  // 47. SHADERS.COM: UNDERTONES
  if (model === 'UndertonesShader' || pattern.includes('undertones-shader')) {
    const grad = ctx.createLinearGradient(0, height, width, 0);
    grad.addColorStop(0, `${accent}44`);
    grad.addColorStop(0.5, baseColor);
    grad.addColorStop(1, `${midColor}66`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return true;
  }

  // 48. SHADERS.COM: COLOR ECLIPSE
  if (model === 'ColorEclipse' || pattern.includes('color-eclipse')) {
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.32;
    // Radiant halo
    const halo = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.35);
    halo.addColorStop(0, accent);
    halo.addColorStop(0.4, `${accent}88`);
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // Dark eclipse body
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Diamond flare
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx + r * 0.7, cy - r * 0.7, 5, 0, Math.PI * 2);
    ctx.fill();
    return true;
  }

  // 49. COLIR: SOLAR FLARE FILM BURN & OPTICAL LIGHT LEAK
  if (model === 'ColirSolarFilmBurn' || pattern.includes('colir-solar-burn')) {
    // Deep dark umber/black ground
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // 1. Broad soft ambient cylindrical glow on the right
    const ambientGrad = ctx.createRadialGradient(
      width * 0.65, height * 0.5, 30,
      width * 0.65, height * 0.5, width * 0.5
    );
    ambientGrad.addColorStop(0, `${accent}BB`);
    ambientGrad.addColorStop(0.45, `${midColor}88`);
    ambientGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = ambientGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. High-intensity vertical optical slit beam (left-center, x: 0.20 - 0.32)
    const slitX = width * 0.26;
    const slitW = width * 0.09;
    const slitGrad = ctx.createLinearGradient(slitX - slitW * 1.5, 0, slitX + slitW * 1.5, 0);
    slitGrad.addColorStop(0, 'transparent');
    slitGrad.addColorStop(0.3, `${midColor}99`);
    slitGrad.addColorStop(0.5, accent);
    slitGrad.addColorStop(0.65, '#FFF275'); // Incandescent filament core
    slitGrad.addColorStop(0.8, accent);
    slitGrad.addColorStop(0.9, `${midColor}BB`);
    slitGrad.addColorStop(1, 'transparent');

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = slitGrad;
    ctx.fillRect(slitX - slitW * 1.5, 0, slitW * 3.0, height);

    // Sharp specular slit edge
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(slitX + slitW * 0.3, 0);
    ctx.lineTo(slitX + slitW * 0.3, height);
    ctx.stroke();

    // Top horizontal bleed bar (y: 0.01 - 0.08)
    const topBarGrad = ctx.createLinearGradient(0, 0, 0, height * 0.16);
    topBarGrad.addColorStop(0, `${accent}CC`);
    topBarGrad.addColorStop(0.5, `${midColor}77`);
    topBarGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = topBarGrad;
    ctx.fillRect(0, 0, width, height * 0.16);
    ctx.restore();

    // Emulsion grain dust specks
    ctx.fillStyle = 'rgba(255, 230, 180, 0.35)';
    for (let i = 0; i < 60; i++) {
      const gx = rng() * width;
      const gy = rng() * height;
      ctx.fillRect(gx, gy, 1.2, 1.2);
    }
    return true;
  }

  // 50. COLIR: AURORA BOREALIS COSMIC DRIFT & STARFIELD
  if (model === 'ColirAuroraCosmicDrift' || pattern.includes('colir-aurora-drift')) {
    // Void midnight navy-black base
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // 1. Soft deep navy-blue / indigo backdrop nebula
    const nebulaGrad = ctx.createLinearGradient(0, height, 0, 0);
    nebulaGrad.addColorStop(0, `${midColor}EE`);
    nebulaGrad.addColorStop(0.5, `${midColor}66`);
    nebulaGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Undulating vertical Aurora Borealis curtains
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const curtainCount = 14;
    for (let c = 0; c < curtainCount; c++) {
      const cx = width * (0.05 + (c / curtainCount) * 0.95);
      const cWidth = width * 0.12;
      const startY = height * (0.45 + Math.sin(c * 0.8 + seed) * 0.15);

      const aGrad = ctx.createLinearGradient(0, height, 0, startY);
      aGrad.addColorStop(0, `${accent}DD`);
      aGrad.addColorStop(0.35, '#40E0D0BB'); // Turquoise aurora
      aGrad.addColorStop(0.7, '#228B2277');  // Forest emerald
      aGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = aGrad;
      ctx.beginPath();
      ctx.moveTo(cx - cWidth * 0.5, height);
      // Sinusoidal drapery fold
      const foldOffset = Math.sin(c * 1.2 + seed) * 35;
      ctx.quadraticCurveTo(cx + foldOffset, height * 0.65, cx, startY);
      ctx.quadraticCurveTo(cx + cWidth * 0.5 + foldOffset, height * 0.65, cx + cWidth * 0.5, height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 3. Twinkling cosmic stardust particle field (180 micro-stars)
    const starColors = ['#FFFFFF', '#98FF98', '#40E0D0', '#FF51BE', '#E0E7FF'];
    for (let s = 0; s < 180; s++) {
      const sx = rng() * width;
      const sy = rng() * (height * 0.85); // Concentrate towards the dark upper cosmos
      const sRadius = 0.6 + rng() * 1.6;
      const sColor = starColors[s % starColors.length];
      const sAlpha = 0.35 + rng() * 0.65;

      ctx.save();
      ctx.globalAlpha = sAlpha;
      ctx.fillStyle = sColor;
      ctx.beginPath();
      ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
      ctx.fill();

      // Faint 4-point diffraction spike on brightest stars
      if (s % 18 === 0) {
        ctx.strokeStyle = `${sColor}88`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(sx - 3.5, sy);
        ctx.lineTo(sx + 3.5, sy);
        ctx.moveTo(sx, sy - 3.5);
        ctx.lineTo(sx, sy + 3.5);
        ctx.stroke();
      }
      ctx.restore();
    }
    return true;
  }

  // 51. COLIR: MOLTEN MAGMA MARBLING & VISCOUS FLUID SWIRL
  if (model === 'ColirMoltenMagmaSwirl' || pattern.includes('colir-molten-magma')) {
    // Deep rich violet-black base ground
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // 1. Broad radiant fiery lava mass (lower-left to upper-center)
    const magmaBase = ctx.createRadialGradient(
      width * 0.28, height * 0.72, 20,
      width * 0.45, height * 0.55, width * 0.65
    );
    magmaBase.addColorStop(0, '#F88405'); // Molten tangerine
    magmaBase.addColorStop(0.35, accent);  // Hot scarlet/crimson
    magmaBase.addColorStop(0.7, `${midColor}BB`); // Deep plum violet
    magmaBase.addColorStop(1, 'transparent');
    ctx.fillStyle = magmaBase;
    ctx.fillRect(0, 0, width, height);

    // 2. Viscous sinuous fluid marbling lobes
    ctx.save();
    const lobes = 9;
    for (let l = 0; l < lobes; l++) {
      const lx = width * (0.15 + (l % 3) * 0.32);
      const ly = height * (0.2 + Math.floor(l / 3) * 0.3);
      const lRadius = 80 + l * 25;

      ctx.beginPath();
      ctx.lineWidth = 3.5 + (l % 3) * 2;
      ctx.strokeStyle = l % 2 === 0 ? '#F88405CC' : `${accent}DD`;
      ctx.shadowColor = l % 2 === 0 ? '#F88405' : accent;
      ctx.shadowBlur = 8;

      ctx.moveTo(lx - lRadius * 0.7, ly + lRadius * 0.4);
      ctx.bezierCurveTo(
        lx - lRadius * 0.2, ly - lRadius * 0.8,
        lx + lRadius * 0.5, ly + lRadius * 0.7,
        lx + lRadius * 0.8, ly - lRadius * 0.3
      );
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Dark viscous crevasse folding loop (right side as seen in reference image 3)
    ctx.fillStyle = `${baseColor}DD`;
    ctx.strokeStyle = '#1F0F21';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const crevasseX = width * 0.75;
    const crevasseY = height * 0.45;
    ctx.moveTo(crevasseX - 35, crevasseY - 120);
    ctx.bezierCurveTo(crevasseX + 50, crevasseY - 60, crevasseX + 40, crevasseY + 80, crevasseX - 10, crevasseY + 140);
    ctx.bezierCurveTo(crevasseX - 60, crevasseY + 60, crevasseX - 50, crevasseY - 40, crevasseX - 35, crevasseY - 120);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Specular liquid highlights
    ctx.strokeStyle = 'rgba(255, 230, 200, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(width * 0.32, height * 0.68, 65, 0.2, 1.8);
    ctx.stroke();
    ctx.restore();

    return true;
  }

  return false;
}
