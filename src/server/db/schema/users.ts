import { index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { gameSessions } from "./data";
import createTable from "./createTable";

export const students = createTable(
  "students",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
  },
  (student) => ({
    nameIndex: index("student_name_idx").on(student.name),
  })
)
export const studentsRelations = relations(students, ({ many }) => ({
  studentsToExaminers: many(studentsToExaminers),
  gameSessions: many(gameSessions),
}));

export const examiners = createTable(
  "examiners",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
  }
)
export const examinersRelations = relations(examiners, ({ many }) => ({
  studentsToExaminers: many(studentsToExaminers)
}));


export const studentsToExaminers = createTable(
  'students_to_examiners',
  {
    studentId: integer('student_id')
      .notNull()
      .references(() => students.id),
    examinerId: integer('examiner_id')
      .notNull()
      .references(() => examiners.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.studentId, t.examinerId] }),
  }),
);
export const studentsToExaminersRelations = relations(studentsToExaminers, ({ one }) => ({
  examiner: one(examiners, {
    fields: [studentsToExaminers.examinerId],
    references: [examiners.id],
  }),
  student: one(students, {
    fields: [studentsToExaminers.studentId],
    references: [students.id],
  }),
}));

