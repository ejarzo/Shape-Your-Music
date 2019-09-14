import { getFauna, getProjectPreviewData, withErrorWrapper } from './utils';
const { q, client } = getFauna();

exports.handler = withErrorWrapper(async (event, context) => {
  const { data: projectRefs } = await client.query(
    q.Paginate(q.Match(q.Index('projects_sort_by_ts_desc')))
  );
  const getAllprojectDataQuery = projectRefs.map(ref => q.Get(ref[1]));
  const allProjects = await client.query(getAllprojectDataQuery);

  /* TODO: pagination */
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: allProjects.map(({ ref, data, ts }) => ({
        ref,
        ts,
        data: getProjectPreviewData(data),
      })),
    }),
  };
});
