"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface ParticleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
}

export const ParticleButton = ({
  children,
  onClick,
  disabled = false,
  className,
  variant = "primary",
}: ParticleButtonProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const isHoveringRef = useRef(false);
  const frameCountRef = useRef(0);

  const createParticle = useCallback((x: number, y: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 0.5;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.2,
      size: 1 + Math.random() * 2,
      alpha: 0.4 + Math.random() * 0.4,
      life: 0,
      maxLife: 60 + Math.random() * 40,
    };
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    frameCountRef.current++;
    
    // Render every 2nd frame for performance (30fps instead of 60fps)
    if (frameCountRef.current % 2 === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles on hover (limited spawn rate)
      if (isHoveringRef.current && particlesRef.current.length < 30 && frameCountRef.current % 4 === 0) {
        const x = Math.random() * canvas.width;
        const y = canvas.height + 5;
        particlesRef.current.push(createParticle(x, y));
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;
        
        const progress = particle.life / particle.maxLife;
        const currentAlpha = particle.alpha * (1 - progress);

        if (particle.life >= particle.maxLife) {
          return false;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.fill();

        return true;
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
  };

  const baseStyles = variant === "primary"
    ? "bg-foreground text-background hover:bg-foreground/90"
    : "bg-background text-foreground border border-border/50 hover:bg-muted/50";

  return (
    <button
      ref={containerRef}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-full px-8 h-11 font-medium transition-all duration-200 shadow-lg",
        variant === "primary" && "shadow-foreground/10",
        disabled && "opacity-50 cursor-not-allowed",
        baseStyles,
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};
