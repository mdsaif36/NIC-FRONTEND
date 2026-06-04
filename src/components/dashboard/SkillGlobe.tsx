import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

interface SkillGlobeProps {
  skills: string[];
  skillDetails: { [key: string]: { proficiency: number; type: 'technical' | 'soft' | 'domain' } };
  hoveredSkill: string | null;
  setHoveredSkill: (s: string | null) => void;
}

export const SkillGlobe: React.FC<SkillGlobeProps> = ({ skills, skillDetails, hoveredSkill, setHoveredSkill }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  // Angle states
  const [rotX, setRotX] = useState(-0.3);
  const [rotY, setRotY] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [fallbackMode, setFallbackMode] = useState(false);
  
  // Current mouse positions for tooltip
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [localHovered, setLocalHovered] = useState<string | null>(null);

  // Auto-rotation speeds
  const speedX = 0.0008;
  const speedY = 0.0012;

  // Track coordinates for hover detection
  const projectedPointsRef = React.useRef<{ name: string; sx: number; sy: number; proficiency: number; type: string }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setFallbackMode(true);
      return;
    }

    let animationFrameId: number;
    let localRotX = rotX;
    let localRotY = rotY;

    const render = () => {
      if (!isDragging) {
        localRotY += speedY;
        localRotX += speedX;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const R = Math.min(canvas.width, canvas.height) * 0.32;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw wireframe grid lines representing latitude & longitude
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.05)'; // Light purple grid
      ctx.lineWidth = 1;
      
      // Latitude circles
      for (let i = -2; i <= 2; i++) {
        const latAngle = (i * Math.PI) / 6;
        const yRadius = Math.cos(latAngle) * R;
        const yCenter = cy + Math.sin(latAngle) * R * Math.sin(localRotX);
        const xRadius = yRadius;
        
        ctx.beginPath();
        ctx.ellipse(cx, yCenter, Math.abs(xRadius), Math.abs(yRadius * Math.cos(localRotX)), 0, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Longitude lines
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(R * Math.cos(localRotY + (i * Math.PI) / 6)), Math.abs(R), localRotX, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Outer bounding wire circle
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, R + 10, 0, 2 * Math.PI);
      ctx.stroke();

      // Golden spiral Fibonacci distribution
      const N = skills.length;
      const points = skills.map((name, i) => {
        const zFraction = 1 - (2 * i) / (N - 1 || 1);
        const radiusFraction = Math.sqrt(1 - zFraction * zFraction);
        const phi = i * 2.39996; // Golden angle in radians
        
        // Initial coordinates on unit sphere
        const x0 = radiusFraction * Math.cos(phi);
        const y0 = radiusFraction * Math.sin(phi);
        const z0 = zFraction;

        // Apply rotation Y
        let x1 = x0 * Math.cos(localRotY) - z0 * Math.sin(localRotY);
        let z1 = x0 * Math.sin(localRotY) + z0 * Math.cos(localRotY);
        
        // Apply rotation X
        let y2 = y0 * Math.cos(localRotX) - z1 * Math.sin(localRotX);
        let z2 = y0 * Math.sin(localRotX) + z1 * Math.cos(localRotX);

        // Scale coordinates to globe radius
        const x = x1 * R;
        const y = y2 * R;
        const z = z2 * R;

        // Perspective divide
        const dist = 320;
        const scale = dist / (dist - z);
        const sx = cx + x * scale;
        const sy = cy + y * scale;

        const details = skillDetails[name] || { proficiency: 4, type: 'technical' };

        return {
          name,
          sx,
          sy,
          z,
          scale,
          proficiency: details.proficiency,
          type: details.type
        };
      });

      // Sort points by z depth (draw back items first, front items last)
      points.sort((a, b) => a.z - b.z);

      // Save projected coordinates for mouse checks
      projectedPointsRef.current = points.map(p => ({
        name: p.name,
        sx: p.sx,
        sy: p.sy,
        proficiency: p.proficiency,
        type: p.type
      }));

      // Render items
      points.forEach(p => {
        // Color mapping
        let color = '#38BDF8'; // Technical = Blue
        let glowColor = 'rgba(56, 189, 248, 0.25)';
        if (p.type === 'soft') {
          color = '#C084FC'; // Soft = Purple
          glowColor = 'rgba(192, 132, 252, 0.25)';
        } else if (p.type === 'domain') {
          color = '#22D3EE'; // Domain = Cyan
          glowColor = 'rgba(34, 211, 238, 0.25)';
        }

        // Highlight if hovered
        const isHovered = localHovered === p.name || hoveredSkill === p.name;
        if (isHovered) {
          color = '#FFFFFF';
          glowColor = 'rgba(255, 255, 255, 0.7)';
        }

        // Opacity based on depth (-R to +R)
        const depthOpacity = (p.z + R) / (2 * R) * 0.65 + 0.35;
        ctx.globalAlpha = isHovered ? 1.0 : depthOpacity;

        // Font size based on proficiency and depth scale
        // Strong (4-5) is larger/brighter, Learning (1-2) is smaller/dimmer
        const baseSize = 8.5 + (p.proficiency / 5) * 5.5; 
        const fontSize = Math.round(baseSize * p.scale);
        
        ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Shadows for high-fidelity glowing look
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = isHovered ? 12 : 3;
        ctx.fillStyle = color;

        // Draw node name
        ctx.fillText(p.name, p.sx, p.sy);

        // Draw a tiny matching node dot under the text node
        ctx.fillStyle = color;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy + (fontSize / 2) + 4, 1.8 * p.scale, 0, 2 * Math.PI);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [skills, skillDetails, rotX, rotY, isDragging, localHovered, hoveredSkill]);

  // Handler for mouse events on canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isDragging) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      
      // Update rotation angles relative to mouse offsets
      setRotY(prev => prev + dx * 0.007);
      setRotX(prev => prev - dy * 0.007);
      setLastMouse({ x: e.clientX, y: e.clientY });
    } else {
      // Find closest node
      let closestSkill: string | null = null;
      let minDistance = 22; // Hover window size
      
      projectedPointsRef.current.forEach(p => {
        const dist = Math.hypot(p.sx - mx, p.sy - my);
        if (dist < minDistance) {
          minDistance = dist;
          closestSkill = p.name;
        }
      });

      if (closestSkill !== localHovered) {
        setLocalHovered(closestSkill);
        setHoveredSkill(closestSkill);
      }

      if (closestSkill) {
        setMousePos({ x: mx, y: my });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setLocalHovered(null);
    setHoveredSkill(null);
  };

  // Static mock social proof alumni details for tooltip
  const getSocialProof = (name: string) => {
    const proofs: { [key: string]: string } = {
      'Python': '14 Google & Meta alumni have this',
      'React': '8 Microsoft & Amazon alumni have this',
      'ML': '12 Google & Meta research partners have this',
      'SQL': '9 Amazon & Flipkart database experts have this',
      'System Design': '11 Meta & Google Staff Engineers validate this',
      'AWS': '6 AWS certified cloud architects verified',
      'DSA': '12 IIT alumni interviewers have this',
      '3D Skill Globe': '3 graphics engineers endorse this'
    };
    return proofs[name] || '4 verified campus alumni have this';
  };

  if (fallbackMode) {
    // Beautiful flat fallback cloud for graceful degradation
    return (
      <div className="flex flex-wrap gap-2.5 justify-center items-center py-10 px-4 min-h-[300px] w-full bg-slate-950/20 border border-white/5 rounded-xl text-left select-none">
        {skills.map((s) => {
          const details = skillDetails[s] || { proficiency: 4, type: 'technical' };
          let colorClass = 'bg-blue-500/10 text-blue-300 border-blue-500/20';
          if (details.type === 'soft') colorClass = 'bg-purple-500/10 text-purple-300 border-purple-500/20';
          else if (details.type === 'domain') colorClass = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';

          const sizes = ['text-[10px]', 'text-[11px]', 'text-xs', 'text-sm font-bold', 'text-base font-extrabold'];
          const sizeClass = sizes[details.proficiency - 1] || 'text-xs';

          return (
            <span 
              key={s}
              onMouseEnter={() => setHoveredSkill(s)}
              onMouseLeave={() => setHoveredSkill(null)}
              className={`px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${colorClass} ${sizeClass} hover:scale-105 hover:bg-white/10`}
            >
              {s}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[350px] flex items-center justify-center select-none overflow-visible">
      
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        width={350}
        height={350}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="cursor-grab active:cursor-grabbing w-[350px] h-[350px] overflow-visible"
      />

      {/* Floating HTML Tooltip */}
      {localHovered && (
        <div 
          className="absolute z-50 bg-[#0c0c14]/95 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none text-left w-52 text-white animate-fade-in"
          style={{ 
            left: `${mousePos.x + 15}px`, 
            top: `${mousePos.y - 10}px` 
          }}
        >
          <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1">
            <span className="text-xs font-bold font-sora text-white">{localHovered}</span>
            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
              skillDetails[localHovered]?.type === 'soft' 
                ? 'bg-purple-500/15 text-purple-400' 
                : skillDetails[localHovered]?.type === 'domain'
                ? 'bg-cyan-500/15 text-cyan-400'
                : 'bg-blue-500/15 text-blue-400'
            }`}>
              {skillDetails[localHovered]?.type || 'technical'}
            </span>
          </div>
          <span className="block text-[10px] text-slate-350 mt-1 font-semibold">
            Proficiency: <span className="text-purple-400 font-bold">{skillDetails[localHovered]?.proficiency || 4}/5</span>
          </span>
          <p className="text-[9px] text-emerald-400 font-semibold mt-1 font-space-grotesk flex items-center gap-1 leading-normal">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            {getSocialProof(localHovered)}
          </p>
        </div>
      )}

      {/* Center ambient glow orb */}
      <div className="absolute inset-0 m-auto w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0" />
    </div>
  );
};
