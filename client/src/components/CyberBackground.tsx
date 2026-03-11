import { useEffect, useRef } from 'react';

export function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      decay: number;
    }

    const particles: Particle[] = [];

    // Create particles
    const createParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 2 + 1;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        decay: Math.random() * 0.02 + 0.01
      });
    };

    // Create grid points (nodes)
    const nodes: Array<{ x: number; y: number }> = [];
    const nodeSpacing = 120;
    for (let y = 0; y < canvas.height; y += nodeSpacing) {
      for (let x = 0; x < canvas.width; x += nodeSpacing) {
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        nodes.push({
          x: x + offsetX,
          y: y + offsetY
        });
      }
    }

    let animationId: number;
    let frameCount = 0;

    const animate = () => {
      // Dark background with slight gradient
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frameCount++;

      // Draw connections between nearby nodes
      ctx.strokeStyle = 'rgba(0, 204, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.globalAlpha = 1 - distance / 150;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Draw and update nodes
      nodes.forEach((node, index) => {
        // Subtle pulsing animation
        const pulse = Math.sin(frameCount * 0.02 + index * 0.1) * 0.5 + 1;
        const nodeSize = 1.5 * pulse;

        // Cyan glow
        ctx.shadowColor = 'rgba(0, 204, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = 'rgba(0, 204, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = 'transparent';
      });

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= p.decay;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.fillStyle = `rgba(0, 204, 255, ${p.opacity})`;
        ctx.shadowColor = `rgba(0, 204, 255, ${p.opacity})`;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowColor = 'transparent';

      // Randomly spawn new particles
      if (Math.random() < 0.3) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        createParticle(randomNode.x, randomNode.y);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    />
  );
}
