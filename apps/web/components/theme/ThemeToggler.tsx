"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, SunIcon, MoonIcon } from "lucide-react";
import { Button } from "../ui/button";

export function ThemeToggler() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="flex items-center gap-2">
               <Button
      variant="ghost"
      type="button"
      size="icon"
      className="px-2"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200" />
      <MoonIcon className="hidden h-[1.2rem] w-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200" />
    </Button>
        </div>
    );
}
