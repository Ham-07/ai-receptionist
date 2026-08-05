import { z } from "zod";
import { UUID_FORMAT } from "@/lib/constants";

export const LeadSchema = z.object({
  business_id: z
    .string()
    .regex(UUID_FORMAT, "Invalid business ID format"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number cannot exceed 30 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, "Message cannot exceed 2000 characters")
    .optional()
    .or(z.literal("")),
});

export type LeadFormData = z.infer<typeof LeadSchema>;
