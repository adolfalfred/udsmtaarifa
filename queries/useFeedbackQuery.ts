import api from "@/lib/api";
import type { FeedbackProps } from "@/types/feedback";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useFeedbacksQuery = (
  search: string,
  page: number,
  status: FeedbackProps["status"] | ""
) => {
  const [store, setStore] = useState<FeedbackProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["feedback", { search, page, status }],
    queryFn: () =>
      api
        .get(`/feedback?s=${search}&limit=20&page=${page}&status=${status}`)
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
