"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";

import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {ChevronDown, ChevronRight} from "lucide-react";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {ActiveFiltersSummary, FilterBar} from "./filters-bar";
import {OrganizationCard} from "./organization-card";
import {ProjectsDialog} from "./projects-dialog";

import type {VirtualItem} from "@tanstack/react-virtual";
import type {FC} from "react";

import type {
  ChartData,
  Organization,
  OrganizationItem,
  VirtualListItem,
} from "@/types";

export const GSoCDashboard: FC<{data: Organization[]}> = ({data}) => {
  const [organizations] = useState<Organization[]>(data);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );
  const [bookmarkedOrgs, setBookmarkedOrgs] = useState<Set<string>>(new Set());
  const [isBookmarksDialogOpen, setIsBookmarksDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isProjectsDialogOpen, setIsProjectsDialogOpen] = useState(false);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarkedOrgs");
    if (storedBookmarks) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookmarkedOrgs(new Set(JSON.parse(storedBookmarks)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "bookmarkedOrgs",
      JSON.stringify(Array.from(bookmarkedOrgs)),
    );
  }, [bookmarkedOrgs]);

  const [filters, setFilters] = useQueryStates({
    years: parseAsArrayOf(parseAsString).withDefault([]),
    tech: parseAsArrayOf(parseAsString).withDefault([]),
    sections: parseAsInteger.withDefault(1),
  });

  const {allYears, allTechnologies} = useMemo(() => {
    const yearsSet = new Set<string>();
    const techSet = new Set<string>();
    organizations.forEach(org => {
      if (org.years) {
        Object.entries(org.years).forEach(([year, data]) => {
          if (data !== null) yearsSet.add(year.replace("_", ""));
        });
      }
      org.technologies.forEach(tech => techSet.add(tech));
    });
    return {
      allYears: Array.from(yearsSet).sort((a, b) => b.localeCompare(a)),
      allTechnologies: Array.from(techSet).sort(),
    };
  }, [organizations]);

  const allYearsForChart = useMemo(() => {
    return allYears.slice().sort((a, b) => a.localeCompare(b));
  }, [allYears]);

  const getChartData = useCallback(
    (orgYears: Organization["years"], years: string[]): ChartData[] => {
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
    },
    [],
  );

  const filteredOrgsWithChartData = useMemo(() => {
    return organizations
      .filter(org => {
        if (filters.years.length > 0) {
          const orgYears = Object.keys(org.years || {})
            .filter(
              year => org.years?.[year as keyof typeof org.years] !== null,
            )
            .map(year => year.replace("_", ""));
          if (!filters.years.every(year => orgYears.includes(year)))
            return false;
        }
        if (filters.tech.length > 0) {
          if (!filters.tech.some(tech => org.technologies.includes(tech)))
            return false;
        }
        return true;
      })
      .map(org => ({
        ...org,
        chartData: getChartData(org.years, allYearsForChart),
      }));
  }, [
    organizations,
    filters.years,
    filters.tech,
    allYearsForChart,
    getChartData,
  ]);

  const virtualListItems = useMemo((): VirtualListItem[] => {
    if (filters.sections <= 1 || filteredOrgsWithChartData.length === 0) {
      return filteredOrgsWithChartData.map((org, index) => ({
        type: "organization",
        data: {...org, displayIndex: index + 1},
      }));
    }
    const sections: Array<(typeof filteredOrgsWithChartData)[0][]> = Array.from(
      {length: filters.sections},
      () => [],
    );

    filteredOrgsWithChartData.forEach((org, index) => {
      sections[index % filters.sections].push(org);
    });

    const flatList: VirtualListItem[] = [];
    sections.forEach((orgsInSection, sectionIndex) => {
      if (orgsInSection.length > 0) {
        const title = `Section ${sectionIndex + 1}`;
        const isCollapsed = collapsedSections.has(title);
        flatList.push({type: "header", title, isCollapsed});

        if (!isCollapsed) {
          const organizationItems: OrganizationItem[] = orgsInSection.map(
            (org, localIndex) => ({
              type: "organization",
              data: {...org, displayIndex: localIndex + 1},
            }),
          );
          flatList.push(...organizationItems);
        }
      }
    });
    return flatList;
  }, [filteredOrgsWithChartData, filters.sections, collapsedSections]);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: virtualListItems.length,
    estimateSize: index => {
      const item = virtualListItems[index];
      return item.type === "header" ? 56 : 235;
    },
    overscan: 10,
  });

  const toggleYear = useCallback(
    (year: string) => {
      setFilters(prev => ({
        ...prev,
        years: prev.years.includes(year)
          ? prev.years.filter(y => y !== year)
          : [...prev.years, year],
      }));
    },
    [setFilters],
  );

  const toggleTechnology = useCallback(
    (tech: string) => {
      setFilters(prev => ({
        ...prev,
        tech: prev.tech.includes(tech)
          ? prev.tech.filter(t => t !== tech)
          : [...prev.tech, tech],
      }));
    },
    [setFilters],
  );

  const setSections = useCallback(
    (sections: number) => {
      setFilters(prev => ({...prev, sections}));
    },
    [setFilters],
  );

  const toggleSectionCollapse = useCallback((sectionTitle: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionTitle)) {
        newSet.delete(sectionTitle);
      } else {
        newSet.add(sectionTitle);
      }
      return newSet;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({years: [], tech: [], sections: 1});
    setCollapsedSections(new Set());
  }, [setFilters]);

  const handleBarClick = useCallback((url?: string) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const toggleBookmark = useCallback((orgName: string) => {
    setBookmarkedOrgs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orgName)) {
        newSet.delete(orgName);
      } else {
        newSet.add(orgName);
      }
      return newSet;
    });
  }, []);

  const handleViewProjects = useCallback((org: Organization) => {
    setSelectedOrg(org);
    setIsProjectsDialogOpen(true);
  }, []);

  const exportBookmarksToCsv = useCallback(() => {
    const bookmarkedData = organizations.filter(org =>
      bookmarkedOrgs.has(org.name),
    );
    const headers = ["Name", "Category", "URL", "Technologies", "Description"];
    const csvContent = [
      headers.join(","),
      ...bookmarkedData.map(org =>
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
  }, [bookmarkedOrgs, organizations]);

  const hasActiveFilters = filters.years.length > 0 || filters.tech.length > 0;

  const virtualizedItems = rowVirtualizer.getVirtualItems();

  return (
    <>
      <div className="mb-6 space-y-4">
        <FilterBar
          allYears={allYears}
          selectedYears={filters.years}
          onToggleYear={toggleYear}
          allTechnologies={allTechnologies}
          selectedTechnologies={filters.tech}
          onToggleTechnology={toggleTechnology}
          selectedSections={filters.sections}
          onSetSections={setSections}
          onClearAll={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
          onShowBookmarks={() => setIsBookmarksDialogOpen(true)}
          numBookmarks={bookmarkedOrgs.size}
        />
        <ActiveFiltersSummary
          selectedYears={filters.years}
          selectedTechnologies={filters.tech}
          onToggleYear={toggleYear}
          onToggleTechnology={toggleTechnology}
        />
        <p className="text-sm text-muted-foreground pt-2">
          Showing {filteredOrgsWithChartData.length} organization
          {filteredOrgsWithChartData.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div ref={parentRef}>
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualizedItems[0]?.start ?? 0}px)`,
            }}>
            {virtualizedItems.map((virtualRow: VirtualItem) => {
              const item = virtualListItems[virtualRow.index];

              if (item.type === "header") {
                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className="w-full justify-start text-lg h-12 mb-2"
                    onClick={() => toggleSectionCollapse(item.title)}>
                    {item.isCollapsed ? (
                      <ChevronRight className="mr-2 h-5 w-5" />
                    ) : (
                      <ChevronDown className="mr-2 h-5 w-5" />
                    )}
                    <h2 className="font-semibold tracking-tight">
                      {item.title}
                    </h2>
                  </Button>
                );
              }

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}>
                  <OrganizationCard
                    org={item.data}
                    chartData={item.data.chartData}
                    onBarClick={handleBarClick}
                    isBookmarked={bookmarkedOrgs.has(item.data.name)}
                    onToggleBookmark={() => toggleBookmark(item.data.name)}
                    onViewProjects={() => handleViewProjects(item.data)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {filteredOrgsWithChartData.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">
            No organizations found matching your filters.
          </p>
          <Button onClick={clearAllFilters}>Clear All Filters</Button>
        </div>
      )}

      <Dialog
        open={isBookmarksDialogOpen}
        onOpenChange={setIsBookmarksDialogOpen}>
        <DialogContent className="md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bookmarked Organizations</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto space-y-4 p-1 pr-4">
            {organizations
              .filter(org => bookmarkedOrgs.has(org.name))
              .map((org, index) => (
                <OrganizationCard
                  key={org.name}
                  org={{...org, displayIndex: index + 1}}
                  chartData={getChartData(org.years, allYearsForChart)}
                  onBarClick={handleBarClick}
                  isBookmarked
                  showChart={false}
                  onToggleBookmark={() => toggleBookmark(org.name)}
                  onViewProjects={() => handleViewProjects(org)}
                />
              ))}
            {bookmarkedOrgs.size === 0 && (
              <p className="text-muted-foreground text-center min-h-[50vh] flex items-center justify-center">
                No bookmarks yet.
              </p>
            )}
          </div>
          {bookmarkedOrgs.size > 0 && (
            <DialogFooter>
              <Button onClick={exportBookmarksToCsv}>Export to CSV</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      <ProjectsDialog
        isOpen={isProjectsDialogOpen}
        onClose={() => setIsProjectsDialogOpen(false)}
        organization={selectedOrg}
      />
    </>
  );
};
