"use client";
import {memo, useState} from "react";

import {Bookmark, ExternalLink, MessageSquarePlus} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {useOrganizationStore} from "@/hooks/user-organization-store";
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
  }: OrganizationCardProps) => {
    const {organizations, setPriority, setNotes} = useOrganizationStore();
    const {priority, notes} = organizations[org.name] || {};

    const [noteText, setNoteText] = useState(notes || "");

    const handlePriorityChange = (value: string) => {
      setPriority(org.name, value);
    };

    const handleSaveNote = () => {
      setNotes(org.name, noteText);
    };

    const priorityStyles: {[key: string]: string} = {
      high: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
      medium:
        "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
      low: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
      "not-wanted":
        "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600",
    };

    return (
      <Card
        className={`@container/card overflow-hidden transition-shadow hover:shadow-lg my-5 ${
          isBookmarked ? "border-primary" : ""
        } ${priority ? priorityStyles[priority] : ""}`}>
        <CardContent className="px-4">
          <div className="flex flex-col gap-4 @lg/card:flex-row @lg/card:items-start">
            <div className="flex flex-col @lg/card:flex-row items-start gap-4 flex-1 min-w-0">
              {org.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={org.image_url}
                  alt={org.name}
                  className="size-18 rounded object-contain shrink-0 border p-1"
                  style={{backgroundColor: org.image_background_color}}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-lg font-bold text-muted-foreground shrink-0">
                    {org.displayIndex}.
                  </span>
                  <h2 className="text-lg font-semibold text-card-foreground text-ellipsis">
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

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MessageSquarePlus size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add a note to {org.name}</DialogTitle>
                        <DialogDescription>
                          Add a note to this organization to remember important
                          details.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        placeholder="Type your note here."
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                      />
                      <DialogFooter>
                        <Button onClick={handleSaveNote}>Save Note</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Select onValueChange={handlePriorityChange} value={priority}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Set priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="not-wanted">Not Wanted</SelectItem>
                    </SelectContent>
                  </Select>
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
                {notes && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold">Note:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-2">
                      {notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {showChart && (
              <ProjectsChart chartData={chartData} onBarClick={onBarClick} />
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

OrganizationCard.displayName = "OrganizationCard";
