"use client";

import {Check, ChevronDown, PlusCircle, X} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useFilters} from "@/hooks/use-filters";
import {cn, toggleItem} from "@/lib/utils";

interface FilterBarProps {
  allYears: string[];
  allTechnologies: string[];
}

export const FilterBar = ({allYears, allTechnologies}: FilterBarProps) => {
  const {
    filters,
    hasActiveFilters,
    setFilters,
    clearFilters: clearAll,
  } = useFilters();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 border rounded-lg bg-card">
      <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
        {/* Year Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-auto justify-between">
              <span>
                {filters.years.length > 0
                  ? `${filters.years.length} Year(s)`
                  : "Filter by Year"}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-60 overflow-y-auto">
            <DropdownMenuLabel>GSoC Years</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allYears.map(year => (
              <DropdownMenuCheckboxItem
                key={year}
                checked={filters.years.includes(year)}
                onSelect={e => e.preventDefault()}
                onCheckedChange={() =>
                  setFilters(prev => ({years: toggleItem(prev.years, year)}))
                }>
                {year}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Technology Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-auto justify-between">
              <span>
                {filters.tech.length > 0
                  ? `${filters.tech.length} Tech(s)`
                  : "Filter by Technology"}
              </span>
              <PlusCircle className="h-4 w-4 opacity-50 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search technologies..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {allTechnologies.map(tech => (
                    <CommandItem
                      key={tech}
                      onSelect={() =>
                        setFilters(prev => ({
                          tech: toggleItem(prev.tech, tech),
                        }))
                      }>
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          filters.tech.includes(tech)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span>{tech}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Sections Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Split into
          </span>
          <Select
            value={filters.sections.toString()}
            onValueChange={value =>
              setFilters({sections: parseInt(value, 10)})
            }>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, ...Array.from({length: 9}, (_, i) => i + 2)].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num === 1 ? "No Split" : `${num} Sections`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearAll}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export const ActiveFiltersSummary = () => {
  const {filters, setFilters} = useFilters();

  if (filters.years.length === 0 && filters.tech.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium">Active Filters:</span>
      {filters.years.map(year => (
        <Badge key={year} variant="outline" className="p-1 pl-2">
          Year: {year}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-5 w-5 rounded-full"
            onClick={() =>
              setFilters(prev => ({years: toggleItem(prev.years, year)}))
            }>
            <X size={14} />
          </Button>
        </Badge>
      ))}
      {filters.tech.map(tech => (
        <Badge key={tech} variant="outline" className="p-1 pl-2">
          {tech}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-5 w-5 rounded-full"
            onClick={() => {
              setFilters(prev => ({tech: toggleItem(prev.tech, tech)}));
            }}>
            <X size={14} />
          </Button>
        </Badge>
      ))}
    </div>
  );
};
