import { useEffect, useRef } from "react";

// 8-directional system
type Dir = "up" | "down" | "left" | "right" | "ur" | "ul" | "dr" | "dl";

const DIAG = Math.SQRT1_2;

const DIR_VEC: Record<Dir, [number, number]> = {
  right: [1, 0],
  left: [-1, 0],
  down: [0, 1],
  up: [0, -1],
  ur: [DIAG, -DIAG],
  ul: [-DIAG, -DIAG],
  dr: [DIAG, DIAG],
  dl: [-DIAG, DIAG],
};

const CHILD_DIRS: Record<Dir, Dir[]> = {
  ur: ["right", "up", "ur", "dr", "ul"],
  dr: ["right", "down", "dr", "ur", "dl"],
  ul: ["left", "up", "ul", "dl", "ur"],
  dl: ["left", "down", "dl", "ul", "dr"],
  right: ["up", "down", "ur", "dr", "right"],
  left: ["up", "down", "ul", "dl", "left"],
  up: ["left", "right", "ul", "ur", "up"],
  down: ["left", "right", "dl", "dr", "down"],
};

const LINE_COLOR = "#67e8f9";   // brighter cyan-blue
const DOT_COLOR = "#c4f1f9";
const GLOW_COLOR = "#22d3ee";   // stronger glow
const MAX_DEPTH = 6;

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
  const len = 45 + Math.random() * maxLen; // longer branches
  const [dx, dy] = DIR_VEC[dir];
  return {
    x, y,
    tx: x + dx * len,
    ty: y + dy * len,
    cx: x, cy: y,
    dir,
    speed: 2.2 + Math.random() * 2.8, // faster growth
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
    const ctx = canvas.getContext("2d", { alpha: true })!;

    let animId: number;
    const branches: Branch[] = [];
    const pulses: { branch: Branch; t: number; speed: number }[] = [];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Stronger diagonal spine seeds (matches the image's main flow)
    function seed() {
      const w = canvas.width;
      const h = canvas.height;

      const diagSeeds = [
        { x: w * 0.08, y: h * 0.12, dir: "dr" as Dir },
        { x: w * 0.18, y: h * 0.05, dir: "dr" as Dir },
        { x: w * 0.45, y: h * 0.02, dir: "dr" as Dir },
        { x: w * 0.68, y: h * 0.08, dir: "dl" as Dir },
        { x: w * 0.92, y: h * 0.25, dir: "dl" as Dir },
        { x: w * 0.95, y: h * 0.48, dir: "ul" as Dir },
        { x: w * 0.82, y: h * 0.65, dir: "ul" as Dir },
        { x: w * 0.12, y: h * 0.22, dir: "dr" as Dir },
      ];

      const extraSeeds = [
        { x: w * 0.05 + Math.random() * w * 0.15, y: h * 0.1, dir: "right" as Dir },
        { x: w * 0.75, y: h * 0.35 + Math.random() * h * 0.3, dir: "left" as Dir },
        { x: w * 0.6, y: h * 0.55, dir: "up" as Dir },
      ];

      [...diagSeeds, ...extraSeeds].forEach(({ x, y, dir }) => {
        branches.push(makeBranch(x, y, dir, 140, 0)); // longer main branches
      });
    }

    seed();

    function spawnPulse(b: Branch) {
      if (!b.done) return;
      pulses.push({ branch: b, t: 0, speed: 0.004 + Math.random() * 0.007 });
    }

    function spawnChildren(b: Branch) {
      if (b.spawned || b.depth >= MAX_DEPTH) return;
      b.spawned = true;

      const candidates = CHILD_DIRS[b.dir];
      const maxKids = Math.max(1, 4 - Math.floor(b.depth * 0.6));
      const numKids = 1 + Math.floor(Math.random() * maxKids);

      const used = new Set<Dir>();
      for (let i = 0; i < numKids; i++) {
        if (Math.random() < 0.08) continue;

        let dir: Dir;
        let tries = 0;
        do {
          dir = candidates[Math.floor(Math.random() * candidates.length)];
          tries++;
        } while (used.has(dir) && tries < 10);
        used.add(dir);

        const maxLen = Math.max(25, 125 - b.depth * 16);
        branches.push(makeBranch(b.tx, b.ty, dir, maxLen, b.depth + 1));
      }

      // More frequent pulses for lively feel
      if (Math.random() < 0.55) {
        setTimeout(() => spawnPulse(b), 300 + Math.random() * 700);
      }
    }

    // Occasional reseed + cleanup
    const reseeder = setInterval(() => {
      const live = branches.filter(b => !b.fading).length;
      if (live < 18) seed();

      // Fade out oldest deep branches
      branches
        .filter(b => b.done && !b.fading && b.depth >= MAX_DEPTH - 2)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .forEach(b => { b.fading = true; });
    }, 1800);

    function draw() {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw branches
      for (let i = branches.length - 1; i >= 0; i--) {
        const b = branches[i];

        if (!b.done) {
          const dx = b.tx - b.cx;
          const dy = b.ty - b.cy;
          const dist = Math.hypot(dx, dy);

          if (dist <= b.speed) {
            b.cx = b.tx;
            b.cy = b.ty;
            b.done = true;
            setTimeout(() => spawnChildren(b), 40 + Math.random() * 160);
          } else {
            const move = b.speed / dist;
            b.cx += dx * move;
            b.cy += dy * move;
          }
        }

        if (b.fading) {
          b.alpha -= 0.006;
          if (b.alpha <= 0) {
            branches.splice(i, 1);
            continue;
          }
        }

        ctx.globalAlpha = b.alpha * 0.85;
        ctx.shadowColor = GLOW_COLOR;
        ctx.shadowBlur = 12;           // stronger glow
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = 1.8;           // slightly thicker lines
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.cx, b.cy);
        ctx.stroke();

        // Start dot
        ctx.shadowBlur = 10;
        ctx.fillStyle = DOT_COLOR;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.4, 0, Math.PI * 2);
        ctx.fill();

        // End dot
        if (b.done) {
          ctx.beginPath();
          ctx.arc(b.tx, b.ty, b.depth >= MAX_DEPTH - 1 ? 1.6 : 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Pulse dots (traveling signals)
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;

        if (p.t > 1 || p.branch.fading) {
          pulses.splice(i, 1);
          continue;
        }

        const px = p.branch.x + (p.branch.tx - p.branch.x) * p.t;
        const py = p.branch.y + (p.branch.ty - p.branch.y) * p.t;

        ctx.globalAlpha = 0.95 - p.t * 0.3;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#67e8f9";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
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
      style={{ opacity: 0.85 }}   // slightly more visible to match image intensity
    />
  );
}
