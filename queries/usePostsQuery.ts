import api from "@/lib/api";
import type { PostProps } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const usePostsQuery = (search: string, page: number) => {
  const [store, setStore] = useState<PostProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["post", { search, page }],
    queryFn: () =>
      api
        .get(
          `${process.env.EXPO_PUBLIC_DB_SERVER}/post?s=${search}&limit=20&page=${page}`
        )
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

export const usePostQuery = (id: string) => {
  const { data, isLoading } = useQuery<PostProps>({
    queryKey: ["post", id],
    queryFn: () =>
      api
        .get(`${process.env.EXPO_PUBLIC_DB_SERVER}/post/${id}`)
        .then((res) => res.data),
  });
  return { data: data || null, isLoading };
};
