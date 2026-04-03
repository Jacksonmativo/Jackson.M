import { useEffect, useRef } from "react";

// Orthogonal only — no diagonals (PCB trace aesthetic)
type Dir = "up" | "down" | "left" | "right";

const DIR_VEC: Record<Dir, [number, number]> = {
  right: [1,  0],
  left:  [-1, 0],
  down:  [0,  1],
  up:    [0, -1],
};

// Each direction can continue forward, or turn 90° left/right
const CHILD_DIRS: Record<Dir, Dir[]> = {
  right: ["right", "up",   "down"],
  left:  ["left",  "up",   "down"],
  up:    ["up",    "left", "right"],
  down:  ["down",  "left", "right"],
};

const LINE_COLOR = "#a78bfa";
const DOT_COLOR  = "#c4b5fd";
const GLOW_COLOR = "#7c3aed";
const MAX_DEPTH  = 8;

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

function makeBranch(
  x: number,
  y: number,
  dir: Dir,
  depth: number
): Branch {
  // Shorter segments at higher depth → denser branching near tips
  const len = Math.max(18, 75 - depth * 8) + Math.random() * 35;
  const [dx, dy] = DIR_VEC[dir];
  return {
    x, y,
    tx: x + dx * len,
    ty: y + dy * len,
    cx: x, cy: y,
    dir,
    speed: 1.6 + Math.random() * 2.2,
    done: false,
    alpha: 1,
    fading: false,
    spawned: false,
    depth,
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

    // ── Seed positions match image clusters ─────────────────────────────────
    // Cluster 1: Top-center spreading downward & sideways
    // Cluster 2: Right side spreading leftward & up/down
    function seed() {
      const w = canvas.width;
      const h = canvas.height;

      const topSeeds: Array<{ x: number; y: number; dir: Dir }> = [
        { x: w * 0.22, y: 0,          dir: "down"  },
        { x: w * 0.26, y: 0,          dir: "down"  },
        { x: w * 0.30, y: 0,          dir: "down"  },
        { x: w * 0.34, y: 0,          dir: "down"  },
        { x: w * 0.38, y: 0,          dir: "down"  },
        { x: w * 0.42, y: 0,          dir: "down"  },
        { x: w * 0.20, y: h * 0.02,   dir: "right" },
        { x: w * 0.44, y: h * 0.02,   dir: "right" },
        { x: w * 0.18, y: h * 0.04,   dir: "down"  },
        { x: w * 0.46, y: h * 0.04,   dir: "down"  },
      ];

      const rightSeeds: Array<{ x: number; y: number; dir: Dir }> = [
        { x: w,        y: h * 0.30,   dir: "left"  },
        { x: w,        y: h * 0.36,   dir: "left"  },
        { x: w,        y: h * 0.42,   dir: "left"  },
        { x: w,        y: h * 0.48,   dir: "left"  },
        { x: w,        y: h * 0.54,   dir: "left"  },
        { x: w,        y: h * 0.60,   dir: "left"  },
        { x: w,        y: h * 0.66,   dir: "left"  },
        { x: w * 0.92, y: h,          dir: "up"    },
        { x: w * 0.86, y: h,          dir: "up"    },
        { x: w * 0.98, y: h * 0.25,   dir: "left"  },
      ];

      [...topSeeds, ...rightSeeds].forEach(({ x, y, dir }) => {
        branches.push(makeBranch(x, y, dir, 0));
      });
    }
    seed();

    // ── Pulse dots ──────────────────────────────────────────────────────────
    interface Pulse { branch: Branch; t: number; speed: number; }
    const pulses: Pulse[] = [];

    // ── Spawn children on completion ─────────────────────────────────────────
    function spawnChildren(b: Branch) {
      if (b.spawned || b.depth >= MAX_DEPTH) return;
      b.spawned = true;

      const candidates = CHILD_DIRS[b.dir];
      const maxKids = Math.max(1, 3 - Math.floor(b.depth * 0.65));
      const numKids = 1 + Math.floor(Math.random() * maxKids);

      const used = new Set<Dir>();
      for (let i = 0; i < numKids; i++) {
        if (Math.random() < 0.12) continue; // occasional dead end
        let dir: Dir;
        let tries = 0;
        do {
          dir = candidates[Math.floor(Math.random() * candidates.length)];
          tries++;
        } while (used.has(dir) && tries < 6);
        used.add(dir);
        branches.push(makeBranch(b.tx, b.ty, dir, b.depth + 1));
      }

      // Occasionally launch a travelling pulse dot
      if (Math.random() < 0.28) {
        setTimeout(() => {
          if (b.done && !b.fading) {
            pulses.push({
              branch: b,
              t: 0,
              speed: 0.004 + Math.random() * 0.007,
            });
          }
        }, 300 + Math.random() * 900);
      }
    }

    // ── Fade old deep branches; re-seed when sparse ──────────────────────────
    const reseeder = setInterval(() => {
      const live = branches.filter(b => !b.fading).length;
      if (live < 35) seed();

      branches
        .filter(b => b.done && !b.fading && b.depth >= MAX_DEPTH - 1)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .forEach(b => { b.fading = true; });
    }, 2000);

    // ── Draw loop ────────────────────────────────────────────────────────────
    function draw() {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = branches.length - 1; i >= 0; i--) {
        const b = branches[i];

        // Advance growth
        if (!b.done) {
          const dx = b.tx - b.cx;
          const dy = b.ty - b.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= b.speed) {
            b.cx = b.tx; b.cy = b.ty;
            b.done = true;
            setTimeout(() => spawnChildren(b), 40 + Math.random() * 140);
          } else {
            b.cx += (dx / dist) * b.speed;
            b.cy += (dy / dist) * b.speed;
          }
        }

        // Fade out
        if (b.fading) {
          b.alpha -= 0.003;
          if (b.alpha <= 0) { branches.splice(i, 1); continue; }
        }

        const a = b.alpha * 0.9;

        // Glow pass (wider, dimmer)
        ctx.globalAlpha = a * 0.35;
        ctx.shadowColor  = GLOW_COLOR;
        ctx.shadowBlur   = 0;
        ctx.strokeStyle  = LINE_COLOR;
        ctx.lineWidth    = 3.5;
        ctx.lineCap      = "square";
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.cx, b.cy);
        ctx.stroke();

        // Core trace
        ctx.globalAlpha  = a;
        ctx.shadowColor  = GLOW_COLOR;
        ctx.shadowBlur   = 10;
        ctx.strokeStyle  = LINE_COLOR;
        ctx.lineWidth    = 1.3;
        ctx.lineCap      = "square";
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.cx, b.cy);
        ctx.stroke();

        // Junction dot at start
        ctx.fillStyle   = DOT_COLOR;
        ctx.shadowBlur  = 12;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Endpoint dot when done
        if (b.done) {
          const r = b.depth >= MAX_DEPTH - 1 ? 1.8 : 3.2;
          ctx.beginPath();
          ctx.arc(b.tx, b.ty, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Travelling pulse dots
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t > 1 || p.branch.fading) { pulses.splice(i, 1); continue; }
        const px = p.branch.x  + (p.branch.tx - p.branch.x)  * p.t;
        const py = p.branch.y  + (p.branch.ty - p.branch.y)  * p.t;
        ctx.globalAlpha  = 0.95;
        ctx.fillStyle    = "#ffffff";
        ctx.shadowColor  = LINE_COLOR;
        ctx.shadowBlur   = 18;
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
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
      style={{ opacity: 0.9 }}
    />
  );
}
