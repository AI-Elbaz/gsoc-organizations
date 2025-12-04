"use client";
import dynamic from "next/dynamic";

const ThemeSwitcher = dynamic(
  () => import("./theme-switcher").then(mod => mod.ThemeSwitcher),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse size-9 bg-gray-200 rounded-md"></div>
    ),
  },
);

export {ThemeSwitcher};
