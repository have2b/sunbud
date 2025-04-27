"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";

// Sample data for demonstration
const CATEGORIES: SearchableSelectOption[] = [
  { label: "Áo phông", value: "ao-phong" },
  { label: "Áo sơ mi", value: "ao-so-mi" },
  { label: "Áo khoác", value: "ao-khoac" },
  { label: "Quần jeans", value: "quan-jeans" },
  { label: "Quần tây", value: "quan-tay" },
  { label: "Quần short", value: "quan-short" },
  { label: "Váy", value: "vay" },
  { label: "Đầm", value: "dam" },
  { label: "Giày", value: "giay" },
  { label: "Dép", value: "dep" },
  { label: "Túi xách", value: "tui-xach" },
  { label: "Phụ kiện", value: "phu-kien" },
  { label: "Đồng hồ", value: "dong-ho" },
  { label: "Mắt kính", value: "mat-kinh" },
  { label: "Mũ", value: "mu" },
  { label: "Thắt lưng", value: "that-lung" },
  // Adding more items to demonstrate the value of search
  { label: "Áo polo", value: "ao-polo" },
  { label: "Áo hoodie", value: "ao-hoodie" },
  { label: "Áo len", value: "ao-len" },
  { label: "Áo thun", value: "ao-thun" },
  { label: "Quần jogger", value: "quan-jogger" },
  { label: "Quần kaki", value: "quan-kaki" },
  { label: "Chân váy", value: "chan-vay" },
  { label: "Đồ ngủ", value: "do-ngu" },
  { label: "Đồ bơi", value: "do-boi" },
  { label: "Đồ thể thao", value: "do-the-thao" },
];

const SIZES: SearchableSelectOption[] = [
  { label: "XS", value: "xs" },
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
  { label: "XXL", value: "xxl" },
  { label: "XXXL", value: "xxxl" },
];

export function SearchableSelectExample() {
  const [category, setCategory] = useState<string | number>("");
  const [size, setSize] = useState<string | number>("");
  
  // Reset form for demo purposes
  const handleReset = () => {
    setCategory("");
    setSize("");
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Searchable Select Component</CardTitle>
          <CardDescription>
            A searchable dropdown component for handling large lists of options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic usage example */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Usage</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Category Selection (Many Options)</p>
                <SearchableSelect
                  options={CATEGORIES}
                  value={category}
                  onValueChange={setCategory}
                  placeholder="Select a category"
                  searchPlaceholder="Search categories..."
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Size Selection (Few Options)</p>
                <SearchableSelect
                  options={SIZES}
                  value={size}
                  onValueChange={setSize}
                  placeholder="Select a size"
                />
              </div>
            </div>
            <div className="text-sm">
              <p>Selected Category: <span className="font-medium">{category ? CATEGORIES.find(c => c.value === category)?.label || category : "None"}</span></p>
              <p>Selected Size: <span className="font-medium">{size ? SIZES.find(s => s.value === size)?.label || size : "None"}</span></p>
            </div>
          </div>

          {/* Advanced usage with clearable option */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">With Clearable Option</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Clearable Category Selection</p>
                <SearchableSelect
                  options={CATEGORIES}
                  value={category}
                  onValueChange={setCategory}
                  placeholder="Select a category"
                  clearable={true}
                />
              </div>
            </div>
          </div>
          
          {/* Size variant */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Size Variants</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Default Size</p>
                <SearchableSelect
                  options={SIZES}
                  value={size}
                  onValueChange={setSize}
                  placeholder="Default size"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Small Size</p>
                <SearchableSelect
                  options={SIZES}
                  value={size}
                  onValueChange={setSize}
                  placeholder="Small size"
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleReset}>Reset Selections</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
