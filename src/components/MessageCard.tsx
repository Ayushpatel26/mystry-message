'use client';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/user";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { ObjectId } from "mongoose";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: ObjectId) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const {toast} = useToast();
    const messageDate = new Date(message.createdAt);
    const readableDate = messageDate.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    const handleDeleteConfirm = async () => {
        onMessageDelete(message._id);
        const response = await axios.delete<ApiResponse>(`api/delete-message/${message._id}`);
        toast({
            title: response.data.message
        });
    }
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between gap-2">
                <CardTitle className="break-all">{message.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='destructive' className="w-3 h-3 rounded-full p-3"><X /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your message
                                from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardDescription className="px-7 py-1">{readableDate}</CardDescription>
        </Card>
    )
}

export default MessageCard
