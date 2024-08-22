import { z } from "zod"
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const bolSchema = z.object({
  document: z.string(),
  type: z.string(),
  production: z.string(),
  status: z.string(),
  elapse: z.string(),
  turnaroundtime: z.string(),
  accuracy: z.string(),
  priority: z.string(),
  createdat: z.string(),
  pages: z.number()
})
export const userSchema = z.object({
  
  username: z.string(),
  emailAddress: z.string(),
  lastname: z.string(),
  firstname: z.string(),
  middlename: z.string().optional() ,
  suffix: z.string().optional() ,
  contactNumber: z.string(),
})
export type Bol = z.infer<typeof bolSchema>
export type User = z.infer<typeof userSchema>