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
import { useState } from "react";
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <FilterDialog
            fields={categoryFilterFields}
            onApply={handleApplyFilters}
            initialConditions={filterConditions}
          />

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

          <Button variant="outline" onClick={handleResetFilters}>
            Xóa bộ lọc
          </Button>
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
          <div className="text-muted-foreground text-sm">
            Tổng {data?.total} bản ghi
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
            <span className="text-sm font-medium">
              Trang {pagination.pageIndex + 1} /{" "}
              {Math.ceil((data?.total || 0) / pagination.pageSize)}
            </span>
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
