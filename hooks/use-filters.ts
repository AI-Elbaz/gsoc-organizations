import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

export const useFilters = () => {
  const [filters, setFilters] = useQueryStates({
    years: parseAsArrayOf(parseAsString).withDefault([]),
    tech: parseAsArrayOf(parseAsString).withDefault([]),
    sections: parseAsInteger.withDefault(1),
    query: parseAsString.withDefault(""),
  });

  const hasActiveFilters = Boolean(
    filters.years.length > 0 ||
      filters.tech.length > 0 ||
      filters.query.trim() !== "",
  );

  const clearFilters = () => {
    setFilters({
      years: [],
      tech: [],
      sections: 1,
      query: "",
    });
  };

  return {
    filters,
    hasActiveFilters,
    setFilters,
    clearFilters,
  };
};
