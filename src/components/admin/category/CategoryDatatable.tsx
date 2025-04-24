"use client";
import UpdateCategoryForm from "@/components/admin/category/UpdateCategoryForm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import PublishCategoryForm from "./PublishCategoryForm";

export default function CategoryDatatable() {
  const { data, isLoading, error } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/category");
      const json = await res.json();
      return json.data;
    },
  });

  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [publishCategory, setPublishCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditCategory(category);
  };

  const handlePublish = (category: Category) => {
    setPublishCategory(category);
  };

  const columns = useMemo<ColumnDef<Category, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Tên danh mục",
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("name")}</span>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => (
          <span className="line-clamp-2 text-gray-600">
            {row.getValue("description") || "-"}
          </span>
        ),
      },
      {
        accessorKey: "isPublish",
        header: "Trạng thái",
        cell: ({ row }) => (
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm",
              row.getValue("isPublish")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800",
            )}
          >
            {row.getValue("isPublish") ? "Hiển thị" : "Ẩn"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ row }) => (
          <div className="text-gray-500">
            {new Date(row.getValue("createdAt")).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Ngày cập nhật",
        cell: ({ row }) => (
          <div className="text-gray-500">
            {new Date(row.getValue("updatedAt")).toLocaleDateString()}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => handleEdit(row.original)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 size-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              {row.getValue("isPublish") ? (
                <DropdownMenuItem
                  onSelect={() => handlePublish(row.original)}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 size-4 text-red-600" />
                  Ẩn
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={() => handlePublish(row.original)}
                  className="cursor-pointer text-green-600 focus:text-green-600"
                >
                  <Check className="mr-2 size-4 text-green-600" />
                  Hiển thị
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div className="p-4 text-gray-500">Đang tải...</div>;
  if (error) return <div className="p-4 text-red-500">{error.message}</div>;

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

        {!data?.length && (
          <div className="p-6 text-center text-gray-500">Không có dữ liệu</div>
        )}
      </div>
    </>
  );
}
