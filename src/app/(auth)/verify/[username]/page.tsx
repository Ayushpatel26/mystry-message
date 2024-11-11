'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const VerifyAccount = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const param = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(verifySchema)
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code
      });

      toast({
        title: "Success",
        description: response.data.message
      })
      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification failed",
        description: axiosError.response?.data.message,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100'>
      <div className="p-2 shadow-md rounded-lg bg-white space-y-8 max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">
            Verify Your Account
          </h1>
          <p className="mb-4">
            Enter the verification code sent to your email
          </p>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Verification Code" {...field} />
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
                  ) : ('Submit')
                }
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default VerifyAccount;
