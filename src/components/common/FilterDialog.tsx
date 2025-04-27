"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export type FilterField = {
  key: string;
  label: string;
  type: "string" | "boolean" | "number" | "select";
  // Additional options for number fields
  numberOptions?: {
    minLabel?: string;
    maxLabel?: string;
    step?: number;
    unit?: string; // For display purposes (e.g., "$", "kg")
  };
  // Options for select/dropdown fields
  selectOptions?: {
    options: { label: string; value: string | number }[];
  };
};

export type FilterCondition = {
  field: string;
  value?: string | boolean;
  min?: number;
  max?: number;
  // For API param mapping
  paramNames?: {
    minParam?: string; // Custom parameter name for min value (e.g., "minPrice", "minQuantity")
    maxParam?: string; // Custom parameter name for max value (e.g., "maxPrice", "maxQuantity")
  };
};

interface FilterDialogProps {
  fields: FilterField[];
  onApply: (conditions: FilterCondition[]) => void;
  initialConditions?: FilterCondition[];
}

export function FilterDialog({
  fields,
  onApply,
  initialConditions = [],
}: FilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [conditions, setConditions] =
    useState<FilterCondition[]>(initialConditions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setConditions(initialConditions);
    }
  }, [open, initialConditions]);

  const addCondition = () => {
    setConditions([...conditions, { field: "" }]);
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  const updateCondition = (
    index: number,
    updates: Partial<FilterCondition>,
  ) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setConditions(newConditions);
  };

  const handleApply = () => {
    setIsSubmitting(true);
    try {
      const validConditions = conditions.filter((condition) => {
        if (!condition.field) return false;
        const field = fields.find((f) => f.key === condition.field);
        if (!field) return false;

        if (field.type === "string")
          return !!condition.value?.toString().trim();
        if (field.type === "boolean" || field.type === "select")
          return condition.value !== undefined;
        return condition.min !== undefined || condition.max !== undefined;
      });

      // Map field keys to API parameter names if needed
      const mappedConditions = validConditions.map((condition) => {
        const field = fields.find((f) => f.key === condition.field);

        // For number fields, check if we need to map the parameter names
        if (field?.type === "number") {
          // Default to using field.key with min/max prefix if no custom param names
          const minParam =
            condition.paramNames?.minParam ||
            `min${field.key.charAt(0).toUpperCase()}${field.key.slice(1)}`;
          const maxParam =
            condition.paramNames?.maxParam ||
            `max${field.key.charAt(0).toUpperCase()}${field.key.slice(1)}`;

          return {
            ...condition,
            paramNames: { minParam, maxParam },
          };
        }

        return condition;
      });

      onApply(mappedConditions);
      setOpen(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          Bộ lọc
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Bộ lọc</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {conditions.map((condition, index) => {
            const selectedField = fields.find((f) => f.key === condition.field);

            return (
              <div
                key={index}
                className="relative flex flex-col items-start gap-2 sm:flex-row sm:items-center"
              >
                <div className="w-full sm:w-auto">
                  <Select
                    value={condition.field}
                    onValueChange={(value) => {
                      const field = fields.find((f) => f.key === value)!;
                      updateCondition(index, {
                        field: value,
                        value: field.type === "string" ? "" : undefined,
                        min: undefined,
                        max: undefined,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Chọn trường" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field.key} value={field.key}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedField && (
                  <div className="mt-2 flex w-full gap-2 sm:mt-0 sm:flex-1">
                    {selectedField.type === "string" ? (
                      <Input
                        value={condition.value?.toString() || ""}
                        onChange={(e) =>
                          updateCondition(index, { value: e.target.value })
                        }
                        placeholder="Chứa..."
                        className="w-full"
                      />
                    ) : selectedField.type === "boolean" ? (
                      <div className="w-full">
                        <Select
                          value={condition.value?.toString()}
                          onValueChange={(value) =>
                            updateCondition(index, { value: value === "true" })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Đúng</SelectItem>
                            <SelectItem value="false">Sai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : selectedField.type === "select" ? (
                      <div className="w-full">
                        {selectedField.selectOptions?.options.length &&
                        selectedField.selectOptions.options.length > 10 ? (
                          <SearchableSelect
                            options={selectedField.selectOptions.options}
                            value={condition.value?.toString() || ""}
                            onValueChange={(value) =>
                              updateCondition(index, {
                                value:
                                  typeof value === "string"
                                    ? value
                                    : value.toString(),
                              })
                            }
                            placeholder="Chọn giá trị"
                            searchPlaceholder="Tìm kiếm..."
                            clearable
                          />
                        ) : (
                          <Select
                            value={condition.value?.toString()}
                            onValueChange={(value) =>
                              updateCondition(index, { value })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn giá trị" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedField.selectOptions?.options.map(
                                (option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value.toString()}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="relative w-full sm:flex-1">
                          {selectedField.numberOptions?.unit && (
                            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                              {selectedField.numberOptions.unit}
                            </span>
                          )}
                          <Input
                            type="number"
                            value={condition.min ?? ""}
                            onChange={(e) =>
                              updateCondition(index, {
                                min: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                                // Set parameter name based on field key
                                paramNames: {
                                  ...condition.paramNames,
                                  minParam: `min${selectedField.key.charAt(0).toUpperCase()}${selectedField.key.slice(1)}`,
                                },
                              })
                            }
                            className={`w-full ${selectedField.numberOptions?.unit ? "pl-8" : ""}`}
                            placeholder={
                              selectedField.numberOptions?.minLabel || "Từ"
                            }
                            step={selectedField.numberOptions?.step}
                          />
                        </div>
                        <div className="relative w-full sm:flex-1">
                          {selectedField.numberOptions?.unit && (
                            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                              {selectedField.numberOptions.unit}
                            </span>
                          )}
                          <Input
                            type="number"
                            value={condition.max ?? ""}
                            onChange={(e) =>
                              updateCondition(index, {
                                max: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                                // Set parameter name based on field key
                                paramNames: {
                                  ...condition.paramNames,
                                  maxParam: `max${selectedField.key.charAt(0).toUpperCase()}${selectedField.key.slice(1)}`,
                                },
                              })
                            }
                            className={`w-full ${selectedField.numberOptions?.unit ? "pl-8" : ""}`}
                            placeholder={
                              selectedField.numberOptions?.maxLabel || "Đến"
                            }
                            step={selectedField.numberOptions?.step}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCondition(index)}
                  className="absolute top-0 right-0 sm:static sm:ml-2"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <Button variant="outline" onClick={addCondition} type="button">
              Thêm điều kiện lọc
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
              >
                Hủy
              </Button>
              <Button
                onClick={handleApply}
                disabled={isSubmitting}
                type="button"
              >
                {isSubmitting ? "Đang xử lý..." : "Áp dụng"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
