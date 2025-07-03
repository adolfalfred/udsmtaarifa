import { useQuery } from "@tanstack/react-query";
import type { LikeProps } from "@/types/like";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export const useLikesQuery = (search: string, page: number, post: string) => {
  const [store, setStore] = useState<LikeProps[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["like", { search, page, post }],
    queryFn: () =>
      api
        .get(`/post/like?s=${search}&limit=20&page=${page}&post=${post}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    if (!data) return;
    
    if (page === 1) {
      const newSet = new Set<string>();
      data.data.forEach((item: LikeProps) =>
        newSet.add(`${item.postId}_${item.user.id}`)
      );
      setSeenIds(newSet);
      setStore(
        [...data.data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } else {
      setStore((prev) => {
        const newItems: LikeProps[] = [];
        const updatedSet = new Set(seenIds);
        data.data.forEach((item: LikeProps) => {
          const key = `${item.postId}_${item.user.id}`;
          if (!updatedSet.has(key)) {
            updatedSet.add(key);
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
