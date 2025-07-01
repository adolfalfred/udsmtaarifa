import { useSessionStore } from "@/lib/zustand/useSessionStore";
import { useQuery } from "@tanstack/react-query";
import type { ChatProps } from "@/types/chat";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export const useChatsQuery = (search: string, page: number, type: string) => {
  const { user } = useSessionStore();
  const [store, setStore] = useState<ChatProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["chat", { search, page, type }],
    queryFn: () =>
      api
        .get(
          `/chat?s=${search}&limit=20&page=${page}&user=${user?.id}&type=${type}`
        )
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

export const useChatQuery = (id: string) => {
  const { data, isLoading } = useQuery<ChatProps>({
    queryKey: ["chat", id],
    queryFn: () => api.get(`/chat/${id}`).then((res) => res.data),
  });
  return { data: data || null, isLoading };
};
