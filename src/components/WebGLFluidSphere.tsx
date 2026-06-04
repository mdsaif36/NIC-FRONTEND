import React, { useRef, useEffect } from 'react';

export const WebGLFluidSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("WebGL not supported in this browser.");
      return;
    }

    // ── GLSL Shaders ──────────────────────────────────────────────────────────
    const vertexShaderSource = `
      attribute vec2 position;
      varying vec2 v_uv;
      void main() {
        v_uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      varying vec2 v_uv;
      
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse; // ranges -1.0 to 1.0

      // Stefan Gustavson's Simplex 3D Noise GLSL implementation
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      
      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod(i, 289.0 );
        vec4 p = permute( permute( permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      // Rotate around axis
      mat3 rotateY(float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat3(
          c, 0.0, -s,
          0.0, 1.0, 0.0,
          s, 0.0, c
        );
      }

      mat3 rotateX(float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat3(
          1.0, 0.0, 0.0,
          0.0, c, s,
          0.0, -s, c
        );
      }

      // Sphere distance estimator with organic deformations
      float map(vec3 p) {
        // Apply interactive rotation matrix based on mouse coords
        mat3 rot = rotateY(u_mouse.x * 0.4) * rotateX(u_mouse.y * -0.4);
        vec3 rp = rot * p;

        // Wave deforms
        float n1 = snoise(rp * 1.3 - vec3(0.0, u_time * 0.35, u_time * 0.15));
        float n2 = snoise(rp * 2.8 + vec3(u_time * 0.18, 0.0, u_time * 0.22)) * 0.35;
        float n3 = snoise(rp * 5.5) * 0.12;

        float sphereSDF = length(p) - 1.45;
        // Total displacement
        float displace = n1 * 0.4 + n2 * 0.18 + n3 * 0.06;
        
        return sphereSDF - displace;
      }

      // Normal estimator
      vec3 getNormal(vec3 p) {
        vec2 e = vec2(0.002, 0.0);
        return normalize(vec3(
          map(p + e.xyy) - map(p - e.xyy),
          map(p + e.yxy) - map(p - e.yxy),
          map(p + e.yyx) - map(p - e.yyx)
        ));
      }

      void main() {
        // Normalise pixel coordinates
        vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
        
        // Ray generation (orthographic projection look, slightly perspective)
        vec3 ro = vec3(0.0, 0.0, -4.5); // Ray origin
        vec3 rd = normalize(vec3(uv, 1.25)); // Ray direction

        // Raymarching
        float t = 0.0;
        float max_t = 8.0;
        bool hit = false;
        vec3 p;
        
        for (int i = 0; i < 68; i++) {
          p = ro + rd * t;
          float d = map(p);
          if (abs(d) < 0.001) {
            hit = true;
            break;
          }
          t += d;
          if (t > max_t) break;
        }

        // Output color
        vec3 col = vec3(0.0);

        if (hit) {
          vec3 n = getNormal(p);
          
          // Light direction
          vec3 lightDir = normalize(vec3(0.8, 1.2, -1.5));
          vec3 lightDir2 = normalize(vec3(-1.0, -0.5, 0.5)); // rim purple back-light

          // Ambient & Diffuse
          float diff = max(dot(n, lightDir), 0.0);
          float diff2 = max(dot(n, lightDir2), 0.0);

          // Fresnel reflection
          float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.5);

          // Specular phong highlight (creates glossy wet shine)
          vec3 viewDir = -rd;
          vec3 halfDir = normalize(lightDir + viewDir);
          float spec = pow(max(dot(n, halfDir), 0.0), 40.0);

          // Base colors matching user image: deep purple core, glossy metallic sheen
          vec3 purpleColor = vec3(0.12, 0.05, 0.28);
          vec3 lightPurple = vec3(0.48, 0.32, 0.88);
          vec3 cyanColor = vec3(0.2, 0.55, 1.0);

          // Mix base colors
          col = mix(purpleColor, lightPurple, diff);
          col += cyanColor * diff2 * 0.45; // secondary cyan/blue backlight
          
          // Edge glow
          col += lightPurple * fresnel * 0.9;
          
          // White specular highlight glow
          col += vec3(0.88, 0.82, 1.0) * spec * 1.6;
          
          // Ambient shadow
          col += vec3(0.02, 0.01, 0.04);
        } else {
          // Twinkling stars backdrop
          vec2 coord = gl_FragCoord.xy * 0.003;
          float stars = snoise(vec3(coord * 8.0, 1.0)) * 0.5 + 0.5;
          stars = pow(stars, 12.0) * 0.06; // extremely subtle twinkling points

          // Background gradient mapping to deep purple glow
          float distToCenter = length(uv);
          vec3 bgGlow = vec3(0.07, 0.04, 0.16) * exp(-distToCenter * 0.8);
          
          col = bgGlow + vec3(stars);
        }

        // Gamma correction
        col = pow(col, vec3(1.0 / 1.08));
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // ── WebGL Compiler Utils ──────────────────────────────────────────────────
    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation failed: ", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fs = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking failed: ", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry buffer
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    // ── Mouse & Resize Event Handlers ────────────────────────────────────────
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 2.0 - 1.0;
      const y = -((e.clientY - rect.top) / rect.height * 2.0 - 1.0);
      targetMouse = { x, y };
    };

    const handleResize = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Initial size
    handleResize();

    // ── Animation Loop ────────────────────────────────────────────────────────
    let animationFrameId = 0;
    let startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000.0;

      // Smooth mouse interpolation (easing)
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Set uniforms
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);

      // Draw Screen Quad
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // ── Clean Up ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover pointer-events-auto block"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};
