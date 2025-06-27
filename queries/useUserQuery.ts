import { useQuery } from "@tanstack/react-query";
import type { UserProps } from "@/types/user";
import api from "@/lib/api";

export const useUserQuery = (id: string) => {
  const { data, isLoading } = useQuery<UserProps>({
    queryKey: ["user", id],
    queryFn: () => api.get(`/user/${id}`).then((res) => res.data),
  });
  return { data: data || null, isLoading };
};
