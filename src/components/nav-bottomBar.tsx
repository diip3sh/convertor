"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { animate } from "animejs";
import { GitHub } from "../../public/svg/github";

export const NavBottomBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    // Initial state - hide text
    text.style.opacity = "0";
    text.style.transform = "translateX(-10px)";
    text.style.filter = "blur(4px)";
    text.style.pointerEvents = "none";

    const handleMouseEnter = () => {
      if (isHoveredRef.current) return;
      isHoveredRef.current = true;

      animate(text, {
        opacity: [0, 1],
        translateX: [-10, 0],
        filter: ["blur(4px)", "blur(0px)"],
        duration: 300,
        ease: "outQuad",
      });

      // Expand container width
      animate(container, {
        width: ["41px", "164px"],
        duration: 300,
        ease: "outQuad",
      });
    };

    const handleMouseLeave = () => {
      if (!isHoveredRef.current) return;
      isHoveredRef.current = false;

      animate(text, {
        opacity: [1, 0],
        translateX: [0, -10],
        filter: ["blur(0px)", "blur(4px)"],
        duration: 250,
        ease: "inQuad",
      });

      // Collapse container width
      animate(container, {
        width: ["164px", "41px"],
        duration: 250,
        ease: "inQuad",
      });
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-[#333] fixed right-3 bottom-3 border border-neutral-200 rounded-full shadow-md overflow-hidden"
      style={{ width: "41px", height: "40px" }}
    >
      <Link
        href="https://github.com/pilladipesh33/converter-site"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-2 px-3 py-1.5 h-full font-medium font-geist-sans text-white hover:text-neutral-200 transition-colors duration-200 whitespace-nowrap"
      >
        <GitHub height={16} width={16} className="flex-shrink-0" />
        <span ref={textRef} className="text-base font-geist-sans pr-2">
          Star on GitHub
        </span>
      </Link>
    </div>
  );
};
