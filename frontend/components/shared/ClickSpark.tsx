import React, { useEffect, useRef, useCallback } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
}

interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  children,
  sparkColor = '#c9b52e',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  const createSpark = useCallback((x: number, y: number) => {
    if (!sparksRef.current) return;

    const sparks: HTMLDivElement[] = [];

    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      const angle = (360 / sparkCount) * i;
      const radians = (angle * Math.PI) / 180;
      
      spark.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${sparkSize}px;
        height: ${sparkSize}px;
        background: ${sparkColor};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        animation: spark-${idCounter.current}-${i} ${duration}ms ease-out forwards;
      `;

      const endX = Math.cos(radians) * sparkRadius;
      const endY = Math.sin(radians) * sparkRadius;

      const style = document.createElement('style');
      style.textContent = `
        @keyframes spark-${idCounter.current}-${i} {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);

      sparksRef.current.appendChild(spark);
      sparks.push(spark);

      setTimeout(() => {
        spark.remove();
        style.remove();
      }, duration);
    }

    idCounter.current++;
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      createSpark(e.clientX, e.clientY);
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [createSpark]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div ref={sparksRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
      {children}
    </div>
  );
};

export default ClickSpark;
