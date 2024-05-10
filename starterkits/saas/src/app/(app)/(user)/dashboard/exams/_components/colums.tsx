/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ColumnDropdown } from "./colums-dropdown";
import { format } from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ExamsData = {
    examId: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

export function getColumns(): ColumnDef<ExamsData>[] {
    return columns;
}

export const columns: ColumnDef<ExamsData>[] = [
    {
        accessorKey: "title",
        header: () => <span className="pl-2">Title</span>,
        cell: ({ row }) => <span className="pl-2 font-medium">{row.original.title}</span>,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <span className="pl-2">{row.original.description}</span>,
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {format(new Date(row.original.createdAt), "PP")}
            </span>
        ),
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {format(new Date(row.original.updatedAt), "PP")}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <ColumnDropdown {...row.original} />,
    },
];
