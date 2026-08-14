import { z } from "zod";

export const DriverSchema = z.object({
  id: z.string(),
  code: z.string(),
  number: z.number().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  teamId: z.string().nullable(),
  countryCode: z.string().nullable()
});

export type Driver = z.infer<typeof DriverSchema>;
