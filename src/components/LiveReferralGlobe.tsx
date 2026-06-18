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
  // Seeker in the left hemisphere, Alumni in the right hemisphere
  const seekerPos = { lat: 0.0, lon: -1.1 };
  const alumniPos = { lat: 0.0, lon: 0.9 };

  // Dotted map points list
  const spherePointsRef = useRef<{ x: number; y: number; z: number; isLand: boolean }[]>([]);

  // Generate sphere points on mount
  useEffect(() => {
    const points: { x: number; y: number; z: number; isLand: boolean }[] = [];
    const numPoints = 800; // Dense enough to look like continents

    // Continental clustering math
    const checkIsLand = (lat: number, lon: number) => {
      // lat is in [-PI/2, PI/2], lon is in [-PI, PI]
      const dNA = Math.hypot(lat - 0.5, lon + 1.8);
      const dSA = Math.hypot(lat + 0.3, lon + 1.0);
      const dEU = Math.hypot(lat - 0.7, lon - 0.2);
      const dAF = Math.hypot(lat - 0.0, lon - 0.4);
      const dAS = Math.hypot(lat - 0.5, lon - 1.8);
      const dAU = Math.hypot(lat + 0.5, lon - 2.4);

      return (
        dNA < 0.7 ||
        dSA < 0.65 ||
        dEU < 0.45 ||
        dAF < 0.6 ||
        dAS < 0.85 ||
        dAU < 0.4
      );
    };

    for (let i = 0; i < numPoints; i++) {
      // Golden Spiral distribution
      const zFraction = 1 - (2 * i) / (numPoints - 1 || 1);
      const radiusFraction = Math.sqrt(1 - zFraction * zFraction);
      const phi = i * 2.39996; // Golden angle

      const x0 = radiusFraction * Math.cos(phi);
      const y0 = radiusFraction * Math.sin(phi);
      const z0 = zFraction;

      // Convert to spherical coords
      const lat = Math.asin(y0);
      const lon = Math.atan2(x0, z0);

      const land = checkIsLand(lat, lon);
      points.push({ x: x0, y: y0, z: z0, isLand: land });
    }

    spherePointsRef.current = points;
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
      // Head
      c.beginPath();
      c.arc(cx, cy - r * 0.22, r * 0.28, 0, 2 * Math.PI);
      c.fill();
      // Shoulders
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

      // 1. Draw Bounding Glow and Orbit Rings (Tech aesthetics like the image)
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      // Draw Orbiting Rings
      ctx.strokeStyle = 'rgba(30, 64, 255, 0.08)'; // Blue Ring
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * 1.25, R * 0.45, -0.25, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 30, 60, 0.06)'; // Red Ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * 1.35, R * 0.35, 0.3, 0, 2 * Math.PI);
      ctx.stroke();

      // Rotate sphere points in 3D
      const projectedDots = spherePointsRef.current.map(pt => {
        // Rot Y
        let x1 = pt.x * Math.cos(localRotY) - pt.z * Math.sin(localRotY);
        let z1 = pt.x * Math.sin(localRotY) + pt.z * Math.cos(localRotY);
        // Rot X
        let y2 = pt.y * Math.cos(localRotX) - z1 * Math.sin(localRotX);
        let z2 = pt.y * Math.sin(localRotX) + z1 * Math.cos(localRotX);

        const dist = 300;
        const scale = dist / (dist - z2 * R);
        const sx = cx + x1 * R * scale;
        const sy = cy + y2 * R * scale;

        return { sx, sy, z: z2 * R, isLand: pt.isLand, x1 };
      });

      // Sort dots by depth
      projectedDots.sort((a, b) => a.z - b.z);

      // Draw dots representing sphere continents
      projectedDots.forEach(d => {
        if (!d.isLand) return; // Only draw landmasses for that clean look

        // Opacity based on depth
        const depthOpacity = (d.z + R) / (2 * R) * 0.6 + 0.15;
        ctx.globalAlpha = depthOpacity;

        // Red/Blue hemisphere split
        if (d.x1 < 0) {
          ctx.fillStyle = '#FF1E3C'; // Red hemisphere
        } else {
          ctx.fillStyle = '#1E40FF'; // Blue hemisphere
        }

        ctx.beginPath();
        ctx.arc(d.sx, d.sy, 1.25, 0, 2 * Math.PI);
        ctx.fill();
      });

      // Reset global opacity
      ctx.globalAlpha = 1.0;

      // 2. Seeker and Alumni Nodes 3D projections
      // Seeker coords
      const skX0 = Math.cos(seekerPos.lat) * Math.sin(seekerPos.lon);
      const skY0 = Math.sin(seekerPos.lat);
      const skZ0 = Math.cos(seekerPos.lat) * Math.cos(seekerPos.lon);

      // Seeker rotation
      const skX1 = skX0 * Math.cos(localRotY) - skZ0 * Math.sin(localRotY);
      const skZ1 = skX0 * Math.sin(localRotY) + skZ0 * Math.cos(localRotY);
      const skY2 = skY0 * Math.cos(localRotX) - skZ1 * Math.sin(localRotX);
      const skZ2 = skY0 * Math.sin(localRotX) + skZ1 * Math.cos(localRotX);

      const skScale = 300 / (300 - skZ2 * R);
      const skSx = cx + skX1 * R * skScale;
      const skSy = cy + skY2 * R * skScale;

      // Alumni coords
      const alX0 = Math.cos(alumniPos.lat) * Math.sin(alumniPos.lon);
      const alY0 = Math.sin(alumniPos.lat);
      const alZ0 = Math.cos(alumniPos.lat) * Math.cos(alumniPos.lon);

      // Alumni rotation
      const alX1 = alX0 * Math.cos(localRotY) - alZ0 * Math.sin(localRotY);
      const alZ1 = alX0 * Math.sin(localRotY) + alZ0 * Math.cos(localRotY);
      const alY2 = alY0 * Math.cos(localRotX) - alZ1 * Math.sin(localRotX);
      const alZ2 = alY0 * Math.sin(localRotX) + alZ1 * Math.cos(localRotX);

      const alScale = 300 / (300 - alZ2 * R);
      const alSx = cx + alX1 * R * alScale;
      const alSy = cy + alY2 * R * alScale;

      // 3. Draw Connecting Arc (Quadratic Bezier Curve in 3D)
      // Node 3D Vectors
      const vSeeker = { x: skX0, y: skY0, z: skZ0 };
      const vAlumni = { x: alX0, y: alY0, z: alZ0 };

      // Midpoint on sphere surface
      const vMidRaw = {
        x: (vSeeker.x + vAlumni.x) * 0.5,
        y: (vSeeker.y + vAlumni.y) * 0.5,
        z: (vSeeker.z + vAlumni.z) * 0.5
      };
      const midLen = Math.hypot(vMidRaw.x, vMidRaw.y, vMidRaw.z) || 1;
      // Normal vector pointing outwards
      const vNormal = { x: vMidRaw.x / midLen, y: vMidRaw.y / midLen, z: vMidRaw.z / midLen };
      // Control point offset (arc height)
      const arcHeight = 0.45; 
      const vControl = {
        x: vMidRaw.x + vNormal.x * arcHeight,
        y: vMidRaw.y + vNormal.y * arcHeight,
        z: vMidRaw.z + vNormal.z * arcHeight
      };

      // Generate points along the 3D Bezier curve
      const numCurvePoints = 35;
      const curve2DPoints: { sx: number; sy: number; z: number }[] = [];

      for (let i = 0; i <= numCurvePoints; i++) {
        const t = i / numCurvePoints;
        // Bezier formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const bx = (1 - t) * (1 - t) * vSeeker.x + 2 * (1 - t) * t * vControl.x + t * t * vAlumni.x;
        const by = (1 - t) * (1 - t) * vSeeker.y + 2 * (1 - t) * t * vControl.y + t * t * vAlumni.y;
        const bz = (1 - t) * (1 - t) * vSeeker.z + 2 * (1 - t) * t * vControl.z + t * t * vAlumni.z;

        // Rotate in 3D
        const rx = bx * Math.cos(localRotY) - bz * Math.sin(localRotY);
        const rz = bx * Math.sin(localRotY) + bz * Math.cos(localRotY);
        const ry = by * Math.cos(localRotX) - rz * Math.sin(localRotX);
        const rzFinal = by * Math.sin(localRotX) + rz * Math.cos(localRotX);

        const bScale = 300 / (300 - rzFinal * R);
        const bsx = cx + rx * R * bScale;
        const bsy = cy + ry * R * bScale;

        curve2DPoints.push({ sx: bsx, sy: bsy, z: rzFinal * R });
      }

      // Draw the connecting Arc with linear gradient (Red to Blue)
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 8;
      
      const grad = ctx.createLinearGradient(skSx, skSy, alSx, alSy);
      grad.addColorStop(0, 'rgba(255, 30, 60, 0.85)'); // Red
      grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.7)'); // Purple
      grad.addColorStop(1, 'rgba(30, 64, 255, 0.85)'); // Blue
      ctx.strokeStyle = grad;
      ctx.shadowColor = 'rgba(139, 92, 246, 0.4)';

      ctx.beginPath();
      ctx.moveTo(curve2DPoints[0].sx, curve2DPoints[0].sy);
      for (let i = 1; i < curve2DPoints.length; i++) {
        ctx.lineTo(curve2DPoints[i].sx, curve2DPoints[i].sy);
      }
      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;

      // 4. Animate Referral Pulse Particle traveling along the Arc
      const elapsed = performance.now() * 0.001;
      const pulseT = (elapsed * 0.35) % 1.0; // Easing speed
      const pulseIdx = Math.floor(pulseT * numCurvePoints);
      
      if (pulseIdx >= 0 && pulseIdx < curve2DPoints.length) {
        const pulsePt = curve2DPoints[pulseIdx];
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(pulsePt.sx, pulsePt.sy, 3.5, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.shadowBlur = 0;
      }

      // 5. Draw Seeker Node (Left / Red)
      if (skZ2 > -0.7) { // Only draw if not fully blocked at back
        const nodeRadius = 14 * skScale;

        // Outer Glow Ring
        ctx.strokeStyle = 'rgba(255, 30, 60, 0.28)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(skSx, skSy, nodeRadius + 5, 0, 2 * Math.PI);
        ctx.stroke();

        // Solid Node Circle
        ctx.fillStyle = '#FF1E3C';
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(255, 30, 60, 0.6)';
        ctx.beginPath();
        ctx.arc(skSx, skSy, nodeRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner User Icon
        drawUserIcon(ctx, skSx, skSy, nodeRadius * 0.85);

        // Seeker Callout Label
        ctx.strokeStyle = 'rgba(255, 30, 60, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(skSx - nodeRadius, skSy);
        ctx.lineTo(skSx - nodeRadius - 20, skSy - 15);
        ctx.lineTo(skSx - nodeRadius - 100, skSy - 15);
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px "Space Grotesk", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('SEEKER (Sending Request)', skSx - nodeRadius - 95, skSy - 22);
      }

      // 6. Draw Alumni Node (Right / Blue)
      if (alZ2 > -0.7) {
        const nodeRadius = 14 * alScale;

        // Outer Glow Ring
        ctx.strokeStyle = 'rgba(30, 64, 255, 0.28)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(alSx, alSy, nodeRadius + 5, 0, 2 * Math.PI);
        ctx.stroke();

        // Solid Node Circle
        ctx.fillStyle = '#1E40FF';
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(30, 64, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(alSx, alSy, nodeRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner User Icon
        drawUserIcon(ctx, alSx, alSy, nodeRadius * 0.85);

        // Alumni Callout Label
        ctx.strokeStyle = 'rgba(30, 64, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(alSx + nodeRadius, alSy);
        ctx.lineTo(alSx + nodeRadius + 20, alSy + 15);
        ctx.lineTo(alSx + nodeRadius + 100, alSy + 15);
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px "Space Grotesk", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ALUMNI (Giving Referral)', alSx + nodeRadius + 20, alSy + 28);
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
      <div className="absolute w-[260px] h-[260px] rounded-full bg-gradient-to-tr from-[#FF1E3C]/6 via-purple-600/4 to-[#1E40FF]/6 blur-[90px] pointer-events-none z-0" />
      
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
