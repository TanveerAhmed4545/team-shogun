import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries/keys";
import toast from "react-hot-toast";

export interface Project {
  _id: string;
  clientName: string;
  orderId: string;
  profileName: string;
  orderStatus: string;
  value: number;
  deadline: string;
  star: number;
  developer?: {
    id: any; // Can be string or populated User object
    name: string;
  };
  createdBy: string;
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: queryKeys.projects.list(),
    queryFn: async () => {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (!json.success) throw new Error("Failed to fetch projects");
      return json.data || [];
    },
  });
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectId, status }: { projectId: string, status: string }) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });
      if (!res.ok) throw new Error("Update failed");
      return { projectId, status };
    },
    onMutate: async ({ projectId, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.projects.list() });
      const previousProjects = queryClient.getQueryData(queryKeys.projects.list());
      queryClient.setQueryData(queryKeys.projects.list(), (old: any) => 
        old?.map((p: any) => p._id === projectId ? { ...p, orderStatus: status } : p)
      );
      return { previousProjects };
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
    onError: (err, variables, context: any) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(queryKeys.projects.list(), context.previousProjects);
      }
      toast.error("Failed to update status");
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.projects.list() });
      const previousProjects = queryClient.getQueryData(queryKeys.projects.list());
      queryClient.setQueryData(queryKeys.projects.list(), (old: any) => 
        old?.filter((p: any) => p._id !== projectId)
      );
      return { previousProjects };
    },
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
    onError: (err, variables, context: any) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(queryKeys.projects.list(), context.previousProjects);
      }
      toast.error("Failed to delete project");
    }
  });
}
