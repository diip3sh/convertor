"use client";

import { NavBottomBar } from "./nav-bottomBar";

export const Header = () => {
  return (
    <header className="py-6 border-b border-dashed border-[var(--line-color)]">
      <div className="flex justify-between items-start">
        <div className="font-semibold font-pixel text-3xl tracking-tight text-[var(--text-color)]">
          Convert.Or
        </div>
        <NavBottomBar />
      </div>
    </header>
  );
};
