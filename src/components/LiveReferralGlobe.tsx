import React, { useState, useEffect, useRef } from 'react';

export const LiveReferralGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction angles
  const [rotX, setRotX] = useState(-0.15);
  const [rotY, setRotY] = useState(0.4);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  // Auto-rotation speeds
  const speedX = 0.0006;
  const speedY = 0.001;

  // Seeker & Alumni positions on the sphere (lat, lon)
  const seekerPos = { lat: 0.0, lon: -1.1 };
  const alumniPos = { lat: 0.0, lon: 0.9 };

  // Dotted map points list
  const spherePointsRef = useRef<{ x: number; y: number; z: number; isLand: boolean }[]>([]);
  // Background stars list
  const bgStarsRef = useRef<{ x: number; y: number; size: number; alpha: number; speed: number }[]>([]);

  // Generate sphere points and stars on mount
  useEffect(() => {
    const points: { x: number; y: number; z: number; isLand: boolean }[] = [];
    const numPoints = 2200; 

    // Earth geographic continent builder
    const checkIsLand = (lat: number, lon: number) => {
      const dNA1 = Math.hypot(lat - 0.7, lon + 1.7); // Canada/USA
      const dNA2 = Math.hypot(lat - 1.0, lon + 2.3); // Alaska
      const dNA3 = Math.hypot(lat - 0.2, lon + 1.4); // Mexico / Central America
      
      const dSA1 = Math.hypot(lat + 0.2, lon + 1.0); // Brazil
      const dSA2 = Math.hypot(lat + 0.6, lon + 1.1); // Argentina/Chile
      
      const dGreenland = Math.hypot(lat - 1.2, lon + 0.7);

      const dAF1 = Math.hypot(lat - 0.1, lon - 0.3); // West Africa
      const dAF2 = Math.hypot(lat - 0.1, lon - 0.7); // Horn of Africa / East
      const dAF3 = Math.hypot(lat + 0.4, lon - 0.4); // South Africa
      const dMadagascar = Math.hypot(lat + 0.3, lon - 0.8); // Madagascar

      const dEU1 = Math.hypot(lat - 0.8, lon - 0.3); // Central Europe
      const dEU2 = Math.hypot(lat - 1.1, lon - 0.4); // Scandinavia
      const dUK = Math.hypot(lat - 0.9, lon - 0.1); // United Kingdom

      const dAS1 = Math.hypot(lat - 0.9, lon - 1.6); // Siberia
      const dAS2 = Math.hypot(lat - 0.5, lon - 1.7); // China / East Asia
      const dAS3 = Math.hypot(lat - 0.3, lon - 1.4); // India
      const dAS4 = Math.hypot(lat - 0.4, lon - 0.8); // Middle East
      const dAS5 = Math.hypot(lat - 0.2, lon - 1.9); // Indochina
      const dJapan = Math.hypot(lat - 0.6, lon - 2.4); // Japan

      const dAU1 = Math.hypot(lat + 0.45, lon - 2.3); // Australia
      const dNZ = Math.hypot(lat + 0.7, lon - 2.9); // New Zealand

      return (
        dNA1 < 0.52 || dNA2 < 0.35 || dNA3 < 0.22 ||
        dSA1 < 0.45 || dSA2 < 0.32 ||
        dGreenland < 0.25 ||
        dAF1 < 0.45 || dAF2 < 0.3 || dAF3 < 0.35 || dMadagascar < 0.12 ||
        dEU1 < 0.35 || dEU2 < 0.22 || dUK < 0.15 ||
        dAS1 < 0.6 || dAS2 < 0.52 || dAS3 < 0.35 || dAS4 < 0.32 || dAS5 < 0.32 || dJapan < 0.15 ||
        dAU1 < 0.32 || dNZ < 0.12
      );
    };

    for (let i = 0; i < numPoints; i++) {
      const zFraction = 1 - (2 * i) / (numPoints - 1 || 1);
      const radiusFraction = Math.sqrt(1 - zFraction * zFraction);
      const phi = i * 2.39996; // Golden angle

      const x0 = radiusFraction * Math.cos(phi);
      const y0 = radiusFraction * Math.sin(phi);
      const z0 = zFraction;

      const lat = Math.asin(y0);
      const lon = Math.atan2(x0, z0);

      const land = checkIsLand(lat, lon);
      points.push({ x: x0, y: y0, z: z0, isLand: land });
    }

    spherePointsRef.current = points;

    // Generate space stars
    const stars = [];
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * 420,
        y: Math.random() * 420,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.02 + 0.01
      });
    }
    bgStarsRef.current = stars;
  }, []);

  // Animation & Rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let localRotX = rotX;
    let localRotY = rotY;

    // Helper: Draw user icon inside nodes
    const drawUserIcon = (c: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
      c.fillStyle = '#FFFFFF';
      c.beginPath();
      c.arc(cx, cy - r * 0.22, r * 0.28, 0, 2 * Math.PI);
      c.fill();
      c.beginPath();
      c.arc(cx, cy + r * 0.62, r * 0.5, Math.PI, 2 * Math.PI);
      c.fill();
    };

    const render = () => {
      if (!isDragging) {
        localRotX += speedX;
        localRotY += speedY;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const R = Math.min(canvas.width, canvas.height) * 0.32;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // ── 1. Twinkling Space Stars Background ───────────────────────────────
      ctx.shadowBlur = 0;
      bgStarsRef.current.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 0.8 || star.alpha < 0.1) {
          star.speed = -star.speed;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, star.alpha))})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // ── 2. Bilateral Ambient Glows (Vibrant Atmosphere) ───────────────────
      // Left side Seeker Red Glow
      const leftAura = ctx.createRadialGradient(cx - R * 0.8, cy, 0, cx - R * 0.8, cy, R * 1.5);
      leftAura.addColorStop(0, 'rgba(255, 30, 60, 0.13)');
      leftAura.addColorStop(1, 'rgba(255, 30, 60, 0.0)');
      ctx.fillStyle = leftAura;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.6, 0, 2 * Math.PI);
      ctx.fill();

      // Right side Alumni Blue Glow
      const rightAura = ctx.createRadialGradient(cx + R * 0.8, cy, 0, cx + R * 0.8, cy, R * 1.5);
      rightAura.addColorStop(0, 'rgba(30, 64, 255, 0.15)');
      rightAura.addColorStop(1, 'rgba(30, 64, 255, 0.0)');
      ctx.fillStyle = rightAura;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.6, 0, 2 * Math.PI);
      ctx.fill();

      // ── 3. Draw Orbiting Rings (Tech aesthetics) ────────────────────────
      ctx.strokeStyle = 'rgba(30, 64, 255, 0.06)'; // Blue Ring
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * 1.25, R * 0.45, -0.25, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 30, 60, 0.04)'; // Red Ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * 1.35, R * 0.35, 0.3, 0, 2 * Math.PI);
      ctx.stroke();

      // ── 4. Draw 3D Rotating Latitude & Longitude Wireframe Grid ─────────
      const numGridPoints = 40;
      
      // Latitudes
      const latGridAngles = [-Math.PI / 4, 0, Math.PI / 4];
      latGridAngles.forEach(latAngle => {
        ctx.beginPath();
        for (let i = 0; i <= numGridPoints; i++) {
          const lon = (i / numGridPoints) * 2 * Math.PI - Math.PI;
          const x0 = Math.cos(latAngle) * Math.sin(lon);
          const y0 = Math.sin(latAngle);
          const z0 = Math.cos(latAngle) * Math.cos(lon);

          let x1 = x0 * Math.cos(localRotY) - z0 * Math.sin(localRotY);
          let z1 = x0 * Math.sin(localRotY) + z0 * Math.cos(localRotY);
          let y2 = y0 * Math.cos(localRotX) - z1 * Math.sin(localRotX);
          let z2 = y0 * Math.sin(localRotX) + z1 * Math.cos(localRotX);

          const scale = 300 / (300 - z2 * R);
          const sx = cx + x1 * R * scale;
          const sy = cy + y2 * R * scale;

          const op = (z2 + R) / (2 * R) * 0.035 + 0.005;
          ctx.strokeStyle = `rgba(148, 163, 184, ${op})`;

          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      });

      // Longitudes
      const lonGridAngles = [-Math.PI / 3, 0, Math.PI / 3];
      lonGridAngles.forEach(lonAngle => {
        ctx.beginPath();
        for (let i = 0; i <= numGridPoints; i++) {
          const lat = (i / numGridPoints) * Math.PI - Math.PI / 2;
          const x0 = Math.cos(lat) * Math.sin(lonAngle);
          const y0 = Math.sin(lat);
          const z0 = Math.cos(lat) * Math.cos(lonAngle);

          let x1 = x0 * Math.cos(localRotY) - z0 * Math.sin(localRotY);
          let z1 = x0 * Math.sin(localRotY) + z0 * Math.cos(localRotY);
          let y2 = y0 * Math.cos(localRotX) - z1 * Math.sin(localRotX);
          let z2 = y0 * Math.sin(localRotX) + z1 * Math.cos(localRotX);

          const scale = 300 / (300 - z2 * R);
          const sx = cx + x1 * R * scale;
          const sy = cy + y2 * R * scale;

          const op = (z2 + R) / (2 * R) * 0.035 + 0.005;
          ctx.strokeStyle = `rgba(148, 163, 184, ${op})`;

          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      });

      // ── 5. Rotate and Project Sphere Particles ──────────────────────────
      const projectedDots = spherePointsRef.current.map(pt => {
        let x1 = pt.x * Math.cos(localRotY) - pt.z * Math.sin(localRotY);
        let z1 = pt.x * Math.sin(localRotY) + pt.z * Math.cos(localRotY);
        let y2 = pt.y * Math.cos(localRotX) - z1 * Math.sin(localRotX);
        let z2 = pt.y * Math.sin(localRotX) + z1 * Math.cos(localRotX);

        const dist = 300;
        const scale = dist / (dist - z2 * R);
        const sx = cx + x1 * R * scale;
        const sy = cy + y2 * R * scale;

        return { sx, sy, z: z2 * R, isLand: pt.isLand, x1, scale };
      });

      // Sort dots by depth
      projectedDots.sort((a, b) => a.z - b.z);

      // Draw digital particles representing continents & oceans
      projectedDots.forEach(d => {
        const depthOpacity = (d.z + R) / (2 * R) * 0.55 + 0.15;
        
        if (d.isLand) {
          ctx.globalAlpha = depthOpacity * 0.85;
          if (d.x1 < 0) {
            ctx.fillStyle = '#FF1E3C'; // Red hemisphere
          } else {
            ctx.fillStyle = '#1E40FF'; // Blue hemisphere
          }
          const size = 2.4 * d.scale;
          ctx.fillRect(d.sx - size / 2, d.sy - size / 2, size, size);
        } else {
          ctx.globalAlpha = depthOpacity * 0.14;
          ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
          const size = 1.0 * d.scale;
          ctx.fillRect(d.sx - size / 2, d.sy - size / 2, size, size);
        }
      });

      ctx.globalAlpha = 1.0;

      // ── 6. Volumetric Atmosphere Rim Glow Overlay ────────────────────────
      const rimGrad = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.04);
      rimGrad.addColorStop(0, 'rgba(139, 92, 246, 0.0)');
      rimGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.05)');
      rimGrad.addColorStop(1.0, 'rgba(30, 64, 255, 0.15)');
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.04, 0, 2 * Math.PI);
      ctx.fill();

      // ── 7. Seeker and Alumni Nodes Projections ──────────────────────────
      // Seeker
      const skX0 = Math.cos(seekerPos.lat) * Math.sin(seekerPos.lon);
      const skY0 = Math.sin(seekerPos.lat);
      const skZ0 = Math.cos(seekerPos.lat) * Math.cos(seekerPos.lon);

      const skX1 = skX0 * Math.cos(localRotY) - skZ0 * Math.sin(localRotY);
      const skZ1 = skX0 * Math.sin(localRotY) + skZ0 * Math.cos(localRotY);
      const skY2 = skY0 * Math.cos(localRotX) - skZ1 * Math.sin(localRotX);
      const skZ2 = skY0 * Math.sin(localRotX) + skZ1 * Math.cos(localRotX);

      const skScale = 300 / (300 - skZ2 * R);
      const skSx = cx + skX1 * R * skScale;
      const skSy = cy + skY2 * R * skScale;

      // Alumni
      const alX0 = Math.cos(alumniPos.lat) * Math.sin(alumniPos.lon);
      const alY0 = Math.sin(alumniPos.lat);
      const alZ0 = Math.cos(alumniPos.lat) * Math.cos(alumniPos.lon);

      const alX1 = alX0 * Math.cos(localRotY) - alZ0 * Math.sin(localRotY);
      const alZ1 = alX0 * Math.sin(localRotY) + alZ0 * Math.cos(localRotY);
      const alY2 = alY0 * Math.cos(localRotX) - alZ1 * Math.sin(localRotX);
      const alZ2 = alY0 * Math.sin(localRotX) + alZ1 * Math.cos(localRotX);

      const alScale = 300 / (300 - alZ2 * R);
      const alSx = cx + alX1 * R * alScale;
      const alSy = cy + alY2 * R * alScale;

      // ── 8. Draw Connecting Arc ──────────────────────────────────────────
      const vSeeker = { x: skX0, y: skY0, z: skZ0 };
      const vAlumni = { x: alX0, y: alY0, z: alZ0 };

      const vMidRaw = {
        x: (vSeeker.x + vAlumni.x) * 0.5,
        y: (vSeeker.y + vAlumni.y) * 0.5,
        z: (vSeeker.z + vAlumni.z) * 0.5
      };
      const midLen = Math.hypot(vMidRaw.x, vMidRaw.y, vMidRaw.z) || 1;
      const vNormal = { x: vMidRaw.x / midLen, y: vMidRaw.y / midLen, z: vMidRaw.z / midLen };
      const arcHeight = 0.45; 
      const vControl = {
        x: vMidRaw.x + vNormal.x * arcHeight,
        y: vMidRaw.y + vNormal.y * arcHeight,
        z: vMidRaw.z + vNormal.z * arcHeight
      };

      const numCurvePoints = 35;
      const curve2DPoints: { sx: number; sy: number; z: number }[] = [];

      for (let i = 0; i <= numCurvePoints; i++) {
        const t = i / numCurvePoints;
        const bx = (1 - t) * (1 - t) * vSeeker.x + 2 * (1 - t) * t * vControl.x + t * t * vAlumni.x;
        const by = (1 - t) * (1 - t) * vSeeker.y + 2 * (1 - t) * t * vControl.y + t * t * vAlumni.y;
        const bz = (1 - t) * (1 - t) * vSeeker.z + 2 * (1 - t) * t * vControl.z + t * t * vAlumni.z;

        const rx = bx * Math.cos(localRotY) - bz * Math.sin(localRotY);
        const rz = bx * Math.sin(localRotY) + bz * Math.cos(localRotY);
        const ry = by * Math.cos(localRotX) - rz * Math.sin(localRotX);
        const rzFinal = by * Math.sin(localRotX) + rz * Math.cos(localRotX);

        const bScale = 300 / (300 - rzFinal * R);
        const bsx = cx + rx * R * bScale;
        const bsy = cy + ry * R * bScale;

        curve2DPoints.push({ sx: bsx, sy: bsy, z: rzFinal * R });
      }

      ctx.lineWidth = 2.8;
      ctx.shadowBlur = 10;
      
      const grad = ctx.createLinearGradient(skSx, skSy, alSx, alSy);
      grad.addColorStop(0, 'rgba(255, 30, 60, 0.9)'); 
      grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.75)'); 
      grad.addColorStop(1, 'rgba(30, 64, 255, 0.9)'); 
      ctx.strokeStyle = grad;
      ctx.shadowColor = 'rgba(139, 92, 246, 0.45)';

      ctx.beginPath();
      ctx.moveTo(curve2DPoints[0].sx, curve2DPoints[0].sy);
      for (let i = 1; i < curve2DPoints.length; i++) {
        ctx.lineTo(curve2DPoints[i].sx, curve2DPoints[i].sy);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Animate Pulse Particle
      const elapsed = performance.now() * 0.001;
      const pulseT = (elapsed * 0.35) % 1.0; 
      const pulseIdx = Math.floor(pulseT * numCurvePoints);
      
      if (pulseIdx >= 0 && pulseIdx < curve2DPoints.length) {
        const pulsePt = curve2DPoints[pulseIdx];
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(pulsePt.sx, pulsePt.sy, 4.0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── 9. Draw Seeker Node ─────────────────────────────────────────────
      if (skZ2 > -0.7) {
        const nodeRadius = 14.5 * skScale;

        // Glow Ring
        ctx.strokeStyle = 'rgba(255, 30, 60, 0.32)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(skSx, skSy, nodeRadius + 5.5, 0, 2 * Math.PI);
        ctx.stroke();

        // Node Circle
        ctx.fillStyle = '#FF1E3C';
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(255, 30, 60, 0.7)';
        ctx.beginPath();
        ctx.arc(skSx, skSy, nodeRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        // User Icon
        drawUserIcon(ctx, skSx, skSy, nodeRadius * 0.85);

        // Seeker Pointer Line
        ctx.strokeStyle = 'rgba(255, 30, 60, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(skSx - nodeRadius, skSy);
        ctx.lineTo(skSx - nodeRadius - 22, skSy - 22);
        ctx.lineTo(skSx - nodeRadius - 100, skSy - 22);
        ctx.stroke();

        // Seeker Glassmorphic Callout Pill (High fidelity styling)
        const badgeX = skSx - nodeRadius - 100;
        const badgeY = skSy - 22;

        ctx.fillStyle = 'rgba(12, 10, 15, 0.88)';
        ctx.strokeStyle = 'rgba(255, 30, 60, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        
        // Draw round rect for card
        ctx.beginPath();
        ctx.roundRect(badgeX - 100, badgeY - 20, 100, 36, 6);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Text inside card
        ctx.font = 'bold 9px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#FF1E3C';
        ctx.textAlign = 'left';
        ctx.fillText('SEEKER', badgeX - 90, badgeY - 6);
        
        ctx.font = '500 8.5px "Inter", sans-serif';
        ctx.fillStyle = '#E2E8F0';
        ctx.fillText('Sending Request', badgeX - 90, badgeY + 8);
      }

      // ── 10. Draw Alumni Node ────────────────────────────────────────────
      if (alZ2 > -0.7) {
        const nodeRadius = 14.5 * alScale;

        // Glow Ring
        ctx.strokeStyle = 'rgba(30, 64, 255, 0.32)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(alSx, alSy, nodeRadius + 5.5, 0, 2 * Math.PI);
        ctx.stroke();

        // Node Circle
        ctx.fillStyle = '#1E40FF';
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(30, 64, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(alSx, alSy, nodeRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        // User Icon
        drawUserIcon(ctx, alSx, alSy, nodeRadius * 0.85);

        // Alumni Pointer Line
        ctx.strokeStyle = 'rgba(30, 64, 255, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(alSx + nodeRadius, alSy);
        ctx.lineTo(alSx + nodeRadius + 22, alSy + 22);
        ctx.lineTo(alSx + nodeRadius + 100, alSy + 22);
        ctx.stroke();

        // Alumni Glassmorphic Callout Pill (High fidelity styling)
        const badgeX = alSx + nodeRadius + 100;
        const badgeY = alSy + 22;

        ctx.fillStyle = 'rgba(10, 12, 20, 0.88)';
        ctx.strokeStyle = 'rgba(30, 64, 255, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY - 16, 100, 36, 6);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Text inside card
        ctx.font = 'bold 9px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#38BDF8';
        ctx.textAlign = 'left';
        ctx.fillText('ALUMNI', badgeX + 10, badgeY - 2);
        
        ctx.font = '500 8.5px "Inter", sans-serif';
        ctx.fillStyle = '#E2E8F0';
        ctx.fillText('Giving Referral', badgeX + 10, badgeY + 12);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotX, rotY, isDragging]);

  // Mouse interaction logic
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setRotY(prev => prev + dx * 0.006);
    setRotX(prev => prev - dy * 0.006);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto select-none overflow-visible flex items-center justify-center">
      {/* Glow highlight behind the globe */}
      <div className="absolute w-[280px] h-[280px] rounded-full bg-gradient-to-tr from-[#FF1E3C]/8 via-purple-600/5 to-[#1E40FF]/8 blur-[95px] pointer-events-none z-0" />
      
      <canvas
        ref={canvasRef}
        width={420}
        height={420}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="cursor-grab active:cursor-grabbing w-full h-full relative z-10 block"
      />
    </div>
  );
};
