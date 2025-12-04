"use client";
import {memo, useCallback, useState} from "react";

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
import {useOrganizationStore} from "@/hooks/use-organizations-store";
import {cn} from "@/lib/utils";
import {ProjectsChart} from "./projects-chart";
import {ProjectsDialog} from "./projects-dialog";

import type {ChartData, Organization, Priority} from "@/types";

const priorityStyles = {
  high: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  medium:
    "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  low: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
  "not-wanted":
    "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600",
};

const AddNoteDialog = ({orgName, notes}: {orgName: string; notes?: string}) => {
  const setNotes = useOrganizationStore(state => state.setNotes);
  const [noteText, setNoteText] = useState(notes || "");

  const [open, setOpen] = useState(false);

  const handleSaveNote = () => {
    setNotes(orgName, noteText);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <MessageSquarePlus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a note {orgName}.</DialogTitle>
          <DialogDescription>
            Add a note to this organization to remember important details.
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
  );
};

const BookmarkButton = ({orgName}: {orgName: string}) => {
  const toggleBookmark = useOrganizationStore(state => state.toggleBookmark);

  const isBookmarked = useOrganizationStore(
    state => state.organizations[orgName]?.isBookmarked,
  );

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => toggleBookmark(orgName)}>
      <Bookmark size={16} className={cn(isBookmarked && "fill-primary")} />
    </Button>
  );
};

interface OrganizationCardProps {
  org: Organization;
  displayIndex?: number;
  chartData?: ChartData[];
}

export const OrganizationCard = memo(
  ({org, displayIndex, chartData}: OrganizationCardProps) => {
    const priority = useOrganizationStore(
      state => state.organizations[org.name]?.priority,
    );
    const notes = useOrganizationStore(
      state => state.organizations[org.name]?.notes,
    );

    const [openProjectsDialog, setOpenProjectsDialog] = useState(false);

    const setPriority = useOrganizationStore(state => state.setPriority);

    const handleBarClick = useCallback((url?: string) => {
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    }, []);

    return (
      <Card
        className={cn(
          "@container/card overflow-hidden transition-shadow hover:shadow-lg my-5",
          priority && priorityStyles[priority],
        )}>
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
                    {displayIndex}.
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
                  <BookmarkButton orgName={org.name} />
                  <AddNoteDialog orgName={org.name} notes={notes} />
                  <Select
                    onValueChange={value =>
                      setPriority(org.name, value as Priority)
                    }
                    value={priority}>
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

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {org.technologies.map(tech => (
                    <Badge key={tech} variant="outline" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                  <span className="font-semibold text-card-foreground">
                    Topics:{" "}
                  </span>
                  {org.topics.slice(0, 4).join(", ")}
                  {org.topics.length > 4 && ` +${org.topics.length - 4}`}
                </div>
                <ProjectsDialog
                  organization={org}
                  open={openProjectsDialog}
                  onOpenChange={setOpenProjectsDialog}
                />
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
            {chartData && (
              <ProjectsChart
                chartData={chartData}
                onBarClick={handleBarClick}
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

OrganizationCard.displayName = "OrganizationCard";
