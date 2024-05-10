"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import { type ExamsData } from "./colums";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
    deleteExam,
    updateExam,
} from "@/server/actions/exams/mutations";
import { useAwaitableTransition } from "@/hooks/use-awaitable-transition";

export function ColumnDropdown({ examId, title }: ExamsData) {
    const router = useRouter();

    const { mutateAsync: updateExamMutate, isPending: updateExamIsPending } =
        useMutation({
            mutationFn: ({ title }: { title: string }) => {
                return updateExam({ examId, title });
            },
            onSettled: () => {
                router.refresh();
            },
        });

    const [updateIsTransitionPending, startAwaitableUpdateTransition] =
        useAwaitableTransition();

    const onUpdateExam = (title: string) => {
        toast.promise(
            async () => {
                await updateExamMutate({ title });
                await startAwaitableUpdateTransition(() => {
                    router.refresh();
                });
            },
            {
                loading: "Updating exam...",
                success: "Exam updated!",
                error: "Failed to update exam.",
            },
        );
    };

    const {
        mutateAsync: deleteExamMutate,
        isPending: deleteExamIsPending,
    } = useMutation({
        mutationFn: ({ examId }: { examId: string }) =>
            deleteExam({ examId }),
    });

    const [
        deleteIsTransitionPending,
        startAwaitableDeleteTransition,
    ] = useAwaitableTransition();

    const onDeleteExam = async () => {
        toast.promise(
            async () => {
                await deleteExamMutate({
                    examId,
                });
                await startAwaitableDeleteTransition(() => {
                    router.refresh();
                });
            },
            {
                loading: "Deleting exam...",
                success: "Exam deleted",
                error: "Failed to delete exam.",
            },
        );
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-screen max-w-[12rem]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={updateExamIsPending || updateIsTransitionPending}
                    onClick={() => onUpdateExam(title)}
                >
                    Update
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={deleteExamIsPending || deleteIsTransitionPending}
                    onClick={onDeleteExam}
                    className="text-red-600"
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
