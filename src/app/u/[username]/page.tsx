'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { SyncLoader } from "react-spinners";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const SendMessage = () => {
    const params = useParams<{ username: string }>();
    const [geminiMessages, setGeminiMessages] = useState(false);
    const username = params.username;

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const defaultMessages = [
        "Hope you're having an amazing day!",
        "Just wanted to say you're appreciated.",
        "Keep pushing forward, you're doing great!"
    ];


    const messageContent = form.watch('content');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username,
            });

            toast(response.data.message);
            form.reset({ ...form.getValues(), content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast('Error', {
                description:
                    axiosError.response?.data.message ?? 'Failed to send message',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuggestedMessages = async () => {
        setGeminiMessages(true)
        try {
            const response = await axios.post<ApiResponse>('/api/suggest-messages');

            const messages = response.data.result
                .split(specialChar)
                .map((msg) => msg.trim())
                .filter((msg) => msg.split(' ').length <= 15);

            let finalMessages = messages.slice(0, 3);
            if (finalMessages.length < 3 && messages.length >= 4) {
                finalMessages.push(messages[3]);
            }

            setSuggestedMessages(finalMessages);
            setGeminiMessages(false)
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch suggested messages');
            setGeminiMessages(false)
        }
    };

    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled className='cursor-pointer'>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className='cursor-pointer' disabled={isLoading || !messageContent}>
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <div className="space-y-4 my-8">
                <div className="space-y-2">
                    <Button
                        disabled={geminiMessages}
                        onClick={fetchSuggestedMessages}
                        className="my-4 cursor-pointer w-44 justify-center"
                    >
                        {geminiMessages ? (
                            <div className="flex items-center justify-center w-full">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />  Please wait
                            </div>
                        ) : (
                            "Suggest Messages"
                        )}
                    </Button>
                    <p>Click on any message below to select it.</p>
                </div>
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Messages</h3>
                    </CardHeader>
                    {geminiMessages ? (
                        <div className="flex h-36 items-center justify-center mb-7">
                            <SyncLoader color="#000000" size={15} />
                        </div>
                    ) : (
                        <CardContent className="flex flex-col space-y-4 overflow-y-auto h-36">
                            {(suggestedMessages.length > 0 ? suggestedMessages : defaultMessages).map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="mb-2 cursor-pointer"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))}
                        </CardContent>
                    )}
                </Card>

            </div>

            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/sign-up'}>
                    <Button className='cursor-pointer'>Create Your Account</Button>
                </Link>
            </div>
        </div>
    );
};

export default SendMessage;
