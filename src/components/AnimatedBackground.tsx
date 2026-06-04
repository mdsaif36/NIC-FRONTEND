import React, { useEffect, useRef } from 'react';

export interface AnimatedBackgroundProps {
  /**
   * The number of constellation particles to render.
   * @default 60
   */
  particleCount?: number;
  /**
   * RGB values of the connection lines between particles.
   * Format: "r, g, b"
   * @default "99, 102, 241"
   */
  lineColorRgb?: string;
  /**
   * The maximum distance between particles to draw a connecting line.
   * @default 120
   */
  maxDistance?: number;
  /**
   * Additional tailwind or CSS classes for the canvas element.
   * @default "absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
   */
  className?: string;
  /**
   * Whether to display the drifting ambient smoky clouds.
   * @default true
   */
  showOrbs?: boolean;
}

// Constellation Particle definition helper
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  originalVx: number;
  originalVy: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.originalVx = this.vx;
    this.originalVy = this.vy;
    this.radius = Math.random() * 1.5 + 0.8;

    // Glowing star particles
    const colors = [
      'rgba(255, 255, 255, 0.85)',  // pure star
      'rgba(56, 189, 248, 0.75)',   // cyan star
      'rgba(244, 63, 94, 0.75)',    // rose star
      'rgba(168, 85, 247, 0.75)',    // purple star
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(width: number, height: number, mouse: { x: number; y: number; active: boolean }) {
    if (mouse.active) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        const force = (180 - dist) / 180;
        if (dist > 60) {
          this.vx += (dx / dist) * force * 0.03;
          this.vy += (dy / dist) * force * 0.03;
        } else {
          this.vx -= (dx / dist) * force * 0.12;
          this.vy -= (dy / dist) * force * 0.12;
        }
      } else {
        this.vx += (this.originalVx - this.vx) * 0.02;
        this.vy += (this.originalVy - this.vy) * 0.02;
      }
    } else {
      this.vx += (this.originalVx - this.vx) * 0.02;
      this.vy += (this.originalVy - this.vy) * 0.02;
    }

    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const maxSpeed = 1.0;
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }

    this.x += this.vx;
    this.y += this.vy;

    const margin = 10;
    if (this.x < -margin) this.x = width + margin;
    else if (this.x > width + margin) this.x = -margin;

    if (this.y < -margin) this.y = height + margin;
    else if (this.y > height + margin) this.y = -margin;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    
    if (this.radius > 1.6) {
      ctx.shadowBlur = this.radius * 2;
      ctx.shadowColor = this.color;
    }
    
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// Ambient Smoky Cloud Orb Helper (Morphs and drifts slowly)
class AmbientOrb {
  x: number;
  y: number;
  baseRadius: number;
  vx: number;
  vy: number;
  colorStart: string;
  angle: number;
  angleSpeed: number;

  constructor(width: number, height: number, colorStart: string, radius: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.baseRadius = radius;
    // Super slow drift speeds for smoke effect
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;
    this.colorStart = colorStart;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = 0.0008 + Math.random() * 0.0012; // Slow morph speed
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.angleSpeed;

    // Smooth edge wrap
    const margin = this.baseRadius * 0.8;
    if (this.x < -margin) this.x = width + margin;
    else if (this.x > width + margin) this.x = -margin;

    if (this.y < -margin) this.y = height + margin;
    else if (this.y > height + margin) this.y = -margin;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    // Wave pulse the radius to look like drifting/morphing smoke clouds
    const pulseRadius = this.baseRadius * (1 + Math.sin(this.angle) * 0.25);
    
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      pulseRadius
    );
    
    // Smooth smoke transparency gradient
    gradient.addColorStop(0, this.colorStart);
    gradient.addColorStop(0.35, this.colorStart.replace(/[\d\.]+\)$/, '0.12)')); // soft inner body
    gradient.addColorStop(0.65, this.colorStart.replace(/[\d\.]+\)$/, '0.04)')); // softer fringe
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // fully transparent outer edge

    ctx.beginPath();
    ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  particleCount = 60,
  lineColorRgb = '186, 242, 255',
  maxDistance = 120,
  className = 'absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden',
  showOrbs = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth || window.innerWidth;
    let height = canvas.offsetHeight || window.innerHeight;

    const particles: Particle[] = [];
    const orbs: AmbientOrb[] = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(Math.random() * width, Math.random() * height));
    }

    // Initialize ambient smoke orbs with higher opacity for vibrant smoke animation
    if (showOrbs) {
      const minDimension = Math.min(width, height);
      // Icy/Cold Colors (Cyan, Silver, Light Teal, Frosted White, Sky Blue)
      orbs.push(new AmbientOrb(width, height, 'rgba(186, 242, 255, 0.22)', minDimension * 0.95)); // Light cyan
      orbs.push(new AmbientOrb(width, height, 'rgba(224, 242, 254, 0.20)', minDimension * 0.75)); // Sky blue
      orbs.push(new AmbientOrb(width, height, 'rgba(238, 242, 255, 0.18)', minDimension * 0.85)); // Frosted silver/lavender
      orbs.push(new AmbientOrb(width, height, 'rgba(56, 189, 248, 0.16)', minDimension * 0.80));  // Sky ice blue
      orbs.push(new AmbientOrb(width, height, 'rgba(204, 251, 241, 0.14)', minDimension * 0.90));  // Light minty ice/teal
    }

    const mouse = { x: 0, y: 0, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = mouseX;
        mouse.y = mouseY;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          mouse.x = touchX;
          mouse.y = touchY;
          mouse.active = true;
        } else {
          mouse.active = false;
        }
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      particles.forEach(p => {
        if (p.x > width) p.x = Math.random() * width;
        if (p.y > height) p.y = Math.random() * height;
      });
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    resizeCanvas();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw morphing smoke clouds
      orbs.forEach(orb => {
        orb.update(width, height);
        orb.draw(ctx);
      });

      // Update and draw constellation nodes
      particles.forEach(p => {
        p.update(width, height, mouse);
        p.draw(ctx);
      });

      // Draw constellation connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.12;
            ctx.strokeStyle = `rgba(${lineColorRgb}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 155) {
            const alpha = (1 - dist / 155) * 0.18;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`; // Glowing cyan mouse trails
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [particleCount, lineColorRgb, maxDistance, showOrbs]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  );
};
