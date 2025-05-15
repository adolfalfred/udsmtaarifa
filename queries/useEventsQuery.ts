import api from "@/lib/api";
import type { EventProps } from "@/types/event";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useEventsQuery = (
  search: string,
  page: number,
  category: number | ""
) => {
  const [store, setStore] = useState<EventProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["event", { search, page, category }],
    queryFn: () =>
      api
        .get(
          `/event?s=${search}&limit=20&page=${page}&category=${category}&available=true`
        )
        .then((res) => res.data),
  });

  useEffect(() => {
    if (page === 1) {
      setStore(data?.data ?? []);
    } else if (data) {
      setStore((prev) => {
        const map = new Map();
        [...prev, ...data.data].forEach((item) => {
          map.set(item.id, item);
        });
        return Array.from(map.values());
      });
    }
  }, [data, page]);

  return { data: store, isLoading, nextPage: data?.nextPage || false };
};

export const useEventQuery = (id: string) => {
  const { data, isLoading } = useQuery<EventProps>({
    queryKey: ["event", id],
    queryFn: () => api.get(`/event/${id}`).then((res) => res.data),
  });
  return { data: data || null, isLoading };
};
