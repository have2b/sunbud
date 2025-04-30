import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductList } from "@/components/shop/ProductList";
import { Suspense } from "react";

const ShopPage = () => {
  return (
    <Suspense>
      <div className="flex h-full min-h-0 w-full max-w-screen flex-1 flex-row gap-8 p-12">
        <FilterSidebar />
        <ProductList />
      </div>
    </Suspense>
  );
};

export default ShopPage;
