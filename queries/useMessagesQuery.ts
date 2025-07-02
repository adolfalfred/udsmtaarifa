import type { MessageProps } from "@/types/message";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export const useMessagesQuery = (
  search: string,
  page: number,
  chat: string
) => {
  const [store, setStore] = useState<MessageProps[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["message", { search, page, chat }],
    queryFn: () =>
      api
        .get(`/message?s=${search}&limit=20&page=${page}&chat=${chat}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    if (!data) return;
    if (page === 1) {
      const newSet = new Set<string>();
      data.data.forEach((item: MessageProps) => newSet.add(item.id));
      setSeenIds(newSet);
      setStore(
        [...data.data].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
    } else
      setStore((prev) => {
        const newItems: MessageProps[] = [];
        const updatedSet = new Set(seenIds);
        data.data.forEach((item: MessageProps) => {
          if (!updatedSet.has(item.id)) {
            updatedSet.add(item.id);
            newItems.push(item);
          }
        });
        if (newItems.length > 0) {
          setSeenIds(updatedSet);
          return [...prev, ...newItems].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return prev;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    data: store,
    isLoading,
    nextPage: (data?.nextPage as boolean) || false,
  };
};
