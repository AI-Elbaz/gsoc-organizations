"use client";
import {useTheme} from "next-themes";

import {startTransition} from "react";

import {Moon, Sun} from "lucide-react";

import {Button} from "../ui/button";

export const ThemeSwitcher = () => {
  const {theme, setTheme} = useTheme();

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() =>
        startTransition(() => setTheme(theme === "light" ? "dark" : "light"))
      }>
      {theme === "light" ? <Sun /> : <Moon />}
    </Button>
  );
};
