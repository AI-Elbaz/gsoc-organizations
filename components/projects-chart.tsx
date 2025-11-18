"use client";
import {memo} from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {Card} from "@/components/ui/card";

import type {TooltipContentProps} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import type {ChartData} from "@/types";

const CustomTooltip = ({
  active,
  payload,
}: TooltipContentProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const {year, projectsUrl} = payload[0].payload;
    const projects = payload[0].value;
    return (
      <Card className="p-1.5 gap-1">
        <p className="font-semibold text-sm">{year}</p>
        <p className="text-primary">{projects} projects</p>
        {projectsUrl && (
          <p className="text-xs text-muted-foreground">
            Click bar to view projects
          </p>
        )}
      </Card>
    );
  }
  return null;
};

interface ProjectsChartProps {
  chartData: ChartData[];
  onBarClick: (url?: string) => void;
}

// Projects Chart Component
export const ProjectsChart = memo(
  ({chartData, onBarClick}: ProjectsChartProps) => (
    <div className="hidden shrink-0 w-80 lg:block">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-card-foreground">
          Projects Timeline
        </span>
        <span className="text-xs text-muted-foreground">
          Total:{" "}
          <span className="font-bold text-primary">
            {chartData.reduce((sum, item) => sum + item.projects, 0)}
          </span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart
          data={chartData}
          margin={{top: 5, right: 5, bottom: 25, left: -20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            tick={{fontSize: 10}}
            interval={0}
            angle={-60}
            textAnchor="end"
          />
          <YAxis allowDecimals={false} tick={{fontSize: 10}} />
          <Tooltip content={CustomTooltip} />
          <Bar
            dataKey="projects"
            radius={[4, 4, 0, 0]}
            onClick={(_, index) => onBarClick(chartData[index].projectsUrl)}>
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill="royalblue" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  ),
);

ProjectsChart.displayName = "ProjectsChart";
