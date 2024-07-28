"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { User } from "next-auth";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

import { useMutation } from "@tanstack/react-query";
import { updateNameMutation } from "@/server/actions/user/mutations";
import { useAwaitableTransition } from "@/hooks/use-awaitable-transition";
import { siteConfig } from "@/config/site";

import { createOrgMutation } from "@/server/actions/organization/mutations";
import { completeNewUserSetupMutation } from "@/server/actions/user/mutations";

import { Input } from "@/components/ui/input";
import { Step, Stepper, useStepper } from "@/components/ui/stepper";
import type { StepItem } from "@/components/ui/stepper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";

const steps = [
    { label: "User" },
    { label: "Organisation" },
    { label: "Invite Team" },
] satisfies StepItem[];

type NewUserFormProps = {
    user: User;
};

export function StepperDemo({
    user,
}: NewUserFormProps) {
    return (
        <div className="flex w-full flex-col gap-4">
            <Stepper variant="circle-alt" initialStep={0} steps={steps}>
                {steps.map((stepProps, index) => {
                    if (index === 0) {
                        return (
                            <Step key={stepProps.label} {...stepProps}>
                                <NewUserProfileForm user={user} />
                            </Step>
                        );
                    }
                    if (index === 1) {
                        return (
                            <Step key={stepProps.label} {...stepProps}>
                                <NewUserOrgForm />
                            </Step>
                        );
                    }
                    return (
                        <Step key={stepProps.label} {...stepProps}>
                            <CompletedSetup/>
                        </Step>
                    );
                })}
            </Stepper>
        </div>
    );
}

const profileFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),
});

export type ProfileFormSchema = z.infer<typeof profileFormSchema>;

type NewUserProfileFormProps = {
    user: User;
};

export function NewUserProfileForm({ user }: NewUserProfileFormProps) {
    const { nextStep } = useStepper();
    const [isPending, startAwaitableTransition] = useAwaitableTransition();

    const form = useForm<ProfileFormSchema>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name ?? "",
        },
    });

    const { isPending: isMutatePending, mutateAsync } = useMutation({
        mutationFn: () => updateNameMutation({ name: form.getValues().name }),
    });

    const onSubmit = useCallback(async () => {
        try {
            await mutateAsync();
            await startAwaitableTransition(() => {
                nextStep();
                toast.success("Profile setup complete!");
            });
        } catch (error) {
            toast.error(
                (error as { message?: string })?.message ??
                    "An error occurred while updating your profile",
            );
        }
    }, [mutateAsync, startAwaitableTransition, nextStep]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                void form.handleSubmit(onSubmit)();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [form, onSubmit]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Welcome to {siteConfig.name}
                        </CardTitle>
                        <CardDescription>
                            Please set up your profile to get started
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="alidotm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter your full name to get started
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input value={user?.email ?? ""} readOnly />
                            </FormControl>
                            <FormDescription>
                                This is the email you used to sign up
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    </CardContent>

                    <CardFooter className="flex items-center justify-end gap-2">
                        <StepperFormActions
                            isLoading={isPending || isMutatePending}
                        />
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}

const createOrgFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),
    email: z.string().email("Invalid email address"),
});

type CreateOrgFormSchema = z.infer<typeof createOrgFormSchema>;


export function NewUserOrgForm(
    { prevBtn = true }: { prevBtn?: boolean } = {},
) {
    const { nextStep } = useStepper();
    const [isPending, startAwaitableTransition] = useAwaitableTransition();

    const form = useForm<CreateOrgFormSchema>({
        resolver: zodResolver(createOrgFormSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    const { mutateAsync, isPending: isMutatePending } = useMutation({
        mutationFn: ({ name, email }: { name: string; email: string }) =>
            createOrgMutation({ name, email }),
    });

    const onSubmit = useCallback(async (values: CreateOrgFormSchema) => {
        try {
            await mutateAsync(values);
            await completeNewUserSetupMutation();
            await startAwaitableTransition(() => {
                nextStep();
                toast.success("Organization created successfully");
            });
        } catch (error) {
            toast.error(
                (error as { message?: string })?.message ??
                    "Organization could not be created",
            );
        }
    }, [mutateAsync, startAwaitableTransition, nextStep]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                void form.handleSubmit(onSubmit)();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [form, onSubmit]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Setup your organization
                        </CardTitle>
                        <CardDescription>
                            Create an organization to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Org Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="hey@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the email of your organization.
                                        This could be your personal email or a
                                        shared email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Org Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ali's Org"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the name of your organization.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex items-center justify-end gap-2">
                        { prevBtn ? <StepperFormActions
                            isLoading={isPending || isMutatePending}
                        />  :<Button
                        disabled={
                            isPending ||
                            isMutatePending 
                        }
                        type="submit"
                        className="gap-2"
                    >
                        {isPending ||
                        isMutatePending  ? (
                            <Icons.loader className="h-4 w-4" />
                        ) : null}
                        <span>Continue</span>
                    </Button> }
                    
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}


export function CompletedSetup() {
    const router = useRouter();
    const onSubmit = useCallback(() => {
        router.refresh();
    }, [router]);

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Setup Complete 🎉 </CardTitle>
                    <CardDescription>
                        You have successfully completed the setup process
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                    
                </CardContent>
                <CardFooter className="flex items-center justify-end gap-2">
                    <Button onClick={onSubmit} size="sm" className="gap-2">
                        Get Started 🚀
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

function StepperFormActions({
    isLoading = false,
}: { isLoading?: boolean } = {}) {
    const { prevStep, nextStep, isDisabledStep, isLastStep, isOptionalStep } =
        useStepper();
    const router = useRouter();

    const onLastStepClick = useCallback(() => {
        toast.success("Setup complete!");
        router.refresh();
    }, [router]);

    return (
        <div className="flex w-full justify-end gap-2">
            {!isLastStep && (
                <Button
                    disabled={isDisabledStep || isLoading}
                    onClick={prevStep}
                    size="sm"
                    variant="secondary"
                >
                    Back
                </Button>
            )}
            <Button 
                size="sm" 
                disabled={isLoading} 
                className="gap-2"
                onClick={isLastStep ? onLastStepClick : undefined}
                type={isLastStep ? "button" : "submit"}
            >
                {isLoading ? <Icons.loader className="h-4 w-4" /> : null}
                {isLastStep
                    ? "Get Started 🚀"
                    : isOptionalStep
                    ? "Skip"
                    : "Next"}
            </Button>
        </div>
    );
}