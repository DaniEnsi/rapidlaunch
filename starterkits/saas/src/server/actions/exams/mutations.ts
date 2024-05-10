import { db } from '../../db';
import { exams } from '../../db/schema';
import { sql } from 'drizzle-orm';

export async function createExam({ title, description }) {
  return db.insertInto(exams).values({
    title,
    description,
    createdAt: sql`CURRENT_TIMESTAMP`,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  }).returningAll().executeTakeFirstOrThrow();
}

export async function updateExam({ examId, title, description }) {
  return db.update(exams).set({
    title,
    description,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  }).where(exams.examId.eq(examId)).returningAll().executeTakeFirstOrThrow();
}

export async function deleteExam({ examId }) {
  return db.deleteFrom(exams).where(exams.examId.eq(examId)).executeTakeFirstOrThrow();
}
