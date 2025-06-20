import api from "@/lib/api";
import type { PostProps, PostTypesProps } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const usePostsQuery = (
  search: string,
  page: number,
  type: PostTypesProps
) => {
  const [store, setStore] = useState<PostProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["post", { search, page, type }],
    queryFn: () =>
      api
        .get(
          `/post?s=${search}&limit=2&page=${page}&type=${type}&available=true`
        )
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

export const usePostQuery = (id: string) => {
  const { data, isLoading } = useQuery<PostProps>({
    queryKey: ["post", id],
    queryFn: () => api.get(`/post/${id}`).then((res) => res.data),
  });
  return { data: data || null, isLoading };
};
