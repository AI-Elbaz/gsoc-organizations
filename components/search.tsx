import {Input} from "@/components/ui/input";
import {useFilters} from "@/hooks/use-filters";

export const Search = () => {
  const {filters, setFilters} = useFilters();

  return (
    <Input
      type="text"
      placeholder="Search..."
      value={filters.query || ""}
      onChange={e => setFilters({query: e.target.value})}
      className="max-w-md"
    />
  );
};
