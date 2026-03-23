import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0, radius: 150 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;
      vx: number;
      vy: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        
        // Muted blue and purple tones
        const colors = [
          'rgba(100, 149, 237, 0.4)', // Cornflower Blue
          'rgba(147, 112, 219, 0.4)', // Medium Purple
          'rgba(123, 104, 238, 0.4)', // Medium Slate Blue
          'rgba(72, 61, 139, 0.3)',   // Dark Slate Blue
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        // Idle drift
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Wrap around screen
        if (this.baseX < 0) this.baseX = canvas.width;
        if (this.baseX > canvas.width) this.baseX = 0;
        if (this.baseY < 0) this.baseY = canvas.height;
        if (this.baseY > canvas.height) this.baseY = 0;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 20;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 20;
          }
        }
      }
    }

    const isMobile = window.innerWidth < 768;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const init = () => {
      particles = [];
      const baseDensity = (isMobile || isIOS) ? 18000 : 9000;
      const numberOfParticles = (canvas.width * canvas.height) / baseDensity;
      const maxParticles = (isMobile || isIOS) ? 40 : 150;
      const finalCount = Math.min(numberOfParticles, maxParticles);
      
      for (let i = 0; i < finalCount; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-20 bg-[#02040a] overflow-hidden pointer-events-none" style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}>
      {/* Fallback Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#02040a] via-[#0a0e1a] to-[#02040a] opacity-100" />
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Atmosphere Glows (Optimized with radial gradients instead of CSS blur) */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full -z-10" style={{ background: 'radial-gradient(circle, rgba(30, 58, 138, 0.15) 0%, transparent 70%)', transform: 'translateZ(0)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full -z-10" style={{ background: 'radial-gradient(circle, rgba(88, 28, 135, 0.15) 0%, transparent 70%)', transform: 'translateZ(0)' }} />
    </div>
  );
}
