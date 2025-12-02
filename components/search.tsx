import {Input} from "@/components/ui/input";

interface SearchProps {
  value: string | null;
  onChange: (value: string) => void;
}

export const Search = ({value, onChange}: SearchProps) => {
  return (
    <Input
      type="text"
      placeholder="Search..."
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      className="max-w-md"
    />
  );
};
