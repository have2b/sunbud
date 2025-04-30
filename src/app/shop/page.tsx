import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductList } from "@/components/shop/ProductList";

const ShopPage = () => {
  return (
    <div className="flex h-full min-h-0 w-full max-w-screen flex-1 justify-between gap-4 p-12">
      {/* Contains 2 part: FilterSidebar and ProductList separate vertically */}
      <FilterSidebar />
      <ProductList />
    </div>
  );
};

export default ShopPage;
