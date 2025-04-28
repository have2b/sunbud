import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FilterState, SortOption } from "./types";

interface ProductSortProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resultsCount: number;
}

export const ProductSort = ({ 
  filters, 
  updateFilter, 
  resultsCount 
}: ProductSortProps) => {
  return (
    <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
      <div className="text-muted-foreground text-sm">
        Showing <span className="font-medium">{resultsCount}</span> results
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="sort-select" className="text-sm">
          Sort by:
        </Label>
        <Select
          value={filters.sort}
          onValueChange={(value) =>
            updateFilter("sort", value as SortOption)
          }
        >
          <SelectTrigger id="sort-select" className="h-9 w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <div className="flex items-center">Newest First</div>
            </SelectItem>
            <SelectItem value="price-asc">
              <div className="flex items-center">
                Price: Low to High
              </div>
            </SelectItem>
            <SelectItem value="price-desc">
              <div className="flex items-center">
                Price: High to Low
              </div>
            </SelectItem>
            <SelectItem value="popularity">
              <div className="flex items-center">Popularity</div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
