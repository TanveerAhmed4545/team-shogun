import { z } from "zod";

export const createProjectSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  profileName: z.string().min(1, "Profile name is required"),
  orderId: z.string().min(1, "Order ID is required"),
  value: z.number().positive("Value must be positive"),
  currency: z.string().default("USD"),
  orderStatus: z.enum(["Pending", "WIP", "Revision", "Delivered", "Completed", "Cancelled"]).default("Pending"),
  developer: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
  deadline: z.string().transform((str) => new Date(str)), // Handles ISO strings from frontend
  priority: z.enum(["Green", "Yellow", "Red"]).default("Green"),
  remarks: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
