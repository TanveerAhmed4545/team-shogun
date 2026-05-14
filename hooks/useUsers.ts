import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import toast from "react-hot-toast";

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  skills?: string[];
}

export function useUsers() {
  return useQuery<TeamMember[]>({
    queryKey: queryKeys.users.list(),
    queryFn: async () => {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to fetch users");
      return json.data.users || [];
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string, data: any }) => {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      return { userId, ...data };
    },
    onSuccess: () => {
      toast.success("Updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: () => toast.error("Failed to update"),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.list() });
      const previousMembers = queryClient.getQueryData(queryKeys.users.list());
      queryClient.setQueryData(queryKeys.users.list(), (old: any) => 
        old?.filter((m: any) => m._id !== userId)
      );
      return { previousMembers };
    },
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    onError: (err, userId, context: any) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(queryKeys.users.list(), context.previousMembers);
      }
      toast.error("Failed to remove member");
    }
  });
}
