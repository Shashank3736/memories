import { z } from "zod"

const SignupValidation = z.object({
    username: z.string().min(2).max(50),
})

export { SignupValidation }
