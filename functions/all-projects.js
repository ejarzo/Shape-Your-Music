import {
  getFauna,
  getProjectPreviewData,
  withErrorWrapper,
} from './utils/fauna';

exports.handler = withErrorWrapper(async (event, context) => {
  const { before, after, size = 24 } = event.queryStringParameters;
  const { q, client } = getFauna();
  const result = await client.query(
    q.Paginate(q.Match(q.Index('all_projects_sorted_by_date_created')), {
      size,
      after: after ? parseInt(after) : undefined,
      before: before ? parseInt(before) : undefined,
    })
  );
  const getAllprojectDataQuery = result.data.map(ref => q.Get(ref[1]));
  const allProjects = await client.query(getAllprojectDataQuery);

  return {
    statusCode: 200,
    body: JSON.stringify({
      after: result.after,
      before: result.before,
      data: allProjects.map(({ ref, data, ts }, i) => {
        return {
          ref,
          ts,
          _id: ref.id,
          index: i,
          ...getProjectPreviewData(data),
        };
      }),
    }),
  };
});
