"use client";
import UpdateCategoryForm from "@/components/admin/category/UpdateCategoryForm";
import {
  DataTableEmpty,
  DataTableError,
  DataTableLoading,
} from "@/components/common/DatatableStates";
import {
  FilterCondition,
  FilterDialog,
} from "@/components/common/FilterDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import PublishCategoryForm from "./PublishCategoryForm";
import { createCategoryColumns } from "./category.columns";
import { categoryFilterFields } from "./category.filter";

export default function CategoryDatatable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>(
    [],
  );

  const { data, isLoading, error, refetch } = useQuery<{
    data: Category[];
    total: number;
  }>({
    queryKey: [
      "categories",
      pagination.pageIndex,
      pagination.pageSize,
      filterConditions,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        limit: pagination.pageSize.toString(),
      });

      // Convert filter conditions to API params
      filterConditions.forEach((condition) => {
        if (condition.field === "name" && condition.value) {
          params.set("name", condition.value.toString());
        }
        if (condition.field === "isPublish" && condition.value !== undefined) {
          params.set("isPublish", condition.value.toString());
        }
        if (condition.field === "description" && condition.value) {
          params.set("description", condition.value.toString());
        }
      });

      const res = await fetch(`/api/admin/category?${params}`);
      const json = await res.json();
      return json.data;
    },
  });

  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [publishCategory, setPublishCategory] = useState<Category | null>(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const nameCondition = filterConditions.find((c) => c.field === "name");
    setSearchInput(nameCondition ? String(nameCondition.value) : "");
  }, [filterConditions]);

  const handleApplyFilters = (conditions: FilterCondition[]) => {
    setFilterConditions(conditions);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleResetFilters = () => {
    setFilterConditions([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = createCategoryColumns(
    (category) => setEditCategory(category),
    (category) => setPublishCategory(category),
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.total || 0) / pagination.pageSize),
  });

  if (isLoading) return <DataTableLoading />;
  if (error) return <DataTableError error={error} retry={() => refetch()} />;

  return (
    <>
      {editCategory && (
        <UpdateCategoryForm
          category={editCategory}
          onClose={() => setEditCategory(null)}
        />
      )}
      {publishCategory && (
        <PublishCategoryForm
          category={publishCategory}
          onClose={() => setPublishCategory(null)}
        />
      )}

      <div className="space-y-4 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <FilterDialog
            fields={categoryFilterFields}
            onApply={handleApplyFilters}
            initialConditions={filterConditions}
          />

          <Button variant="outline" onClick={handleResetFilters}>
            Xóa bộ lọc
          </Button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newConditions = filterConditions.filter(
                (c) => c.field !== "name",
              );
              if (searchInput.trim()) {
                newConditions.push({
                  field: "name",
                  value: searchInput.trim(),
                });
              }
              setFilterConditions(newConditions);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="flex flex-1 gap-2"
          >
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên..."
                className="pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-muted-foreground absolute top-2.5 left-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </div>

        <div className="overflow-x-auto rounded-lg bg-white">
          <Table className="min-w-[800px] sm:min-w-0">
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-gray-900"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!data?.data?.length && <DataTableEmpty />}
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">
              Tổng {data?.total} mục
            </p>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => {
                setPagination({
                  pageIndex: 0,
                  pageSize: Number(value),
                });
              }}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Số mục/trang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 mục</SelectItem>
                <SelectItem value="20">20 mục</SelectItem>
                <SelectItem value="50">50 mục</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex - 1,
                }))
              }
              disabled={pagination.pageIndex === 0}
            >
              Trước
            </Button>

            <div className="flex items-center gap-1">
              {(() => {
                const total = data?.total || 0;
                const totalPages = Math.ceil(total / pagination.pageSize);
                let pageNumbers: (number | string)[] = [];

                if (totalPages <= 3) {
                  pageNumbers = Array.from(
                    { length: totalPages },
                    (_, i) => i + 1,
                  );
                } else {
                  pageNumbers = [1, 2, 3, "...", totalPages];
                }

                return pageNumbers.map((pageNumber, index) => {
                  if (pageNumber === "...") {
                    return (
                      <span key={index} className="px-2 text-sm">
                        ...
                      </span>
                    );
                  }
                  const isCurrent = pagination.pageIndex + 1 === pageNumber;
                  return (
                    <Button
                      key={index}
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: (pageNumber as number) - 1,
                        }));
                      }}
                    >
                      {pageNumber}
                    </Button>
                  );
                });
              })()}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              disabled={
                pagination.pageIndex + 1 >=
                Math.ceil((data?.total || 0) / pagination.pageSize)
              }
            >
              Sau
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
