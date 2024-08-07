/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { SignUpSchema } from "@/schemas/SignUpSchema";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/use-toast";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";

function signUp() {
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isUsernameChecking, setisUsernameChecking] = useState(false);
  const [Username, setUsername] = useState("");
  const [CheckUsername, setCheckUsername] = useState("");
  const [ShowPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const debounceUsername = useDebounceCallback(setUsername, 500);

  useEffect(() => {
    const checkUsername = async () => {
      if (debounceUsername) {
        try {
          setisUsernameChecking(true);
          const response = await axios.get(
            `/api/check-username-uniqe?username=${debounceUsername}`
          );
          return setCheckUsername(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          const mainError =
            axiosError.response?.data.message ?? "Error Checking Username";
          setCheckUsername(mainError);
        } finally {
          setisUsernameChecking(false);
        }
      }
    };
    checkUsername();
  }, [debounceUsername]);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    try {
      setisSubmitting(true);
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      form.reset();
      router.replace(`/verify/${Username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const fError = axiosError.response?.data.message ?? "Error During Signup";
      toast({
        title: "Failed to Sign Up",
        description: fError,
        variant: "destructive",
      });
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center min-h-screen items-center bg-gray-200">
        <div className="flex flex-col justify-center items-center w-4/5 md:w-auto md:p-14 h-auto bg-white shadow-lg rounded-lg px-2 py-4">
          <h1 className="text-2xl md:text-4xl font-bold tracking-wider">
            Join Glactic Message
          </h1>
          <div className="w-full px-5 md:px-0  my-3 mt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ashly75"
                          type="text"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ashly@example.com"
                          type="email"
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
                          <Input type={ShowPassword ? "text":"password"} {...field} />
                          <Button className="relative left-[16rem] md:left-[22.2rem] bottom-[3rem]" onClick={()=>{ShowPassword ? setShowPassword(false): setShowPassword(true)}}  variant={"outline"}>{ShowPassword ? (<EyeOff/>):(<Eye/>)}</Button>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full "
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default signUp;
