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
  meta?: Record<string, unknown>;
  onRowClick?: (item: T) => void;
}

export function GenericDataTable<T>({
  queryKey,
  apiPath,
  columns,
  filterFields,
  searchableFields,
  initialPageSize = 10,
  meta,
  onRowClick,
}: GenericDataTableProps<T>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>(
    [],
  );
  const [searchInput, setSearchInput] = useState("");

  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<{
    data: T[];
    total: number;
  }>({
    queryKey: [queryKey, pagination, filterConditions],
    queryFn: async () => {
      try {
        setIsSubmitting(true);
        setApiError(null);

        const params = new URLSearchParams({
          page: (pagination.pageIndex + 1).toString(),
          limit: pagination.pageSize.toString(),
        });

        filterConditions.forEach((condition) => {
          const fieldConfig = filterFields.find(
            (f) => f.key === condition.field,
          );

          if (fieldConfig?.type === "number") {
            // Use custom parameter names if available, otherwise fall back to field_min/field_max format
            const minParamName =
              condition.paramNames?.minParam || `${condition.field}_min`;
            const maxParamName =
              condition.paramNames?.maxParam || `${condition.field}_max`;

            if (condition.min !== undefined)
              params.set(minParamName, condition.min.toString());
            if (condition.max !== undefined)
              params.set(maxParamName, condition.max.toString());
          } else if (fieldConfig?.type === "select") {
            // Handle select fields directly
            if (condition.value !== undefined) {
              params.set(condition.field, condition.value.toString());
            }
          } else {
            if (condition.value !== undefined)
              params.set(condition.field, condition.value.toString());
          }
        });

        const res = await fetch(`${apiPath}?${params}`);

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const errorMessage =
            errorData?.message || `Error ${res.status}: ${res.statusText}`;
          setApiError(errorMessage);
          throw new Error(errorMessage);
        }

        const json = await res.json();

        if (!json.success && json.message) {
          setApiError(json.message);
          throw new Error(json.message);
        }

        return json.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        console.error("API request failed:", errorMessage);
        setApiError(errorMessage);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
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

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.total || 0) / pagination.pageSize),
    meta, // Pass meta data to the table instance
  });

  const handleApplyFilters = (conditions: FilterCondition[]) => {
    setApiError(null);
    setFilterConditions(conditions);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleResetFilters = () => {
    setApiError(null);
    setFilterConditions([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  if (isLoading) return <DataTableLoading />;
  if (error) return <DataTableError error={error} retry={() => refetch()} />;

  return (
    <div className="space-y-4 p-4">
      {apiError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            {apiError}
          </p>
          <button
            onClick={() => {
              setApiError(null);
              refetch();
            }}
            className="mt-2 text-sm font-medium text-red-800 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
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
                disabled={isSubmitting}
              />
              <Search className="text-muted-foreground absolute top-2.5 left-2 size-5" />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
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
              <TableRow
                key={row.id}
                className="hover:bg-gray-50"
                onClick={() => onRowClick?.(row.original)}
              >
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
