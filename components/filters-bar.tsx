"use client";

import {Bookmark, Check, ChevronDown, PlusCircle, X} from "lucide-react";

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
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
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

interface FilterBarProps {
  allYears: string[];
  selectedYears: string[];
  onToggleYear: (year: string) => void;
  allTechnologies: string[];
  selectedTechnologies: string[];
  onToggleTechnology: (tech: string) => void;
  selectedSections: number;
  onSetSections: (sections: number) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  onShowBookmarks: () => void;
  numBookmarks: number;
}

interface ActiveFiltersSummaryProps {
  selectedYears: string[];
  selectedTechnologies: string[];
  onToggleYear: (year: string) => void;
  onToggleTechnology: (tech: string) => void;
}

export const FilterBar = ({
  allYears,
  selectedYears,
  onToggleYear,
  allTechnologies,
  selectedTechnologies,
  onToggleTechnology,
  selectedSections,
  onSetSections,
  onClearAll,
  hasActiveFilters,
  onShowBookmarks,
  numBookmarks,
}: FilterBarProps) => {
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
                {selectedYears.length > 0
                  ? `${selectedYears.length} Year(s)`
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
                checked={selectedYears.includes(year)}
                onCheckedChange={() => onToggleYear(year)}
                onSelect={e => e.preventDefault()}>
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
                {selectedTechnologies.length > 0
                  ? `${selectedTechnologies.length} Tech(s)`
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
                      onSelect={() => onToggleTechnology(tech)}>
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selectedTechnologies.includes(tech)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
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
            value={selectedSections.toString()}
            onValueChange={value => onSetSections(parseInt(value, 10))}>
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
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={onShowBookmarks}>
              <Bookmark className="mr-2 h-4 w-4" />
              View Bookmarks ({numBookmarks})
            </Button>
          </DialogTrigger>
        </Dialog>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearAll}>
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export const ActiveFiltersSummary = ({
  selectedYears,
  selectedTechnologies,
  onToggleYear,
  onToggleTechnology,
}: ActiveFiltersSummaryProps) => {
  if (selectedYears.length === 0 && selectedTechnologies.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-medium">Active Filters:</span>
      {selectedYears.map(year => (
        <Badge key={year} variant="outline" className="p-1 pl-2">
          Year: {year}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-5 w-5 rounded-full"
            onClick={() => onToggleYear(year)}>
            <X size={14} />
          </Button>
        </Badge>
      ))}
      {selectedTechnologies.map(tech => (
        <Badge key={tech} variant="outline" className="p-1 pl-2">
          {tech}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-5 w-5 rounded-full"
            onClick={() => onToggleTechnology(tech)}>
            <X size={14} />
          </Button>
        </Badge>
      ))}
    </div>
  );
};
