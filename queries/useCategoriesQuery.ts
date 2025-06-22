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
        const map = new Map();
        [...prev, ...data.data].forEach((item) => {
          map.set(item.id, item);
        });
        return Array.from(map.values()).sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    }
  }, [data]);

  return {
    data: store,
    isLoading,
    nextPage: (data?.nextPage as boolean) || false,
  };
};
