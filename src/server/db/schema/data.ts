import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgEnum,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import createTable from "./createTable";
import { students } from "./users";

export const tasks = createTable(
  "tasks",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    scriptId: integer("script_id")
      .notNull()
      .references(() => scripts.id),
  },
  (task) => ({
    nameIndex: index("task_name_idx").on(task.name),
  })
);
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  script: one(scripts, { fields: [tasks.scriptId], references: [scripts.id] }),
  tasksResults: many(tasksResults),
}));


export const scripts = createTable(
  "scripts",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    simulatorId: integer("simulator_id")
      .notNull()
      .references(() => simulators.id)
  },
  (script) => ({
    nameIndex: index("script_name_idx").on(script.name),
  })
);
export const scriptsRelations = relations(scripts, ({ one, many }) => ({
  simulator: one(simulators, { fields: [scripts.simulatorId], references: [simulators.id] }),
  tasks: many(tasks),
  gameSessions: many(gameSessions)
}));

export const simulators = createTable(
  "simulators",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
  },
  (simulator) => ({
    nameIndex: index("simulator_name_idx").on(simulator.name),
  })
)
export const simulatorsRelations = relations(simulators, ({ many }) => ({
  scripts: many(scripts),
  gameSessions: many(gameSessions)
}));


const TYPES = ["training", "practice", "attestation"] as const;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScriptConfigT = z.object({
  type: z.enum(TYPES),
  options: z.object({
    SIZ: z.boolean(),
    hints: z.boolean(),
  })
});
type ScriptConfigT = z.infer<typeof ScriptConfigT>;

export const gameSessions = createTable(
  "game_sessions",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id),
    simulatorId: integer("simulator_id")
      .notNull()
      .references(() => simulators.id),
    scriptId: integer("script_id")
      .notNull()
      .references(() => scripts.id),
    comment: text("comment"),
    scriptConfig: json("script_config").$type<ScriptConfigT>(),
    time: integer("time").notNull(), //in seconds
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }
)
export const gameSessionsRelations = relations(gameSessions, ({ one, many }) => ({
  student: one(students, { fields: [gameSessions.studentId], references: [students.id] }),
  simulator: one(simulators, { fields: [gameSessions.simulatorId], references: [simulators.id] }),
  script: one(scripts, { fields: [gameSessions.scriptId], references: [scripts.id] }),
  tasksResults: many(tasksResults),
}));


export const taskStatusEnum = pgEnum('task_status', ['done', 'notdone', 'error']);
export const tasksResults = createTable(
  "tasks_results",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    gameSessionId: integer("game_session_id")
      .notNull()
      .references(() => gameSessions.id),
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id),
    taskStatus: taskStatusEnum("task_status").notNull(),
  }
)
export const tasksResultsRelations = relations(tasksResults, ({ one }) => ({
  gameSession: one(gameSessions, { fields: [tasksResults.gameSessionId], references: [gameSessions.id] }),
  task: one(tasks, { fields: [tasksResults.taskId], references: [tasks.id] }),
}));

// export const posts = createTable(
//     "post",
//     {
//       id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
//       name: varchar("name", { length: 256 }),
//       // createdById: varchar("created_by", { length: 255 })
//       //   .notNull()
//       //   .references(() => users.id),
//       createdAt: timestamp("created_at", { withTimezone: true })
//         .default(sql`CURRENT_TIMESTAMP`)
//         .notNull(),
//       updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
//         () => new Date()
//       ),
//     },
//     (example) => ({
//       // createdByIdIdx: index("created_by_idx").on(example.createdById),
//       nameIndex: index("name_idx").on(example.name),
//     })
//   );