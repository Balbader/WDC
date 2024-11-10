"use client"; // Marks this as a client-side component

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { pageTitleStyles } from "@/styles/common";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { changePasswordAction } from "./actions";
import { LoaderButton } from "@/components/loader-button";
import { useServerAction } from "zsa-react";

// Define the validation schema for the password reset form
const registrationSchema = z
    .object({
        password: z.string().min(8),
        token: z.string(),
        passwordConfirmation: z.string().min(8),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords don't match",
        path: ["passwordConfirmation"],
    });

// Main component for the password reset page
// Accepts a token from URL search parameters
export default function ResetPasswordPage({
    searchParams,
}: {
    searchParams: { token: string };
}) {
    // Initialize form with react-hook-form and zod validation
    const form = useForm<z.infer<typeof registrationSchema>>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            password: "",
            token: searchParams.token,
            passwordConfirmation: "",
        },
    });

    // Use server action hook for handling password change
    // isPending: loading state
    // isSuccess: successful submission state
    // error: error state if submission fails
    const { execute, isPending, isSuccess, error } =
        useServerAction(changePasswordAction);

    // Handle form submission
    function onSubmit(values: z.infer<typeof registrationSchema>) {
        execute({
            token: values.token,
            password: values.password,
        });
    }

    return (
        // Main container with centered content
        <div className="py-24 max-w-[400px] space-y-6 mx-auto">
            {/* Success state UI - shown after successful password change */}
            {isSuccess && (
                <>
                    <h1 className={cn(pageTitleStyles, "text-center")}>
                        Password Updated
                    </h1>
                    <Alert variant="success">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Password updated</AlertTitle>
                        <AlertDescription>
                            Your password has been successfully updated.
                        </AlertDescription>
                    </Alert>

                    <Button variant="default" asChild className="w-full">
                        <Link href="/sign-in/email">Login with New Password</Link>
                    </Button>
                </>
            )}

            {/* Form state UI - shown when password hasn't been changed yet */}
            {!isSuccess && (
                <>
                    <h1 className={cn(pageTitleStyles, "text-center")}>
                        Change Password
                    </h1>

                    {/* Error alert - shown when password change fails */}
                    {error && (
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Uh-oh, something went wrong</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}

                    {/* Password reset form with validation */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="w-full"
                                                placeholder="Enter your new password"
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="passwordConfirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="w-full"
                                                placeholder="Enter Confirm your Password"
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <LoaderButton
                                isLoading={isPending}
                                className="w-full"
                                type="submit"
                            >
                                Change Password
                            </LoaderButton>
                        </form>
                    </Form>
                </>
            )}
        </div>
    );
}
