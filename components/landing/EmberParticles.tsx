"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  life: number;
  maxLife: number;
  color: string;
}

export const EmberParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const colors = ["#10b981", "#06b6d4", "#34d399", "#22d3ee"];

    const initParticles = () => {
      particlesArray = [];
      for (let i = 0; i < 100; i++) {
        particlesArray.push(createParticle());
      }
    };

    const createParticle = (): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100, // start slightly below canvas
        size: Math.random() * 3 + 1,
        speedY: (Math.random() * 1.5 + 0.5) * -1, // moving up
        speedX: (Math.random() - 0.5) * 1.5,
        life: 0,
        maxLife: Math.random() * 100 + 50,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Fading effect
        const opacity = 1 - (p.life / p.maxLife);
        ctx.fillStyle = `${p.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;
        p.life++;

        // Reset particle when it dies or goes off screen
        if (p.life >= p.maxLife || p.y < 0) {
          particlesArray[i] = createParticle();
        }
      }
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    initParticles();
    drawParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};
