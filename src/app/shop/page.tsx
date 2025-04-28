"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";

// Import modular components
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { MobileFilters } from "@/components/shop/MobileFilters";
import { ProductWithCategory } from "@/components/shop/ProductCard";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductSort } from "@/components/shop/ProductSort";
import { FilterState } from "@/components/shop/types";

const ShopPage = () => {
  // Maximum price to set the upper bound of price filter
  const MAX_PRICE = 100000;

  // States
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    priceRange: [0, MAX_PRICE],
    minQuantity: 0,
    sort: "newest",
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Build query params for API request
  const buildQueryParams = () => {
    const params = new URLSearchParams();

    if (filters.search) {
      params.append("search", filters.search);
    }

    if (filters.categories.length > 0) {
      params.append("categories", filters.categories.join(","));
    }

    params.append("minPrice", filters.priceRange[0].toString());
    params.append("maxPrice", filters.priceRange[1].toString());
    params.append("minQuantity", filters.minQuantity.toString());
    params.append("sort", filters.sort);

    return params.toString();
  };

  // Fetch filtered products
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["filtered-products", filters],
    queryFn: async () => {
      setIsSearching(true);
      try {
        const queryParams = buildQueryParams();
        const response = await axios.get(`/api/user/product?${queryParams}`);
        return response.data.data.products as ProductWithCategory[];
      } finally {
        setIsSearching(false);
      }
    },
    enabled: false, // Don't run automatically on filters change
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/user/category");
      return response.data.data as Category[];
    },
  });

  // Handle search button click
  const handleSearch = () => {
    refetchProducts();
  };

  // Handler for updating filters
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handler for category filter toggles
  const toggleCategory = (categoryId: number) => {
    setFilters((prev) => {
      const currentCategories = [...prev.categories];
      const index = currentCategories.indexOf(categoryId);

      if (index > -1) {
        currentCategories.splice(index, 1);
      } else {
        currentCategories.push(categoryId);
      }

      return { ...prev, categories: currentCategories };
    });
  };

  // Handler for price range updates
  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: [value[0], value[1]] }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      categories: [],
      priceRange: [0, MAX_PRICE],
      minQuantity: 0,
      sort: "newest",
    });
  };

  return (
    <div className="container max-w-screen-xl px-4 py-8 md:py-12">
      <div className="mb-6 md:mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Shop</h1>
        <p className="text-muted-foreground mt-2">
          Browse our collection of premium products
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Mobile filter button */}
        <div className="mb-4 flex md:hidden">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <span>Filters</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile filters */}
        <MobileFilters
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          filters={filters}
          updateFilter={updateFilter}
          toggleCategory={toggleCategory}
          handlePriceChange={handlePriceChange}
          categories={categories}
          categoriesLoading={categoriesLoading}
          resetFilters={resetFilters}
          MAX_PRICE={MAX_PRICE}
          handleSearch={handleSearch}
        />

        {/* Desktop filter sidebar */}
        <FilterSidebar
          filters={filters}
          updateFilter={updateFilter}
          toggleCategory={toggleCategory}
          handlePriceChange={handlePriceChange}
          categories={categories}
          categoriesLoading={categoriesLoading}
          resetFilters={resetFilters}
          MAX_PRICE={MAX_PRICE}
          handleSearch={handleSearch}
        />

        {/* Products section */}
        <div className="flex-1">
          {/* Top bar with sort and results count */}
          <ProductSort
            filters={filters}
            updateFilter={updateFilter}
            resultsCount={productsData?.length || 0}
          />

          {/* Products grid */}
          {isSearching || productsLoading ? (
            <div className="py-10 text-center">
              <div className="text-muted-foreground">Loading products...</div>
            </div>
          ) : (
            <ProductGrid
              products={productsData || []}
              isLoading={productsLoading}
            />
          )}

          {/* Initial state prompt */}
          {!productsData && !productsLoading && !isSearching && (
            <div className="py-10 text-center">
              <h3 className="text-lg font-medium">Ready to search</h3>
              <p className="text-muted-foreground mt-1">
                Set your filters and click Search to find products
              </p>
              <Button onClick={handleSearch} className="mt-4">
                Search Now
              </Button>
              <Button variant="outline" className="mt-6" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
