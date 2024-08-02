import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  // id: z.string(),
  name: z.string(),
  type: z.string(),
  production: z.string(),
  status: z.string(),
  createdat: z.string(),
  ocrstart: z.string(),
  ocrend: z.string(),
  accuracy: z.string(),
})

export type Task = z.infer<typeof taskSchema>
