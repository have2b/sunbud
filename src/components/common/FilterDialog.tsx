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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CrossIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type FilterField = {
  key: string;
  label: string;
  type: "string" | "boolean" | "number";
  // Additional options for number fields
  numberOptions?: {
    minLabel?: string;
    maxLabel?: string;
    step?: number;
    unit?: string; // For display purposes (e.g., "$", "kg")
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
    const validConditions = conditions.filter((condition) => {
      if (!condition.field) return false;
      const field = fields.find((f) => f.key === condition.field);
      if (!field) return false;

      if (field.type === "string") return !!condition.value?.toString().trim();
      if (field.type === "boolean") return condition.value !== undefined;
      return condition.min !== undefined || condition.max !== undefined;
    });

    // Map field keys to API parameter names if needed
    const mappedConditions = validConditions.map(condition => {
      const field = fields.find(f => f.key === condition.field);
      
      // For number fields, check if we need to map the parameter names
      if (field?.type === "number") {
        // Default to using field.key with min/max prefix if no custom param names
        const minParam = condition.paramNames?.minParam || `min${field.key.charAt(0).toUpperCase()}${field.key.slice(1)}`;
        const maxParam = condition.paramNames?.maxParam || `max${field.key.charAt(0).toUpperCase()}${field.key.slice(1)}`;
        
        return {
          ...condition,
          paramNames: { minParam, maxParam }
        };
      }
      
      return condition;
    });

    onApply(mappedConditions);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Bộ lọc</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bộ lọc</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {conditions.map((condition, index) => {
            const selectedField = fields.find((f) => f.key === condition.field);

            return (
              <div key={index} className="flex items-center gap-2">
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
                  <SelectTrigger className="w-40">
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

                {selectedField && (
                  <div className="flex flex-1 gap-2">
                    {selectedField.type === "string" ? (
                      <Input
                        value={condition.value?.toString() || ""}
                        onChange={(e) =>
                          updateCondition(index, { value: e.target.value })
                        }
                        placeholder="Chứa..."
                      />
                    ) : selectedField.type === "boolean" ? (
                      <Select
                        value={condition.value?.toString()}
                        onValueChange={(value) =>
                          updateCondition(index, { value: value === "true" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Đúng</SelectItem>
                          <SelectItem value="false">Sai</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <>
                        <div className="relative flex-1">
                          {selectedField.numberOptions?.unit && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
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
                                }
                              })
                            }
                            className={selectedField.numberOptions?.unit ? "pl-8" : ""}
                            placeholder={selectedField.numberOptions?.minLabel || "Từ"}
                            step={selectedField.numberOptions?.step}
                          />
                        </div>
                        <div className="relative flex-1">
                          {selectedField.numberOptions?.unit && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
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
                                }
                              })
                            }
                            className={selectedField.numberOptions?.unit ? "pl-8" : ""}
                            placeholder={selectedField.numberOptions?.maxLabel || "Đến"}
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
                >
                  <CrossIcon className="size-4" />
                </Button>
              </div>
            );
          })}

          <div className="flex justify-between">
            <Button variant="outline" onClick={addCondition}>
              Thêm điều kiện lọc
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleApply}>Áp dụng</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
