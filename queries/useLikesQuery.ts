import api from "@/lib/api";
import type { LikeProps } from "@/types/like";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useLikesQuery = (search: string, page: number, post: string) => {
  const [store, setStore] = useState<LikeProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["like", { search, page, post }],
    queryFn: () =>
      api
        .get(`/post/like?s=${search}&limit=20&page=${page}&post=${post}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    if (data) {
      setStore((prev) => {
        const map = new Map();
        [...prev, ...data.data].forEach((item) => {
          map.set(item.id, item);
        });
        return Array.from(map.values());
      });
    }
  }, [data]);

  return {
    data: store,
    isLoading,
    nextPage: (data?.nextPage as boolean) || false,
  };
};
