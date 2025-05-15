import api from "@/lib/api";
import type { FeedbackTypesProps } from "@/types/feedbackTypes";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useFeedbacktypesQuery = (search: string, page: number) => {
  const [store, setStore] = useState<FeedbackTypesProps[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["feedbacktype", { search, page }],
    queryFn: () =>
      api
        .get(`/feedbacktype?s=${search}&limit=20&page=${page}`)
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

  return { data: store, isLoading, nextPage: data?.nextPage || false };
};
