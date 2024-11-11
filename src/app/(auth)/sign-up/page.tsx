"use client";

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios, {AxiosError} from 'axios';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import { signUpSchema } from '@/schemas/signUpSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
      toast({
        title: 'Success',
        description: response.data.message
      })
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Error in signup of user", axiosError);
      const errorMessage = axiosError.response?.data?.message || axiosError.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false);
    }
  }

  return (
    <div className='bg-gray-100 flex justify-center items-center min-h-screen'>
      <div className="px-4 py-2 shadow-md bg-white rounded-lg">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-extrabold sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl">
            Join Mystry Message
          </h1>
          <p className="mb-2 font-medium">
            Sign up to start your anonymous adventure
          </p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField
            name="username"
            control={form.control}
            render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='username'
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                  debounced(e.target.value);
                }} />
              </FormControl>
                {isCheckingUsername && <Loader2 className='animate-spin' />}
                <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>
                  {usernameMessage}
                </p>
              <FormMessage />
            </FormItem>
            )}
            />

            <FormField
            name="email"
            control={form.control}
            render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='email'
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            )}
            />

            <FormField
            name="password"
            control={form.control}
            render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='password'
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className='h-4'
                    /> Please wait
                  </>
                ) : ('Signup')
              }
            </Button>
            </form>
          </Form>
          
          <div className="text-center">
            <p>
              Already a member?{' '}
              <Link href='/sign-in' className='text-blue-500 hover:text-blue-800'>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;
