import { useSessionStore } from "@/lib/zustand/useSessionStore";
import type { PostProps, PostTypesProps } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export const usePostsQuery = (
  search: string,
  page: number,
  type: PostTypesProps
) => {
  const { user } = useSessionStore();
  const [store, setStore] = useState<PostProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["post", { search, page, type }],
    queryFn: () =>
      api
        .get(
          `/post?s=${search}&limit=20&page=${page}&type=${type}&userId=${user?.id}&available=true`
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

export const usePostQuery = (id: string) => {
  const { data, isLoading } = useQuery<PostProps>({
    queryKey: ["post", id],
    queryFn: () => api.get(`/post/${id}`).then((res) => res.data),
  });
  return { data: data || null, isLoading };
};
