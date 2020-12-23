/* TODO -- automate this... */

// CreateIndex({
//   name: 'all_projects_sorted_by_title',
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
//   Function("all_projects_sorted_by_title"),
//   {
//     body: Query(Lambda(["size", "after", "before"],
//       Let(
//         {
//           match: Match(Index("all_projects_sorted_by_title")),
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
