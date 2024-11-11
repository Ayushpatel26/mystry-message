'use client';
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';//dhyan
import { Message } from '@/models/user';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { ObjectId } from 'mongoose';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const {toast} = useToast();
  // optimistic UI approach -> First show it in UI and then do it in backend
  const handleDeleteMessage = (messageId: ObjectId) => {
    setMessages(messages.filter((sandes) => sandes._id !== messageId))
  }

  const {data: session} = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  });

  const {register, watch, setValue} = form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: "destructive"
      })
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback( async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      const fetchedMessages = Array.isArray(response.data.message) ? response.data.message : [];
      setMessages(fetchedMessages);
      if (refresh) {
        toast({
          title: "Showing latest messages",
        })
      }
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: AxiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  }, [setMessages, setIsLoading]);

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('api/accept-messages', {
        acceptMessages: !acceptMessages
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default'
      })
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: AxiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive"
      })
    }
  }

  if (!session || !session.user) {
    return <div className='text-center font-bold'>Please Sign in</div>
  }
  
  // const {username} = session.user as User;
  const username = (session?.user as User)?.username;
  // research more
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Profile URL has been copied to clipboard"
    })
  }

  return (
    <div className='p-2'>
      <h1 className="text-center text-4xl font-bold mb-2">
        User Dashboard
      </h1>

      <div className="mb-2">
        <h2 className="text-lg font-semibold mb-1">
          Copy Your Unique Link
        </h2>
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={profileUrl}
            id=""
            disabled
            className='bg-gray-100 rounded w-full p-1 mr-1 font-medium'
          />
          <button
            onClick={copyToClipboard}
            className='px-2 py-1 rounded bg-gray-500 text-white font-medium hover:bg-gray-700'
          >
            Copy
          </button>
        </div>
      </div>

      <div className="mb-2 flex align-middle items-center">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-1 text-lg text-gray-900">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>

      <Separator />

      <Button
        className='mt-2'
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 />
        ) : (
          <>
          <RefreshCcw />
          <span className='font-medium'>Refresh</span>
          </>
        )}
      </Button>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {messages.length > 0 ? (
          messages.map(sandes => (
            <MessageCard
              key={sandes._id}
              message={sandes}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-lg font-medium">
            No messages to display!
          </p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
