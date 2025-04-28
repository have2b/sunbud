import { FilterState } from "@/components/shop/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Category } from "@/generated/prisma";
import { Search } from "lucide-react";

interface MobileFiltersProps {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void;
  toggleCategory: (categoryId: number) => void;
  handlePriceChange: (value: number[]) => void;
  categories?: Category[];
  categoriesLoading: boolean;
  resetFilters: () => void;
  MAX_PRICE: number;
  handleSearch: () => void;
}

export const MobileFilters = ({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  filters,
  updateFilter,
  toggleCategory,
  handlePriceChange,
  categories,
  categoriesLoading,
  resetFilters,
  MAX_PRICE,
  handleSearch,
}: MobileFiltersProps) => (
  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
      <SheetHeader className="mb-5">
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription>
          Narrow down products to find exactly what you need
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="mobile-search" className="font-medium">
            Search
          </Label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              id="mobile-search"
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
                    id={`mobile-category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <label
                    htmlFor={`mobile-category-${category.id}`}
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
          <Label htmlFor="mobile-min-quantity" className="font-medium">
            Minimum Available Quantity
          </Label>
          <Input
            id="mobile-min-quantity"
            type="number"
            min={0}
            value={filters.minQuantity}
            onChange={(e) =>
              updateFilter("minQuantity", parseInt(e.target.value) || 0)
            }
          />
        </div>

        <div className="pt-4">
          <Button
            className="w-full"
            onClick={() => {
              handleSearch();
              setMobileFiltersOpen(false);
            }}
          >
            Apply Filters
          </Button>
        </div>

        <div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              resetFilters();
            }}
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
);
