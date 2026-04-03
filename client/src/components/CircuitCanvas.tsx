import { useEffect, useRef } from "react";
import pythonIcon from "@assets/python-1536x1536_1775224863983.webp";
import reactIcon  from "@assets/0_zj_kGMq6f2ZxW7p3_1775224864083.webp";
import jsIcon     from "@assets/JqxsAtj7G5bc4D8vfE5LKrGjLhm2dgYi7aRtEXBd_1775224864139.jpg";

// 8-directional system including diagonals
type Dir = "up" | "down" | "left" | "right" | "ur" | "ul" | "dr" | "dl";

const DIAG = Math.SQRT1_2;

const DIR_VEC: Record<Dir, [number, number]> = {
  right: [1, 0], left:  [-1, 0],
  down:  [0, 1], up:    [0, -1],
  ur:    [DIAG, -DIAG], ul: [-DIAG, -DIAG],
  dr:    [DIAG,  DIAG], dl: [-DIAG,  DIAG],
};

const CHILD_DIRS: Record<Dir, Dir[]> = {
  ur:    ["right", "up", "ur", "dr", "ul"],
  dr:    ["right", "down", "dr", "ur", "dl"],
  ul:    ["left",  "up",   "ul", "dl", "ur"],
  dl:    ["left",  "down", "dl", "ul", "dr"],
  right: ["up", "down", "ur", "dr", "right"],
  left:  ["up", "down", "ul", "dl", "left"],
  up:    ["left", "right", "ul", "ur", "up"],
  down:  ["left", "right", "dl", "dr", "down"],
};

const LINE_COLOR = "#a78bfa";
const DOT_COLOR  = "#c4b5fd";
const GLOW_COLOR = "#7c3aed";
const MAX_DEPTH  = 5;
const ICON_SIZE  = 28;
const ICON_DURATION = 2000; // ms each icon stays visible

interface Branch {
  x: number; y: number;
  tx: number; ty: number;
  cx: number; cy: number;
  dir: Dir;
  speed: number;
  done: boolean;
  alpha: number;
  fading: boolean;
  spawned: boolean;
  depth: number;
}

interface IconDisplay {
  img: HTMLImageElement;
  x: number;
  y: number;
  age: number;
}

function makeBranch(x: number, y: number, dir: Dir, maxLen: number, depth: number): Branch {
  const len = 35 + Math.random() * maxLen;
  const [dx, dy] = DIR_VEC[dir];
  return {
    x, y,
    tx: x + dx * len, ty: y + dy * len,
    cx: x, cy: y,
    dir, speed: 1.6 + Math.random() * 2.4,
    done: false, alpha: 1, fading: false, spawned: false, depth,
  };
}

export function CircuitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let animId: number;
    const branches: Branch[] = [];

    // ── Pre-load tech icons ──────────────────────────────────────────────────
    const iconImages: HTMLImageElement[] = [pythonIcon, reactIcon, jsIcon].map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // Active icon displays at nodes
    const activeIcons: IconDisplay[] = [];

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Pulse dots ───────────────────────────────────────────────────────────
    interface Pulse { branch: Branch; t: number; speed: number; }
    const pulses: Pulse[] = [];
    function spawnPulse(b: Branch) {
      if (!b.done) return;
      pulses.push({ branch: b, t: 0, speed: 0.005 + Math.random() * 0.006 });
    }

    // ── Seed branches ────────────────────────────────────────────────────────
    function seed() {
      const w = canvas.width, h = canvas.height;
      const diagSeeds: Array<{ x: number; y: number; dir: Dir }> = [
        { x: w * 0.05, y: h * 0.05, dir: "dr" },
        { x: w * 0.1,  y: h * 0.0,  dir: "dr" },
        { x: w * 0.55, y: h * 0.0,  dir: "dr" },
        { x: w * 0.62, y: h * 0.05, dir: "dl" },
        { x: w * 1.0,  y: h * 0.3,  dir: "dl" },
        { x: w * 1.0,  y: h * 0.55, dir: "ul" },
        { x: w * 0.0,  y: h * 0.1,  dir: "dr" },
        { x: w * 0.85, y: h * 0.15, dir: "dl" },
      ];
      const orthSeeds: Array<{ x: number; y: number; dir: Dir }> = [
        { x: w * 0.02 + Math.random() * w * 0.1, y: h * 0.05 + Math.random() * h * 0.1, dir: "right" },
        { x: w * 0.7  + Math.random() * w * 0.25, y: Math.random() * h * 0.4, dir: "left"  },
        { x: w * 0.6  + Math.random() * w * 0.35, y: h * 0.5 + Math.random() * h * 0.4, dir: "up"   },
        { x: Math.random() * w * 0.3, y: h * 0.6 + Math.random() * h * 0.35, dir: "right" },
      ];
      [...diagSeeds, ...orthSeeds].forEach(({ x, y, dir }) => {
        branches.push(makeBranch(x, y, dir, 110, 0));
      });
    }
    seed();

    // ── Spawn children ───────────────────────────────────────────────────────
    function spawnChildren(b: Branch) {
      if (b.spawned || b.depth >= MAX_DEPTH) return;
      b.spawned = true;
      const candidates = CHILD_DIRS[b.dir];
      const maxKids = Math.max(1, 3 - Math.floor(b.depth * 0.7));
      const numKids = 1 + Math.floor(Math.random() * maxKids);
      const used = new Set<Dir>();
      for (let i = 0; i < numKids; i++) {
        if (Math.random() < 0.12) continue;
        let dir: Dir; let tries = 0;
        do {
          dir = candidates[Math.floor(Math.random() * candidates.length)];
          tries++;
        } while (used.has(dir) && tries < 8);
        used.add(dir);
        branches.push(makeBranch(b.tx, b.ty, dir, Math.max(20, 90 - b.depth * 14), b.depth + 1));
      }
      if (Math.random() < 0.35) setTimeout(() => spawnPulse(b), 500 + Math.random() * 900);
    }

    // ── Icon spawner — pick a random done node every 2 s ────────────────────
    const iconSpawner = setInterval(() => {
      const nodes = branches.filter(b => b.done && !b.fading);
      if (nodes.length === 0) return;
      const node = nodes[Math.floor(Math.random() * nodes.length)];
      const img  = iconImages[Math.floor(Math.random() * iconImages.length)];
      if (!img.complete) return;
      activeIcons.push({ img, x: node.tx, y: node.ty, age: 0 });
    }, 2000);

    // ── Re-seed when sparse ──────────────────────────────────────────────────
    const reseeder = setInterval(() => {
      if (branches.filter(b => !b.fading).length < 24) seed();
      branches
        .filter(b => b.done && !b.fading && b.depth >= MAX_DEPTH - 1)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .forEach(b => { b.fading = true; });
    }, 2000);

    // ── Draw loop ────────────────────────────────────────────────────────────
    let lastTime = performance.now();

    function draw() {
      animId = requestAnimationFrame(draw);
      const now = performance.now();
      const dt  = Math.min(now - lastTime, 50);
      lastTime  = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Branches
      for (let i = branches.length - 1; i >= 0; i--) {
        const b = branches[i];
        if (!b.done) {
          const dx = b.tx - b.cx, dy = b.ty - b.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= b.speed) {
            b.cx = b.tx; b.cy = b.ty; b.done = true;
            setTimeout(() => spawnChildren(b), 60 + Math.random() * 180);
          } else {
            b.cx += (dx / dist) * b.speed;
            b.cy += (dy / dist) * b.speed;
          }
        }
        if (b.fading) {
          b.alpha -= 0.004;
          if (b.alpha <= 0) { branches.splice(i, 1); continue; }
        }
        ctx.globalAlpha = b.alpha * 0.78;
        ctx.shadowColor = GLOW_COLOR; ctx.shadowBlur = 6;
        ctx.strokeStyle = LINE_COLOR; ctx.lineWidth = 1.15; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.cx, b.cy); ctx.stroke();
        ctx.fillStyle = DOT_COLOR; ctx.shadowBlur = 9;
        ctx.beginPath(); ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2); ctx.fill();
        if (b.done) {
          ctx.beginPath();
          ctx.arc(b.tx, b.ty, b.depth === MAX_DEPTH ? 1.4 : 2.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Pulse dots
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t > 1 || p.branch.fading) { pulses.splice(i, 1); continue; }
        const px = p.branch.x + (p.branch.tx - p.branch.x) * p.t;
        const py = p.branch.y + (p.branch.ty - p.branch.y) * p.t;
        ctx.globalAlpha = 0.92; ctx.fillStyle = "#ffffff";
        ctx.shadowColor = LINE_COLOR; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill();
      }

      // ── Tech icons at nodes ─────────────────────────────────────────────
      const FADE = 350; // fade in/out window ms
      for (let i = activeIcons.length - 1; i >= 0; i--) {
        const ic = activeIcons[i];
        ic.age += dt;
        if (ic.age >= ICON_DURATION) { activeIcons.splice(i, 1); continue; }

        let alpha: number;
        if (ic.age < FADE) {
          alpha = ic.age / FADE;
        } else if (ic.age > ICON_DURATION - FADE) {
          alpha = (ICON_DURATION - ic.age) / FADE;
        } else {
          alpha = 1;
        }

        const half = ICON_SIZE / 2;
        // Subtle glow ring behind icon
        ctx.globalAlpha = alpha * 0.3;
        ctx.shadowColor = LINE_COLOR;
        ctx.shadowBlur  = 18;
        ctx.fillStyle   = "#170f2e";
        ctx.beginPath();
        ctx.arc(ic.x, ic.y, half + 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw icon
        ctx.globalAlpha = alpha;
        ctx.shadowBlur  = 10;
        ctx.shadowColor = "#ffffff";
        try {
          ctx.drawImage(ic.img, ic.x - half, ic.y - half, ICON_SIZE, ICON_SIZE);
        } catch (_) { /* image not ready */ }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur  = 0;
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(reseeder);
      clearInterval(iconSpawner);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
