import api from "@/lib/api";
import type { CommentProps } from "@/types/comment";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useCommentsQuery = (
  search: string,
  page: number,
  post: string,
  comment: string
) => {
  const [store, setStore] = useState<CommentProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["comment", { search, page, post, comment }],
    queryFn: () =>
      api
        .get(`/post/comment?s=${search}&limit=20&page=${page}&post=${post}`)
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
