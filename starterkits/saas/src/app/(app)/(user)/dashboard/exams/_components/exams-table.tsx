"use client";

import { DataTable } from "@/app/(app)/_components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { getColumns, type ExamsData } from "./colums";
import { membersToOrganizationsRoleEnum } from "@/server/db/schema";
import { useDataTable } from "@/hooks/use-data-table";
import type {
    DataTableFilterableColumn,
    DataTableSearchableColumn,
} from "@/types/data-table";
import { type getPaginatedOrgMembersQuery } from "@/server/actions/organization/queries";

/** @learn more about data-table at shadcn ui website @see https://ui.shadcn.com/docs/components/data-table */

const filterableColumns: DataTableFilterableColumn<ExamsData>[] = [
    {
        id: "role",
        title: "Role",
        options: membersToOrganizationsRoleEnum.enumValues.map((v) => ({
            label: v,
            value: v,
        })),
    },
];

type MembersTableProps = {
    membersPromise: ReturnType<typeof getPaginatedOrgMembersQuery>;
};

const searchableColumns: DataTableSearchableColumn<ExamsData>[] = [
    { id: "email", placeholder: "Search email..." },
];

export function ExamsTable({ membersPromise }: MembersTableProps) {
    const { data, pageCount, total } = React.use(membersPromise);

    const columns = useMemo<ColumnDef<ExamsData, unknown>[]>(
        () => getColumns(),
        [],
    );

    const ExamsData: ExamsData[] = data.map((member) => {
        return {
            id: member.id!,
            role: member.role,
            createdAt: member.createdAt,
            email: member.member.email,
            name: member.member.name,
            memberId: member.memberId,
        };
    });

    const { table } = useDataTable({
        data: ExamsData,
        columns,
        pageCount,
        searchableColumns,
        filterableColumns,
    });

    return (
        <>
            <DataTable
                table={table}
                columns={columns}
                filterableColumns={filterableColumns}
                searchableColumns={searchableColumns}
                totalRows={total}
            />
        </>
    );
}
