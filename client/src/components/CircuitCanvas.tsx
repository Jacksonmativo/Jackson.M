import { useEffect, useRef } from "react";

interface Branch {
  x: number; y: number;       // start point
  tx: number; ty: number;     // target end
  cx: number; cy: number;     // current drawn tip
  speed: number;
  done: boolean;
  alpha: number;
  fading: boolean;
  spawned: boolean;
  depth: number;
}

const LINE_COLOR  = "#a78bfa";
const DOT_COLOR   = "#c4b5fd";
const GLOW_COLOR  = "#7c3aed";
const MAX_DEPTH   = 5;
const GROW_SPEED  = () => 1.8 + Math.random() * 2.2;

type Dir = "up" | "down" | "left" | "right";

function makeBranch(x: number, y: number, dir: Dir, maxLen: number, depth: number): Branch {
  const len = 35 + Math.random() * maxLen;
  let tx = x, ty = y;
  if (dir === "right") tx = x + len;
  if (dir === "left")  tx = x - len;
  if (dir === "down")  ty = y + len;
  if (dir === "up")    ty = y - len;
  return { x, y, tx, ty, cx: x, cy: y, speed: GROW_SPEED(), done: false, alpha: 1, fading: false, spawned: false, depth };
}

function perpDirs(dir: Dir): Dir[] {
  return dir === "right" || dir === "left" ? ["up", "down"] : ["left", "right"];
}

function branchDir(b: Branch): Dir {
  const dx = b.tx - b.x, dy = b.ty - b.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
  return dy > 0 ? "down" : "up";
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

    // ── Pulse dots that travel along finished branches ──────────────────────
    interface Pulse { branch: Branch; t: number; speed: number; }
    const pulses: Pulse[] = [];

    function spawnPulse(b: Branch) {
      if (!b.done) return;
      pulses.push({ branch: b, t: 0, speed: 0.006 + Math.random() * 0.006 });
    }

    // ── Seed initial branches from corners & edges ──────────────────────────
    function seed() {
      const w = canvas.width, h = canvas.height;

      const seedPoints: Array<{ x: number; y: number; dirs: Dir[] }> = [
        // top-left corner cluster
        { x: w * 0.02 + Math.random() * w * 0.1, y: h * 0.02 + Math.random() * h * 0.12, dirs: ["right", "down"] },
        { x: w * 0.05 + Math.random() * w * 0.12, y: h * 0.04 + Math.random() * h * 0.1, dirs: ["right", "down"] },
        // top-right / right edge cluster
        { x: w * 0.65 + Math.random() * w * 0.3,  y: Math.random() * h * 0.5,           dirs: ["left", "down", "up"] },
        { x: w * 0.7  + Math.random() * w * 0.25, y: Math.random() * h * 0.6,           dirs: ["left", "up"] },
        { x: w * 0.55 + Math.random() * w * 0.4,  y: h * 0.1 + Math.random() * h * 0.4, dirs: ["left", "down"] },
        // bottom-right
        { x: w * 0.6  + Math.random() * w * 0.35, y: h * 0.55 + Math.random() * h * 0.4, dirs: ["left", "up"] },
        { x: w * 0.75 + Math.random() * w * 0.2,  y: h * 0.6  + Math.random() * h * 0.35, dirs: ["left", "up"] },
      ];

      seedPoints.forEach(sp => {
        const d = sp.dirs[Math.floor(Math.random() * sp.dirs.length)];
        branches.push(makeBranch(sp.x, sp.y, d, 100, 0));
      });
    }
    seed();

    // ── Spawn children when a branch finishes ───────────────────────────────
    function spawnChildren(b: Branch) {
      if (b.spawned || b.depth >= MAX_DEPTH) return;
      b.spawned = true;
      const dir     = branchDir(b);
      const perps   = perpDirs(dir);
      const numKids = Math.random() < 0.4 ? 1 : Math.random() < 0.7 ? 2 : 3;

      for (let i = 0; i < numKids; i++) {
        if (Math.random() < 0.15) continue; // occasional dead ends
        const kidDir = Math.random() < 0.65
          ? perps[Math.floor(Math.random() * perps.length)]  // 65% perpendicular
          : dir;                                              // 35% continue straight
        const maxLen = 80 - b.depth * 12;
        if (maxLen < 20) continue;
        branches.push(makeBranch(b.tx, b.ty, kidDir, maxLen, b.depth + 1));
      }

      // Occasionally fire a pulse on this branch
      if (Math.random() < 0.4) setTimeout(() => spawnPulse(b), 400 + Math.random() * 800);
    }

    // ── Periodic re-seeding so it never goes empty ──────────────────────────
    const reseeder = setInterval(() => {
      const live = branches.filter(b => !b.fading).length;
      if (live < 22) seed();
      // Fade some old done branches
      branches
        .filter(b => b.done && !b.fading && b.depth >= MAX_DEPTH - 1)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .forEach(b => { b.fading = true; });
    }, 2200);

    // ── Draw ────────────────────────────────────────────────────────────────
    function draw() {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- Branches ---
      for (let i = branches.length - 1; i >= 0; i--) {
        const b = branches[i];

        // Grow
        if (!b.done) {
          const dx = b.tx - b.cx, dy = b.ty - b.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= b.speed) {
            b.cx = b.tx; b.cy = b.ty;
            b.done = true;
            setTimeout(() => spawnChildren(b), 60 + Math.random() * 200);
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

        ctx.globalAlpha  = b.alpha * 0.75;
        ctx.shadowColor  = GLOW_COLOR;
        ctx.shadowBlur   = 5;
        ctx.strokeStyle  = LINE_COLOR;
        ctx.lineWidth    = 1.1;
        ctx.lineCap      = "round";

        // Draw trace
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.cx, b.cy);
        ctx.stroke();

        // Dot at start
        ctx.fillStyle   = DOT_COLOR;
        ctx.shadowBlur  = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Dot at end when complete
        if (b.done) {
          ctx.beginPath();
          ctx.arc(b.tx, b.ty, b.depth === MAX_DEPTH ? 1.5 : 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- Pulses ---
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t > 1) { pulses.splice(i, 1); continue; }
        if (p.branch.fading) { pulses.splice(i, 1); continue; }

        const px = p.branch.x + (p.branch.tx - p.branch.x) * p.t;
        const py = p.branch.y + (p.branch.ty - p.branch.y) * p.t;

        ctx.globalAlpha = 0.9;
        ctx.fillStyle   = "#ffffff";
        ctx.shadowColor = LINE_COLOR;
        ctx.shadowBlur  = 14;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
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
      style={{ opacity: 0.55 }}
    />
  );
}
