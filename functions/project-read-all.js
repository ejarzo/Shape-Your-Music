import { getFauna, getProjectPreviewData, withErrorWrapper } from './utils';
const { q, client } = getFauna();

exports.handler = withErrorWrapper(async (event, context) => {
  /* TODO: order by TS */
  const { data: projectRefs } = await client.query(
    q.Paginate(q.Match(q.Ref('indexes/all_projects')))
  );
  const getAllprojectDataQuery = projectRefs.map(ref => q.Get(ref));
  const allProjects = await client.query(getAllprojectDataQuery);

  /* TODO: pagination */
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: allProjects.reverse().map(({ ref, data, ts }) => ({
        ref,
        ts,
        data: getProjectPreviewData(data),
      })),
    }),
  };
});
