"use client";
import { SignInSchema } from "@/schemas/SignInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession, signIn, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  if (session) {
    return router.replace("/dashboard");
  }

  const [isSubmitting, setisSubmitting] = useState(false);
  const [ShowPassword, setShowPassword] = useState(false);
  const [Username, setUsername] = useState("");

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    try {
      setisSubmitting(true);
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error == "CredentialsSignin") {
          toast({
            title: "Failed to Sign In",
            description: "Incorrect Username or Password",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Failed to Sign In",
            description: result.error,
            variant: "destructive",
          });
        }
      }

      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Server Error",
        description: `${error}`,
      })
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center min-h-screen items-center bg-gray-200">
        <div className="flex flex-col justify-center items-center w-4/5 md:w-auto md:p-14 h-auto bg-white shadow-lg rounded-lg px-2 py-4">
          <h1 className="text-2xl md:text-4xl font-bold tracking-wider">
            Wellcome Back
          </h1>
          <div className="w-full px-5 md:px-0   mt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username/Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username or Email"
                          type="text"
                          {...field}
                        />
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
                        <>
                          <Input
                            type={ShowPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            className="relative left-[16rem] md:left-[15.2rem] bottom-[3rem]"
                            onClick={() => {
                              ShowPassword
                                ? setShowPassword(false)
                                : setShowPassword(true);
                            }}
                            variant={"outline"}
                          >
                            {ShowPassword ? <EyeOff /> : <Eye />}
                          </Button>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full relative -top-7"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <p className="font-medium">New Here? <Link className="text-blue-600 font-semibold hover:underline" href={"/sign-up"}>Sign Up</Link></p>
        </div>
      </div>
    </>
  );
}
