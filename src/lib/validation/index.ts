import { z } from "zod"

export const SignupValidation = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export const PostValidation = z.object({
    caption: z.string().min(5, { message: "Caption must be at least 5 characters." }).max(2200),
    file: z.custom<File[]>().refine((file) => file[0] && file[0].size < 8*1024*1024, { message: "File size must be less than 8MB." }),
    location: z.string().min(2, { message: "Location must be at least 2 characters." }).max(100),
    tags: z.string().min(2, { message: "Tags must be at least 2 characters." }),
})