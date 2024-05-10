import { db } from '../../db';
import { exams } from '../../db/schema';

export async function getExamById(examId: string) {
  return db.selectFrom(exams)
    .selectAll()
    .where(exams.examId.eq(examId))
    .executeTakeFirstOrThrow();
}

export async function getAllExams() {
  return db.selectFrom(exams)
    .selectAll()
    .execute();
}
