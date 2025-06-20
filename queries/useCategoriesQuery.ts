import api from "@/lib/api";
import type { CategoryProps } from "@/types/category";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useCategoryQuery = (search: string, page: number) => {
  const [store, setStore] = useState<CategoryProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["category", { search, page }],
    queryFn: () =>
      api
        .get(`/category?s=${search}&limit=100&page=${page}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    if (data) {
      setStore((prev) => {
        const set = new Set([...prev, ...data?.data]);
        return Array.from(set);
      });
    }
  }, [data]);

  return {
    data: store,
    isLoading,
    nextPage: (data?.nextPage as boolean) || false,
  };
};
