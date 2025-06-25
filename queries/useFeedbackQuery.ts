import { useSessionStore } from "@/lib/zustand/useSessionStore";
import type { FeedbackProps } from "@/types/feedback";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export const useFeedbacksQuery = (
  search: string,
  page: number,
  status: FeedbackProps["status"] | "",
  type: string
) => {
  const { user } = useSessionStore();
  const [store, setStore] = useState<FeedbackProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["feedback", { search, page, status, type }],
    queryFn: () =>
      api
        .get(
          `/feedback?s=${search}&limit=20&page=${page}&user=${user?.id}&status=${status}&type=${type}`
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

export const useFeedbackQuery = (id: string) => {
  const { data, isLoading } = useQuery<FeedbackProps>({
    queryKey: ["feedback", id],
    queryFn: () => api.get(`/feedback/${id}`).then((res) => res.data),
  });
  return { data: data || null, isLoading };
};
