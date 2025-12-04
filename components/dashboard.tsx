"use client";

import {useMemo} from "react";

import {Button} from "@/components/ui/button";
import {useFilters} from "@/hooks/use-filters";
import {getChartData} from "@/lib/utils";
import {BookmarksDialog} from "./bookmarks-dialog";
import {ExportButton} from "./export-data-button";
import {ActiveFiltersSummary, FilterBar} from "./filters-bar";
import {OrganizationsList} from "./organizations-list";
import {Search} from "./search";

import type {Organization} from "@/types";

interface GSoCDashboardProps {
  organizations: Organization[];
  allYears: string[];
  allTechnologies: string[];
}

export const GSoCDashboard = ({
  organizations,
  allYears,
  allTechnologies,
}: GSoCDashboardProps) => {
  const {filters, clearFilters} = useFilters();

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
        if (!!filters.query) {
          return org.name.toLowerCase().includes(filters.query.toLowerCase());
        }
        return true;
      })
      .map(org => ({
        ...org,
        chartData: getChartData(org.years, allYears.toReversed()),
      }));
  }, [organizations, filters.years, filters.tech, filters.query, allYears]);

  return (
    <main className="flex flex-col gap-5">
      <FilterBar allYears={allYears} allTechnologies={allTechnologies} />
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Search />
        <div className="flex items-center gap-2">
          <ExportButton />
          <BookmarksDialog organizations={organizations} />
        </div>
      </div>
      <ActiveFiltersSummary />
      <p className="text-sm text-muted-foreground">
        Showing {filteredOrgsWithChartData.length} organization
        {filteredOrgsWithChartData.length !== 1 ? "s" : ""}
      </p>
      {filteredOrgsWithChartData.length !== 0 ? (
        <OrganizationsList
          filteredOrgsWithChartData={filteredOrgsWithChartData}
        />
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">
            No organizations found matching your filters.
          </p>
          <Button onClick={clearFilters}>Clear All Filters</Button>
        </div>
      )}
    </main>
  );
};
