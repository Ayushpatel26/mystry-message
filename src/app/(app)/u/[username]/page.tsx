'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const UserPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { username } = useParams();

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username,
        content: data.content
      });
      toast({
        title: response.data.message
      })
    } catch (error) {
      console.log(error);
      const AxiosError = error as AxiosError<ApiResponse>;
      toast({
        title: AxiosError.response?.data.message || AxiosError.message,
        variant: "destructive"
      })
    }
    setIsSubmitting(false);
  }

  return (
    <div className='mx-auto w-full p-2 md:w-2/3'>
      <h1 className="text-3xl font-bold text-center">
        Public Profile Link
      </h1>

      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea placeholder='Write your message here'
                    {...field}
                    className=''
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {
              isSubmitting ? (
                <>
                  <Loader2 className='h-4'
                  /> Please wait
                </>
              ) : ('Send')
            }
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default UserPage;
