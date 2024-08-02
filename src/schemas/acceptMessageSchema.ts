import { z } from "zod";

export const acceptMessages = z.object({
    value: z.boolean(),
})