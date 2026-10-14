import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search…", label }) {
  return (
    <label className="search">
      <Search size={18} strokeWidth={1.75} aria-hidden="true" />
      <input
        type="search"
        className="search__input"
        value={value}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
