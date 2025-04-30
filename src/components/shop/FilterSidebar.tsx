"use client";

import { Category } from "@/generated/prisma";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tempSelectedCategoryIds, setTempSelectedCategoryIds] = useState<
    number[]
  >([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

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
    const categoriesParam = searchParams.get("categories");
    if (categoriesParam) {
      const ids = categoriesParam
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
      setTempSelectedCategoryIds(ids);
    } else {
      setTempSelectedCategoryIds([]);
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

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (tempSelectedCategoryIds.length > 0) {
      newSearchParams.set("categories", tempSelectedCategoryIds.join(","));
    } else {
      newSearchParams.delete("categories");
    }
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <div className="h-full w-1/4 border-2 border-e-indigo-600 p-4">
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

      <button
        onClick={applyFilters}
        className="w-full rounded-md bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  );
};
