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

  const { data, isLoading } = useQuery({
    queryKey: ["message", { search, page, chat }],
    queryFn: () =>
      api
        .get(`/message?s=${search}&limit=20&page=${page}&chat=${chat}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    if (page === 1) setStore(data?.data ?? []);
    else if (data)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    data: store,
    isLoading,
    nextPage: (data?.nextPage as boolean) || false,
  };
};
