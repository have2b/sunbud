import { Search } from "lucide-react";
import { Category } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { FilterState } from "@/components/shop/types";

interface FilterSidebarProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleCategory: (categoryId: number) => void;
  handlePriceChange: (value: number[]) => void;
  categories?: Category[];
  categoriesLoading: boolean;
  resetFilters: () => void;
  MAX_PRICE: number;
  handleSearch: () => void;
}

export const FilterSidebar = ({
  filters,
  updateFilter,
  toggleCategory,
  handlePriceChange,
  categories,
  categoriesLoading,
  resetFilters,
  MAX_PRICE,
  handleSearch,
}: FilterSidebarProps) => (
  <div className="hidden w-64 pr-6 md:block">
    <div className="sticky top-24">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="font-medium">
            Search
          </Label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              id="search"
              placeholder="Search products..."
              className="pl-8"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label className="font-medium">Categories</Label>
          {categoriesLoading ? (
            <p className="text-muted-foreground text-sm">
              Loading categories...
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              {categories?.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 cursor-pointer text-sm font-medium"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Price Range</Label>
            <span className="text-muted-foreground text-sm">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
          </div>
          <Slider
            min={0}
            max={MAX_PRICE}
            step={10}
            value={[filters.priceRange[0], filters.priceRange[1]]}
            onValueChange={handlePriceChange}
            className="mt-6"
          />
        </div>

        <Separator />

        {/* Minimum Quantity */}
        <div className="space-y-2">
          <Label htmlFor="min-quantity" className="font-medium">
            Minimum Available Quantity
          </Label>
          <Input
            id="min-quantity"
            type="number"
            min={0}
            value={filters.minQuantity}
            onChange={(e) =>
              updateFilter("minQuantity", parseInt(e.target.value) || 0)
            }
          />
        </div>
      </div>
    </div>
  </div>
);
