import api from "@/lib/api";
import type { UnitProps } from "@/types/unit";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
        const set = new Set([...prev, ...data?.data]);
        return Array.from(set);
      });
    }
  }, [data]);

  return { data: store, isLoading, nextPage: data?.nextPage || false };
};
