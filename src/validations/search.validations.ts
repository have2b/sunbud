import * as v from "valibot";

export const searchSchema = v.object({
  query: v.pipe(v.string(), v.minLength(1, "Vui lòng nhập từ khoá tìm kiếm")),
});

export type SearchSchema = v.InferOutput<typeof searchSchema>;
