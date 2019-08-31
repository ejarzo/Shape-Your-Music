import { getFauna, getProjectPreviewData } from './utils';
const { q, client } = getFauna();

exports.handler = async (event, context) => {
  try {
    const { data: projectRefs } = await client.query(
      q.Paginate(q.Match(q.Ref('indexes/all_projects')))
    );
    const getAllprojectDataQuery = projectRefs.map(ref => q.Get(ref));
    const allProjects = await client.query(getAllprojectDataQuery);
    /* TODO: 400 error on client query */
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: allProjects.map(({ ref, data }) => ({
          ref,
          data: getProjectPreviewData(data),
        })),
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
