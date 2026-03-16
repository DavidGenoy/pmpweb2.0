import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (more pronounced, max ~25 degrees)
    const rotateX = ((y - centerY) / centerY) * -25;
    const rotateY = ((x - centerX) / centerX) * 25;

    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform,
        transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
};

export default TiltCard;
