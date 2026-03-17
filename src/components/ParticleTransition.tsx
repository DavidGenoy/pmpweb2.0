import React, { useEffect, useRef } from 'react';

interface ParticleTransitionProps {
  direction: 'down' | 'up'; // down: dark to white, up: white to dark
  color: string; // the dark color
  height?: number;
  className?: string;
}

const ParticleTransition: React.FC<ParticleTransitionProps> = ({ 
  direction, 
  color, 
  height = 480,
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const h = canvas.height;
      
      ctx.clearRect(0, 0, width, h);

      // High particle count for a rich, granular texture
      const particleCount = Math.floor((width * h) / 8); 
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * h;
        
        // Base probability from y position
        const normalizedY = y / h;
        let prob = direction === 'down' ? (1 - normalizedY) : normalizedY;
        
        // Non-linear curve for a more "dissolved" look
        prob = Math.pow(prob, 3.5);

        // Organic clustering noise
        const noise = (
          Math.sin(x * 0.02) * Math.cos(y * 0.02) * 0.5 + 
          Math.sin(x * 0.008 + y * 0.008) * 0.3 + 
          Math.cos(x * 0.003) * 0.2 +
          1.5
        ) / 2.5;
        
        const finalProb = prob * noise;

        // Solid edge blending
        const edgeThreshold = 0.015; 
        const isAtSolidEdge = direction === 'down' ? (normalizedY < edgeThreshold) : (normalizedY > (1 - edgeThreshold));
        
        if (isAtSolidEdge || Math.random() < finalProb) {
          const size = Math.random() * 1.2 + 0.15;
          const opacity = isAtSolidEdge ? 1.0 : (Math.random() * 0.6 + 0.1);
          
          // Crystalline Sparkle logic
          const isSparkle = prob > 0.6 && Math.random() > 0.9997;
          
          if (isSparkle) {
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = Math.random() * 0.9 + 0.1;
            const s = size * 2.5;
            
            // Star/Diamond shape
            ctx.beginPath();
            ctx.moveTo(x, y - s);
            ctx.lineTo(x + s/3, y - s/3);
            ctx.lineTo(x + s, y);
            ctx.lineTo(x + s/3, y + s/3);
            ctx.lineTo(x, y + s);
            ctx.lineTo(x - s/3, y + s/3);
            ctx.lineTo(x - s, y);
            ctx.lineTo(x - s/3, y - s/3);
            ctx.closePath();
            ctx.fill();
            
            // Crystalline glow
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            
            // Irregular grain shapes
            const shapeType = Math.random();
            if (shapeType > 0.4) {
              // Tiny grain
              ctx.beginPath();
              ctx.arc(x, y, size, 0, Math.PI * 2);
              ctx.fill();
            } else if (shapeType > 0.1) {
              // Micro-stipple / irregular grain
              const rw = size * (Math.random() * 1.8 + 0.4);
              const rh = size * (Math.random() * 1.8 + 0.4);
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(Math.random() * Math.PI);
              ctx.fillRect(-rw/2, -rh/2, rw, rh);
              ctx.restore();
            } else {
              // Tiny cluster of 2-3 particles
              for (let j = 0; j < 2; j++) {
                const cx = x + (Math.random() - 0.5) * 2;
                const cy = y + (Math.random() - 0.5) * 2;
                ctx.beginPath();
                ctx.arc(cx, cy, size * 0.7, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      // Use devicePixelRatio for high-resolution
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${height}px`;
      
      draw();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    handleResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [direction, color, height]);

  return (
    <div className={`w-full overflow-hidden ${className}`} style={{ height: `${height}px` }}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default ParticleTransition;
