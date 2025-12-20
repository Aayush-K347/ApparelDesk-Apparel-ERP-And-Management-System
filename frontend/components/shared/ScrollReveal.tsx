import React, { useRef, useEffect, useState, useMemo, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  baseOpacity?: number;
  enableBlur?: boolean;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  baseOpacity = 0,
  enableBlur = true,
  baseRotation = 5,
  blurStrength = 10,
  containerClassName = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far through the viewport the element has scrolled
      // 0 = element just entering viewport from bottom
      // 1 = element fully visible / past center
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      // Progress from 0 to 1 as element moves from bottom to center of viewport
      let progress = 1 - (elementCenter - viewportCenter) / (windowHeight / 2);
      progress = Math.max(0, Math.min(1, progress));
      
      setScrollProgress(progress);
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const styles = useMemo(() => {
    const opacity = baseOpacity + (1 - baseOpacity) * scrollProgress;
    const rotation = baseRotation * (1 - scrollProgress);
    const blur = enableBlur ? blurStrength * (1 - scrollProgress) : 0;
    const translateY = 30 * (1 - scrollProgress);

    return {
      opacity,
      transform: `translateY(${translateY}px) rotate(${rotation}deg)`,
      filter: enableBlur ? `blur(${blur}px)` : 'none',
      transition: 'transform 0.1s ease-out, opacity 0.1s ease-out, filter 0.1s ease-out',
    };
  }, [scrollProgress, baseOpacity, baseRotation, enableBlur, blurStrength]);

  return (
    <div ref={containerRef} className={containerClassName} style={styles}>
      {children}
    </div>
  );
};

export default ScrollReveal;
