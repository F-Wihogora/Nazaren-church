"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

type ThemeToggleProps = {
  showSystem?: boolean;
  className?: string;
};

export function ThemeToggle({ showSystem = false, className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    if (!showSystem) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const label =
    !mounted ? "Theme" :
    showSystem && theme === "system" ? "System theme" :
    resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  const Icon = !mounted ? Moon :
    showSystem && theme === "system" ? Monitor :
    resolvedTheme === "dark" ? Sun : Moon;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      aria-label={label}
      title={label}
      onClick={cycleTheme}
      disabled={!mounted}
    >
      <Icon className={`h-5 w-5 ${!mounted ? "opacity-40" : ""}`} />
    </Button>
  );
}
