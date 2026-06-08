import { z } from 'zod';

const futureDate = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    { message: 'Please select a valid deadline.' },
  );

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  projectId: z.string().uuid('Select a project'),
  assignedToId: z.string().optional(),
  dueDate: futureDate,
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  deadline: futureDate,
  status: z.enum(['ACTIVE', 'COMPLETED', 'ON_HOLD']),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
