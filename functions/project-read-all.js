import { getFauna, getProjectPreviewData, withErrorWrapper } from './utils';
const { q, client } = getFauna();

exports.handler = withErrorWrapper(async (event, context) => {
  const { data: projectRefs } = await client.query(
    q.Paginate(q.Match(q.Ref('indexes/all_projects')))
  );
  const getAllprojectDataQuery = projectRefs.map(ref => q.Get(ref));
  const allProjects = await client.query(getAllprojectDataQuery);
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: allProjects.map(({ ref, data }) => ({
        ref,
        data: getProjectPreviewData(data),
      })),
    }),
  };
});
