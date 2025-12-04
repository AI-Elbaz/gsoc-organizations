import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

import type {ChartData, Organization} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchClient = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });

export function toggleItem<T>(array: T[], item: T): T[] {
  const index = array.indexOf(item);
  return index !== -1 ? array.filter((_, i) => i !== index) : [...array, item];
}

export function extractUniqueYearsAndTechnologies(
  organizations: Organization[],
) {
  const yearsSet = new Set<string>();
  const techSet = new Set<string>();

  for (const org of organizations) {
    if (org.years) {
      Object.entries(org.years).forEach(([year, data]) => {
        if (data !== null) yearsSet.add(year.slice(1));
      });
    }

    for (const tech of org.technologies) {
      techSet.add(tech);
    }
  }

  return {
    allYears: Array.from(yearsSet).sort((a, b) => b.localeCompare(a)),
    allTechnologies: Array.from(techSet).sort(),
  };
}

export const getChartData = (
  orgYears: Organization["years"],
  years: string[],
): ChartData[] => {
  if (!orgYears) return [];
  const orgYearsData = new Map<
    string,
    {num_projects: number; projects_url?: string} | null
  >();

  Object.entries(orgYears).forEach(([year, data]) => {
    orgYearsData.set(year.replace("_", ""), data);
  });

  return years.map(year => {
    const data = orgYearsData.get(year);
    return {
      year,
      projects: data?.num_projects ?? 0,
      projectsUrl: data?.projects_url,
    };
  });
};

export const sanitizeCsvField = (value: string) => {
  // If value contains comma, newline, or quote, wrap in quotes and escape internal quotes
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};
