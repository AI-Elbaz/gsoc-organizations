"use client";
import {memo} from "react";

import {Bookmark, ExternalLink} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {ProjectsChart} from "./projects-chart";

import type {ChartData, Organization} from "@/types";

interface OrganizationCardProps {
  org: Organization & {displayIndex: number};
  chartData: ChartData[];
  onBarClick: (url?: string) => void;
  isBookmarked: boolean;
  showChart?: boolean;
  onToggleBookmark: () => void;
  onViewProjects: () => void;
}

export const OrganizationCard = memo(
  ({
    org,
    chartData,
    showChart = true,
    onBarClick,
    isBookmarked,
    onToggleBookmark,
    onViewProjects,
  }: OrganizationCardProps) => (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-lg my-5 ${
        isBookmarked ? "border-primary" : ""
      }`}>
      <CardContent className="px-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {org.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={org.image_url}
                alt={org.name}
                className="w-12 h-12 rounded object-contain shrink-0 border p-1"
                style={{backgroundColor: org.image_background_color}}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-lg font-bold text-muted-foreground shrink-0">
                  {org.displayIndex}.
                </span>
                <h2 className="text-lg font-semibold text-card-foreground truncate">
                  {org.name}
                </h2>
                <Badge variant="secondary">{org.category}</Badge>
                <Button asChild variant="ghost" size="icon">
                  <a href={org.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onToggleBookmark}>
                  <Bookmark
                    size={16}
                    className={isBookmarked ? "fill-primary" : ""}
                  />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {org.description}
              </p>
              <div className="mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {org.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                <span className="font-semibold text-card-foreground">
                  Topics:{" "}
                </span>
                {org.topics.slice(0, 4).join(", ")}
                {org.topics.length > 4 && ` +${org.topics.length - 4}`}
              </div>
              <Button variant="secondary" onClick={onViewProjects}>
                View Projects
              </Button>
            </div>
          </div>
          {showChart && (
            <ProjectsChart chartData={chartData} onBarClick={onBarClick} />
          )}
        </div>
      </CardContent>
    </Card>
  ),
);

OrganizationCard.displayName = "OrganizationCard";
