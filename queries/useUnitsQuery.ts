import { useQuery } from "@tanstack/react-query";
import type { UnitProps } from "@/types/unit";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export const useUnitsQuery = (search: string, page: number) => {
  const [store, setStore] = useState<UnitProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["unit", { search, page }],
    queryFn: () =>
      api
        .get(`/unit?s=${search}&limit=20&page=${page}`)
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
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
