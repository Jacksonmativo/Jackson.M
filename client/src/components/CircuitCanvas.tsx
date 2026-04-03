import { useEffect, useRef } from "react";

// 8-directional system including diagonals
type Dir = "up" | "down" | "left" | "right" | "ur" | "ul" | "dr" | "dl";

const DIAG = Math.SQRT1_2; // 1/√2 ≈ 0.707

// Unit vectors for each direction
const DIR_VEC: Record<Dir, [number, number]> = {
  right: [1, 0], left:  [-1, 0],
  down:  [0, 1], up:    [0, -1],
  ur:    [DIAG, -DIAG], ul: [-DIAG, -DIAG],
  dr:    [DIAG,  DIAG], dl: [-DIAG,  DIAG],
};

// What child directions each parent can spawn
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

function makeBranch(x: number, y: number, dir: Dir, maxLen: number, depth: number): Branch {
  const len = 35 + Math.random() * maxLen;
  const [dx, dy] = DIR_VEC[dir];
  return {
    x, y,
    tx: x + dx * len,
    ty: y + dy * len,
    cx: x, cy: y,
    dir,
    speed: 1.6 + Math.random() * 2.4,
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

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Pulse dots ──────────────────────────────────────────────────────────
    interface Pulse { branch: Branch; t: number; speed: number; }
    const pulses: Pulse[] = [];
    function spawnPulse(b: Branch) {
      if (!b.done) return;
      pulses.push({ branch: b, t: 0, speed: 0.005 + Math.random() * 0.006 });
    }

    // ── Seed branches from corners & edges ──────────────────────────────────
    function seed() {
      const w = canvas.width, h = canvas.height;

      // Diagonal "spine" seeds — like the image's dominant diagonal streaks
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

      // Orthogonal fringe seeds scattered around
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

    // ── Spawn children on branch completion ─────────────────────────────────
    function spawnChildren(b: Branch) {
      if (b.spawned || b.depth >= MAX_DEPTH) return;
      b.spawned = true;

      const candidates = CHILD_DIRS[b.dir];
      // Number of children: 1–3, fewer as depth increases
      const maxKids = Math.max(1, 3 - Math.floor(b.depth * 0.7));
      const numKids = 1 + Math.floor(Math.random() * maxKids);

      const used = new Set<Dir>();
      for (let i = 0; i < numKids; i++) {
        if (Math.random() < 0.12) continue; // dead end
        let dir: Dir;
        let tries = 0;
        do {
          dir = candidates[Math.floor(Math.random() * candidates.length)];
          tries++;
        } while (used.has(dir) && tries < 8);
        used.add(dir);

        const maxLen = Math.max(20, 90 - b.depth * 14);
        branches.push(makeBranch(b.tx, b.ty, dir, maxLen, b.depth + 1));
      }

      if (Math.random() < 0.35) setTimeout(() => spawnPulse(b), 500 + Math.random() * 900);
    }

    // ── Re-seed when sparse ─────────────────────────────────────────────────
    const reseeder = setInterval(() => {
      const live = branches.filter(b => !b.fading).length;
      if (live < 24) seed();
      branches
        .filter(b => b.done && !b.fading && b.depth >= MAX_DEPTH - 1)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .forEach(b => { b.fading = true; });
    }, 2000);

    // ── Main draw loop ──────────────────────────────────────────────────────
    function draw() {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = branches.length - 1; i >= 0; i--) {
        const b = branches[i];

        // Grow toward target
        if (!b.done) {
          const dx = b.tx - b.cx, dy = b.ty - b.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= b.speed) {
            b.cx = b.tx; b.cy = b.ty;
            b.done = true;
            setTimeout(() => spawnChildren(b), 60 + Math.random() * 180);
          } else {
            b.cx += (dx / dist) * b.speed;
            b.cy += (dy / dist) * b.speed;
          }
        }

        // Fade out
        if (b.fading) {
          b.alpha -= 0.004;
          if (b.alpha <= 0) { branches.splice(i, 1); continue; }
        }

        ctx.globalAlpha = b.alpha * 0.78;
        ctx.shadowColor = GLOW_COLOR;
        ctx.shadowBlur  = 6;
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth   = 1.15;
        ctx.lineCap     = "round";

        // Trace line
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.cx, b.cy);
        ctx.stroke();

        // Start dot
        ctx.fillStyle  = DOT_COLOR;
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // End dot when done
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
        const px = p.branch.x  + (p.branch.tx - p.branch.x)  * p.t;
        const py = p.branch.y  + (p.branch.ty - p.branch.y)  * p.t;
        ctx.globalAlpha = 0.92;
        ctx.fillStyle   = "#ffffff";
        ctx.shadowColor = LINE_COLOR;
        ctx.shadowBlur  = 14;
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur  = 0;
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(reseeder);
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
