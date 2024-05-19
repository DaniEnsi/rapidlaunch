"use server";

import { db } from "@/server/db";
import {
    exams,
    subjects
} from "@/server/db/schema";
import { adminProcedure, protectedProcedure } from "@/server/procedures";
import { and, asc, count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";
import { unstable_noStore as noStore } from "next/cache";

/**
 * @purpose Get exams
 * @returns exams
 */

export async function getExams() {
    await protectedProcedure();

    return await db.query.exams.findMany();
}


/**
 * @purpose Get exam by id
 * @param examId
 * @returns exam
 */

type GetExamByIdProps = {
    examId: string;
};

export async function getExamById({ examId }: GetExamByIdProps) {
    await protectedProcedure();

    return await db.query.exams.findFirst({
        where: and(eq(exams.id, examId))
    });
}


/**
 * @purpose Get paginated exams
 * @param page - page number
 * @param per_page - number of items per page
 * @param sort - sort by column
 * @param subject - filter by subject
 * @param paper - filter by paper number
 * @returns Paginated users
 */

const panginatedExamPropsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    subject: z.string().optional(),
    paper: z.string().optional(),
});

type GetPaginatedExamsQueryProps = z.infer<typeof panginatedExamPropsSchema>;

export async function getPaginatedExamsQuery(input: GetPaginatedExamsQueryProps) {
    noStore();
    await adminProcedure();

    const 

    const offset = (input.page - 1) * input.per_page;

    const [column, order] = (input.sort?.split(".") as [
        keyof typeof exams.$inferSelect | undefined,
        "asc" | "desc" | undefined,
    ]) ?? ["name", "desc"];

    const { data, total } = await db.transaction(async (tx) => {
        const response = await tx.query.organizations.findMany({
            where: input.subject
                ? ilike(exams.subjectId, `%${input.email}%`)
                : undefined,
            with: {
                owner: true,
                membersToExamanizations: {
                    with: {
                        member: true,
                    },
                },
                subscriptions: true,
            },
            offset,
            limit: input.per_page,
            orderBy:
                column && column in organizations
                    ? order === "asc"
                        ? asc(organizations[column])
                        : desc(organizations[column])
                    : desc(organizations.createdAt),
        });

        const data = response.map((org) => {
            return {
                ...org,
                members: org.membersToExamanizations.map((mto) => {
                    return {
                        ...mto.member,
                        role: mto.role,
                    };
                }),
            };
        });

        const total = await tx
            .select({
                count: count(),
            })
            .from(organizations)
            .where(
                or(
                    input.email
                        ? ilike(organizations.email, `%${input.email}%`)
                        : undefined,
                ),
            )
            .execute()
            .then((res) => res[0]?.count ?? 0);

        return { data, total };
    });

    const pageCount = Math.ceil(total / input.per_page);

    return { data, pageCount, total };
}
