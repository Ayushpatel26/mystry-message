"use client";

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signInSchema } from '@/schemas/signInSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        })
      }
    }
    
    if (result?.url) {
      router.replace('/dashboard');
      return null;//by gpt
    }

    setIsSubmitting(false);
  }

  return (
    <div className='bg-gray-100 flex flex-col justify-center items-center min-h-screen'>
      <div className="px-4 py-2 shadow-md bg-white rounded-lg max-w-md">
        <div className="text-center">
          <h1 className="mb-3 text-2xl font-extrabold sm:text-3xl lg:text-4xl xl:text-7xl">
            Welcome to Mystry Message
          </h1>
          <p className="mb-2">
            Sign in to start your anonymous adventure
          </p>
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-2'
            >
            <FormField
            name="identifier"
            control={form.control}
            render={({field}) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder='email/username'
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className='font-medium'
            >
              {
                isSubmitting ? (
                  <>
                    <Loader2 className='h-4'
                    /> Please wait
                  </>
                ) : ('Signin')
              }
            </Button>
            </form>
          </Form>
          
          <div className="text-center">
            <p>
              Not Signed up?{' '}
              <Link href='/sign-up' className='text-blue-500 hover:text-blue-800'>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;
