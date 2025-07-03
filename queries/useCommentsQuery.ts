import type { CommentProps } from "@/types/comment";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export const useCommentsQuery = (
  search: string,
  page: number,
  post: string
) => {
  const [store, setStore] = useState<CommentProps[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["comment", { search, page, post }],
    queryFn: () =>
      api
        .get(`/post/comment?s=${search}&limit=20&page=${page}&post=${post}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    if (!data) return;
    if (page === 1) {
      
      const newSet = new Set<string>();
      data.data.forEach((item: CommentProps) => newSet.add(item.id));
      setSeenIds(newSet);
      setStore(
        [...data.data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } else {
      setStore((prev) => {
        const newItems: CommentProps[] = [];
        const updatedSet = new Set(seenIds);
        data.data.forEach((item: CommentProps) => {
          if (!updatedSet.has(item.id)) {
            updatedSet.add(item.id);
            newItems.push(item);
          }
        });
        if (newItems.length > 0) {
          setSeenIds(updatedSet);
          return [...prev, ...newItems].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    data: store,
    isLoading,
    nextPage: (data?.nextPage as boolean) || false,
  };
};
