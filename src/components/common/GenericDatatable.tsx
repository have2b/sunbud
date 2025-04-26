// components/common/GenericDataTable.tsx
"use client";
import {
  DataTableEmpty,
  DataTableError,
  DataTableLoading,
} from "@/components/common/DatatableStates";
import {
  FilterCondition,
  FilterDialog,
  FilterField,
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
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface GenericDataTableProps<T> {
  queryKey: string;
  apiPath: string;
  columns: ColumnDef<T>[];
  filterFields: FilterField[];
  searchableFields?: {
    placeholder: string;
    onSearch: (input: string) => FilterCondition[];
  };
  initialPageSize?: number;
}

export function GenericDataTable<T>({
  queryKey,
  apiPath,
  columns,
  filterFields,
  searchableFields,
  initialPageSize = 10,
}: GenericDataTableProps<T>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>(
    [],
  );
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, error, refetch } = useQuery<{
    data: T[];
    total: number;
  }>({
    queryKey: [queryKey, pagination, filterConditions],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        limit: pagination.pageSize.toString(),
      });

      filterConditions.forEach((condition) => {
        const fieldConfig = filterFields.find((f) => f.key === condition.field);

        if (fieldConfig?.type === "number") {
          if (condition.min !== undefined)
            params.set(`${condition.field}_min`, condition.min.toString());
          if (condition.max !== undefined)
            params.set(`${condition.field}_max`, condition.max.toString());
        } else {
          if (condition.value !== undefined)
            params.set(condition.field, condition.value.toString());
        }
      });

      const res = await fetch(`${apiPath}?${params}`);
      const json = await res.json();
      return json.data;
    },
  });

  useEffect(() => {
    if (searchableFields) {
      const searchCondition = filterConditions.find((c) =>
        searchableFields.onSearch("").some((sc) => sc.field === c.field),
      );
      setSearchInput(searchCondition ? String(searchCondition.value) : "");
    }
  }, [filterConditions, searchableFields]);

  const handleApplyFilters = (conditions: FilterCondition[]) => {
    setFilterConditions(conditions);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleResetFilters = () => {
    setFilterConditions([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

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
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <FilterDialog
          fields={filterFields}
          onApply={handleApplyFilters}
          initialConditions={filterConditions}
        />

        <Button variant="outline" onClick={handleResetFilters}>
          Xóa bộ lọc
        </Button>

        {searchableFields && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const searchConditions = searchableFields.onSearch(
                searchInput.trim(),
              );
              const newConditions = filterConditions.filter(
                (c) => !searchConditions.some((sc) => sc.field === c.field),
              );
              setFilterConditions([...newConditions, ...searchConditions]);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="flex flex-1 gap-2"
          >
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={searchableFields.placeholder}
                className="pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Search className="text-muted-foreground absolute top-2.5 left-2 size-5" />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        )}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!data?.data?.length && <DataTableEmpty />}
      </div>

      {/* Pagination controls (same as original) */}
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
  );
}
