import { z } from "zod";

export const VerifyCodeSchema = z.object({
  code: z.string().length(6, "The Code Must have 6 Characters"),
});
