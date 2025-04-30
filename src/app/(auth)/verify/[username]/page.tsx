'use client';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { toast } from "sonner";
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"


export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });
            toast("Success", {
                description: response.data.message,
            });

            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast("Error", {
                description: axiosError.response?.data.message ??
                    'An error occurred. Please try again.',
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="flex flex-col w-full justify-center items-center max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-y-6 justify-center flex-col items-center">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='w-full justify-center text-2xl'>Verification Code</FormLabel>
                                    <Controller
                                        name="code"
                                        control={form.control}
                                        render={({ field }) => (
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        )}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-1/2 justify-center cursor-pointer'>Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
