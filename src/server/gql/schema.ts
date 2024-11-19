import { buildSchema } from "drizzle-graphql";
import { db } from "../db";
// import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

const { schema } = buildSchema(db);

// const fields = entities.inputs.TasksFilters.getFields()

// const TasksExtendFilters = new GraphQLInputObjectType({
//   name: 'TasksExtendFilters',
//   description: undefined,
//   isOneOf: false,
//   fields: {
//     ...fields,
//     search: { type: GraphQLString },
//   }
// })

// const gqlSchema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'Query',
//     fields: {
//       // tasks: {
//       //   type: new GraphQLList(new GraphQLNonNull(entities.types.TasksSelectItem)),
//       //   args: {
//       //     // You can reuse inputs as well
//       //     where: {
//       //       type: TasksExtendFilters,
//       //     },
//       //   },
//       //   // resolve: entities.queries.tasks.resolve,
//       //   resolve: async (source, args, context, info) => {
//       //     console.dir({
//       //       source,
//       //       args,
//       //       context,
//       //       info
//       //     })
//       //     // Your custom logic goes here...
//       //     const result = await db.query.tasks.findMany({
//       //       where: (tasks, { ilike }) => (ilike(tasks.name, args.where.name.ilike))
//       //     })
//       //     return result;
//       //   },
//       // },
//       students: entities.queries.students,
//       studentsSingle: entities.queries.studentsSingle,
//     },
//   }),
//   // Same rules apply to mutations
//   mutation: new GraphQLObjectType({
//     name: 'Mutation',
//     fields: entities.mutations,
//   }),
//   // In case you need types inside your schema
//   types: [...Object.values(entities.types), ...Object.values(entities.inputs)],
// });

export default schema;
