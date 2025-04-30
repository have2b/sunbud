"use client";

import { Category } from "@/generated/prisma";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for categories (existing)
  const [categories, setCategories] = useState<Category[]>([]);
  const [tempSelectedCategoryIds, setTempSelectedCategoryIds] = useState<
    number[]
  >([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  // State for search term
  const [searchTerm, setSearchTerm] = useState("");

  // State for price range
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // State for quantity
  const [isQuantityOpen, setIsQuantityOpen] = useState(true);
  const [minQuantity, setMinQuantity] = useState("");

  // State for sorting
  const [isSortOpen, setIsSortOpen] = useState(true);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/user/category");
        const data = await response.json();
        if (data.status === 200) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Load all filters from URL params
    const categoriesParam = searchParams.get("categories");
    const searchParam = searchParams.get("search");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minQuantityParam = searchParams.get("minQuantity");
    const sortParam = searchParams.get("sort");

    // Set categories (existing)
    if (categoriesParam) {
      const ids = categoriesParam
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
      setTempSelectedCategoryIds(ids);
    } else {
      setTempSelectedCategoryIds([]);
    }

    // Set search term
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    // Set price range
    if (minPriceParam) {
      setMinPrice(minPriceParam);
    }
    if (maxPriceParam) {
      setMaxPrice(maxPriceParam);
    }

    // Set quantity
    if (minQuantityParam) {
      setMinQuantity(minQuantityParam);
    }

    // Set sort option
    if (sortParam) {
      setSortOption(sortParam);
    }
  }, [searchParams]);

  const handleCategoryChange = (categoryId: number) => {
    setTempSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const toggleCategorySection = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const togglePriceSection = () => {
    setIsPriceOpen(!isPriceOpen);
  };

  const toggleQuantitySection = () => {
    setIsQuantityOpen(!isQuantityOpen);
  };

  const toggleSortSection = () => {
    setIsSortOpen(!isSortOpen);
  };

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Apply categories filter
    if (tempSelectedCategoryIds.length > 0) {
      newSearchParams.set("categories", tempSelectedCategoryIds.join(","));
    } else {
      newSearchParams.delete("categories");
    }

    // Apply search term filter
    if (searchTerm && searchTerm.trim() !== "") {
      newSearchParams.set("search", searchTerm.trim());
    } else {
      newSearchParams.delete("search");
    }

    // Apply price range filter
    if (minPrice && !isNaN(Number(minPrice))) {
      newSearchParams.set("minPrice", minPrice);
    } else {
      newSearchParams.delete("minPrice");
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      newSearchParams.set("maxPrice", maxPrice);
    } else {
      newSearchParams.delete("maxPrice");
    }

    // Apply quantity filter
    if (minQuantity && !isNaN(Number(minQuantity))) {
      newSearchParams.set("minQuantity", minQuantity);
    } else {
      newSearchParams.delete("minQuantity");
    }

    // Apply sorting option
    if (sortOption) {
      newSearchParams.set("sort", sortOption);
    } else {
      newSearchParams.delete("sort");
    }

    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    // Reset all state variables
    setTempSelectedCategoryIds([]);
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setMinQuantity("");
    setSortOption("");

    // Clear all search parameters and navigate
    router.replace("/shop", { scroll: false });
  };

  return (
    <div className="h-full w-1/4 overflow-y-auto border-2 border-e-indigo-600 p-4">
      {/* Search Term Section */}
      <div className="mb-4">
        <h2 className="mb-2 text-lg font-semibold">Tìm kiếm</h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full rounded-md border border-gray-300 p-2 pl-8 focus:border-emerald-500 focus:outline-none"
          />
          <Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-4">
        <div
          className="mb-2 flex cursor-pointer items-center justify-between"
          onClick={toggleCategorySection}
        >
          <h2 className="text-lg font-semibold">Danh mục</h2>
          {isCategoryOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {isCategoryOpen && (
          <div className="mb-4 space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={tempSelectedCategoryIds.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="mb-4">
        <div
          className="mb-2 flex cursor-pointer items-center justify-between"
          onClick={togglePriceSection}
        >
          <h2 className="text-lg font-semibold">Khoảng giá</h2>
          {isPriceOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {isPriceOpen && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Giá tối thiểu"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Giá tối đa"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Quantity Section */}
      <div className="mb-4">
        <div
          className="mb-2 flex cursor-pointer items-center justify-between"
          onClick={toggleQuantitySection}
        >
          <h2 className="text-lg font-semibold">Số lượng</h2>
          {isQuantityOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {isQuantityOpen && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                placeholder="Số lượng tối thiểu"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sorting Section */}
      <div className="mb-4">
        <div
          className="mb-2 flex cursor-pointer items-center justify-between"
          onClick={toggleSortSection}
        >
          <h2 className="text-lg font-semibold">Sắp xếp</h2>
          {isSortOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {isSortOpen && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center space-x-2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Mặc định</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={applyFilters}
          className="w-full rounded-md bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
        >
          Áp dụng bộ lọc
        </button>
        <button
          onClick={clearFilters}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};
