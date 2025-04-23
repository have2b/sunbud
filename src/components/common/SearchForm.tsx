"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { searchSchema, SearchSchema } from "@/validations/search.validations";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const SearchForm = () => {
  const router = useRouter();
  const form = useForm<SearchSchema>({
    resolver: valibotResolver(searchSchema),
    defaultValues: { query: "" },
  });

  async function onSubmit(values: SearchSchema) {
    const query = values.query?.trim();
    if (query) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-56 items-center gap-2"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Tìm kiếm..."
                      {...field}
                      className="rounded-full bg-white pr-10"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <Search
                        className="text-muted-foreground size-5 cursor-pointer"
                        onClick={() => form.handleSubmit(onSubmit)()}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SearchForm;
