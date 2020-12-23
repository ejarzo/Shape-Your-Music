// CreateIndex({
//   name: 'all_projects_sorted_by_date_created',
//   source: Collection('Project'),
//   terms: [],
//   values: [
//     {
//       field: ['data', 'dateCreated'],
//       reverse: true,
//     },
//     {
//       field: ['ref'],
//     },
//   ],
// });

// Update(
//   Function("all_projects_sorted_by_date_created"),
//   {
//     body: Query(Lambda(["size", "after", "before"],
//       Let(
//         {
//           match: Match(Index("all_projects_sorted_by_date_created")),
//           page: If(
//             Equals(Var("before"), null),
//             If(
//               Equals(Var("after"), null),
//                 Paginate(Var("match"), { size: Var("size") }),
//                 Paginate(Var("match"), { size: Var("size"), after: Var("after") })
//             ),
//             Paginate(Var("match"), { size: Var("size"), before: Var("before") }),
//           )
//         },
//         Map(Var("page"), Lambda("values", Get(Select(1, Var("values")))))
//       )
//     ))
//   }
// );
