import { zodResolver } from "@hookform/resolvers/zod"
import { SigninValidation } from "@/lib/validation"
import { z } from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useToast } from "@/components/ui/use-toast"
import { useUserContext } from "@/context/AuthContext"
import Logo from "@/components/shared/Logo"

// Actual form
const SigninForms = () => {
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext()
  const navigate = useNavigate()

  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if(!session) {
      return toast({
        title: "Sign in failed. Please try again! 55"
      })
    }
    const isLoggedIn = await checkAuthUser()

    if(isLoggedIn) {
      form.reset();
      navigate('/')
    } else {
      toast({
        title: "Sign in failed. Please try again 66!"
      })
    }
  }
  return (
    // 3. Render the form.
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <Logo />
        <h2 className="h3-bold md:h2-bold">Log in to your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">Welcom back! Enter your details.</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader />  Loading...
              </div>
            ): "Sign In"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
              Don't have an account?
              <Link to='/sign-up' className="ml-1 text-primary-500 text-small-semibold hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForms