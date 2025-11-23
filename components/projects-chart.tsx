"use client";
import {memo} from "react";

import {Bar, BarChart, XAxis, YAxis} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type {ChartConfig} from "@/components/ui/chart";

interface ChartData {
  year: string;
  projects: number;
  projectsUrl?: string;
}

interface ProjectsChartProps {
  chartData: ChartData[];
  onBarClick: (url?: string) => void;
}

const chartConfig = {
  projects: {
    label: "Projects",
    color: "hsl(221, 83%, 53%)", // royalblue in HSL
  },
} satisfies ChartConfig;

export const ProjectsChart = memo(
  ({chartData, onBarClick}: ProjectsChartProps) => {
    const totalProjects = chartData.reduce(
      (sum, item) => sum + item.projects,
      0,
    );

    return (
      <div className="hidden shrink-0 w-80 lg:block">
        <div className="flex items-center justify-end mb-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-primary">
              {totalProjects}
            </span>
            <span className="text-xs text-muted-foreground">projects</span>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="min-h-[150px] w-full">
          <BarChart
            data={chartData}
            margin={{top: 5, right: 5, bottom: 5, left: -20}}
            accessibilityLayer>
            <XAxis
              dataKey="year"
              tick={{fontSize: 11}}
              tickLine={false}
              axisLine={false}
              tickFormatter={value => value.slice(-2)}
            />
            <YAxis
              allowDecimals={false}
              tick={{fontSize: 11}}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    if (payload && payload.length > 0) {
                      const data = payload[0].payload;
                      return (
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold">{data.year}</p>
                          {data.projectsUrl && (
                            <p className="text-xs text-muted-foreground">
                              Click bar to view projects
                            </p>
                          )}
                        </div>
                      );
                    }
                    return value;
                  }}
                />
              }
            />
            <Bar
              dataKey="projects"
              fill="var(--color-projects)"
              radius={[4, 4, 0, 0]}
              onClick={data => onBarClick(data.projectsUrl)}
              cursor="pointer"
            />
          </BarChart>
        </ChartContainer>
      </div>
    );
  },
);

ProjectsChart.displayName = "ProjectsChart";
