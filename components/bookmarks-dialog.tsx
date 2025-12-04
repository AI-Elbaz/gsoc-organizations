import {useCallback, useMemo} from "react";

import {Bookmark} from "lucide-react";

import {useOrganizationStore} from "@/hooks/use-organizations-store";
import {OrganizationCard} from "./organization-card";
import {Button} from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import type {Organization} from "@/types";

export const BookmarksDialog = ({
  organizations,
}: {
  organizations: Organization[];
}) => {
  const data = useOrganizationStore(state => state.organizations);

  const bookmarkedOrgs = useMemo(() => {
    return organizations.filter(org => data[org.name]?.isBookmarked);
  }, [data, organizations]);

  const exportBookmarksToCsv = useCallback(() => {
    const headers = ["Name", "Category", "URL", "Technologies", "Description"];
    const csvContent = [
      headers.join(","),
      ...bookmarkedOrgs.map(org =>
        [
          `"${org.name.replace(/"/g, '""')}"`,
          `"${org.category}"`,
          `"${org.url}"`,
          `"${org.technologies.join(" ")}"`,
          `"${org.description.replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "gsoc_bookmarks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [bookmarkedOrgs]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bookmark className="mr-2 h-4 w-4" />
          View Bookmarks ({bookmarkedOrgs.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bookmarked Organizations</DialogTitle>
          <DialogDescription className="sr-only">
            View and manage your bookmarked organizations.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto space-y-4 p-1 pr-4">
          {bookmarkedOrgs.length ? (
            bookmarkedOrgs.map((org, index) => (
              <OrganizationCard
                key={org.name}
                org={org}
                displayIndex={index + 1}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center min-h-[50vh] flex items-center justify-center">
              No bookmarks yet.
            </p>
          )}
        </div>
        {bookmarkedOrgs.length > 0 && (
          <DialogFooter>
            <Button onClick={exportBookmarksToCsv}>Export to CSV</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
