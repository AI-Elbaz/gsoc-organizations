import {useCallback, useMemo, useRef, useState} from "react";

import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {ChevronDown, ChevronRight} from "lucide-react";

import {Button} from "@/components/ui/button";
import {useFilters} from "@/hooks/use-filters";
import {OrganizationCard} from "./organization-card";

import type {VirtualItem} from "@tanstack/react-virtual";

import type {ChartData, Organization, VirtualListItem} from "@/types";

export const OrganizationsList = ({
  filteredOrgsWithChartData,
}: {
  filteredOrgsWithChartData: (Organization & {
    chartData: ChartData[];
  })[];
}) => {
  const {filters} = useFilters();

  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );

  const listParentRef = useRef<HTMLDivElement>(null);

  const virtualListItems = useMemo((): VirtualListItem[] => {
    // Early return for single section case
    if (filters.sections <= 1) {
      return filteredOrgsWithChartData.map((org, index) => ({
        type: "organization",
        data: org,
        displayIndex: index + 1,
      }));
    }

    if (filteredOrgsWithChartData.length === 0) {
      return [];
    }

    const flatList: VirtualListItem[] = [];
    const sectionsMap = new Map<number, typeof filteredOrgsWithChartData>();

    for (const [index, org] of filteredOrgsWithChartData.entries()) {
      const sectionIndex = index % filters.sections;
      const sectionOrgs = sectionsMap.get(sectionIndex) ?? [];
      sectionOrgs.push(org);
      sectionsMap.set(sectionIndex, sectionOrgs);
    }

    // Build flat list from sections
    for (const [i, orgsInSection] of sectionsMap) {
      if (orgsInSection && orgsInSection.length > 0) {
        const title = `Section ${i + 1}`;
        const isCollapsed = collapsedSections.has(title);

        flatList.push({type: "header", title, isCollapsed});

        if (!isCollapsed) {
          orgsInSection.forEach((org, localIndex) => {
            flatList.push({
              type: "organization",
              data: org,
              displayIndex: localIndex + 1,
            });
          });
        }
      }
    }

    return flatList;
  }, [filteredOrgsWithChartData, filters.sections, collapsedSections]);

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

  const rowVirtualizer = useWindowVirtualizer({
    count: virtualListItems.length,
    estimateSize: index => {
      const item = virtualListItems[index];
      return item.type === "header" ? 56 : 235;
    },
    overscan: 10,
  });

  const virtualizedItems = rowVirtualizer.getVirtualItems();

  return (
    <div ref={listParentRef}>
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
                  <h2 className="font-semibold tracking-tight">{item.title}</h2>
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
                  displayIndex={item.displayIndex}
                  chartData={item.data.chartData}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
