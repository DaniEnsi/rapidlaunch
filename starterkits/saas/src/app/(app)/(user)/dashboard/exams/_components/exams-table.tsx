"use client";

import { DataTable } from "@/app/(app)/_components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { getColumns, type ExamsData } from "./colums";
import { useDataTable } from "@/hooks/use-data-table";
import type {
    DataTableFilterableColumn,
    DataTableSearchableColumn,
} from "@/types/data-table";
import { getAllExams } from "@/server/actions/exams/queries";

const filterableColumns: DataTableFilterableColumn<ExamsData>[] = [
    {
        id: "role",
        title: "Role",
        options: [
            { label: "Invigilator", value: "Invigilator" },
            { label: "Manager", value: "Manager" },
            { label: "Billing", value: "Billing" },
            { label: "Admin", value: "Admin" },
        ],
    },
];

const searchableColumns: DataTableSearchableColumn<ExamsData>[] = [
    { id: "title", placeholder: "Search title..." },
    { id: "description", placeholder: "Search description..." },
];

export function ExamsTable() {
    const examsPromise = React.useMemo(() => getAllExams(), []);

    const { data, pageCount, total } = useDataTable({
        dataPromise: examsPromise,
        columns: useMemo<ColumnDef<ExamsData, unknown>[]>(() => getColumns(), []),
        filterableColumns,
        searchableColumns,
    });

    return (
        <>
            <DataTable
                table={data}
                columns={useMemo<ColumnDef<ExamsData, unknown>[]>(() => getColumns(), [])}
                filterableColumns={filterableColumns}
                searchableColumns={searchableColumns}
                totalRows={total}
            />
        </>
    );
}
