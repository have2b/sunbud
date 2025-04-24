"use client";
import UpdateCategoryForm from "@/components/admin/category/UpdateCategoryForm";
import {
  DataTableEmpty,
  DataTableError,
  DataTableLoading,
} from "@/components/common/DatatableStates";
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
import { createCategoryColumns } from "./columns";

export default function CategoryDatatable() {
  const { data, isLoading, error, refetch } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/category");
      const json = await res.json();
      return json.data;
    },
  });

  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [publishCategory, setPublishCategory] = useState<Category | null>(null);

  const columns = createCategoryColumns(
    (category) => setEditCategory(category),
    (category) => setPublishCategory(category),
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!data?.length && <DataTableEmpty />}
      </div>
    </>
  );
}
